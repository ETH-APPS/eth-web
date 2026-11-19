import { articles, formatArticleDate } from '~/content/articleCatalog'

export interface BlogArticleListItem {
  id: string
  title: string
  releaseDate: string
  tags: readonly string[]
  image: string
  imageAlt: string
  to: string
}

export function useAllBlogArticles() {
  const allArticles: BlogArticleListItem[] = articles.map(article => ({
    id: article.slug,
    title: article.title,
    releaseDate: formatArticleDate(article.publishedAt),
    tags: article.tags,
    image: article.image,
    imageAlt: article.imageAlt,
    to: `/artikel/${article.slug}`,
  }))

  return { allArticles }
}
