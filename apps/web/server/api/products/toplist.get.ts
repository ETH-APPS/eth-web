import { createSigningHeaders, normalizeToplistProducts, TOPLIST_PATH } from '../../utils/duckingProducts'
import type { ProductSearchResult } from '../../../shared/types/products'

const CACHE_TTL_MS = 60_000
const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_UPSTREAM_REQUESTS_PER_WINDOW = 10
const RATE_LIMIT_COOLDOWN_MS = 60_000
let cached: { expiresAt: number, value: ProductSearchResult } | null = null
let inFlight: Promise<ProductSearchResult> | null = null
let rateLimitedUntil = 0
const requestTimes: number[] = []

export default defineEventHandler(async (event) => {
  const secret = useRuntimeConfig(event).duckingSigningSecret
  if (!secret)
    throw createError({ statusCode: 503, statusMessage: 'Pencarian produk belum tersedia' })

  const now = Date.now()
  if (cached && cached.expiresAt > now)
    return cached.value
  if (inFlight)
    return inFlight
  if (now < rateLimitedUntil)
    throw createError({ statusCode: 429, statusMessage: 'Produk populer sementara dibatasi' })

  while (requestTimes.length && requestTimes[0]! <= now - RATE_LIMIT_WINDOW_MS)
    requestTimes.shift()
  if (requestTimes.length >= MAX_UPSTREAM_REQUESTS_PER_WINDOW)
    throw createError({ statusCode: 429, statusMessage: 'Produk populer sementara dibatasi' })
  requestTimes.push(now)

  const request = fetchToplist(secret)
  inFlight = request
  try {
    const result = await request
    cached = { expiresAt: Date.now() + CACHE_TTL_MS, value: result }
    return result
  }
  finally {
    inFlight = null
  }
})

async function fetchToplist(secret: string): Promise<ProductSearchResult> {
  const url = new URL(TOPLIST_PATH, 'https://dev.ducking.id')
  url.searchParams.set('limit', '6')
  url.searchParams.set('language', 'en')

  let response: Response
  try {
    response = await fetch(url, {
      headers: createSigningHeaders(secret, TOPLIST_PATH),
      signal: AbortSignal.timeout(12_000),
    })
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Layanan produk tidak dapat dihubungi' })
  }

  if (response.status === 429)
    rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS
  if (!response.ok)
    throw createError({ statusCode: 502, statusMessage: 'Layanan produk sedang bermasalah' })

  let raw: unknown
  try {
    raw = await response.json()
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Respons layanan produk tidak valid' })
  }

  const result = normalizeToplistProducts(raw)
  if (!result)
    throw createError({ statusCode: 502, statusMessage: 'Respons layanan produk tidak valid' })
  return result
}
