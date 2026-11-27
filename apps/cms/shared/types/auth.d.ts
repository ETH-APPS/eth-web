import type { CmsSessionUser } from './auth'

declare module '#auth-utils' {
  interface User extends CmsSessionUser {}

  interface UserSession {
    loggedInAt: string
  }

  interface SecureSessionData {
    accessToken: string
    refreshToken: string
    accessExpiresAt: number
    refreshExpiresAt: number
  }
}

export {}
