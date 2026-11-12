<script setup lang="ts">
import { faqDirectoryGroups } from '~/constants/faqDirectory'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'FAQ | ETH Cargo',
  description:
    'Temukan jawaban atas pertanyaan umum mengenai layanan, pengiriman, tarif, kalkulator, dan tracking ETH Cargo.',
  ogTitle: 'FAQ | ETH Cargo',
  ogDescription:
    'Temukan jawaban atas pertanyaan umum mengenai layanan, pengiriman, tarif, kalkulator, dan tracking ETH Cargo.',
  ogType: 'website',
})

const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  const pageUrl = new URL('/faq', homepage).href

  useHead({
    script: [{
      key: 'faq-page-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': pageUrl + '#webpage',
        name: 'FAQ | ETH Cargo',
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          '@id': homepage + '#website',
          name: 'ETH Cargo',
          url: homepage,
        },
        mainEntity: faqDirectoryGroups.flatMap(group => group.items.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        }))),
      }).replace(/</g, '\\u003c'),
    }],
  })
}
</script>

<template>
  <MarketingFaqDirectory
    :groups="faqDirectoryGroups"
    description="Temukan jawaban lengkap seputar layanan pengiriman All-In Door-to-Door, estimasi tarif, pelacakan kargo, hingga ketentuan impor dari China ke Indonesia."
  />
</template>
