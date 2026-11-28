import type { AxiosInstance } from 'axios'
import type { ApiEnvelope } from '#shared/types/api'
import type { CmsUser } from '#shared/types/auth'

export async function loginCms(api: AxiosInstance, email: string, password: string) {
  const response = await api.post<ApiEnvelope<CmsUser>>('/auth/login', { email, password })
  return response.data.data
}

export async function getCmsUser(api: AxiosInstance) {
  const response = await api.get<ApiEnvelope<CmsUser>>('/auth/me')
  return response.data.data
}

export async function logoutCms(api: AxiosInstance) {
  await api.post('/auth/logout')
}
