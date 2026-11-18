<script setup lang="ts">
import { faqDirectoryGroups } from '~/constants/faqDirectory'

definePageMeta({
  layout: 'marketing',
  validate: route => faqDirectoryGroups.some(group => group.id === route.params.slug),
  scrollToTop: (_to, from) => !faqDirectoryGroups.some(group => from.path === `/faq/${group.id}`),
})

const route = useRoute()
const group = computed(() => faqDirectoryGroups.find(item => item.id === route.params.slug))
const pageTitle = computed(() => group.value?.id === 'pertanyaan-umum'
  ? 'FAQ Impor & Kargo China | ETH Cargo'
  : `${group.value?.title ?? 'FAQ'} | ETH Cargo`)
const pageDescription = computed(() => group.value?.id === 'pertanyaan-umum'
  ? 'Jawaban seputar jasa sourcing, transfer RMB, kargo udara & laut ETH Cargo: estimasi waktu, biaya, refund, dan syarat. Konsultasi bila butuh bantuan.'
  : group.value?.description ?? '')

useSeoMeta({
  title: pageTitle,
  keywords: () => group.value?.id === 'pertanyaan-umum' ? 'faq impor china' : undefined,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
})

const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  const pageUrl = computed(() => new URL(`/faq/${route.params.slug}`, homepage).href)

  useHead({
    script: [{
      key: 'faq-page-schema',
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': pageUrl.value + '#webpage',
        name: pageTitle.value,
        url: pageUrl.value,
        isPartOf: {
          '@type': 'WebSite',
          '@id': homepage + '#website',
          name: 'ETH Cargo',
          url: homepage,
        },
        mainEntity: group.value?.items.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })) ?? [],
      }).replace(/</g, '\\u003c')),
    }],
  })
}
</script>

<template>
  <MarketingFaqDirectory
    :groups="faqDirectoryGroups"
    :selected-group-id="group?.id"
    description="Temukan jawaban lengkap seputar layanan pengiriman All-In Door-to-Door, estimasi tarif, pelacakan kargo, hingga ketentuan impor dari China ke Indonesia."
  />
</template>
