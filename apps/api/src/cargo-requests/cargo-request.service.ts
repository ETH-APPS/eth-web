import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CargoRequestStatus,
  ReviewDecision,
  type CargoRequest,
  type CargoRequestReview,
} from '../generated/prisma/client.js';
import { PrismaService } from '../database/prisma.service.js';
import type { CargoRequestDto } from './dto/cargo-request.dto.js';
import type { ReviewCargoRequestDto } from './dto/review-cargo-request.dto.js';
import type { StaffCargoRequestQueryDto } from './dto/staff-cargo-request-query.dto.js';

type RequestWithReview = CargoRequest & {
  reviews: CargoRequestReview[];
};

function toResponse(request: RequestWithReview) {
  const latestReview = request.reviews[0];
  return {
    id: request.id,
    customerId: request.customerId,
    status: request.status,
    shippingMethod: request.shippingMethod,
    cargoType: request.cargoType,
    heightCm: request.heightCm.toNumber(),
    lengthCm: request.lengthCm.toNumber(),
    widthCm: request.widthCm.toNumber(),
    boxWeightKg: request.boxWeightKg.toNumber(),
    boxCount: request.boxCount,
    notes: request.notes,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    latestReview: latestReview
      ? {
          decision: latestReview.decision,
          reason: latestReview.reason,
          createdAt: latestReview.createdAt,
        }
      : null,
  };
}

const latestReview = {
  orderBy: { createdAt: 'desc' as const },
  take: 1,
};

@Injectable()
export class CargoRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, input: CargoRequestDto) {
    const request = await this.prisma.cargoRequest.create({
      data: {
        customerId,
        shippingMethod: input.shippingMethod,
        cargoType: input.cargoType.trim(),
        heightCm: input.heightCm,
        lengthCm: input.lengthCm,
        widthCm: input.widthCm,
        boxWeightKg: input.boxWeightKg,
        boxCount: input.boxCount,
        notes: input.notes?.trim() || null,
      },
      include: { reviews: latestReview },
    });
    return toResponse(request);
  }

  async listForCustomer(customerId: string) {
    const requests = await this.prisma.cargoRequest.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { reviews: latestReview },
    });
    return requests.map(toResponse);
  }

  async getForCustomer(customerId: string, id: string) {
    const request = await this.prisma.cargoRequest.findFirst({
      where: { id, customerId },
      include: { reviews: latestReview },
    });
    if (!request) throw new NotFoundException('Cargo request not found');
    return toResponse(request);
  }

  async resubmit(customerId: string, id: string, input: CargoRequestDto) {
    const request = await this.prisma.$transaction(async (transaction) => {
      const updated = await transaction.cargoRequest.updateMany({
        where: { id, customerId, status: CargoRequestStatus.NEEDS_REVISION },
        data: {
          shippingMethod: input.shippingMethod,
          cargoType: input.cargoType.trim(),
          heightCm: input.heightCm,
          lengthCm: input.lengthCm,
          widthCm: input.widthCm,
          boxWeightKg: input.boxWeightKg,
          boxCount: input.boxCount,
          notes: input.notes?.trim() || null,
          status: CargoRequestStatus.PENDING_REVIEW,
        },
      });
      if (updated.count !== 1) {
        const owned = await transaction.cargoRequest.findFirst({
          where: { id, customerId },
          select: { id: true },
        });
        if (!owned) throw new NotFoundException('Cargo request not found');
        throw new ConflictException('Cargo request is not awaiting revision');
      }
      return transaction.cargoRequest.findUniqueOrThrow({
        where: { id },
        include: { reviews: latestReview },
      });
    });
    return toResponse(request);
  }

  async listForStaff(query: StaffCargoRequestQueryDto) {
    const requests = await this.prisma.cargoRequest.findMany({
      where: query.status ? { status: query.status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { reviews: latestReview },
    });
    return requests.map(toResponse);
  }

  async getForStaff(id: string) {
    const request = await this.prisma.cargoRequest.findUnique({
      where: { id },
      include: { reviews: latestReview },
    });
    if (!request) throw new NotFoundException('Cargo request not found');
    return toResponse(request);
  }

  async review(id: string, staffId: string, input: ReviewCargoRequestDto) {
    const reason = input.reason?.trim() || null;
    if (input.decision !== ReviewDecision.APPROVED && !reason) {
      throw new BadRequestException('A reason is required for this decision');
    }
    const request = await this.prisma.$transaction(async (transaction) => {
      const existing = await transaction.cargoRequest.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existing) throw new NotFoundException('Cargo request not found');
      const updated = await transaction.cargoRequest.updateMany({
        where: { id, status: CargoRequestStatus.PENDING_REVIEW },
        data: { status: input.decision },
      });
      if (updated.count !== 1) {
        throw new ConflictException('Cargo request is not pending review');
      }
      await transaction.cargoRequestReview.create({
        data: {
          cargoRequestId: id,
          staffId,
          decision: input.decision,
          reason,
        },
      });
      return transaction.cargoRequest.findUniqueOrThrow({
        where: { id },
        include: { reviews: latestReview },
      });
    });
    return toResponse(request);
  }
}
