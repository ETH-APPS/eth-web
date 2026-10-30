<script setup lang="ts">
import transferImage from '~/assets/images/marketing/transfer.png'
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Jasa Transfer RMB | ETH Cargo',
  description: 'Hitung estimasi pembayaran supplier China melalui Bank of China, Alipay, WeChat Pay, 1688, Taobao, dan Alibaba bersama ETH Cargo.',
  ogTitle: 'Jasa Transfer RMB | ETH Cargo',
  ogDescription: 'Solusi transfer RMB yang cepat, aman, dan transparan untuk transaksi bisnis Anda ke China.',
  ogType: 'website',
})

const transferStats = [
  { value: '+10.000', label: 'Transaksi\nTransfer Selesai' },
  { value: '<2 H', label: 'Proses Kilat\nTanpa Delay' },
  { value: '98%', label: 'Tingkat Keberhasilan\nTransaksi' },
] as const

const transferWorkflowSteps = [
  {
    title: 'Konsultasi & Verifikasi Tagihan',
    description: 'Kirimkan invoice supplier, link pembayaran 1688/Taobao, atau detail rekening bank/Alipay penerima kepada tim remittance kami untuk pengecekan kurs.',
  },
  {
    title: 'Kunci Kurs & Transfer Rupiah',
    description: 'Dapatkan konfirmasi kurs RMB real-time yang sudah dikunci (rate lock), lalu lakukan pembayaran dalam mata uang Rupiah ke rekening resmi ETH Cargo.',
  },
  {
    title: 'Pemrosesan & Pemindahan Dana',
    description: 'Tim keuangan kami segera meneruskan dan memproses transfer dana RMB ke akun Alipay, WeChat Pay, atau rekening bank supplier di China secara kilat.',
  },
  {
    title: 'Konfirmasi & Terbit Bukti Transfer',
    description: 'Sistem menerbitkan tanda terima/bukti transfer resmi (bank receipt/payment voucher) sebagai verifikasi bahwa pembayaran telah berhasil dikirim.',
  },
  {
    title: 'Supplier Menerima Pembayaran',
    description: 'Supplier Anda menerima dana RMB di China, mengonfirmasi pesanan, dan proses produksi atau pengiriman kargo barang Anda dapat segera dimulai.',
  },
] as const

const faqContent = faqContentByPath['/transfer-rmb'] ?? homeFaqContent
</script>

<template>
  <MarketingSectionsRmbTransferEstimator />
  <MarketingSectionsStats
    :stats="transferStats"
    tone="primary"
    aria-label="Statistik layanan transfer RMB"
  />
  <MarketingSectionsRmbPaymentCoverage />
  <MarketingSectionsRmbTransferBenefits />
  <MarketingSectionsShippingWorkflow
    section-id="rmb-transfer-workflow"
    title="Cara Kerja Layanan Transfer RMB di ETH Cargo"
    description="Alur pembayaran kilat dan terstruktur untuk pengiriman dana ke supplier China dengan aman, transparan, dan dapat dilacak."
    :steps="transferWorkflowSteps"
    cta-prompt=""
    cta-label=""
    cta-to="#"
    :show-cta="false"
  />
  <MarketingSectionsFaq
    :content="faqContent"
  />
  <MarketingSectionsQuoteBanner
    section-id="transfer-rmb-quote"
    title="Siap untuk Transfer RMB?"
    description="Proses pembayaran ke supplier China kini lebih praktis, aman, dan tanpa kendala. Konsultasikan nominal serta tujuan transfer bisnis Anda langsung bersama tim specialist kami."
    email-label="Atau hubungi kami via email:"
    email="testing-mail@gmail.co.id"
    cta-label="Transfer Sekarang!"
    cta-to="#rmb-calculator"
    :image="transferImage"fix(web): use favicon-eth as browser tab icon
    image-alt="Layanan transfer RMB ETH Cargo"
  />
</template>
