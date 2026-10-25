<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Tentang Kami | ETH Cargo',
  description:
    'Kenali ETH Cargo, penyedia layanan freight forwarding internasional dan solusi logistik All-In Door-to-Door China–Indonesia.',
  ogTitle: 'Tentang Kami | ETH Cargo',
  ogDescription:
    'Kenali ETH Cargo, penyedia layanan freight forwarding internasional dan solusi logistik All-In Door-to-Door China–Indonesia.',
  ogType: 'website',
})

const services = [
  {
    icon: 'cargo',
    title: 'Kargo China',
    description:
      'Layanan ekspedisi pengiriman barang secara FCL, LCL, dan Air Cargo dengan jaminan kepabeanan resmi All-In Door-to-Door.',
  },
  {
    icon: 'sourcing',
    title: 'Jasa Sourcing',
    description:
      'Pendampingan pencarian pabrik tangan pertama di China, negosiasi harga modal grosir, serta verifikasi kualitas barang sebelum dikirim.',
  },
  {
    icon: 'transfer',
    title: 'Jasa Transfer RMB',
    description:
      'Fasilitas pembayaran cepat dan legal ke rekening bank China, Alipay, WeChat, maupun tagihan platform 1688 dengan kurs kompetitif.',
  },
] as const

const companyStats = [
  { value: '+10.000', label: 'Transaksi Berhasil' },
  { value: '98%', label: 'Tingkat Keberhasilan' },
  { value: '+10', label: 'Tahun Pengalaman' },
] as const
</script>

<template>
  <MarketingSectionsAboutUs
    description="ETH Cargo adalah penyedia layanan freight forwarding internasional terdepan yang mengkhususkan diri pada jalur impor China–Indonesia. Kami berkomitmen menghadirkan solusi logistik All-In Door-to-Door yang transparan, aman, dan efisien untuk membantu pertumbuhan bisnis impor serta manufaktur di Indonesia."
    overview-description="Kami menyediakan ekosistem pengiriman dan pengadaan barang terintegrasi satu pintu (one-stop solution). Mulai dari pengiriman kargo via Laut (FCL/LCL) dan Udara, pendampingan pencarian supplier (sourcing), hingga fasilitasi pembayaran internasional (Transfer RMB) dengan proses cepat dan tanpa kendala legalitas."
    :services="services"
  />
  <MarketingSectionsStats
    :stats="companyStats"
    aria-label="Statistik perusahaan ETH Cargo"
  />
  <MarketingSectionsAboutCargoService />
  <MarketingSectionsAboutDigitalFeatures />
</template>
