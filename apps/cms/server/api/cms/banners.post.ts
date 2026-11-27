import { setHeader } from 'h3'
import type { ArticleBanner } from '../../../shared/types/article'
import { forwardCmsMultipart } from '../../utils/cms'

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')
  return forwardCmsMultipart<ArticleBanner>(event, '/cms/banners')
})
