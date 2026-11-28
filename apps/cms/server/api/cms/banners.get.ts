import { setHeader } from 'h3'
import type { ApiEnvelope } from '../../../shared/types/api'
import type { ArticleBanner } from '../../../shared/types/article'
import { backendApi, upstreamError } from '../../utils/api'
import { cmsAccessToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')
  const token = await cmsAccessToken(event)

  try {
    const response = await backendApi(event).get<ApiEnvelope<ArticleBanner[]>>('/cms/banners', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    upstreamError(error)
  }
})
