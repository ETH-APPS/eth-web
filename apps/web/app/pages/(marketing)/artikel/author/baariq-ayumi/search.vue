<script setup lang="ts">
import { blogAuthor } from '~/constants/blogAuthor'

definePageMeta({
  layout: 'marketing',
})

const route = useRoute()
const { allArticles } = useAllBlogArticles()

const searchQuery = computed(() => {
  const query = route.query.q
  return Array.isArray(query) ? String(query[0] ?? '') : String(query ?? '')
})

const activeTopic = computed(() => {
  const topic = route.query.topic
  return Array.isArray(topic) ? String(topic[0] ?? '') : String(topic ?? '')
})

useSeoMeta({
  title: () => searchQuery.value
    ? `Hasil Pencarian “${searchQuery.value}” oleh ${blogAuthor.name} | ETH Cargo`
    : `Pencarian Artikel ${blogAuthor.name} | ETH Cargo`,
  description: () => searchQuery.value
    ? `Temukan artikel ${blogAuthor.name} yang berkaitan dengan ${searchQuery.value}.`
    : `Cari artikel yang ditulis oleh ${blogAuthor.name}.`,
  robots: 'noindex, follow',
})
</script>

<template>
  <MarketingBlogAllArticles
    variant="author-search"
    :author-name="blogAuthor.name"
    :articles="allArticles"
    :initial-search="searchQuery"
    :initial-topic="activeTopic"
    :per-page="12"
  />
</template>
