<script setup lang="ts">
import { Blocks, Clock3, Headset, Package, PackageCheck, ShieldCheck } from 'lucide-vue-next'
import CargoLandingHero from '~/components/marketing/CargoLandingHero.vue'
import calculatorIcon from '~/assets/icons/Сalculator.png'
import containerIcon from '~/assets/icons/container.png'
import deliveryTruckIcon from '~/assets/icons/delivery-truck.png'
import warehouseIcon from '~/assets/icons/warehouse.png'
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
const isThailand = computed(() => country.value.slug === 'thailand')
const isAmerica = computed(() => country.value.slug === 'amerika')
const isSingapore = computed(() => country.value.slug === 'singapura')
const isTaiwan = computed(() => country.value.slug === 'taiwan')
const isMalaysia = computed(() => country.value.slug === 'malaysia')
const isAustralia = computed(() => country.value.slug === 'australia')
const isSouthKorea = computed(() => country.value.slug === 'korea-selatan')
const hasFeaturedFreightContent = computed(() => isThailand.value || isAmerica.value || isSingapore.value || isTaiwan.value || isMalaysia.value || isAustralia.value || isSouthKorea.value)
const featuredCountryName = computed(() => isAmerica.value ? 'Amerika Serikat' : isSingapore.value ? 'Singapura' : isTaiwan.value ? 'Taiwan' : isMalaysia.value ? 'Malaysia' : isAustralia.value ? 'Australia' : isSouthKorea.value ? 'Korea Selatan' : 'Thailand')
const featuredSeaDescription = computed(() => `Mengirim barang dalam volume besar? Layanan Kargo Laut (LCL & FCL) kami memberikan keandalan operasional dengan biaya yang jauh lebih efisien untuk rute ${featuredCountryName.value} - Indonesia. Dengan jaminan ketersediaan ruang kontainer dan transparansi harga, ETH Cargo siap membantu Anda merencanakan rantai pasok dengan lebih cerdas dan hemat.`)
const featuredAirDescription = computed(() => `Butuh pengiriman kilat untuk barang bernilai tinggi atau komoditas prioritas? Layanan Kargo Udara kami menawarkan waktu transit tercepat dari ${featuredCountryName.value} ke Indonesia. Dengan jadwal penerbangan yang teratur dan penanganan khusus, kami memastikan rantai pasok Anda berjalan tanpa hambatan.`)
const featuredEstimatorDescription = computed(() => `Dapatkan kalkulasi perkiraan biaya pengiriman All-In dari ${isAmerica.value ? 'Amerika' : isSingapore.value ? 'Singapura' : isTaiwan.value ? 'Taiwan' : isMalaysia.value ? 'Malaysia' : isAustralia.value ? 'Australia' : isSouthKorea.value ? 'Korea Selatan' : 'Thailand'} ke Indonesia secara instan untuk perencanaan modal bisnis Anda.`)
const countryDeliveryEstimates = computed(() => {
  const seaEstimate = isThailand.value ? '2 ~ 4 Minggu' : '4 ~ 8 Minggu'
  const airEstimate = isThailand.value ? '1 ~ 5 Hari' : '3 ~ 7 Hari'

  return {
    'FCL Cargo': seaEstimate,
    'LCL Cargo': seaEstimate,
    'Air Cargo': airEstimate,
  }
})
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

useHead({
  meta: [
    { name: 'keywords', content: seoKeywords }
  ]
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
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

const thailandWorkflowSteps = [
  {
    title: 'Konsultasi & Hitung Estimasi',
    description: 'Kirim detail kargo (volume/CBM atau berat) dan jenis layanan yang diinginkan. Tim kami akan memberikan penawaran biaya All-In yang transparan.',
    icon: calculatorIcon,
  },
  {
    title: 'Pengiriman ke Gudang Thailand',
    description: 'Supplier Anda mengirimkan barang ke gudang konsolidasi ETH Cargo di Thailand lengkap dengan Kode Marking Anda.',
    icon: deliveryTruckIcon,
  },
  {
    title: 'Pengiriman Kargo & Clearance',
    description: 'Kami melakukan verifikasi barang, pemuatan ke kontainer/pesawat, dan pengurusan seluruh proses bea cukai serta dokumen kepabeanan.',
    icon: containerIcon,
  },
  {
    title: 'Tiba di Gudang Indonesia',
    description: 'Kargo tiba di gudang penyortiran ETH Cargo di Indonesia. Tim logistik melakukan pemeriksaan kondisi barang, pengukuran ulang, dan penimbangan akhir demi kepastian data.',
    icon: warehouseIcon,
  },
  {
    title: 'Pengiriman Akhir ke Alamat Anda',
    description: 'Barang langsung didistribusikan ke alamat gudang, pabrik, atau toko Anda secara aman dan tepat waktu.',
    icon: Package,
  },
]

const featuredWorkflowSteps = computed(() => thailandWorkflowSteps.map((step, index) => index === 1 && (isAmerica.value || isSingapore.value || isTaiwan.value || isMalaysia.value || isAustralia.value || isSouthKorea.value)
  ? {
      ...step,
      title: `Pengiriman ke Gudang ${isAmerica.value ? 'USA' : isTaiwan.value ? 'Taiwan' : isMalaysia.value ? 'Malaysia' : isAustralia.value ? 'Australia' : isSouthKorea.value ? 'Korea Selatan' : 'Singapura'}`,
      description: `Supplier Anda mengirimkan barang ke gudang konsolidasi ETH Cargo di ${isAmerica.value ? 'Amerika' : isTaiwan.value ? 'Taiwan' : isMalaysia.value ? 'Malaysia' : isAustralia.value ? 'Australia' : isSouthKorea.value ? 'Korea Selatan' : 'Singapura'} lengkap dengan Kode Marking Anda.`,
    }
  : step))

const faqContent = computed(() => country.value.faq)
const cargoBanner = computed(() => ({
  title: `Siap Kirim Kargo Impor dari ${country.value.name}?`,
  description: 'Hitung estimasi pengiriman dengan kalkulator kargo kami, atau konsultasikan kebutuhan impor bisnis Anda langsung bersama tim ahli ETH Cargo.',
  email: 'ethcargo@hotmail.com',
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
    :quote-to="whatsappConsultationUrl"
    animated-quote-button
    :image="country.hero.image"
    :image-alt="country.hero.imageAlt"
    :highlights="heroHighlights"
    highlights-aria-label="Multinational cargo service benefits"
    country-variant
  />
  <MarketingSectionsFreightService
    :eyebrow="hasFeaturedFreightContent ? 'Layanan Kami' : 'Our Service'"
    :title="hasFeaturedFreightContent ? 'Cargo Laut (Sea Freight)' : 'Sea Freight'"
    :description="hasFeaturedFreightContent
      ? featuredSeaDescription
      : 'Kirim barang bervolume besar melalui layanan Full Container Load (FCL) yang aman dan andal. Dengan kepastian alokasi kontainer serta penguncian tarif hingga 45 hari, perencanaan logistik bisnis menjadi lebih efisien dan terukur.'"
    :image="cargoSeaUrl"
    image-alt="Kapal kontainer untuk layanan sea freight multinational ETH Cargo"
    :cta-prompt="hasFeaturedFreightContent
      ? 'Solusi logistik All-In Door-to-Door yang aman, terpercaya, dan bebas pusing urusan kepabeanan.'
      : 'Pelajari layanan pengiriman laut untuk kebutuhan bisnis internasional Anda'"
    cta-label="Pelajari Selengkapnya"
    cta-to="/sea-freight"
    animated-cta
    :compact-layout="hasFeaturedFreightContent"
  />
  <MarketingSectionsStats
    :stats="serviceStats"
    aria-label="Multinational cargo service statistics"
  />
  <MarketingSectionsFreightService
    section-id="air-freight"
    :eyebrow="hasFeaturedFreightContent ? 'Layanan Kami' : 'Our Service'"
    :title="hasFeaturedFreightContent ? 'Cargo Udara (Air Freight)' : 'Air Freight'"
    :description="hasFeaturedFreightContent
      ? featuredAirDescription
      : 'Butuh pengiriman internasional yang lebih cepat? Layanan Air Freight kami memberikan waktu transit singkat, jadwal penerbangan yang terukur, serta penanganan kargo yang aman dari titik keberangkatan hingga tiba di negara tujuan.'"
    :image="cargoAirUrl"
    image-alt="Pesawat cargo untuk layanan air freight multinational ETH Cargo"
    :cta-prompt="hasFeaturedFreightContent
      ? 'Nikmati layanan All-In Door-to-Door yang praktis. Seluruh proses kepabeanan dan pengantaran akhir kami tangani sepenuhnya untuk ketenangan bisnis Anda.'
      : 'Pelajari layanan pengiriman udara untuk kebutuhan bisnis internasional Anda'"
    cta-label="Pelajari Selengkapnya"
    cta-to="/air-freight"
    animated-cta
    :compact-layout="hasFeaturedFreightContent"
  />
  <MarketingSectionsShippingWorkflow
    :title="hasFeaturedFreightContent ? 'Cara Kerja Layanan Kargo' : 'HOW IT WORKS'"
    :description="hasFeaturedFreightContent
      ? 'Proses pengiriman kargo yang simpel, transparan, dan terukur dari awal hingga barang tiba di gudang Anda.'
      : 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.'"
    :steps="hasFeaturedFreightContent ? featuredWorkflowSteps : shippingWorkflowSteps"
    :cta-prompt="hasFeaturedFreightContent ? 'Siap memulai pengiriman kargo bisnis Anda hari ini?' : 'Lorem ipsum dolor sit amet consectetur adipiscing elit'"
    :cta-label="hasFeaturedFreightContent ? 'Konsultasi Gratis' : 'Get a Quote'"
    :cta-to="whatsappConsultationUrl"
  />
  <MarketingSectionsRateEstimator
    title="Hitung Estimasi Tarif Multinasional"
    :description="hasFeaturedFreightContent
      ? featuredEstimatorDescription
      : 'Dapatkan kalkulasi perkiraan biaya pengiriman internasional secara instan untuk membantu perencanaan logistik dan anggaran bisnis Anda.'"
    :delivery-estimates="countryDeliveryEstimates"
    calculator-enabled
    animated-submit
    show-shipping-price-field
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
