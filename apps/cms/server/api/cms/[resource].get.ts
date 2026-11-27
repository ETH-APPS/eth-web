import { createError, getRouterParam, setHeader } from 'h3'
import type { ApiEnvelope } from '../../../shared/types/api'
import type { ArticleBanner, ArticleTaxonomy } from '../../../shared/types/article'
import { backendApi, upstreamError } from '../../utils/api'
import { cmsAccessToken } from '../../utils/auth'

const resources = ['categories', 'tags', 'banners'] as const
type Resource = typeof resources[number]

function isResource(value: string): value is Resource {
  return resources.includes(value as Resource)
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')
  const resource = getRouterParam(event, 'resource') ?? ''
  if (!isResource(resource))
    throw createError({ status: 404, statusText: 'CMS resource not found' })

  const token = await cmsAccessToken(event)
  try {
    const response = await backendApi(event).get<ApiEnvelope<ArticleTaxonomy[] | ArticleBanner[]>>(
      `/cms/${resource}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  } catch (error) {
    upstreamError(error)
  }
})
