<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

const route = useRoute()
const { allArticles } = useAllBlogArticles()

const searchQuery = computed(() => {
  const query = route.query.q
  return Array.isArray(query) ? String(query[0] ?? '') : String(query ?? '')
})

useSeoMeta({
  title: () => searchQuery.value
    ? `Hasil Pencarian “${searchQuery.value}” | ETH Cargo`
    : 'Pencarian Artikel | ETH Cargo',
  description: () => searchQuery.value
    ? `Temukan artikel ETH Cargo yang berkaitan dengan ${searchQuery.value}.`
    : 'Cari artikel dan insight terbaru seputar logistik, impor, ekspor, serta pengiriman internasional.',
  robots: 'noindex, follow',
})
</script>

<template>
  <MarketingBlogAllArticles
    variant="search-results"
    :articles="allArticles"
    :initial-search="searchQuery"
    :per-page="12"
  />
</template>
