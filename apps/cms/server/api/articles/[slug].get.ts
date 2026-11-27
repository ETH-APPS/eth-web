import { createError, getRouterParam, setHeader } from 'h3'
import type { ApiEnvelope } from '../../../shared/types/api'
import type { PublishedArticle } from '../../../shared/types/article'
import { backendApi, upstreamError } from '../../utils/api'

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')
  const slug = getRouterParam(event, 'slug')
  if (!slug)
    throw createError({ status: 400, statusText: 'Article slug required' })

  try {
    const response = await backendApi(event).get<ApiEnvelope<PublishedArticle>>(
      `/articles/${encodeURIComponent(slug)}`,
    )
    return response.data
  } catch (error) {
    upstreamError(error)
  }
})
