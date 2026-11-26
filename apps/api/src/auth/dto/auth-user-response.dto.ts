import { ApiProperty } from '@nestjs/swagger';
import {
  UserPermission,
  UserRole,
} from '../../generated/prisma/client.js';

export class AuthAuthorProfileResponseDto {
  @ApiProperty()
  slug!: string;

  @ApiProperty()
  jobTitle!: string;

  @ApiProperty()
  bio!: string;

  @ApiProperty({ format: 'uri' })
  linkedinUrl!: string;
}

export class AuthUserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty({ type: String, nullable: true })
  lastName!: string | null;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role!: UserRole;

  @ApiProperty({
    enum: UserPermission,
    enumName: 'UserPermission',
    isArray: true,
  })
  permissions!: UserPermission[];

  @ApiProperty({
    type: () => AuthAuthorProfileResponseDto,
    nullable: true,
  })
  authorProfile!: AuthAuthorProfileResponseDto | null;
}
