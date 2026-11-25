<script setup lang="ts">
import articleImage from '~/assets/images/marketing/article.png'
import { faqContentByPath, homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

definePageMeta({
  layout: 'marketing',
})

const pageDescription = 'Panduan lengkap proses impor, pemilihan metode pengiriman, dokumen, dan pemantauan kargo bersama ETH Cargo.'
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  const articleUrl = new URL('/complete-guide', homepage).href

  useHead({
    script: [{
      key: 'complete-guide-article-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': articleUrl + '#article',
        url: articleUrl,
        mainEntityOfPage: articleUrl,
        headline: 'Panduan Lengkap Cara Import Barang dari China',
        description: pageDescription,
        image: new URL(articleImage, homepage).href,
        publisher: {
          '@type': 'Organization',
          '@id': homepage + '#organization',
          name: 'ETH Cargo',
          url: homepage,
        },
      }).replace(/</g, '\\u003c'),
    }],
  })
}

useHead({
  meta: [
    { name: 'keywords', content: 'cara import barang dari china' }
  ]
})

useSeoMeta({
  title: 'Cara Import Barang dari China: Langkah Lengkap | ETH Cargo',
  description: 'Langkah impor barang dari China ke Indonesia: pilih supplier, kode marking, kirim ke gudang, kargo, hingga dokumen impor. Baca panduannya.',
  ogTitle: 'Cara Import Barang dari China: Langkah Lengkap | ETH Cargo',
  ogDescription: 'Langkah impor barang dari China ke Indonesia: pilih supplier, kode marking, kirim ke gudang, kargo, hingga dokumen impor. Baca panduannya.',
  ogType: 'article',
})

const faqContent = faqContentByPath['/complete-guide'] ?? homeFaqContent
const completeGuideBanner = illustratedCtaBanners.completeGuide
</script>

<template>
  <MarketingSectionsCompleteGuideContent />
  <MarketingSectionsFaq
    :content="faqContent"
    section-id="complete-guide-faq"
    :default-open-index="1"
  />
  <!-- <div id="complete-guide-quote" class="pb-8 lg:pb-16">
    <UiContainer wide>
      <MarketingIllustratedCtaBanner
        v-bind="completeGuideBanner"
        variant="standard"
        image-alt="Ilustrasi panduan strategi impor B2B dari China"
      />
    </UiContainer>
    <MarketingSectionsQuoteBanner
      class="lg:hidden"
      section-id="complete-guide-mobile-quote"
      compact
      :title="completeGuideBanner.title"
      :description="completeGuideBanner.description"
      email-label="Atau hubungi kami via email:"
      :email="completeGuideBanner.email"
      :cta-label="completeGuideBanner.ctaLabel"
      :cta-to="completeGuideBanner.ctaTo"
      :show-image="false"
    />
  </div> -->
</template>
