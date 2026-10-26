<script setup lang="ts">
import promoImage from '~/assets/images/marketing/cargo-air-landscape.png'
import quoteImage from '~/assets/images/marketing/cargo-sea-landscape.png'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Promo | ETH Cargo',
  description: 'Temukan promo dan penawaran terbaru dari ETH Cargo untuk kebutuhan pengiriman bisnis Anda.',
  ogTitle: 'Promo | ETH Cargo',
  ogDescription: 'Temukan promo dan penawaran terbaru dari ETH Cargo untuk kebutuhan pengiriman bisnis Anda.',
  ogType: 'website',
})

interface PromoDetail {
  id: string
  image: string
  imageAlt: string
  period: string
  remainingLabel: string
  title: string
  status: string
  description: string
  inactive?: boolean
  termsLabel: string
  termsTo: string
}

const promoDescription =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.'

const selectedPromo = ref<PromoDetail | null>(null)

const promos = [
  {
    id: 'promo-placeholder',
    title: 'Lorem Ipsum',
    status: 'Active',
    description: promoDescription,
    image: promoImage,
    imageAlt: 'Promo pengiriman ETH Cargo',
    termsLabel: 'Terms & Conditions',
    termsTo: '/terms-and-conditions',
  },
] as const

const activePromos = Array.from({ length: 9 }, (_, index) => ({
  id: `active-promo-${index + 1}`,
  image: promoImage,
  imageAlt: `Promo aktif ETH Cargo ${index + 1}`,
  period: 'Januari',
  remainingLabel: '28 days left',
  title: 'Lorem Ipsum',
  status: 'Active',
  description: promoDescription,
  termsLabel: 'Terms & Conditions',
  termsTo: '/terms-and-conditions',
}))

const inactivePromos = Array.from({ length: 8 }, (_, index) => ({
  id: `inactive-promo-${index + 1}`,
  image: promoImage,
  imageAlt: `Promo tidak aktif ETH Cargo ${index + 1}`,
  period: 'Januari',
  remainingLabel: 'Expired',
  title: 'Lorem Ipsum',
  status: 'Inactive',
  description: promoDescription,
  inactive: true,
  termsLabel: 'Terms & Conditions',
  termsTo: '/terms-and-conditions',
}))
</script>

<template>
  <MarketingPromoHero
    eyebrow="PROMO"
    title="OUR PROMO"
    description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat."
    :promos="promos"
  />
  <MarketingPromoGallery
    year="2026"
    :active-promos="activePromos"
    :inactive-promos="inactivePromos"
    :active-total="12"
    :inactive-total="8"
    @select="selectedPromo = $event"
  />
  <MarketingSectionsQuoteBanner
    section-id="promo-quote"
    title="Book your LCL Cargo"
    description="Get your quote and book a shipping with LCL Cargo"
    email-label="via Email"
    email="testing-mail@gmail.co.id"
    cta-label="Get A Quote"
    cta-to="/calculator"
    :image="quoteImage"
    image-alt="Layanan pengiriman LCL Cargo ETH Cargo"
  />
  <MarketingPromoDetailModal
    :promo="selectedPromo"
    @close="selectedPromo = null"
  />
</template>
