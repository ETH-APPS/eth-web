import { setHeader } from 'h3'
import { currentCmsUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')
  const user = await currentCmsUser(event)
  return { data: user }
})
