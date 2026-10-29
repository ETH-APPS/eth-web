<script setup lang="ts">
import airFreightUrl from '~/assets/images/marketing/air-freight.png'
import fclCargoUrl from '~/assets/images/marketing/fcl-cargo.png'
import lclCargoUrl from '~/assets/images/marketing/lcl-cargo.png'
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Jasa Cargo China ke Indonesia | ETH Cargo',
  description:
    'Layanan cargo laut dan udara B2B dari China ke Indonesia dengan biaya All-In Door-to-Door yang transparan.',
  ogTitle: 'Jasa Cargo China ke Indonesia | ETH Cargo',
  ogDescription:
    'Layanan cargo laut dan udara B2B dari China ke Indonesia dengan biaya All-In Door-to-Door yang transparan.',
  ogType: 'website',
})

const seaFreightServices = [
  {
    title: 'FCL Cargo',
    description:
      'Layanan sewa kontainer utuh (20ft / 40ft) khusus untuk pengiriman kargo bisnis Anda. Tanpa bercampur dengan barang milik orang lain, FCL memberikan keamanan maksimal, proses bongkar muat lebih cepat, dan biaya per unit yang jauh lebih murah untuk volume besar.',
    eta: '3 – 4 Minggu',
    image: fclCargoUrl,
    imageAlt: 'Kapal kontainer untuk layanan FCL Cargo',
  },
  {
    title: 'LCL Cargo',
    description:
      'Solusi pengiriman hemat tanpa harus menyewa satu kontainer penuh. Kargo Anda dikonsolidasikan secara rapi dan dihitung berdasarkan kubikasi (CBM). Pilihan tepat untuk mengoptimalkan arus kas (cash flow) dan modal kerja bisnis Anda.',
    eta: '3 – 4 Minggu',
    image: lclCargoUrl,
    imageAlt: 'Muatan kontainer untuk layanan LCL Cargo',
  },
]

const airFreightServices = [
  {
    title: 'AIR Cargo',
    description:
      'Solusi pengiriman express untuk sampel produk, barang dengan urgensi tinggi, atau produk berfokus pada tren. Mengombinasikan kecepatan pengiriman udara dengan kemudahan pengurusan pajak dan dokumen clearance secara All-In sampai ke gudang Anda.',
    eta: '3 – 7 Hari',
    image: airFreightUrl,
    imageAlt: 'Pesawat cargo untuk layanan pengiriman udara ETH Cargo',
  },
]

const serviceStats = [
  { value: '+10.000', label: 'Pengiriman Sukses' },
  { value: '98%', label: 'Ketepatan Waktu' },
  { value: '+5', label: 'Cakupan Rute Impor' },
]

const faqContent = faqContentByPath['/china-cargo'] ?? homeFaqContent
</script>

<template>
  <MarketingChinaCargoHero />
  <MarketingSectionsFreightService
    eyebrow="Layanan Kami"
    title="Kargo Laut (Sea Freight)"
    description="Kirim barang kapasitas besar dari China ke Indonesia dengan tarif paling ekonomis. Kami menyediakan pilihan Full Container Load (FCL) dan Less Container Load (LCL) dengan kepastian alokasi ruang kapal, pengurusan bea cukai lengkap, serta harga All-In yang transparan."
    :services="seaFreightServices"
  />
  <MarketingSectionsStats :stats="serviceStats" />
  <MarketingSectionsFreightService
    section-id="air-freight"
    eyebrow="Layanan Kami"
    title="Kargo Udara (Air Freight)"
    description="Butuh stok produk tiba lebih cepat? Layanan Kargo Udara ETH Cargo menghadirkan solusi pengiriman prioritas dengan waktu transit singkat, jadwal penerbangan rutin, serta penanganan bea cukai yang aman dan transparan."
    :services="airFreightServices"
  />
  <MarketingChinaCargoShippingWorkflow />
  <MarketingSectionsRateEstimator
    title="Hitung Estimasi Tarif"
    description="Dapatkan kalkulasi perkiraan biaya pengiriman All-In dari China ke Indonesia secara instan untuk perencanaan modal bisnis Anda."
  />
  <MarketingSectionsFaq :content="faqContent" />
  <MarketingSectionsQuoteActionBanner :content="faqContent" />
</template>
