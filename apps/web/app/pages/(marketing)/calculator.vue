<script setup lang="ts">
import cargoCategories from '~/data/cargo-categories.json'
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Kalkulator Estimasi Tarif Kargo | ETH Cargo',
  description:
    'Hitung estimasi biaya pengiriman kargo laut dan udara berdasarkan kategori, dimensi, berat, dan jumlah koli bersama ETH Cargo.',
  ogTitle: 'Kalkulator Estimasi Tarif Kargo | ETH Cargo',
  ogDescription:
    'Hitung estimasi biaya pengiriman kargo laut dan udara berdasarkan kategori, dimensi, berat, dan jumlah koli bersama ETH Cargo.',
  ogType: 'website',
})

const calculatorShippingTypes = [
  {
    mode: 'fcl',
    title: 'FCL Cargo',
    description:
      'Sewa kontainer utuh untuk pengiriman muatan besar dengan kepastian kapasitas dan efisiensi biaya tertinggi.',
    eta: '3~4 minggu',
    to: '/sea-freight#fcl-overview',
  },
  {
    mode: 'lcl',
    title: 'LCL Cargo',
    description:
      'Solusi kargo laut hemat untuk impor skala menengah tanpa harus menyewa satu kontainer penuh.',
    eta: '3~4 minggu',
    to: '/sea-freight#lcl-overview',
  },
  {
    mode: 'air',
    title: 'Air Cargo',
    description:
      'Pengiriman super cepat jalur udara untuk produk sensitif, sampel barang, atau kebutuhan restok mendesak.',
    eta: '3~7 Hari',
    to: '/air-freight',
  },
] as const

const faqContent = faqContentByPath['/calculator'] ?? homeFaqContent
</script>

<template>
  <MarketingSectionsRateEstimator
    section-id="calculator-estimator"
    title="Kalkulator Impor All-In"
    description="Hitung perkiraan biaya pengiriman kargo Anda dari China ke Indonesia secara cepat dan transparan. Masukkan rincian jenis barang, dimensi, serta jumlah koli untuk mendapatkan estimasi tarif pengiriman All-In."
    guide-prompt="Hasil perhitungan merupakan estimasi awal berbasis volume (CBM) dan berat kargo. Biaya final All-In akan dikonfirmasi ulang oleh tim profesional ETH Cargo saat barang ditimbang di gudang China."
    :show-guide-action="false"
  />
  <MarketingSectionsCargoCategories
    section-id="import-cargo-categories"
    title="Kategori Barang Impor"
    description="Temukan klasifikasi jenis komoditas produk impor Anda di bawah ini untuk memastikan perhitungan estimasi tarif dan penanganan kepabeanan yang sesuai."
    :categories="cargoCategories"
    cta-prompt="Tidak menemukan kategori komoditas barang Anda di atas?"
    cta-label="Konsultasi Kategori Kargo"
    cta-to="#quote"
  />
  <MarketingSectionsLartasRestrictions />
  <MarketingSectionsFaq v-bind="faqContent">
    <MarketingSectionsCargoShippingTypes
      section-id="calculator-shipping-types"
      variant="compact"
      surface="muted"
      prominent-header
      description="Pilih metode pengiriman kargo yang sesuai dengan skala bisnis, volume muatan, dan urgensi estimasi waktu tiba Anda dari China ke Indonesia."
      :services="calculatorShippingTypes"
    />
  </MarketingSectionsFaq>
</template>
