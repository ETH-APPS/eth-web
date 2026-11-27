<script setup lang="ts">
import poppinsRegular from '@fontsource/poppins/files/poppins-latin-400-normal.woff2?url'
import poppinsMedium from '@fontsource/poppins/files/poppins-latin-500-normal.woff2?url'
import poppinsSemibold from '@fontsource/poppins/files/poppins-latin-600-normal.woff2?url'
import poppinsBold from '@fontsource/poppins/files/poppins-latin-700-normal.woff2?url'
import logoUrl from '~/assets/images/brand/logo.png'
import { homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

const homeBanner = illustratedCtaBanners.cargo
const siteName = 'ETH Cargo'
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

definePageMeta({
  layout: 'marketing'
})

if (import.meta.server) {
  const fontPreload = { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' } as const

  useHead({
    link: [
      ...[poppinsRegular, poppinsMedium, poppinsSemibold].map(href => ({ ...fontPreload, href })),
      { ...fontPreload, href: poppinsBold, media: '(min-width: 64rem)' },
    ],
  })
}

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

useHead({
  meta: [
    { name: 'keywords', content: 'forwarder china Indonesia' }
  ]
})

useSeoMeta({
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
  <MarketingSectionsHomeLogisticsEstimator />
  <LazyMarketingSectionsProductSourcing :hydrate-on-visible="{ rootMargin: '800px' }" />
  <LazyMarketingSectionsMainServices :hydrate-on-visible="{ rootMargin: '320px' }" />
  <LazyMarketingSectionsWhyChooseUs :hydrate-on-visible="{ rootMargin: '800px' }" />
  <LazyMarketingSectionsShippingFlow :hydrate-on-visible="{ rootMargin: '800px' }" />
  <!-- <MarketingSectionsHomeRateEstimator /> -->
  <LazyMarketingSectionsTestimonials :hydrate-on-visible="{ rootMargin: '1600px' }" />
  <LazyMarketingSectionsFaq :content="homeFaqContent" :hydrate-on-interaction="['pointerenter', 'focusin', 'click']" />
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
