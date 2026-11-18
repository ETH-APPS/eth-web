import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CargoRequestStatus } from '../../generated/prisma/client.js';

export class StaffCargoRequestQueryDto {
  @ApiPropertyOptional({
    enum: CargoRequestStatus,
    enumName: 'CargoRequestStatus',
  })
  @IsOptional()
  @IsEnum(CargoRequestStatus)
  status?: CargoRequestStatus;
}
