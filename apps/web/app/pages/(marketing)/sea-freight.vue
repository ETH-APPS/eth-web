<script setup lang="ts">
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea-landscape.png'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Jasa Kargo Laut China ke Indonesia | ETH Cargo',
  description:
    'Layanan kargo laut China ke Indonesia melalui FCL dan LCL dengan tarif All-In, alokasi kontainer yang pasti, serta pengurusan bea cukai resmi.',
  ogTitle: 'Jasa Kargo Laut China ke Indonesia | ETH Cargo',
  ogDescription:
    'Layanan kargo laut China ke Indonesia melalui FCL dan LCL dengan tarif All-In, alokasi kontainer yang pasti, serta pengurusan bea cukai resmi.',
  ogType: 'website',
})

const freightStats = [
  { value: '+10.000', label: 'Pengiriman\nSelesai' },
  { value: '98%', label: 'Tingkat Ketepatan\nWaktu' },
  { value: '+5', label: 'Rute Pengiriman\nInternasional' },
  { value: '+10', label: 'Tahun\nPengalaman' },
]

const fclCargoFeatures = [
  {
    icon: 'delivery',
    title: 'Dedicated Space',
    description:
      'Satu kontainer penuh khusus untuk kargo Anda tanpa risiko tertukar atau rusak akibat barang milik pihak lain.',
  },
  {
    icon: 'support',
    title: '24/7 Support',
    description:
      'Tim kami siap memberikan pembaruan status kargo dan bantuan teknis kapan saja.',
  },
  {
    icon: 'security',
    title: 'Safe & Secure',
    description:
      'Dilengkapi penyegelan resmi kontainer (container seal) dan proteksi asuransi penuh selama perjalanan laut.',
  },
  {
    icon: 'shipping',
    title: 'One-in-all Shipping',
    description:
      'Penanganan lengkap mulai dari konsolidasi barang, dokumen pabean, hingga pengantaran ke alamat Anda.',
  },
] as const

const lclCargoFeatures = [
  {
    icon: 'delivery',
    title: 'Flexible & Economist',
    description:
      'Bayar sesuai kapasitas ruang yang digunakan tanpa beban biaya sisa ruang kontainer.',
  },
  {
    icon: 'support',
    title: '24/7 Support',
    description:
      'Tim kami siap memberikan pembaruan status kargo dan bantuan teknis kapan saja.',
  },
  {
    icon: 'security',
    title: 'Safe & Secure',
    description:
      'Sistem konsolidasi barang profesional dengan pelabelan ketat serta proteksi asuransi pengiriman.',
  },
  {
    icon: 'shipping',
    title: 'One-in-all Shipping',
    description:
      'Penanganan lengkap mulai dari konsolidasi barang, dokumen pabean, hingga pengantaran ke alamat Anda.',
  },
] as const

const seaFreightWorkflowSteps = [
  {
    title: 'Konsultasi & Penawaran FCL/LCL',
    description:
      'Kirimkan detail kargo dan jenis barang ke Tim ETH Cargo. Tim kami akan memberikan kalkulasi biaya All-In yang transparan tanpa biaya tersembunyi.',
  },
  {
    title: 'Penerimaan di Gudang China',
    description:
      'Supplier Anda mengirimkan barang ke gudang konsolidasi ETH Cargo di China dengan melampirkan Kode Marking Anda.',
  },
  {
    title: 'Pengiriman Kargo & Clearance',
    description:
      'Kargo diisi ke dalam kontainer (FCL/LCL), diurus dokumen ekspornya, dan diberangkatkan melalui jalur laut menuju pelabuhan Indonesia.',
  },
  {
    title: 'Tiba di Gudang Indonesia',
    description:
      'Proses pengurusan pajak impor dan clearance resmi oleh tim internal kami, lalu kargo ditampung di gudang ETH Cargo Jakarta.',
  },
  {
    title: 'Pengiriman Akhir ke Alamat Anda',
    description:
      'Kargo ditimbang dan diperiksa ulang, lalu segera didistribusikan langsung ke alamat gudang atau pabrik Anda.',
  },
]
</script>

<template>
  <MarketingSectionsFreightHero
    title-id="sea-freight-title"
    eyebrow="Layanan Ekonomis"
    title="Jasa Kargo Laut China ke Indonesia"
    description="Kirim kargo volume besar lebih efisien dengan opsi Full Container Load (FCL) dan Less Container Load (LCL). Nikmati kepastian alokasi kontainer, transparansi biaya All-In tanpa hidden fee, dan pengurusan bea cukai resmi sampai ke gudang Anda."
    :image="cargoSeaUrl"
    image-alt="Kapal kontainer di pelabuhan untuk layanan kargo laut China ke Indonesia"
  />
  <MarketingSectionsStats
    :stats="freightStats"
    tone="primary"
    aria-label="Statistik layanan kargo laut ETH Cargo"
  />
  <MarketingSectionsFreightOverview
    section-id="fcl-overview"
    eyebrow="Mengenal Layanan.."
    title="FCL Cargo?"
    subtitle="Full Container Load"
    description="Layanan sewa kontainer utuh (20ft / 40ft) untuk pengiriman kargo laut khusus bisnis Anda. FCL memberikan fleksibilitas penuh, keamanan maksimal tanpa bercampur barang lain, serta efisiensi biaya tertinggi per unit untuk volume pengiriman besar."
    eta="3 - 4 Minggu"
    :features="fclCargoFeatures"
    tracking-label="Lacak Pengiriman"
    tracking-to="/#main-services"
    cta-label="Konsultasi FCL"
    cta-to="#quote"
  />
  <MarketingSectionsFreightOverview
    section-id="lcl-overview"
    eyebrow="Mengenal Layanan.."
    title="LCL Cargo?"
    subtitle="Less than Container Load"
    description="Solusi pengiriman kargo laut fleksibel dan hemat biaya dengan metode berbagi ruang container bersama pengirim lain. Sangat cocok untuk bisnis skala kecil hingga menengah yang ingin mengirim kargo tanpa harus menyewa satu kontainer utuh, menjaga cash flow tetap efisien."
    eta="3 - 4 Minggu"
    :features="lclCargoFeatures"
    tracking-label="Lacak Pengiriman"
    tracking-to="/#main-services"
    cta-label="Konsultasi LCL"
    cta-to="#quote"
  />
  <MarketingSectionsShippingWorkflow
    section-id="sea-freight-workflow"
    title="Cara Kerja Layanan Kargo Laut"
    description="Alur pengiriman jalur laut yang terstruktur, aman, dan transparan dari pelabuhan China hingga sampai ke lokasi gudang Anda."
    :steps="seaFreightWorkflowSteps"
    cta-prompt="Siap mengoptimalkan biaya pengiriman kargo laut bisnis Anda?"
    cta-label="Konsultasi Gratis"
    cta-to="#quote"
  />
  <MarketingSectionsRateEstimator
    section-id="sea-freight-rate-estimator"
    title="Hitung Estimasi Tarif Kargo Laut"
    description="Hitung perkiraan biaya pengiriman All-In kargo laut (LCL/FCL) dari China ke Indonesia secara otomatis untuk transparansi perencanaan biaya impor Anda."
    fixed-cargo-service="LCL CARGO"
    guide-prompt="Pelajari panduan pengkategorian produk"
  />
</template>
