<script setup lang="ts">
import { articleBySlug, articles, formatArticleDate } from '~/content/articleCatalog'
import { blogAuthor } from '~/constants/blogAuthor'

definePageMeta({
  layout: 'marketing',
  async validate(route) {
    const { articleBySlug } = await import('~/content/articleCatalog')
    return articleBySlug.has(String(route.params.slug ?? ''))
  },
})

const route = useRoute()
const article = computed(() => articleBySlug.get(String(route.params.slug ?? '')))
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

const relatedArticles = computed(() => {
  if (!article.value)
    return []

  return articles
    .filter(candidate => candidate.slug !== article.value!.slug)
    .map(candidate => ({
      article: candidate,
      score: candidate.tags.filter(tag => article.value!.tags.includes(tag)).length,
    }))
    .sort((first, second) => second.score - first.score || second.article.publishedAt.localeCompare(first.article.publishedAt))
    .slice(0, 3)
    .map(({ article: candidate }) => ({
      id: candidate.slug,
      title: candidate.title,
      releaseDate: formatArticleDate(candidate.publishedAt),
      image: candidate.image,
      imageAlt: candidate.imageAlt,
      to: `/artikel/${candidate.slug}`,
    }))
})

useSeoMeta({
  title: () => article.value ? `${article.value.title} | ETH Cargo` : 'Artikel | ETH Cargo',
  description: () => article.value?.description ?? '',
  ogTitle: () => article.value ? `${article.value.title} | ETH Cargo` : 'Artikel | ETH Cargo',
  ogDescription: () => article.value?.description ?? '',
  ogImage: () => article.value
    ? siteUrl ? new URL(article.value.image, siteUrl).href : article.value.image
    : '',
  ogType: 'article',
})

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href

  useHead(() => {
    if (!article.value)
      return {}

    const articleUrl = new URL(`/artikel/${encodeURIComponent(article.value.slug)}`, homepage).href

    return {
      script: [{
        key: 'blog-posting-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': articleUrl + '#article',
          url: articleUrl,
          mainEntityOfPage: articleUrl,
          headline: article.value.title,
          description: article.value.description,
          datePublished: article.value.publishedAt,
          dateModified: article.value.updatedAt,
          image: new URL(article.value.image, homepage).href,
          author: {
            '@type': 'Person',
            name: article.value.author,
          },
          publisher: {
            '@type': 'Organization',
            '@id': homepage + '#organization',
            name: 'ETH Cargo',
            url: homepage,
          },
        }).replace(/</g, '\\u003c'),
      }],
    }
  })
}
</script>

<template>
  <div v-if="article">
    <MarketingBlogMobileArticleToc :table-of-contents="article.toc" />

    <MarketingBlogArticleHero
      :title="article.title"
      :author="article.author"
      :author-to="blogAuthor.to"
      :updated-at="formatArticleDate(article.updatedAt)"
      :released-at="formatArticleDate(article.publishedAt)"
      :image="article.image"
      :image-alt="article.imageAlt"
    />

    <MarketingBlogArticleContent
      :title="article.title"
      :author="article.author"
      :tags="article.tags"
      :key-points="article.keyPoints"
      :body-html="article.bodyHtml"
      :table-of-contents="article.toc"
      :related-articles="relatedArticles"
    />
  </div>
</template>
