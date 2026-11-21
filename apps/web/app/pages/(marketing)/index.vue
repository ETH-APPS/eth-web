<script setup lang="ts">
import logoUrl from '~/assets/images/brand/logo.png'
import { homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

const homeBanner = illustratedCtaBanners.cargo
const siteName = 'ETH Cargo'
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

definePageMeta({
  layout: 'marketing'
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
  keywords: 'forwarder china Indonesia',
  title: 'Forwarder China Indonesia untuk Bisnis | ETH Cargo',
  description: 'Forwarder China Indonesia untuk bisnis: beli barang, transfer RMB, kargo udara & laut, hingga dokumen impor diurus satu pintu. Konsultasi gratis.',
  ogTitle: 'Forwarder China Indonesia untuk Bisnis | ETH Cargo',
  ogDescription: 'Forwarder China Indonesia untuk bisnis: beli barang, transfer RMB, kargo udara & laut, hingga dokumen impor diurus satu pintu. Konsultasi gratis.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <MarketingSectionsHero />
  <MarketingSectionsMainServices />
  <MarketingSectionsWhyChooseUs />
  <MarketingSectionsShippingFlow />
  <MarketingSectionsHomeRateEstimator />
  <MarketingSectionsProductSourcing />
  <MarketingSectionsTestimonials />
  <MarketingSectionsFaq :content="homeFaqContent" />
  <div id="quote" class="pb-6 lg:pb-10">
    <UiContainer wide>
      <MarketingCargoCtaBanner
        v-bind="homeBanner"
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
