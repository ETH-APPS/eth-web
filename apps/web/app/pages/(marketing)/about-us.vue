<script setup lang="ts">
import supplyChainImage from '~/assets/images/marketing/cargo-air-landscape.png'

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
  <MarketingSectionsAboutImportSupport />
  <MarketingSectionsMultinationalRoutes :show-top-border="false" />
  <MarketingSectionsQuoteBanner
    section-id="about-quote"
    title="Siap Mengoptimalkan Rantai Pasok Impor Anda?"
    description="Percayakan kebutuhan logistik, pengadaan produk, dan pembayaran supplier China Anda kepada ETH Cargo. Tim profesional kami siap memberikan solusi All-In Door-to-Door yang efisien dan terpercaya."
    email-label="Atau hubungi kami via email:"
    email="testing-mail@gmail.co.id"
    cta-label="Konsultasi Gratis"
    cta-to="/#quote"
    :image="supplyChainImage"
    image-alt="Solusi rantai pasok impor ETH Cargo"
  />
</template>