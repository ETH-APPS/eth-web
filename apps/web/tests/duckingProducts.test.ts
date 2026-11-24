import assert from 'node:assert/strict'
import test from 'node:test'
import { productMarketplaceSources } from '../app/constants/productMarketplaces.ts'
import { productWhatsappUrl, whatsappConsultationUrl } from '../app/constants/whatsapp.ts'
import {
  createSigningHeaders,
  normalizeProducts,
  normalizeToplistProducts,
  parseSearchParams,
  signDuckingRequest,
  signSearchRequest,
  TOPLIST_PATH,
} from '../server/utils/duckingProducts.ts'

test('marketplace choices reuse 1688 except Taobao', () => {
  assert.deepEqual(productMarketplaceSources, {
    '1688': '1688',
    Taobao: 'taobao',
    Alibaba: '1688',
    AliExpress: '1688',
  })
  assert.equal(productMarketplaceSources.Alibaba, productMarketplaceSources['1688'])
  assert.equal(productMarketplaceSources.AliExpress, productMarketplaceSources['1688'])
})

test('signature uses the canonical path without query parameters', () => {
  assert.equal(
    signSearchRequest('test-secret', '1700000000', '00000000-0000-4000-8000-000000000000'),
    '0aedf0c25374410a96b7eb77a452d8c4dd2e65f512cc2e57a5980c96b6c50941',
  )
})

test('toplist uses the same signing scheme with its own canonical path', () => {
  assert.equal(
    signDuckingRequest('test-secret', '1700000000', '00000000-0000-4000-8000-000000000000', TOPLIST_PATH),
    'd11888e61f00e3bc90d16b62cb74b610ee0a7d52bf146872df8d19172be3486c',
  )

  const searchHeaders = createSigningHeaders('test-secret')
  assert.equal(searchHeaders['X-Signature'], signSearchRequest('test-secret', searchHeaders['X-Timestamp']!, searchHeaders['X-Nonce']!))
  const toplistHeaders = createSigningHeaders('test-secret', TOPLIST_PATH)
  assert.equal(toplistHeaders['X-Signature'], signDuckingRequest('test-secret', toplistHeaders['X-Timestamp']!, toplistHeaders['X-Nonce']!, TOPLIST_PATH))
})

test('search parameters reject unsupported sources and invalid pagination', () => {
  assert.deepEqual(parseSearchParams({ source: '1688' }), {
    source: '1688', keyword: 'sepatu', pageNo: 1, pageSize: 20,
  })
  assert.deepEqual(parseSearchParams({ source: '1688', keyword: ' sepatu ' }), {
    source: '1688', keyword: 'sepatu', pageNo: 1, pageSize: 20,
  })
  assert.equal(parseSearchParams({ source: 'aliexpress', keyword: 'sepatu' }), null)
  assert.equal(parseSearchParams({ source: '1688', keyword: '' }), null)
  assert.equal(parseSearchParams({ source: '1688', keyword: 'x', page_no: '0' }), null)
  assert.equal(parseSearchParams({ source: '1688', keyword: 'x', page_size: '51' }), null)
  assert.equal(parseSearchParams({ source: ['1688', 'taobao'], keyword: 'x' }), null)
})

test('1688 products use translated name, rupiah price, and Ducking offer link', () => {
  const params = { source: '1688' as const, keyword: 'sepatu', pageNo: 1, pageSize: 20 }
  const result = normalizeProducts({
    success: true,
    data: {
      products: [{ product_id: '1076696888235', product_name: '原单品质', product_name_translated: 'Running shoes', image_url: 'https://cbu01.alicdn.com/shoe.jpg', price_idr: 548250 }],
    },
  }, params)
  assert.deepEqual(result?.products, [{
    id: '1076696888235',
    title: 'Running shoes',
    image: 'https://cbu01.alicdn.com/shoe.jpg',
    priceIdr: 548250,
    detailUrl: 'https://www.ducking.id/products/detail?offer_id=1076696888235',
  }])
  assert.equal(result?.hasMore, false)
})

test('Taobao products fall back to original name and do not invent an exchange rate', () => {
  const result = normalizeProducts({
    success: true,
    data: {
      products: [{ item_id: '12345', product_name: '鞋子', image_url: 'https://example.com/shoe.jpg', price: '10.00', mi_id: 'abc' }],
    },
  }, { source: 'taobao', keyword: 'sepatu', pageNo: 2, pageSize: 20 })
  assert.equal(result?.products[0]?.title, '鞋子')
  assert.equal(result?.products[0]?.priceIdr, null)
  assert.equal(result?.products[0]?.detailUrl, 'https://www.ducking.id/products/detail?item_id=12345&mi_id=abc')
  assert.equal(result?.pageNo, 2)
})

test('invalid upstream envelope is rejected', () => {
  assert.equal(normalizeProducts({ success: false }, { source: '1688', keyword: 'x', pageNo: 1, pageSize: 20 }), null)
})

test('toplist uses hot products and sold count without inventing a price', () => {
  const result = normalizeToplistProducts({
    success: true,
    data: {
      complex: { products: [{ item_id: 1, title: 'Wrong list', img_url: 'https://example.com/complex.jpg' }] },
      hot: { products: [
        { item_id: 1097009235629, title: '冬帽', translate_title: 'Winter hat', img_url: 'https://cbu01.alicdn.com/hat.jpg', sold_out: 6080 },
        { item_id: '1090437874695', title: '秋冬口罩', translate_title: '', img_url: 'https://cbu01.alicdn.com/mask.jpg', sold_out: 0 },
        { item_id: 4, title: 'Unknown sales', img_url: 'https://example.com/unknown.jpg', sold_out: -1 },
        { item_id: 3, title: 'Invalid image', img_url: 'http://example.com/invalid.jpg' },
      ] },
      good_price: { products: [{ item_id: 2, title: 'Wrong list', img_url: 'https://example.com/deal.jpg' }] },
    },
  })

  assert.deepEqual(result, {
    products: [
      { id: '1097009235629', title: 'Winter hat', image: 'https://cbu01.alicdn.com/hat.jpg', priceIdr: null, soldCount: 6080, detailUrl: 'https://www.ducking.id/products/detail?offer_id=1097009235629' },
      { id: '1090437874695', title: '秋冬口罩', image: 'https://cbu01.alicdn.com/mask.jpg', priceIdr: null, soldCount: 0, detailUrl: 'https://www.ducking.id/products/detail?offer_id=1090437874695' },
      { id: '4', title: 'Unknown sales', image: 'https://example.com/unknown.jpg', priceIdr: null, soldCount: null, detailUrl: 'https://www.ducking.id/products/detail?offer_id=4' },
    ],
    pageNo: 1,
    pageSize: 6,
    hasMore: false,
  })
})

test('toplist rejects missing hot results', () => {
  assert.equal(normalizeToplistProducts({ success: false, data: { hot: { products: [] } } }), null)
  assert.equal(normalizeToplistProducts({ success: true, data: { complex: { products: [] } } }), null)
})

test('toplist never returns more than six hot products', () => {
  const result = normalizeToplistProducts({
    success: true,
    data: { hot: { products: Array.from({ length: 7 }, (_, index) => ({
      item_id: index + 1,
      title: `Product ${index + 1}`,
      img_url: 'https://example.com/product.jpg',
    })) } },
  })

  assert.equal(result?.products.length, 6)
})

test('product inquiry opens ETH WhatsApp with product context and tracking code', () => {
  const url = new URL(productWhatsappUrl({
    title: 'Mouse Gaming',
    source: '1688',
    priceIdr: 155907,
    detailUrl: 'https://www.ducking.id/products/detail?offer_id=12345',
  }))

  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, new URL(whatsappConsultationUrl).pathname)
  assert.equal(url.searchParams.get('text'), [
    'Halo tim ETH Cargo, saya ingin konsultasi impor produk ini:',
    'Produk: Mouse Gaming',
    'Marketplace: 1688',
    `Harga referensi: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(155907)}`,
    'Link referensi: https://www.ducking.id/products/detail?offer_id=12345',
    '',
    'Mohon bantu cek ketersediaan serta estimasi biaya total dan waktu pengiriman ke Indonesia. Terima kasih.',
    'ETH-WB',
  ].join('\n'))
})

test('product inquiry handles Taobao products without an available price', () => {
  const message = new URL(productWhatsappUrl({
    title: 'Sepatu',
    source: 'taobao',
    priceIdr: null,
    detailUrl: 'https://www.ducking.id/products/detail?item_id=12345',
  })).searchParams.get('text')

  assert.ok(message)
  assert.match(message, /Marketplace: Taobao/)
  assert.match(message, /Harga referensi: belum tersedia/)
  assert.ok(message.endsWith('ETH-WB'))
})

test('toplist inquiry includes sales instead of a missing price', () => {
  const message = new URL(productWhatsappUrl({
    title: 'Winter hat',
    source: '1688',
    priceIdr: null,
    soldCount: 6080,
    detailUrl: 'https://www.ducking.id/products/detail?offer_id=1097009235629',
  })).searchParams.get('text')

  assert.ok(message)
  assert.match(message, /Terjual: 6\.080/)
  assert.doesNotMatch(message, /Harga referensi/)
  assert.ok(message.endsWith('ETH-WB'))
})
