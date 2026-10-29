<script setup lang="ts">
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Our Complete Guide | ETH Cargo',
  description: 'Panduan lengkap proses impor, pemilihan metode pengiriman, dokumen, dan pemantauan kargo bersama ETH Cargo.',
  ogTitle: 'Our Complete Guide | ETH Cargo',
  ogDescription: 'Panduan lengkap proses impor dan pengiriman internasional bersama ETH Cargo.',
  ogType: 'article',
})

const faqContent = faqContentByPath['/complete-guide'] ?? homeFaqContent

const guideShippingServices = [
  {
    mode: 'sea' as const,
    title: 'Sea Freight',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
    to: '/sea-freight',
  },
  {
    mode: 'air' as const,
    title: 'Air Freight',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
    to: '/air-freight',
  },
] as const
</script>

<template>
  <MarketingSectionsCompleteGuideContent />
  <MarketingSectionsFaq
    :content="faqContent"
    section-id="complete-guide-faq"
    :default-open-index="1"
  />
</template>
