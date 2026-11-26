import type {
  UserPermission,
  UserRole,
} from '../generated/prisma/client.js';

export type AuthAuthorProfile = {
  slug: string;
  jobTitle: string;
  bio: string;
  linkedinUrl: string;
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  permissions: UserPermission[];
  authorProfile: AuthAuthorProfile | null;
};
