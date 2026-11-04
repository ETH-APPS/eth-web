<script setup lang="ts">
import type { MarketingFaqContent } from '~/constants/faq'

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
  description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
  items: [
    {
      question: 'Lorem Ipsum',
      answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
    },
    {
      question: 'Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.',
      answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
    },
    {
      question: 'Lorem Ipsum',
      answer: 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.',
    },
    {
      question: 'Lorem Ipsum',
      answer: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.',
    },
    {
      question: 'Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
      answer: 'Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
    },
    {
      question: 'Lorem Ipsum',
      answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Tempus leo eu aenean sed diam urna tempor.',
    },
  ],
  quoteTitle: 'Lorem Ipsum',
  quoteDescription: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
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
</template>
