<script setup lang="ts">
import promoImage from '~/assets/images/marketing/promo.png'
import quoteImage from '~/assets/images/marketing/promo.png'

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
  termsLabel?: string
  termsTo?: string
}

const promoDescription =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. '

const selectedPromo = ref<PromoDetail | null>(null)

// Data untuk hero (satu promo unggulan)
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

// Pembuat data placeholder, nanti diganti data asli dari API
function createPlaceholderPromos(idPrefix: string, count: number, inactive = false): PromoDetail[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${idPrefix}-${index + 1}`,
    image: promoImage,
    imageAlt: `Promo ${inactive ? 'tidak aktif' : 'aktif'} ETH Cargo ${index + 1}`,
    period: 'Januari',
    remainingLabel: inactive ? 'Expired' : '28 days left',
    title: 'Lorem Ipsum',
    status: inactive ? 'Inactive' : 'Active',
    description: promoDescription,
    inactive,
    termsLabel: 'Terms & Conditions',
    termsTo: '/terms-and-conditions',
  }))
}

// Satu objek = satu blok tahun di halaman (sesuai Figma)
const promoGroups = [
  {
    id: 'promo-group-1',
    year: '2026',
    activeTotal: 12,
    inactiveTotal: 12,
    activePromos: createPlaceholderPromos('group-1-active', 9),
    inactivePromos: createPlaceholderPromos('group-1-inactive', 2, true),
  },
  {
    id: 'promo-group-2',
    year: '2026',
    activeTotal: 8,
    inactiveTotal: 8,
    activePromos: [] as PromoDetail[],
    inactivePromos: createPlaceholderPromos('group-2-inactive', 6, true),
  },
]
</script>

<template>
  <MarketingPromoHero
    eyebrow="PROMO"
    title="OUR PROMO"
    description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat."
    :promos="promos"
  />

  <MarketingPromoGallery
    v-for="group in promoGroups"
    :key="group.id"
    :year="group.year"
    :active-promos="group.activePromos"
    :inactive-promos="group.inactivePromos"
    :active-total="group.activeTotal"
    :inactive-total="group.inactiveTotal"
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