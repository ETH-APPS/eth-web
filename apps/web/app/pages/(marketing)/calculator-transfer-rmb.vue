<script setup lang="ts">
import type { MarketingFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Kalkulator Transfer RMB | ETH Cargo',
  description: 'Hitung estimasi transfer RMB untuk pembayaran supplier dan transaksi bisnis Anda ke China bersama ETH Cargo.',
  ogTitle: 'Kalkulator Transfer RMB | ETH Cargo',
  ogDescription: 'Simulasikan nominal transfer RMB ke Alipay, Bank of China, WeChat Pay, 1688, Taobao, dan Alibaba.',
  ogType: 'website',
})

const faqContent = {
  subtitle: 'Frequently Asked Question',
  description: 'Temukan jawaban seputar waktu pemrosesan, kurs, batas transaksi, dokumen yang dibutuhkan, dan keamanan layanan transfer RMB.',
  items: [
    {
      question: 'Berapa lama estimasi waktu agar dana masuk ke akun supplier?',
      answer: 'Pengiriman dana ke platform e-wallet seperti Alipay dan WeChat Pay umumnya diproses sangat cepat (hitungan menit hingga jam pada hari kerja). Sedangkan untuk transfer langsung ke rekening bank lokal China, dana biasanya akan masuk dalam estimasi 1–2 hari kerja operasional bank.',
    },
    {
      question: 'Apakah nilai tukar (kurs) yang ditampilkan sudah pasti dan final?',
      answer: 'Kurs yang berlaku adalah transparan tanpa biaya tersembunyi. Anda dapat mengunci nilai tukar (lock rate) hari tersebut dengan langsung mengonfirmasi transaksi dan mengirimkan bukti transfer Rupiah ke tim kami.',
    },
    {
      question: 'Apakah ada batas minimal atau maksimal untuk transaksi transfer RMB?',
      answer: 'Kami melayani kebutuhan pembayaran berbagai skala, mulai dari pesanan sampel hingga bulk order partai besar. Untuk mengetahui batasan spesifik per metode pembayaran, silakan hubungi tim spesialis remittance kami.',
    },
    {
      question: 'Data apa saja yang perlu saya siapkan untuk menggunakan jasa titip transfer ini?',
      answer: 'Anda hanya perlu memberikan Commercial Invoice atau link tagihan dari supplier (misal dari 1688/Taobao), rincian nominal RMB yang harus dibayar, serta QR Code Alipay/WeChat atau detail nomor rekening penerima yang valid.',
    },
    {
      question: 'Apakah transaksi saya dijamin keamanannya?',
      answer: 'Tentu. Kami menjamin 100% keamanan dana Anda. Apabila terjadi kegagalan transfer yang disebabkan oleh kendala sistem atau penolakan bank tujuan, dana Anda akan kami refund sepenuhnya sesuai dengan nominal Rupiah yang disetorkan.',
    },
  ],
  quoteTitle: 'Siap Membayar Supplier China Anda?',
  quoteDescription: 'Hitung estimasi pembayaran atau konsultasikan kebutuhan transfer RMB bisnis Anda bersama tim ETH Cargo.',
  calculatorTo: '#rmb-rate-estimator',
} as const satisfies MarketingFaqContent

const cargoShippingTypes = [
  {
    mode: 'sea',
    title: 'Sea Freight',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
    eta: '4~8 minggu',
    to: '/sea-freight',
  },
  {
    mode: 'air',
    title: 'Air Freight',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
    eta: '1~7 hari',
    to: '/air-freight',
  },
] as const

const transferBanner = illustratedCtaBanners.transfer
</script>

<template>
  <MarketingSectionsRmbRateEstimator />
  <MarketingSectionsRmbTransferReach />
  <MarketingSectionsRmbCalculationBreakdown />
  <MarketingSectionsFaq
    section-id="calculator-transfer-rmb-faq"
    :content="faqContent"
  >
    <MarketingSectionsCargoShippingTypes
      section-id="calculator-transfer-rmb-shipping-types"
      title="Tipe Pengiriman Kargo"
      description="Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
      surface="muted"
      plain-header
      :services="cargoShippingTypes"
    />
  </MarketingSectionsFaq>
  <div id="calculator-transfer-rmb-quote" class="pb-6 lg:pb-10">
    <UiContainer wide>
      <MarketingIllustratedCtaBanner
        v-bind="transferBanner"
        variant="standard"
      />
    </UiContainer>
    <MarketingSectionsQuoteBanner
      class="lg:hidden"
      section-id="calculator-transfer-rmb-mobile-quote"
      compact
      :title="transferBanner.title"
      :description="transferBanner.description"
      email-label="Atau hubungi kami via email:"
      :email="transferBanner.email"
      cta-label="Transfer Sekarang!"
      cta-to="#rmb-rate-estimator"
      :show-image="false"
    />
  </div>
</template>
