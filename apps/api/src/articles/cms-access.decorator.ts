import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessGuard } from '../auth/auth.guard.js';
import { Permissions } from '../auth/permissions.decorator.js';
import { UserPermission } from '../generated/prisma/client.js';
import { ApiErrorResponseDto } from '../openapi/api-error-response.dto.js';

export function CmsAccess() {
  return applyDecorators(
    UseGuards(AccessGuard),
    Permissions(UserPermission.CMS_ACCESS),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ type: ApiErrorResponseDto }),
    ApiForbiddenResponse({ type: ApiErrorResponseDto }),
  );
}
