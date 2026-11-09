<script setup lang="ts">
import logoUrl from '~/assets/images/brand/logo.png'
import { homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

const homeBanner = illustratedCtaBanners.about
const siteName = 'ETH Cargo'
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

definePageMeta({
  layout: 'marketing'
})

useHead({
  htmlAttrs: {
    lang: 'id'
  }
})

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  const organizationId = homepage + '#organization'

  useHead({
    script: [{
      key: 'homepage-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': organizationId,
            name: siteName,
            url: homepage,
            logo: new URL(logoUrl, homepage).href,
          },
          {
            '@type': 'WebSite',
            '@id': homepage + '#website',
            name: siteName,
            url: homepage,
            publisher: { '@id': organizationId },
          },
        ],
      }).replace(/</g, '\\u003c'),
    }],
  })
}

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
