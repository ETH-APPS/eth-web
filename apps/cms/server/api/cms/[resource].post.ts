import { createError, getRouterParam, readBody, setHeader, setResponseStatus } from 'h3'
import type { ApiEnvelope } from '../../../shared/types/api'
import type { ArticleTaxonomy } from '../../../shared/types/article'
import { assertSameOrigin, backendApi, upstreamError } from '../../utils/api'
import { cmsAccessToken } from '../../utils/auth'

const resources = ['categories', 'tags'] as const
type Resource = typeof resources[number]

function isResource(value: string): value is Resource {
  return resources.includes(value as Resource)
}

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  setHeader(event, 'cache-control', 'no-store')
  const resource = getRouterParam(event, 'resource') ?? ''
  if (!isResource(resource))
    throw createError({ status: 404, statusText: 'CMS resource not found' })

  const body = await readBody<{ name?: unknown }>(event)
  if (typeof body.name !== 'string')
    throw createError({ status: 400, statusText: 'Name is required' })

  const token = await cmsAccessToken(event)
  try {
    const response = await backendApi(event).post<ApiEnvelope<ArticleTaxonomy>>(
      `/cms/${resource}`,
      { name: body.name },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    setResponseStatus(event, response.status)
    return response.data
  } catch (error) {
    upstreamError(error)
  }
})
