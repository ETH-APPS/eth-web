<script setup lang="ts">
import { homeFaqContent } from '~/constants/faq'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Live Tracking Cargo | ETH Cargo',
  description:
    'Pantau status dan perjalanan pengiriman cargo ETH Cargo menggunakan Marking ID dan PIN tracking Anda.',
  ogTitle: 'Live Tracking Cargo | ETH Cargo',
  ogDescription:
    'Pantau status dan perjalanan pengiriman cargo ETH Cargo menggunakan Marking ID dan PIN tracking Anda.',
  ogType: 'website',
})

const route = useRoute()

function queryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

const initialMarkingId = queryValue(route.query.markingId)
const initialPin = queryValue(route.query.pin)

const trackingResult = {
  caseNumber: initialPin || '2413-OVCA',
  cargoType: 'FCL Cargo',
  currentStatus: 'Your Home',
  checkpoints: [
    {
      location: 'Guangzhou',
      label: 'Seller',
      kind: 'seller',
      events: [
        { label: 'Packed', value: '04/04/26', status: 'complete' },
        { label: 'Deliver', value: '04/04/26', status: 'complete' },
      ],
    },
    {
      location: 'Foshan',
      label: 'Warehouse',
      kind: 'warehouse',
      events: [
        { label: 'Packed', value: '04/04/26', status: 'complete' },
        { label: 'Deliver', value: '04/04/26', status: 'complete' },
      ],
    },
    {
      location: 'Jakarta',
      label: 'Warehouse',
      kind: 'warehouse',
      events: [
        { label: 'Packed', value: '04/04/26', status: 'complete' },
        { label: 'QC', value: '20:52', status: 'complete' },
        { label: 'Deliver', value: '04/04/26', status: 'complete' },
        { label: 'Depart', value: '22/08/26', status: 'complete' },
      ],
    },
    {
      location: 'Your Home',
      label: 'Address',
      kind: 'destination',
      active: true,
      events: [
        { label: 'ETA', value: '26 Sep 2026', status: 'current' },
        { label: 'Duration', value: '4 Weeks', status: 'pending' },
      ],
    },
  ],
} as const

const shippingTypes = [
  {
    mode: 'calculator',
    title: 'Calculator',
    description: 'Hitung estimasi biaya pengiriman berdasarkan jenis, ukuran, dan kebutuhan kargo Anda.',
    tags: ['Sea Freight', 'Air Freight'],
    to: '/calculator',
  },
  {
    mode: 'sea',
    title: 'Kargo Laut',
    description: 'Tipe kargo laut terbaik untuk bulk buying dengan kapasitas pengiriman dalam jumlah besar.',
    eta: '5–8 minggu',
    to: '/sea-freight',
  },
  {
    mode: 'air',
    title: 'Kargo Udara',
    description: 'Pilihan pengiriman cepat untuk sampel, stok mendesak, dan barang yang sensitif terhadap waktu.',
    eta: '1–7 hari',
    to: '/air-freight',
  },
] as const
</script>

<template>
  <MarketingSectionsLiveTracking
    description="Pantau posisi dan status pengiriman kargo Anda secara real-time menggunakan Marking ID dan PIN yang telah diberikan."
    :result="trackingResult"
    :initial-marking-id="initialMarkingId"
    :initial-pin="initialPin"
    :initial-show-result="Boolean(initialMarkingId && initialPin)"
    cta-prompt="Perlu bantuan memahami status perjalanan kargo Anda?"
    cta-label="Get a Quote"
    cta-to="#quote"
  />

  <MarketingSectionsCargoShippingTypes
    section-id="live-tracking-shipping-types"
    variant="compact"
    description="Pilih fitur dan jalur pengiriman yang paling sesuai dengan kebutuhan operasional bisnis Anda."
    :services="shippingTypes"
  />
  <MarketingSectionsFaq v-bind="homeFaqContent" />
</template>
