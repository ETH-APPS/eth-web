<script setup lang="ts">
import { faqContentByPath, homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

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
const completeGuideBanner = illustratedCtaBanners.completeGuide
</script>

<template>
  <MarketingSectionsCompleteGuideContent />
  <MarketingSectionsFaq
    :content="faqContent"
    section-id="complete-guide-faq"
    :default-open-index="1"
  />
  <div id="complete-guide-quote">
    <MarketingIllustratedCtaBanner
      v-bind="completeGuideBanner"
      full-width
      image-alt="Ilustrasi panduan strategi impor B2B dari China"
    />
    <MarketingSectionsQuoteBanner
      class="lg:hidden"
      section-id="complete-guide-mobile-quote"
      :title="completeGuideBanner.title"
      :description="completeGuideBanner.description"
      email-label="Atau hubungi kami via email:"
      :email="completeGuideBanner.email"
      :cta-label="completeGuideBanner.ctaLabel"
      :cta-to="completeGuideBanner.ctaTo"
      :show-image="false"
    />
  </div>
</template>
