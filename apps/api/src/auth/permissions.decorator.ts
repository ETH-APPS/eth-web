import { SetMetadata } from '@nestjs/common';
import type { UserPermission } from '../generated/prisma/client.js';

export const PERMISSIONS_KEY = 'auth.permissions';
export const Permissions = (...permissions: UserPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
