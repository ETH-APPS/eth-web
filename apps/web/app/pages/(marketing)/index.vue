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
  const mobileHint = useRequestHeader('sec-ch-ua-mobile')
  const isMobile = mobileHint === '?1'
    || (mobileHint === undefined && /\b(?:Mobile|Android)\b/i.test(useRequestHeader('user-agent') ?? ''))
  const vary = useResponseHeader('Vary')
  vary.value = [vary.value, 'Sec-CH-UA-Mobile', 'User-Agent'].filter(Boolean).join(', ')

  // Serve the same compiled Tailwind stylesheet with the mobile HTML on cold loads.
  const mobileCss = !import.meta.dev && isMobile
    ? (await import('~/assets/css/main.css?inline')).default
    : undefined

  injectHead().hooks?.hook('tags:resolve', (context) => {
    context.tags = context.tags.filter(({ tag, props }) => {
      if (tag !== 'link') return true

      if (mobileCss && props.rel === 'stylesheet' && typeof props.href === 'string'
        && /\/entry\.[\w-]+\.css$/.test(props.href)) return false

      // Mobile lets the module entry and dynamic imports fetch their own dependencies.
      // This gives CSS and the hero bandwidth before hydration starts.
      if (isMobile && props.rel === 'modulepreload' && props.as === 'script') return false

      return props.rel !== 'prefetch' || (props.as !== 'script' && props.as !== 'style')
    })
  })

  if (mobileCss) {
    useHead({ style: [{ innerHTML: mobileCss, tagPriority: 71 }] })
  }

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
  <LazyMarketingSectionsProductSourcing
    class="max-lg:defer-render [--section-placeholder:1180px]"
    :hydrate-on-visible="{ rootMargin: '800px' }"
  />
  <LazyMarketingSectionsMainServices
    class="max-lg:defer-render [--section-placeholder:1380px] sm:[--section-placeholder:1280px]"
    :hydrate-on-visible="{ rootMargin: '320px' }"
  />
  <LazyMarketingSectionsWhyChooseUs
    class="max-lg:defer-render [--section-placeholder:690px] md:[--section-placeholder:1150px]"
    :hydrate-on-visible="{ rootMargin: '800px' }"
  />
  <LazyMarketingSectionsShippingFlow
    class="max-lg:defer-render [--section-placeholder:450px] md:[--section-placeholder:820px]"
    :hydrate-on-visible="{ rootMargin: '800px' }"
  />
  <!-- <MarketingSectionsHomeRateEstimator /> -->
  <LazyMarketingSectionsTestimonials
    class="max-lg:defer-render [--section-placeholder:550px] sm:[--section-placeholder:490px]"
    :hydrate-on-visible="{ rootMargin: '1600px' }"
  />
  <LazyMarketingSectionsFaq
    class="max-lg:defer-render [--section-placeholder:940px] sm:[--section-placeholder:690px] md:[--section-placeholder:600px]"
    :content="homeFaqContent"
    :hydrate-on-interaction="['pointerenter', 'focusin', 'click']"
  />
  <div id="quote" class="pb-6 max-lg:defer-render [--section-placeholder:370px] sm:[--section-placeholder:232px] lg:pb-10">
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
