import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewDecision } from '../../generated/prisma/client.js';

export class ReviewCargoRequestDto {
  @ApiProperty({ enum: ReviewDecision, enumName: 'ReviewDecision' })
  @IsEnum(ReviewDecision)
  decision!: ReviewDecision;

  @ApiPropertyOptional({ description: 'Required for revision or rejection' })
  @IsOptional()
  @IsString()
  reason?: string;
}
