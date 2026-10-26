<script setup lang="ts">
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'FAQ | ETH Cargo',
  description:
    'Temukan jawaban atas pertanyaan umum mengenai layanan, pengiriman, tarif, kalkulator, dan tracking ETH Cargo.',
  ogTitle: 'FAQ | ETH Cargo',
  ogDescription:
    'Temukan jawaban atas pertanyaan umum mengenai layanan, pengiriman, tarif, kalkulator, dan tracking ETH Cargo.',
  ogType: 'website',
})

const shippingFaq = faqContentByPath['/china-cargo'] ?? homeFaqContent
const calculatorFaq = faqContentByPath['/calculator'] ?? homeFaqContent

const faqGroups = [
  {
    id: 'tentang-eth-cargo',
    title: 'Tentang ETH Cargo',
    description: 'Informasi umum mengenai layanan dan komitmen ETH Cargo.',
    items: homeFaqContent.items,
  },
  {
    id: 'pengiriman-dan-tarif',
    title: 'Pengiriman & Tarif',
    description: 'Ketentuan layanan, estimasi waktu, serta proses pengiriman kargo.',
    items: shippingFaq.items,
  },
  {
    id: 'kalkulator-dan-tracking',
    title: 'Kalkulator & Tracking',
    description: 'Panduan menghitung estimasi tarif dan memantau perjalanan kargo Anda.',
    items: [
      ...calculatorFaq.items,
      {
        question: 'Bagaimana cara melacak status pengiriman ETH Cargo?',
        answer:
          'Buka halaman Live Tracking, lalu masukkan Marking ID dan PIN pengiriman Anda. Sistem akan menampilkan status terakhir beserta riwayat perjalanan kargo dari gudang asal hingga lokasi tujuan.',
      },
    ],
  },
] as const
</script>

<template>
  <MarketingFaqDirectory
    :groups="faqGroups"
    description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
  />
</template>
