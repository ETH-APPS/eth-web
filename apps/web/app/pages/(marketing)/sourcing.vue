<script setup lang="ts">
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Jasa Sourcing Barang China | ETH Cargo',
  description: 'Temukan supplier dan pabrik terpercaya di China dengan dukungan pencarian produk, negosiasi harga, pemesanan sampel, dan kontrol kualitas dari ETH Cargo.',
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
</script>

<template>
  <MarketingSectionsSourcingHero />
  <MarketingSectionsStats
    :stats="sourcingStats"
    tone="primary"
    aria-label="Statistik layanan sourcing ETH Cargo"
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
    v-bind="faqContent"
    section-id="sourcing-faq"
    :default-open-index="0"
    :show-quote="false"
  />
  <MarketingSectionsQuoteBanner
    section-id="sourcing-quote"
    title="Siap Temukan Supplier Tangan Pertama di China?"
    description="Dapatkan penawaran harga modal grosir terbaik, jaminan kualitas produk, serta pengiriman kargo terintegrasi tanpa kendala bahasa. Konsultasikan kebutuhan barang bisnis Anda sekarang!"
    email-label="Atau hubungi kami via email:"
    email="testing-mail@gmail.co.id"
    cta-label="Konsultasi Sekarang"
    cta-to="/#quote"
    image-alt="Gambar layanan sourcing supplier China ETH Cargo"
  />
</template>
