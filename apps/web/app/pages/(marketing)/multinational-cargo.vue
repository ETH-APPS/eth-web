<script setup lang="ts">
import cargoAirUrl from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea-landscape.png'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Multinational Cargo Amerika | ETH Cargo',
  description:
    'Layanan pengiriman kargo laut dan udara untuk kebutuhan logistik internasional dari dan menuju Amerika bersama ETH Cargo.',
  ogTitle: 'Multinational Cargo Amerika | ETH Cargo',
  ogDescription:
    'Layanan pengiriman kargo laut dan udara untuk kebutuhan logistik internasional dari dan menuju Amerika bersama ETH Cargo.',
  ogType: 'website',
})

const serviceStats = [
  { value: '+10.000', label: 'Shipment\nCompleted', uppercase: true },
  { value: '98%', label: 'Completion\nRate', uppercase: true },
  { value: '+7', label: 'Countries\nShipping', uppercase: true },
  { value: '+10', label: 'Years of\nExperiences' },
]

const shippingWorkflowSteps = Array.from({ length: 5 }, () => ({
  title: 'Lorem Ipsum',
  description:
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
}))
</script>

<template>
  <MarketingMultinationalCargoHero />
  <MarketingSectionsFreightService
    eyebrow="Our Service"
    title="Sea Freight"
    description="Kirim barang bervolume besar melalui layanan Full Container Load (FCL) yang aman dan andal. Dengan kepastian alokasi kontainer serta penguncian tarif hingga 45 hari, perencanaan logistik bisnis menjadi lebih efisien dan terukur."
    :image="cargoSeaUrl"
    image-alt="Kapal kontainer untuk layanan sea freight multinational ETH Cargo"
    cta-prompt="Pelajari layanan pengiriman laut untuk kebutuhan bisnis internasional Anda"
    cta-label="Learn more"
    cta-to="#quote"
  />
  <MarketingSectionsStats
    :stats="serviceStats"
    aria-label="Multinational cargo service statistics"
  />
  <MarketingSectionsFreightService
    section-id="air-freight"
    eyebrow="Our Service"
    title="Air Freight"
    description="Butuh pengiriman internasional yang lebih cepat? Layanan Air Freight kami memberikan waktu transit singkat, jadwal penerbangan yang terukur, serta penanganan kargo yang aman dari titik keberangkatan hingga tiba di negara tujuan."
    :image="cargoAirUrl"
    image-alt="Pesawat cargo untuk layanan air freight multinational ETH Cargo"
    cta-prompt="Pelajari layanan pengiriman udara untuk kebutuhan bisnis internasional Anda"
    cta-label="Learn more"
    cta-to="#quote"
  />
  <MarketingSectionsShippingWorkflow
    title="HOW IT WORKS"
    description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
    :steps="shippingWorkflowSteps"
    cta-prompt="Lorem ipsum dolor sit amet consectetur adipiscing elit"
    cta-label="Get a Quote"
    cta-to="#quote"
  />
  <MarketingSectionsRateEstimator
    title="Hitung Estimasi Tarif Multinasional"
    description="Dapatkan kalkulasi perkiraan biaya pengiriman internasional secara instan untuk membantu perencanaan logistik dan anggaran bisnis Anda."
  />
</template>
