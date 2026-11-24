import { createHash, createHmac, randomUUID } from 'node:crypto'
import type { Product, ProductSearchResult, ProductSource } from '../../shared/types/products'

export const SEARCH_PATH = '/api/v2/products/search'
export const TOPLIST_PATH = '/api/v2/products/toplist/all'
export const PAGE_SIZE = 20
const EMPTY_BODY_HASH = createHash('sha256').update('').digest('hex')

export interface SearchParams {
  source: ProductSource
  keyword: string
  pageNo: number
  pageSize: number
}

function singleString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export function parseSearchParams(query: Record<string, unknown>): SearchParams | null {
  const source = singleString(query.source)
  const keyword = query.keyword === undefined ? 'sepatu' : singleString(query.keyword)?.trim()
  const pageNoRaw = singleString(query.page_no) ?? '1'
  const pageSizeRaw = singleString(query.page_size) ?? String(PAGE_SIZE)

  if ((source !== '1688' && source !== 'taobao') || !keyword || keyword.length > 100)
    return null
  if (!/^[1-9]\d*$/.test(pageNoRaw) || !/^[1-9]\d*$/.test(pageSizeRaw))
    return null

  const pageNo = Number(pageNoRaw)
  const pageSize = Number(pageSizeRaw)
  if (!Number.isSafeInteger(pageNo) || pageNo > 100 || !Number.isSafeInteger(pageSize) || pageSize > 50)
    return null

  return { source, keyword, pageNo, pageSize }
}

export function signSearchRequest(secret: string, timestamp: string, nonce: string): string {
  return signDuckingRequest(secret, timestamp, nonce, SEARCH_PATH)
}

export function signDuckingRequest(secret: string, timestamp: string, nonce: string, path: string): string {
  const payload = `GET:${path}:${timestamp}:${nonce}:${EMPTY_BODY_HASH}`
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function createSigningHeaders(secret: string, path = SEARCH_PATH): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonce = randomUUID()
  return {
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
    'X-Signature': signDuckingRequest(secret, timestamp, nonce, path),
  }
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

export function normalizeProducts(raw: unknown, params: SearchParams): ProductSearchResult | null {
  const envelope = record(raw)
  const data = record(envelope?.data)
  if (envelope?.success !== true || !Array.isArray(data?.products))
    return null

  const products: Product[] = []
  for (const item of data.products) {
    const product = record(item)
    if (!product)
      continue

    const rawId = product.product_id ?? product.item_id
    const id = typeof rawId === 'string' || typeof rawId === 'number' ? String(rawId) : ''
    const translated = typeof product.product_name_translated === 'string' ? product.product_name_translated.trim() : ''
    const original = typeof product.product_name === 'string' ? product.product_name.trim() : ''
    const image = typeof product.image_url === 'string' ? product.image_url : ''
    if (!/^\d+$/.test(id) || !(translated || original) || !/^https:\/\//.test(image))
      continue

    const detail = new URL('/products/detail', 'https://www.ducking.id')
    detail.searchParams.set(params.source === '1688' ? 'offer_id' : 'item_id', id)
    if (params.source === 'taobao' && typeof product.mi_id === 'string' && product.mi_id)
      detail.searchParams.set('mi_id', product.mi_id)

    const price = product.price_idr
    products.push({
      id,
      title: translated || original,
      image,
      priceIdr: typeof price === 'number' && Number.isFinite(price) && price >= 0 ? price : null,
      detailUrl: detail.href,
    })
  }

  return {
    products,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
    hasMore: data.products.length >= params.pageSize,
  }
}

export function normalizeToplistProducts(raw: unknown): ProductSearchResult | null {
  const envelope = record(raw)
  const hot = record(record(envelope?.data)?.hot)
  if (envelope?.success !== true || !Array.isArray(hot?.products))
    return null

  const products: Product[] = []
  for (const item of hot.products) {
    const product = record(item)
    if (!product)
      continue

    const rawId = product.item_id
    const id = typeof rawId === 'string' || typeof rawId === 'number' ? String(rawId) : ''
    const translated = typeof product.translate_title === 'string' ? product.translate_title.trim() : ''
    const original = typeof product.title === 'string' ? product.title.trim() : ''
    const image = typeof product.img_url === 'string' ? product.img_url : ''
    if (!/^\d+$/.test(id) || !(translated || original) || !/^https:\/\//.test(image))
      continue

    const detail = new URL('/products/detail', 'https://www.ducking.id')
    detail.searchParams.set('offer_id', id)
    const soldOut = product.sold_out
    products.push({
      id,
      title: translated || original,
      image,
      priceIdr: null,
      soldCount: typeof soldOut === 'number' && Number.isSafeInteger(soldOut) && soldOut >= 0 ? soldOut : null,
      detailUrl: detail.href,
    })
    if (products.length === 6)
      break
  }

  return { products, pageNo: 1, pageSize: 6, hasMore: false }
}
