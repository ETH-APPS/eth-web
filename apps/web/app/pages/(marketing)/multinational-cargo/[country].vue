<script setup lang="ts">
import { Blocks, Clock3, Headset, PackageCheck, ShieldCheck } from 'lucide-vue-next'
import CargoLandingHero from '~/components/marketing/CargoLandingHero.vue'
import cargoAirUrl from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea-landscape.png'
import multinationalVectorUrl from '~/assets/images/marketing/vector-multinational.png'
import { multinationalCountries, multinationalCountryPath } from '~/constants/multinationalCountries'
import { whatsappConsultationUrl } from '~/constants/whatsapp'

definePageMeta({
  layout: 'marketing',
  validate: route => multinationalCountries.some(country => country.slug === route.params.country),
})

const route = useRoute()
const country = computed(() => multinationalCountries.find(item => item.slug === route.params.country)!)
const serviceDescription = computed(() => country.value.hero.description)
const countrySeoMeta: Record<string, { title: string, description: string, keywords: string }> = {
  thailand: {
    title: 'Cargo Thailand ke Indonesia | ETH Cargo',
    description: 'Kirim barang dari Thailand ke Indonesia lewat ETH Cargo. Tanyakan rute, estimasi waktu, dan tarif terbaru ke tim marketing kami.',
    keywords: 'cargo thailand',
  },
  singapura: {
    title: 'Cargo Singapura ke Indonesia | ETH Cargo',
    description: 'Kirim barang dari Singapura ke Indonesia lewat ETH Cargo. Tanyakan rute, estimasi waktu, dan tarif terbaru ke tim marketing kami.',
    keywords: 'cargo singapura',
  },
  'korea-selatan': {
    title: 'Cargo Korea Selatan ke Indonesia | ETH Cargo',
    description: 'Kirim barang dari Korea Selatan ke Indonesia lewat ETH Cargo. Tanyakan rute, estimasi waktu, dan tarif terbaru ke tim marketing kami.',
    keywords: 'cargo korea selatan',
  },
  malaysia: {
    title: 'Cargo Malaysia ke Indonesia | ETH Cargo',
    description: 'Kirim barang dari Malaysia ke Indonesia lewat ETH Cargo. Tanyakan rute, estimasi waktu, dan tarif terbaru ke tim marketing kami.',
    keywords: 'cargo malaysia',
  },
  amerika: {
    title: 'Cargo USA ke Indonesia | ETH Cargo',
    description: 'Kirim barang dari Amerika Serikat ke Indonesia lewat ETH Cargo. Tanyakan rute, estimasi waktu, dan tarif terbaru ke tim marketing kami.',
    keywords: 'cargo usa',
  },
  taiwan: {
    title: 'Cargo Taiwan ke Indonesia | ETH Cargo',
    description: 'Kirim barang dari Taiwan ke Indonesia lewat ETH Cargo. Tanyakan rute, estimasi waktu, dan tarif terbaru ke tim marketing kami.',
    keywords: 'cargo taiwan',
  },
  australia: {
    title: 'Cargo Australia ke Indonesia | ETH Cargo',
    description: 'Kirim barang dari Australia ke Indonesia lewat ETH Cargo. Tanyakan rute, estimasi waktu, dan tarif terbaru ke tim marketing kami.',
    keywords: 'cargo australia',
  },
}
const seoTitle = computed(() => countrySeoMeta[country.value.slug]?.title ?? `${country.value.hero.title.replace('\n', ' ')} | ETH Cargo`)
const seoDescription = computed(() => countrySeoMeta[country.value.slug]?.description ?? serviceDescription.value)
const seoKeywords = computed(() => countrySeoMeta[country.value.slug]?.keywords)
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  useHead(() => {
    const serviceUrl = new URL(multinationalCountryPath(country.value.slug), homepage).href
    return {
      script: [{
        key: 'multinational-cargo-service-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': serviceUrl + '#service',
          name: country.value.hero.title.replace('\n', ' '),
          description: serviceDescription.value,
          url: serviceUrl,
          mainEntityOfPage: serviceUrl,
          image: new URL(country.value.hero.image, homepage).href,
          provider: {
            '@type': 'Organization',
            '@id': homepage + '#organization',
            name: 'ETH Cargo',
            url: homepage,
          },
        }).replace(/</g, '\\u003c'),
      }],
    }
  })
}

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  keywords: seoKeywords,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  robots: 'noindex, follow',
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

const faqContent = computed(() => country.value.faq)
const cargoBanner = computed(() => ({
  title: `Siap Kirim Kargo Impor dari ${country.value.name}?`,
  description: 'Hitung estimasi pengiriman dengan kalkulator kargo kami, atau konsultasikan kebutuhan impor bisnis Anda langsung bersama tim ahli ETH Cargo.',
  email: 'email@ethcargo.co.id',
  ctaLabel: 'Konsultasi Gratis',
  ctaTo: whatsappConsultationUrl,
}))
</script>

<template>
  <CargoLandingHero
    title-id="multinational-cargo-title"
    :eyebrow="country.hero.eyebrow"
    :title="country.hero.title"
    :description="country.hero.description"
    service-label="Layanan di halaman ini:"
    :services="heroServices"
    :service-links="heroServiceLinks"
    tracking-label="Lacak Pengiriman"
    tracking-to="/live-tracking"
    quote-label="Dapatkan Penawaran"
    animated-quote-button
    :image="country.hero.image"
    :image-alt="country.hero.imageAlt"
    :highlights="heroHighlights"
    highlights-aria-label="Multinational cargo service benefits"
    country-variant
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
    animated-cta
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
    animated-cta
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
      <MarketingIllustratedCtaBanner
        v-bind="cargoBanner"
        variant="background"
        :image="multinationalVectorUrl"
        :image-width="512"
        :image-height="350"
        large-image-on-wide-screens
        image-alt="Ilustrasi pengiriman kargo internasional melalui darat, laut, dan udara"
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
