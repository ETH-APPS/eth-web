<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

const route = useRoute()
const { allArticles } = useAllBlogArticles()

const activeTag = computed(() => {
  const tag = route.query.tag
  return Array.isArray(tag) ? String(tag[0] ?? '') : String(tag ?? '')
})

useSeoMeta({
  title: () => activeTag.value
    ? `Artikel ${activeTag.value} | ETH Cargo`
    : 'Tag Artikel | ETH Cargo',
  description: () => activeTag.value
    ? `Temukan artikel ETH Cargo dengan tag ${activeTag.value}.`
    : 'Jelajahi artikel ETH Cargo berdasarkan topik logistik, impor, ekspor, dan pengiriman internasional.',
  robots: 'noindex, follow',
})
</script>

<template>
  <MarketingBlogAllArticles
    variant="tag-results"
    :articles="allArticles"
    :initial-tag="activeTag"
    :per-page="12"
  />
</template>
