import { ApiProperty } from '@nestjs/swagger';
import {
  CargoRequestStatus,
  ShippingMethod,
} from '../../generated/prisma/client.js';
import { CargoReviewResponseDto } from './cargo-review-response.dto.js';

export class CargoRequestResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  customerId!: string;

  @ApiProperty({ enum: CargoRequestStatus, enumName: 'CargoRequestStatus' })
  status!: CargoRequestStatus;

  @ApiProperty({ enum: ShippingMethod, enumName: 'ShippingMethod' })
  shippingMethod!: ShippingMethod;

  @ApiProperty()
  cargoType!: string;

  @ApiProperty({ type: Number })
  heightCm!: number;

  @ApiProperty({ type: Number })
  lengthCm!: number;

  @ApiProperty({ type: Number })
  widthCm!: number;

  @ApiProperty({ type: Number })
  boxWeightKg!: number;

  @ApiProperty({ type: Number })
  boxCount!: number;

  @ApiProperty({ type: String, nullable: true })
  notes!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;

  @ApiProperty({ type: () => CargoReviewResponseDto, nullable: true })
  latestReview!: CargoReviewResponseDto | null;
}
