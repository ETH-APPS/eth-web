import { createError, getHeader, readRawBody, setResponseStatus, type H3Event } from 'h3'
import type { ApiEnvelope } from '../../shared/types/api'
import { assertSameOrigin, backendApi, upstreamError } from './api'
import { cmsAccessToken } from './auth'

const MAX_MULTIPART_BYTES = 6 * 1024 * 1024

export async function forwardCmsMultipart<T>(event: H3Event, path: string) {
  assertSameOrigin(event)
  const contentType = getHeader(event, 'content-type') ?? ''
  if (!contentType.startsWith('multipart/form-data;'))
    throw createError({ status: 415, statusText: 'Multipart form data required' })

  const contentLength = Number(getHeader(event, 'content-length') ?? 0)
  if (contentLength > MAX_MULTIPART_BYTES)
    throw createError({ status: 413, statusText: 'Upload too large' })

  const body = await readRawBody(event, false)
  if (!body)
    throw createError({ status: 400, statusText: 'Upload body required' })
  if (body.length > MAX_MULTIPART_BYTES)
    throw createError({ status: 413, statusText: 'Upload too large' })

  const token = await cmsAccessToken(event)
  try {
    const response = await backendApi(event).post<ApiEnvelope<T>>(path, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': contentType,
        'Content-Length': body.length,
      },
      maxBodyLength: MAX_MULTIPART_BYTES,
    })
    setResponseStatus(event, response.status)
    return response.data
  } catch (error) {
    upstreamError(error)
  }
}
