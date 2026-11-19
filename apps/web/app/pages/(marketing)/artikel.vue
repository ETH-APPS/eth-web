<script setup lang="ts">
import { articles, formatArticleDate } from '~/content/articleCatalog'
import type { Article } from '~/content/articleCatalog'
import { useAllBlogArticles } from '~/composables/useAllBlogArticles'
import { BLOG_PAGE_SIZE, parseBlogPage } from '~/utils/blogPagination'

definePageMeta({
  layout: 'marketing',
  validate(route) {
    const { allArticles } = useAllBlogArticles()
    return parseBlogPage(route.query.page, Math.ceil(allArticles.length / BLOG_PAGE_SIZE)) !== null
  },
})

const route = useRoute()
const isBlogChildPage = computed(() => route.path !== '/artikel' && route.path !== '/artikel/')
const { allArticles } = useAllBlogArticles()
const page = computed(() => parseBlogPage(route.query.page, Math.ceil(allArticles.length / BLOG_PAGE_SIZE)) ?? 1)
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')
const blogUrl = siteUrl ? new URL('/artikel', siteUrl).href : ''
const pageUrl = computed(() => {
  if (!blogUrl || isBlogChildPage.value)
    return ''

  const url = new URL(blogUrl)
  if (page.value > 1)
    url.searchParams.set('page', String(page.value))
  return url.href
})
const articleListId = computed(() => pageUrl.value ? pageUrl.value + '#all-articles' : undefined)

if (blogUrl) {
  useHead(() => ({
    link: pageUrl.value
      ? [{ key: 'canonical', rel: 'canonical', href: blogUrl }]
      : [],
    script: isBlogChildPage.value ? [] : [{
      key: 'blog-collection-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': pageUrl.value + '#webpage',
        url: pageUrl.value,
        name: 'Artikel ETH Cargo',
        isPartOf: {
          '@type': 'WebSite',
          '@id': new URL('/', blogUrl).href + '#website',
          name: 'ETH Cargo',
          url: new URL('/', blogUrl).href,
        },
        mainEntity: { '@id': articleListId.value },
      }).replace(/</g, '\\u003c'),
    }],
  }))
}

useSeoMeta({
  title: 'Artikel Logistik, Ekspor, dan Impor | ETH Cargo',
  description: 'Baca artikel ETH Cargo tentang dokumen pengiriman, kargo udara, kargo laut, ekspor, dan impor.',
  ogTitle: 'Artikel Logistik, Ekspor, dan Impor | ETH Cargo',
  ogDescription: 'Baca artikel ETH Cargo tentang dokumen pengiriman, kargo udara, kargo laut, ekspor, dan impor.',
  ogType: 'website',
})

function articleCard(article: Article) {
  return {
    id: article.slug,
    title: article.title,
    releaseDate: formatArticleDate(article.publishedAt),
    image: article.image,
    imageAlt: article.imageAlt,
    to: `/artikel/${article.slug}`,
  }
}

const featuredPosts = articles.slice(0, 3).map(article => ({
  ...articleCard(article),
  description: article.description,
  author: article.author,
  tags: article.tags,
}))
const popularPosts = articles.slice(0, 5).map(articleCard)
const exportPosts = articles.filter(article => article.tags.includes('Ekspor')).map(article => ({
  ...articleCard(article),
  tags: article.tags,
}))
const importPosts = articles.filter(article => article.tags.includes('Impor')).map(article => ({
  ...articleCard(article),
  tags: article.tags,
}))

</script>

<template>
  <NuxtPage v-if="isBlogChildPage" />

  <div v-else>
    <header class="bg-bg-0 pt-8 sm:pt-10 lg:pt-12">
      <UiContainer>
        <div class="mx-auto max-w-[850px] text-center">
          <h1 class="text-[32px] font-semibold leading-[1.2] text-primary-500 lg:text-[48px]">
            Blog &amp; Berita Impor
          </h1>
          <p class="mt-6 text-justify text-[16px] font-normal leading-[1.5] text-text-tertiary lg:text-center lg:text-[20px] lg:leading-[1.4]">
            Temukan panduan praktis, regulasi kepabeanan terbaru, dan strategi rantai pasok untuk memastikan kelancaran operasional impor B2B Anda bersama ETH Cargo.
          </p>
        </div>
      </UiContainer>
    </header>
    <MarketingBlogHeroCarousel
      :posts="featuredPosts"
      :autoplay-delay="5000"
    />

    <MarketingBlogPopularPostsCarousel
      :posts="popularPosts"
      :autoplay-delay="4500"
    />

    <MarketingBlogCategoryPostsCarousel
      section-id="export-articles"
      title="Ekspor"
      :posts="exportPosts"
      view-all-to="#export-articles"
      :autoplay-delay="5000"
    />

    <MarketingBlogCategoryPostsCarousel
      section-id="import-articles"
      title="Impor"
      :posts="importPosts"
      view-all-to="#import-articles"
      :autoplay-delay="5500"
      class="hidden lg:block"
    />

    <MarketingBlogAllArticles
      :articles="allArticles"
      :per-page="BLOG_PAGE_SIZE"
      :initial-page="page"
      :schema-list-id="articleListId"
    />
  </div>
</template>
