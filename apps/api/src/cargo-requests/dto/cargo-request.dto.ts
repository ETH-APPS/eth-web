import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShippingMethod } from '../../generated/prisma/client.js';

export class CargoRequestDto {
  @ApiProperty({ enum: ShippingMethod, enumName: 'ShippingMethod' })
  @IsEnum(ShippingMethod)
  shippingMethod!: ShippingMethod;

  @ApiProperty({ minLength: 1, maxLength: 100, example: 'General goods' })
  @IsString()
  @MinLength(1)
  @Matches(/\S/)
  @MaxLength(100)
  cargoType!: string;

  @ApiProperty({ type: Number, minimum: 0, example: 32 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  heightCm!: number;

  @ApiProperty({ type: Number, minimum: 0, example: 44 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  lengthCm!: number;

  @ApiProperty({ type: Number, minimum: 0, example: 25 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  widthCm!: number;

  @ApiProperty({ type: Number, minimum: 0, example: 8.5 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  boxWeightKg!: number;

  @ApiProperty({ type: Number, minimum: 1, example: 2 })
  @IsInt()
  @IsPositive()
  boxCount!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
