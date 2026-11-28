import { getQuery, setHeader } from 'h3'
import type { ApiEnvelope } from '../../../shared/types/api'
import type { ArticleList } from '../../../shared/types/article'
import { backendApi, upstreamError } from '../../utils/api'

const queryKeys = ['page', 'limit', 'q', 'category'] as const

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')
  const input = getQuery(event)
  const params = Object.fromEntries(queryKeys.flatMap((key) => {
    const value = input[key]
    return typeof value === 'string' && value ? [[key, value]] : []
  }))

  try {
    const response = await backendApi(event).get<ApiEnvelope<ArticleList>>('/articles', { params })
    return response.data
  } catch (error) {
    upstreamError(error)
  }
})
