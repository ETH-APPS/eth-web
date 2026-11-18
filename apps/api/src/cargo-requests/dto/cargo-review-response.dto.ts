import { ApiProperty } from '@nestjs/swagger';
import { ReviewDecision } from '../../generated/prisma/client.js';

export class CargoReviewResponseDto {
  @ApiProperty({ enum: ReviewDecision, enumName: 'ReviewDecision' })
  decision!: ReviewDecision;

  @ApiProperty({ type: String, nullable: true })
  reason!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
