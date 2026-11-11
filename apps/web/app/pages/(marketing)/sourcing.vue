<script setup lang="ts">
import sourcingHeroUrl from '~/assets/images/marketing/sourcing-hero.png'
import { faqContentByPath, homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

definePageMeta({
  layout: 'marketing',
})

const serviceDescription = 'Temukan supplier dan pabrik terpercaya di China dengan dukungan pencarian produk, negosiasi harga, pemesanan sampel, dan kontrol kualitas dari ETH Cargo.'
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  const serviceUrl = new URL('/sourcing', homepage).href

  useHead({
    script: [{
      key: 'sourcing-service-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': serviceUrl + '#service',
        name: 'Jasa Sourcing Barang China',
        description: serviceDescription,
        url: serviceUrl,
        mainEntityOfPage: serviceUrl,
        image: new URL(sourcingHeroUrl, homepage).href,
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
  title: 'Jasa Sourcing Barang China | ETH Cargo',
  description: serviceDescription,
  ogTitle: 'Jasa Sourcing Barang China | ETH Cargo',
  ogDescription: 'Layanan sourcing supplier dan pabrik terpercaya di China untuk kebutuhan bisnis Anda.',
  ogType: 'website',
})

const sourcingStats = [
  { value: '+10.000', label: 'Transaksi Selesai' },
  { value: '+5', label: 'Rute Pengiriman\nInternasional' },
  { value: '+10', label: 'Tahun Pengalaman' },
] as const

const sourcingWorkflow = [
  {
    title: 'Konsultasi Spesifikasi & Foto Produk',
    description:
      'Kirimkan foto, link referensi (1688/Taobao/Alibaba) dan estimasi kuantitas barang yang ingin Anda cari di China.',
  },
  {
    title: 'Pencarian & Kurasi Supplier Terpercaya',
    description:
      'Tim kami menyaring dan memverifikasi pabrik/supplier tangan pertama, memastikan kredibilitas, MOQ, serta harga grosir terbaik.',
  },
  {
    title: 'Pemesanan & Inspeksi Sampel Produk',
    description:
      'Kami memproses pemesanan sampel barang (sample check) dan melakukan pengujian spesifikasi awal sebelum Anda menyetujui produksi massal.',
  },
  {
    title: 'Negosiasi Kontrak & Pembayaran',
    description:
      'Bantuan negosiasi harga bulk order, kesepakatan waktu produksi, serta fasilitasi pembayaran aman ke supplier via layanan transfer kami.',
  },
  {
    title: 'Quality Control & Pengiriman Kargo',
    description:
      'Pemeriksaan mutu barang di gudang China sebelum dibungkus ulang dan dikirimkan menggunakan jalur logistik Laut/Udara All-In Door-to-Door.',
  },
] as const

const faqContent = faqContentByPath['/sourcing'] ?? homeFaqContent
const sourcingBanner = illustratedCtaBanners.sourcing
</script>

<template>
  <MarketingSectionsSourcingHero />
  <MarketingSectionsStats
    :stats="sourcingStats"
    tone="primary"
    aria-label="Statistik layanan sourcing ETH Cargo"
    :mobile-marquee="true"
  />
  <MarketingSectionsSourcingOverview />
  <MarketingSectionsShippingWorkflow
    section-id="sourcing-workflow"
    title="Cara Kerja Layanan Sourcing ETH Cargo"
    description="Alur pencarian produk dan supplier terstruktur dari tahap konsultasi spesifikasi hingga kargo hasil sourcing siap dikirimkan ke lokasi Anda."
    :steps="sourcingWorkflow"
    important-note="Layanan sourcing ETH Cargo dapat diintegrasikan langsung dengan pengiriman kargo (Laut/Udara) dan transfer RMB, memberikan Anda kemudahan pengelolaan rantai pasok impor dari satu pintu (one-stop solution)."
    cta-prompt="Siap menemukan supplier tangan pertama untuk produk bisnis Anda?"
    cta-label="Konsultasi Gratis"
    cta-to="/#quote"
  />
  <MarketingSectionsMultinationalRoutes :show-top-border="false" />
  <MarketingSectionsSourcingOtherServices />
  <MarketingSectionsFaq
    :content="faqContent"
    section-id="sourcing-faq"
    :default-open-index="0"
  />
  <div id="quote" class="pb-6 lg:pb-10">
    <UiContainer id="sourcing-quote" wide>
      <MarketingIllustratedCtaBanner
        v-bind="sourcingBanner"
        variant="standard"
        image-alt="Ilustrasi tangan memegang paket dan barang hasil sourcing China"
      />
    </UiContainer>
    <MarketingSectionsQuoteBanner
      class="lg:hidden"
      section-id="sourcing-mobile-quote"
      compact
      :title="sourcingBanner.title"
      :description="sourcingBanner.description"
      email-label="Atau hubungi kami via email:"
      :email="sourcingBanner.email"
      :cta-label="sourcingBanner.ctaLabel"
      :cta-to="sourcingBanner.ctaTo"
      :show-image="false"
    />
  </div>
</template>
