<script setup lang="ts">
import { Blocks, Clock3, Headset, PackageCheck, ShieldCheck } from 'lucide-vue-next'
import CargoLandingHero from '~/components/marketing/CargoLandingHero.vue'
import cargoAirUrl from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea-landscape.png'
import multinationalCargoHeroUrl from '~/assets/images/marketing/multinational-cargo-hero.png'
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

const serviceDescription = 'Layanan pengiriman kargo laut dan udara untuk kebutuhan logistik internasional dari dan menuju Amerika bersama ETH Cargo.'
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  const serviceUrl = new URL('/multinational-cargo', homepage).href

  useHead({
    script: [{
      key: 'multinational-cargo-service-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': serviceUrl + '#service',
        name: 'Multinational Cargo Amerika',
        description: serviceDescription,
        url: serviceUrl,
        mainEntityOfPage: serviceUrl,
        image: new URL(multinationalCargoHeroUrl, homepage).href,
        provider: {
          '@type': 'Organization',
          '@id': homepage + '#organization',
          name: 'ETH Cargo',
          url: homepage,
        },
      }).replace(/</g, '\\u003c'),
    }],
  })
}

useSeoMeta({
  title: 'Multinational Cargo Amerika | ETH Cargo',
  description: serviceDescription,
  ogTitle: 'Multinational Cargo Amerika | ETH Cargo',
  ogDescription: serviceDescription,
  ogType: 'website',
})

const heroServices = ['Sea Cargo', 'Air Cargo']
const heroServiceLinks = {
  'Sea Cargo': '#sea-freight',
  'Air Cargo': '#air-freight',
}
const heroHighlights = [
  { label: 'Guaranteed\nSafety', icon: ShieldCheck },
  { label: '24/7\nLive Tracking', icon: Clock3 },
  { label: 'All-in Service', icon: Blocks },
  { label: 'Door-to-door', icon: PackageCheck },
  { label: 'Dedicated\nSupport', icon: Headset },
]

const serviceStats = [
  { value: '+10.000', label: 'Shipment\nCompleted', uppercase: true },
  { value: '98%', label: 'Completion\nRate', uppercase: true },
  { value: '+7', label: 'Countries\nShipping', uppercase: true },
  { value: '+10', label: 'Years of\nExperiences' },
]

const shippingWorkflowSteps = Array.from({ length: 5 }, () => ({
  title: 'Lorem Ipsum',
  description:
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
}))

const faqContent = faqContentByPath['/multinational-cargo'] ?? homeFaqContent
const cargoBanner = {
  title: faqContent.quoteTitle,
  description: faqContent.quoteDescription,
  email: 'email@ethcargo.co.id',
  ctaLabel: 'Konsultasi Gratis',
  ctaTo: '#quote',
}
</script>

<template>
  <CargoLandingHero
    title-id="multinational-cargo-title"
    eyebrow="Multinational Cargo"
    include-eyebrow-in-title
    title="America"
    description="Solusi pengiriman kargo laut dan udara dari dan menuju Amerika yang aman, transparan, dan terintegrasi untuk mendukung kebutuhan logistik internasional bisnis Anda."
    service-label="In this page"
    :services="heroServices"
    :service-links="heroServiceLinks"
    tracking-label="Track Shipment"
    tracking-to="/live-tracking"
    quote-label="Get a Quote"
    :image="multinationalCargoHeroUrl"
    image-alt="Pelabuhan dan bandara kargo untuk layanan pengiriman multinational ETH Cargo"
    :highlights="heroHighlights"
    highlights-aria-label="Multinational cargo service benefits"
  />
  <MarketingSectionsFreightService
    eyebrow="Our Service"
    title="Sea Freight"
    description="Kirim barang bervolume besar melalui layanan Full Container Load (FCL) yang aman dan andal. Dengan kepastian alokasi kontainer serta penguncian tarif hingga 45 hari, perencanaan logistik bisnis menjadi lebih efisien dan terukur."
    :image="cargoSeaUrl"
    image-alt="Kapal kontainer untuk layanan sea freight multinational ETH Cargo"
    cta-prompt="Pelajari layanan pengiriman laut untuk kebutuhan bisnis internasional Anda"
    cta-label="Learn more"
    cta-to="#quote"
  />
  <MarketingSectionsStats
    :stats="serviceStats"
    aria-label="Multinational cargo service statistics"
  />
  <MarketingSectionsFreightService
    section-id="air-freight"
    eyebrow="Our Service"
    title="Air Freight"
    description="Butuh pengiriman internasional yang lebih cepat? Layanan Air Freight kami memberikan waktu transit singkat, jadwal penerbangan yang terukur, serta penanganan kargo yang aman dari titik keberangkatan hingga tiba di negara tujuan."
    :image="cargoAirUrl"
    image-alt="Pesawat cargo untuk layanan air freight multinational ETH Cargo"
    cta-prompt="Pelajari layanan pengiriman udara untuk kebutuhan bisnis internasional Anda"
    cta-label="Learn more"
    cta-to="#quote"
  />
  <MarketingSectionsShippingWorkflow
    title="HOW IT WORKS"
    description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
    :steps="shippingWorkflowSteps"
    cta-prompt="Lorem ipsum dolor sit amet consectetur adipiscing elit"
    cta-label="Get a Quote"
    cta-to="#quote"
  />
  <MarketingSectionsRateEstimator
    title="Hitung Estimasi Tarif Multinasional"
    description="Dapatkan kalkulasi perkiraan biaya pengiriman internasional secara instan untuk membantu perencanaan logistik dan anggaran bisnis Anda."
  />
  <MarketingSectionsFaq :content="faqContent" />
  <div id="quote" class="pb-6 lg:pb-10">
    <UiContainer wide>
      <MarketingCargoCtaBanner
        v-bind="cargoBanner"
      />
    </UiContainer>
    <MarketingSectionsQuoteBanner
      v-bind="cargoBanner"
      class="lg:hidden"
      section-id="multinational-cargo-mobile-quote"
      compact
      email-label="Atau hubungi kami via email:"
      :show-image="false"
    />
  </div>
</template>
