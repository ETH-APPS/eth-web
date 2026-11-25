<script setup lang="ts">
import promoImage from '~/assets/images/marketing/promo.png'

definePageMeta({
  layout: 'marketing',
})

useHead({
  meta: [
    { name: 'keywords', content: 'promo eth cargo' }
  ]
})

useSeoMeta({
  title: 'Promo ETH Cargo untuk Jasa Beli & Kargo | Syarat Berlaku',
  description: 'Lihat promo dan kode promo ETH Cargo untuk jasa beli barang, transfer RMB, dan kargo. Syarat berlaku; cek periode promo terbaru.',
  ogTitle: 'Promo ETH Cargo untuk Jasa Beli & Kargo | Syarat Berlaku',
  ogDescription: 'Lihat promo dan kode promo ETH Cargo untuk jasa beli barang, transfer RMB, dan kargo. Syarat berlaku; cek periode promo terbaru.',
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
}

type SelectedPromo = Pick<PromoDetail, 'id' | 'image' | 'imageAlt' | 'title' | 'status' | 'description' | 'inactive'>

const promoDescription =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. '

const selectedPromo = ref<SelectedPromo | null>(null)

// Data untuk hero (satu promo unggulan)
const promos = [
  {
    id: 'promo-placeholder',
    title: 'Diskon Spesial Anniversary 12 Tahun Pengiriman Impor',
    status: 'Sedang Berlangsung',
    description: 'Dapatkan potongan harga spesial untuk pengiriman kargo laut (LCL/FCL) dan udara dari China ke Indonesia',
    image: promoImage,
    imageAlt: 'Promo pengiriman ETH Cargo',
    termsLabel: 'Syarat & Ketentuan',
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
    status: inactive ? 'Berakhir' : 'Sedang Berlangsung',
    description: promoDescription,
    inactive,
  }))
}

// Satu objek = satu blok tahun di halaman (sesuai Figma)
const promoGroups = [
  {
    id: 'promo-group-1',
    year: '2026',
    activeTotal: 10,
    inactiveTotal: 2,
    activePromos: createPlaceholderPromos('group-1-active', 9),
    inactivePromos: createPlaceholderPromos('group-1-inactive', 2, true),
  },
  {
    id: 'promo-group-2',
    year: '2025',
    activeTotal: 0,
    inactiveTotal: 8,
    activePromos: [] as PromoDetail[],
    inactivePromos: createPlaceholderPromos('group-2-inactive', 6, true),
  },
]
</script>

<template>
  <MarketingPromoHero
    eyebrow="Penawaran Spesial"
    title="Promo & Diskon Pengiriman Kargo"
    description="Nikmati berbagai penawaran menarik, diskon ongkos kirim kargo laut/udara, serta voucher khusus untuk mendukung efisiensi biaya impor bisnis Anda."
    :promos="promos"
    @select="selectedPromo = $event"
  />

  <div class="bg-bg-0 pb-16 lg:pb-24">
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
  </div>

  <MarketingPromoDetailModal
    :promo="selectedPromo"
    @close="selectedPromo = null"
  />
</template>
