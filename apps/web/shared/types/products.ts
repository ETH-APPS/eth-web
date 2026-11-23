export type ProductSource = '1688' | 'taobao'

export interface Product {
  id: string
  title: string
  image: string
  priceIdr: number | null
  detailUrl: string
}

export interface ProductSearchResult {
  products: Product[]
  pageNo: number
  pageSize: number
  hasMore: boolean
}
