import { setHeader, setResponseStatus } from 'h3'
import { assertSameOrigin } from '../../utils/api'
import { revokeCmsSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  setHeader(event, 'cache-control', 'no-store')
  await revokeCmsSession(event)
  setResponseStatus(event, 204)
  return null
})
