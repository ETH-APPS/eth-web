import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ minLength: 20 })
  @IsString()
  @MinLength(20)
  refreshToken!: string;
}
