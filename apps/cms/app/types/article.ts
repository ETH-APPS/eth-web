export interface ArticleBodyImageDraft {
  id: string
  file: File
  previewUrl: string
  alt: string
}

export interface ArticleDraft {
  title: string
  slug: string
  metaDescription: string
  coverFile: File
  coverImageAlt: string
  bodyHtml: string
  bodyImages: ArticleBodyImageDraft[]
  keyPoints: string[]
  categoryId: string
  tagIds: string[]
  bannerId?: string
  authorId: string
}
