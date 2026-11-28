import type { AxiosInstance } from 'axios'
import type { ApiEnvelope } from '#shared/types/api'
import type {
  ArticleBanner,
  ArticleList,
  ArticleMedia,
  ArticleTaxonomy,
  CreateArticlePayload,
  CreatedArticle,
  PublishedArticle,
} from '#shared/types/article'

export type TaxonomyResource = 'categories' | 'tags'
export type ArticleAssetKind = 'ARTICLE_COVER' | 'ARTICLE_BODY'
export interface ArticleListParams {
  page: number
  limit: number
  q?: string
  category?: string
}

export interface CreateBannerInput {
  title: string
  description: string
  image: File
}

export async function listArticles(api: AxiosInstance, params: ArticleListParams) {
  const response = await api.get<ApiEnvelope<ArticleList>>('/articles', { params })
  return response.data.data
}

export async function getArticle(api: AxiosInstance, slug: string) {
  const response = await api.get<ApiEnvelope<PublishedArticle>>(`/articles/${encodeURIComponent(slug)}`)
  return response.data.data
}

export async function listTaxonomy(api: AxiosInstance, resource: TaxonomyResource) {
  const response = await api.get<ApiEnvelope<ArticleTaxonomy[]>>(`/cms/${resource}`)
  return response.data.data
}

export async function createTaxonomy(api: AxiosInstance, resource: TaxonomyResource, name: string) {
  const response = await api.post<ApiEnvelope<ArticleTaxonomy>>(`/cms/${resource}`, { name })
  return response.data.data
}

export async function listBanners(api: AxiosInstance) {
  const response = await api.get<ApiEnvelope<ArticleBanner[]>>('/cms/banners')
  return response.data.data
}

export async function createBanner(api: AxiosInstance, input: CreateBannerInput) {
  const form = new FormData()
  form.append('title', input.title)
  form.append('description', input.description)
  form.append('image', input.image)
  const response = await api.post<ApiEnvelope<ArticleBanner>>('/cms/banners', form)
  return response.data.data
}

export async function uploadArticleAsset(api: AxiosInstance, file: File, kind: ArticleAssetKind) {
  const form = new FormData()
  form.append('file', file)
  form.append('kind', kind)
  const response = await api.post<ApiEnvelope<ArticleMedia>>('/cms/articles/assets', form)
  return response.data.data
}

export async function createArticle(api: AxiosInstance, payload: CreateArticlePayload) {
  const response = await api.post<ApiEnvelope<CreatedArticle>>('/cms/articles', payload)
  return response.data.data
}
