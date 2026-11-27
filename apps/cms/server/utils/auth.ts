import axios from 'axios'
import { createError, type H3Event } from 'h3'
import type { ApiEnvelope, AuthTokenData, CmsSessionUser, CmsUser } from '../../shared/types/auth'
import { backendApi, upstreamError } from './api'

const CMS_ACCESS = 'CMS_ACCESS'
const REFRESH_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000
const ACCESS_REFRESH_SKEW_MS = 60_000
const refreshes = new Map<string, Promise<AuthTokenData>>()

function sessionUser(user: CmsUser): CmsSessionUser {
  const { authorProfile: _authorProfile, ...summary } = user
  return summary
}

function hasCmsAccess(user: CmsUser) {
  return user.permissions.includes(CMS_ACCESS)
}

async function saveSession(event: H3Event, tokens: AuthTokenData, loggedInAt?: string) {
  await replaceUserSession(event, {
    user: sessionUser(tokens.user),
    loggedInAt: loggedInAt ?? new Date().toISOString(),
    secure: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessExpiresAt: Date.now() + tokens.expiresInSeconds * 1000,
      refreshExpiresAt: Date.now() + REFRESH_LIFETIME_MS,
    },
  })
}

async function revoke(event: H3Event, refreshToken: string) {
  try {
    await backendApi(event).post('/auth/logout', { refreshToken })
  } catch {
    console.warn('[cms-auth] Refresh token revocation failed')
  }
}

export async function createCmsSession(event: H3Event, tokens: AuthTokenData) {
  if (!hasCmsAccess(tokens.user)) {
    await revoke(event, tokens.refreshToken)
    throw createError({ status: 403, statusText: 'CMS access required' })
  }
  await saveSession(event, tokens)
}

async function rotateTokens(event: H3Event) {
  const session = await requireUserSession(event)
  const secure = session.secure
  if (!secure?.refreshToken || !secure.refreshExpiresAt || secure.refreshExpiresAt <= Date.now()) {
    await clearUserSession(event)
    throw createError({ status: 401, statusText: 'Session expired' })
  }

  let pending = refreshes.get(secure.refreshToken)
  if (!pending) {
    pending = backendApi(event)
      .post<ApiEnvelope<AuthTokenData>>('/auth/refresh', { refreshToken: secure.refreshToken })
      .then(response => response.data.data)
    refreshes.set(secure.refreshToken, pending)
    pending.finally(() => refreshes.delete(secure.refreshToken)).catch(() => {})
  }

  try {
    const tokens = await pending
    if (!hasCmsAccess(tokens.user)) {
      await revoke(event, tokens.refreshToken)
      await clearUserSession(event)
      throw createError({ status: 403, statusText: 'CMS access required' })
    }
    await saveSession(event, tokens, session.loggedInAt)
    return tokens.accessToken
  } catch (error) {
    await clearUserSession(event)
    upstreamError(error)
  }
}

async function accessToken(event: H3Event, forceRefresh = false) {
  const session = await requireUserSession(event)
  if (
    forceRefresh
    || !session.secure?.accessToken
    || !session.secure.accessExpiresAt
    || session.secure.accessExpiresAt <= Date.now() + ACCESS_REFRESH_SKEW_MS
  ) {
    return rotateTokens(event)
  }
  return session.secure.accessToken
}

export async function currentCmsUser(event: H3Event) {
  let token = await accessToken(event)
  let response
  try {
    response = await backendApi(event).get<ApiEnvelope<CmsUser>>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401)
      upstreamError(error)
    token = await accessToken(event, true)
    try {
      response = await backendApi(event).get<ApiEnvelope<CmsUser>>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (retryError) {
      upstreamError(retryError)
    }
  }

  const user = response.data.data
  if (!hasCmsAccess(user)) {
    const session = await getUserSession(event)
    if (session.secure?.refreshToken)
      await revoke(event, session.secure.refreshToken)
    await clearUserSession(event)
    throw createError({ status: 403, statusText: 'CMS access required' })
  }
  return user
}

export async function revokeCmsSession(event: H3Event) {
  const session = await getUserSession(event)
  if (session.secure?.refreshToken)
    await revoke(event, session.secure.refreshToken)
  await clearUserSession(event)
}
