import type { ProductSource } from '../../shared/types/products'

export const productMarketplaceSources = {
  '1688': '1688',
  Taobao: 'taobao',
  Alibaba: '1688',
  AliExpress: '1688',
} as const satisfies Record<string, ProductSource>

export type ProductMarketplace = keyof typeof productMarketplaceSources
