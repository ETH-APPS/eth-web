import axios from 'axios'
import { createError, getHeader, isError, type H3Event } from 'h3'

export function backendApi(event: H3Event) {
  const config = useRuntimeConfig(event)
  return axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 10_000,
    headers: { Accept: 'application/json' },
  })
}

export function assertSameOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin')
  const expected = useRuntimeConfig(event).cmsOrigin
  if (origin !== expected)
    throw createError({ status: 403, statusText: 'Invalid request origin' })
}

export function upstreamError(error: unknown): never {
  if (isError(error))
    throw error

  if (axios.isAxiosError(error) && error.response) {
    throw createError({
      status: error.response.status,
      statusText: 'API request failed',
      data: error.response.data,
    })
  }

  throw createError({ status: 502, statusText: 'API unavailable' })
}
