import { createSigningHeaders, normalizeProducts, parseSearchParams, SEARCH_PATH } from '../../utils/duckingProducts'
import type { ProductSearchResult } from '../../../shared/types/products'

const cache = new Map<string, { expiresAt: number, value: ProductSearchResult }>()
const CACHE_TTL_MS = 60_000
const CACHE_LIMIT = 100

export default defineEventHandler(async (event) => {
  const params = parseSearchParams(getQuery(event))
  if (!params)
    throw createError({ statusCode: 400, statusMessage: 'Parameter pencarian tidak valid' })

  const secret = useRuntimeConfig(event).duckingSigningSecret
  if (!secret)
    throw createError({ statusCode: 503, statusMessage: 'Pencarian produk belum tersedia' })

  const url = new URL(SEARCH_PATH, 'https://gateway.ducking.id')
  url.searchParams.set('source', params.source)
  url.searchParams.set('keyword', params.keyword)
  url.searchParams.set('page_no', String(params.pageNo))
  url.searchParams.set('page_size', String(params.pageSize))
  const key = url.search
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now())
    return cached.value

  let response: Response
  try {
    response = await fetch(url, {
      headers: createSigningHeaders(secret),
      signal: AbortSignal.timeout(12_000),
    })
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Layanan produk tidak dapat dihubungi' })
  }

  if (!response.ok)
    throw createError({ statusCode: 502, statusMessage: 'Layanan produk sedang bermasalah' })

  let raw: unknown
  try {
    raw = await response.json()
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Respons layanan produk tidak valid' })
  }

  const result = normalizeProducts(raw, params)
  if (!result)
    throw createError({ statusCode: 502, statusMessage: 'Respons layanan produk tidak valid' })

  if (cache.size >= CACHE_LIMIT)
    cache.delete(cache.keys().next().value!)
  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value: result })
  return result
})
