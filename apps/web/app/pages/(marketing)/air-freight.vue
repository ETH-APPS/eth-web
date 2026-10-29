<script setup lang="ts">
import cargoAirUrl from '~/assets/images/marketing/cargo-air-landscape.png'
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Jasa Kargo Udara China ke Indonesia | ETH Cargo',
  description:
    'Layanan kargo udara China ke Indonesia untuk pengiriman prioritas dengan transit cepat, biaya All-In, serta pengurusan bea cukai resmi.',
  ogTitle: 'Jasa Kargo Udara China ke Indonesia | ETH Cargo',
  ogDescription:
    'Layanan kargo udara China ke Indonesia untuk pengiriman prioritas dengan transit cepat, biaya All-In, serta pengurusan bea cukai resmi.',
  ogType: 'website',
})

const freightStats = [
  { value: '+10.000', label: 'Pengiriman\nSelesai' },
  { value: '98%', label: 'Tingkat Ketepatan\nWaktu' },
  { value: '+5', label: 'Rute Pengiriman\nInternasional' },
  { value: '+10', label: 'Tahun\nPengalaman' },
]

const airCargoFeatures = [
  {
    icon: 'delivery',
    title: 'Express Delivery',
    description:
      'Penerbangan kargo terjadwal memastikan barang tiba di gudang tujuan tepat waktu tanpa mengganggu rantai pasok bisnis Anda.',
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
      'Standar penanganan kargo udara internasional yang aman dengan proteksi asuransi untuk meminimalkan risiko kerusakan barang.',
  },
  {
    icon: 'shipping',
    title: 'One-in-all Shipping',
    description:
      'Penanganan lengkap mulai dari konsolidasi barang, dokumen, penerbangan, hingga pengantaran ke alamat Anda.',
  },
] as const

const airFreightWorkflowSteps = [
  {
    title: 'Konsultasi Berat Volume',
    description:
      'Kirimkan detail kargo (berat aktual vs berat volume). Tim kami akan memberikan penawaran tarif All-In udara yang transparan.',
  },
  {
    title: 'Penerimaan di Gudang China',
    description:
      'Supplier Anda mengirimkan barang ke gudang konsolidasi ETH Cargo di China dengan melampirkan Kode Marking Anda.',
  },
  {
    title: 'Pengiriman Kargo & Clearance',
    description:
      'Kargo ditimbang ulang, dikemas sesuai standar regulasi penerbangan, diterbitkan Air Waybill (AWB), dan diberangkatkan via pesawat kargo terjadwal.',
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

const faqContent = faqContentByPath['/air-freight'] ?? homeFaqContent
</script>

<template>
  <MarketingSectionsFreightHero
    title-id="air-freight-title"
    eyebrow="Layanan Prioritas"
    title="Jasa Kargo Udara China ke Indonesia"
    description="Kirim barang penting dan mendesak lebih cepat melalui layanan kargo udara dengan jadwal penerbangan rutin. Nikmati waktu transit singkat, transparansi biaya All-In tanpa hidden fee, dan pengurusan bea cukai resmi sampai ke gudang Anda."
    :image="cargoAirUrl"
    image-alt="Pesawat kargo di bandara untuk layanan kargo udara China ke Indonesia"
  />
  <MarketingSectionsStats
    :stats="freightStats"
    tone="primary"
    aria-label="Statistik layanan kargo udara ETH Cargo"
  />
  <MarketingSectionsFreightOverview
    eyebrow="Mengenal Layanan.."
    title="Air Cargo?"
    subtitle="Pengiriman Express Prioritas Udara"
    description="Solusi pengiriman kargo udara tercepat dari China ke Indonesia untuk memenuhi kebutuhan restok cepat, sampel produk, barang fast-moving, atau kargo sensitif waktu. Mengombinasikan kecepatan penerbangan rutin dengan proses customs clearance yang efisien dan aman."
    eta="3 - 7 hari"
    :features="airCargoFeatures"
    tracking-label="Lacak Pengiriman"
    tracking-to="/#main-services"
    cta-label="Konsultasi Kargo Udara"
    cta-to="#quote"
  />
  <MarketingSectionsShippingWorkflow
    section-id="air-freight-workflow"
    title="Cara Kerja Layanan Kargo Udara"
    description="Alur pengiriman express jalur udara yang cepat, presisi, dan terukur dari bandara China hingga kargo tiba di lokasi gudang Anda."
    :steps="airFreightWorkflowSteps"
    cta-prompt="Butuh pengiriman cepat untuk stok atau sampel kargo bisnis Anda?"
    cta-label="Konsultasi Gratis"
    cta-to="#quote"
  />
  <MarketingSectionsRateEstimator
    section-id="air-freight-rate-estimator"
    title="Hitung Estimasi Tarif Kargo Udara"
    description="Hitung estimasi biaya pengiriman All-In kargo udara dari China ke Indonesia berdasarkan berat aktual atau berat volume secara akurat dan transparan."
    fixed-cargo-service="Air Cargo"
    guide-prompt="Pelajari panduan perhitungan berat volume"
    guide-label="Selengkapnya"
  />
  <MarketingSectionsFaq :content="faqContent" />
  <MarketingSectionsQuoteActionBanner :content="faqContent" />
</template>
