import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class HealthService {
  constructor(private readonly database: PrismaService) {}

  async readiness() {
    await this.database.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
