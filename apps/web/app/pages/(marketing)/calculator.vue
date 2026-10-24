<script setup lang="ts">
import cargoCategories from '~/data/cargo-categories.json'

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

</script>

<template>
  <MarketingSectionsRateEstimator
    section-id="calculator-estimator"
    title="Hitung Estimasi Tarif"
    description="Dapatkan perkiraan biaya pengiriman kargo laut maupun udara berdasarkan detail barang Anda secara mudah, cepat, dan transparan."
    guide-prompt="Masukkan detail barang secara lengkap untuk mendapatkan estimasi tarif yang lebih akurat."
    :show-guide-action="false"
  />
  <MarketingSectionsCargoCategories
    description="Kenali kategori barang yang dapat dikirim untuk membantu menentukan layanan, penanganan, dan estimasi biaya yang paling sesuai."
    :categories="cargoCategories"
    cta-prompt="Kategori barang Anda belum tercantum dalam daftar?"
    cta-label="Get a Quote"
    cta-to="#quote"
  />
</template>
