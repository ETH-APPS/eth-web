import { readBody, setHeader, setResponseStatus } from 'h3'
import type { ApiEnvelope } from '../../../shared/types/api'
import type { CreateArticlePayload, CreatedArticle } from '../../../shared/types/article'
import { assertSameOrigin, backendApi, upstreamError } from '../../utils/api'
import { cmsAccessToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  setHeader(event, 'cache-control', 'no-store')
  const input = await readBody<CreateArticlePayload>(event)
  const token = await cmsAccessToken(event)

  try {
    const response = await backendApi(event).post<ApiEnvelope<CreatedArticle>>('/cms/articles', input, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setResponseStatus(event, response.status)
    return response.data
  } catch (error) {
    upstreamError(error)
  }
})
