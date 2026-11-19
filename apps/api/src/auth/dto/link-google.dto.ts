import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LinkGoogleDto {
  @ApiProperty({ description: 'Google ID token for the account to link' })
  @IsString()
  @MinLength(1)
  idToken!: string;
}
