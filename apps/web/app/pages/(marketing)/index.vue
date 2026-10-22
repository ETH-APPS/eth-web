<script setup lang="ts">
definePageMeta({
  layout: 'marketing'
})

useHead({
  htmlAttrs: {
    lang: 'id'
  }
})

useSeoMeta({
  title: 'ETH Cargo | Express to Home',
  description: 'Solusi pengiriman kargo laut, udara, dan internasional bersama ETH Cargo.',
  ogTitle: 'ETH Cargo | Express to Home',
  ogDescription: 'Solusi pengiriman kargo laut, udara, dan internasional bersama ETH Cargo.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <MarketingSectionsHero />
  <MarketingSectionsMainServices />
  <MarketingSectionsWhyChooseUs />
  <MarketingSectionsShippingFlow />
  <MarketingSectionsProductSourcing />
  <MarketingSectionsTestimonials />
</template>
