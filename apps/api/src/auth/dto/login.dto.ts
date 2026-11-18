import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ format: 'email', example: 'customer@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 1, format: 'password' })
  @IsString()
  @MinLength(1)
  password!: string;
}
