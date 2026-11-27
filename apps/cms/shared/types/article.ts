export interface ArticleTaxonomy {
  id: string
  name: string
  slug: string
}

export interface ArticleMedia {
  id: string
  kind: string
  url: string
  mimeType: string
  sizeBytes: number
  width: number
  height: number
}

export interface ArticleBanner {
  id: string
  title: string
  description: string
  isDefault: boolean
  image: ArticleMedia
}

export interface ArticleAuthor {
  id: string
  name: string
  slug: string
  jobTitle: string
  bio: string
  linkedinUrl: string
}

export interface CreatedArticle {
  id: string
  slug: string
  title: string
  metaDescription: string
  publishedAt: string
  cover: ArticleMedia
  coverImageAlt: string
  keyPoints: string[]
  category: ArticleTaxonomy
  tags: ArticleTaxonomy[]
  banner: ArticleBanner
  author: ArticleAuthor
}

export interface PublishedArticle extends CreatedArticle {
  bodyHtml: string
  updatedAt: string
}

export interface CreateArticlePayload {
  title: string
  slug: string
  metaDescription: string
  coverMediaId: string
  coverImageAlt: string
  bodyHtml: string
  keyPoints: string[]
  categoryId: string
  tagIds: string[]
  bannerId?: string
}
