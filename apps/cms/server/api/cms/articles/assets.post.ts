import { setHeader } from 'h3'
import type { ArticleMedia } from '../../../../shared/types/article'
import { forwardCmsMultipart } from '../../../utils/cms'

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')
  return forwardCmsMultipart<ArticleMedia>(event, '/cms/articles/assets')
})
