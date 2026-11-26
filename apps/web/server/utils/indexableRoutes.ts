import { articleSlugs } from '../../app/content/articleSlugs'

const staticRoutes = [
  '/',
  '/china-cargo',
  '/sea-freight',
  '/air-freight',
  '/transfer-rmb',
  '/sourcing',
  '/calculator',
  '/calculator-transfer-rmb',
  '/live-tracking',
  '/about-us',
  '/faq/pertanyaan-umum',
  '/faq/jasa-cargo-china',
  '/faq/jasa-transfer-rmb',
  '/faq/jasa-sourcing-china',
  '/terms-and-conditions',
  '/legalities',
  '/promo',
  '/cara-import-barang-dari-china',
  '/artikel',
] as const

export const indexableRoutes = [
  ...staticRoutes,
  ...Object.values(articleSlugs).map(slug => `/artikel/${slug}`),
]
