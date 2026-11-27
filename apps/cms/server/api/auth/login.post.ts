import { createError, readBody, setHeader } from 'h3'
import type { ApiEnvelope } from '../../../shared/types/api'
import type { AuthTokenData } from '../../../shared/types/auth'
import { assertSameOrigin, backendApi, upstreamError } from '../../utils/api'
import { createCmsSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  setHeader(event, 'cache-control', 'no-store')
  const body = await readBody<{ email?: unknown, password?: unknown }>(event)
  if (typeof body.email !== 'string' || typeof body.password !== 'string')
    throw createError({ status: 400, statusText: 'Email and password are required' })

  try {
    const response = await backendApi(event).post<ApiEnvelope<AuthTokenData>>('/auth/login', {
      email: body.email,
      password: body.password,
    })
    await createCmsSession(event, response.data.data)
    return { request_id: response.data.request_id, data: response.data.data.user }
  } catch (error) {
    upstreamError(error)
  }
})
