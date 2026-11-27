import axios from 'axios'
import { useQueryClient } from '@tanstack/vue-query'
import type { ApiEnvelope } from '#shared/types/api'
import type { CmsUser } from '#shared/types/auth'

function statusOf(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined
}

function messageOf(error: unknown) {
  if (!axios.isAxiosError(error))
    return 'Terjadi kesalahan. Silakan coba kembali.'

  if (error.response?.status === 401)
    return 'Email atau kata sandi salah.'
  if (error.response?.status === 403)
    return 'Akun ini tidak memiliki akses CMS.'
  if (!error.response)
    return 'API belum dapat dihubungi. Periksa koneksi lalu coba kembali.'

  return 'Login gagal. Silakan coba kembali.'
}

export function useAuth() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const session = useUserSession()
  const isLoggingIn = useState('auth:login-pending', () => false)
  const isLoggingOut = useState('auth:logout-pending', () => false)
  const loginError = useState('auth:login-error', () => '')

  async function login(email: string, password: string) {
    isLoggingIn.value = true
    loginError.value = ''
    try {
      await $api.post<ApiEnvelope<CmsUser>>('/auth/login', { email, password })
      await session.fetch()
    } catch (error) {
      loginError.value = messageOf(error)
      throw error
    } finally {
      isLoggingIn.value = false
    }
  }

  async function verify() {
    const response = await $api.get<ApiEnvelope<CmsUser>>('/auth/me')
    await session.fetch()
    return response.data.data
  }

  async function logout() {
    isLoggingOut.value = true
    try {
      await $api.post('/auth/logout')
    } finally {
      queryClient.clear()
      await session.clear()
      isLoggingOut.value = false
      await navigateTo('/login')
    }
  }

  return {
    ...session,
    isLoggingIn: readonly(isLoggingIn),
    isLoggingOut: readonly(isLoggingOut),
    loginError,
    login,
    logout,
    verify,
    statusOf,
  }
}
