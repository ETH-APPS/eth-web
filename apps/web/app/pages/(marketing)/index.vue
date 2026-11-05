<script setup lang="ts">
import { homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

const homeBanner = illustratedCtaBanners.about

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
  <MarketingSectionsFaq :content="homeFaqContent" />
  <div id="quote" class="pb-6 lg:pb-10">
    <UiContainer>
      <MarketingIllustratedCtaBanner
        v-bind="homeBanner"
        variant="contained"
        :image-max-width="540"
        :image-top-offset="42"
        image-alt="Ilustrasi tim ETH Cargo mengelola rantai pasok impor"
      />
    </UiContainer>
    <MarketingSectionsQuoteBanner
      class="lg:hidden"
      section-id="home-mobile-quote"
      compact
      :title="homeBanner.title"
      :description="homeBanner.description"
      email-label="Atau hubungi kami via email:"
      :email="homeBanner.email"
      :cta-label="homeBanner.ctaLabel"
      :cta-to="homeBanner.ctaTo"
      :show-image="false"
    />
  </div>
</template>
