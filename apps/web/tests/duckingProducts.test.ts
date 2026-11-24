import assert from 'node:assert/strict'
import test from 'node:test'
import { productWhatsappUrl, whatsappConsultationUrl } from '../app/constants/whatsapp.ts'
import { normalizeProducts, parseSearchParams, signSearchRequest } from '../server/utils/duckingProducts.ts'

test('signature uses the canonical path without query parameters', () => {
  assert.equal(
    signSearchRequest('test-secret', '1700000000', '00000000-0000-4000-8000-000000000000'),
    '0aedf0c25374410a96b7eb77a452d8c4dd2e65f512cc2e57a5980c96b6c50941',
  )
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
