import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google ID token from the mobile sign-in SDK' })
  @IsString()
  @MinLength(1)
  idToken!: string;

  @ApiPropertyOptional({ description: 'Required when creating a new account' })
  @IsOptional()
  @IsBoolean()
  acceptedTerms?: boolean;
}
