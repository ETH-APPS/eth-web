<script setup lang="ts">
import { faqContentByPath, homeFaqContent } from '~/constants/faq'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

definePageMeta({
  layout: 'marketing',
})

const serviceDescription = 'Solusi transfer RMB yang cepat, aman, dan transparan untuk transaksi bisnis Anda ke China.'
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')

if (siteUrl) {
  const homepage = new URL('/', siteUrl).href
  const serviceUrl = new URL('/transfer-rmb', homepage).href

  useHead({
    script: [{
      key: 'transfer-rmb-service-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': serviceUrl + '#service',
        name: 'Jasa Transfer RMB',
        description: serviceDescription,
        url: serviceUrl,
        mainEntityOfPage: serviceUrl,
        provider: {
          '@type': 'Organization',
          '@id': homepage + '#organization',
          name: 'ETH Cargo',
          url: homepage,
        },
      }).replace(/</g, '\\u003c'),
    }],
  })
}

useSeoMeta({
  title: 'Jasa Transfer RMB | ETH Cargo',
  description: 'Hitung estimasi pembayaran supplier China melalui Bank of China, Alipay, WeChat Pay, 1688, Taobao, dan Alibaba bersama ETH Cargo.',
  ogTitle: 'Jasa Transfer RMB | ETH Cargo',
  ogDescription: serviceDescription,
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

const transferBanner = illustratedCtaBanners.transfer
</script>

<template>
  <MarketingSectionsRmbTransferEstimator />
  <MarketingSectionsStats
    :stats="transferStats"
    tone="primary"
    mobile-marquee
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
  <div id="transfer-rmb-quote" class="pb-6 lg:pb-10">
    <UiContainer wide>
      <MarketingIllustratedCtaBanner
        v-bind="transferBanner"
        variant="standard"
      />
    </UiContainer>
    <MarketingSectionsQuoteBanner
      class="lg:hidden"
      section-id="transfer-rmb-mobile-quote"
      compact
      :title="transferBanner.title"
      :description="transferBanner.description"
      email-label="Atau hubungi kami via email:"
      :email="transferBanner.email"
      cta-label="Transfer Sekarang!"
      cta-to="#rmb-calculator"
      :show-image="false"
    />
  </div>
</template>
