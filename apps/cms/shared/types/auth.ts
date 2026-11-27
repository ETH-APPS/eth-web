export interface CmsAuthorProfile {
  slug: string
  jobTitle: string
  bio: string
  linkedinUrl: string
}

export interface CmsUser {
  id: string
  email: string
  firstName: string
  lastName: string | null
  role: string
  permissions: string[]
  authorProfile: CmsAuthorProfile | null
}

export type CmsSessionUser = Omit<CmsUser, 'authorProfile'>

export interface AuthTokenData {
  user: CmsUser
  tokenType: 'Bearer'
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
}

export interface ApiEnvelope<T> {
  request_id: string
  data: T
}
