<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Legalities | ETH Cargo',
  description: 'Pusat informasi kebijakan dan ketentuan layanan ETH Cargo.',
  ogTitle: 'Legalities | ETH Cargo',
  ogDescription: 'Pusat informasi kebijakan dan ketentuan layanan ETH Cargo.',
  ogType: 'website',
})

const policyGroups = [
  {
    title: 'General Affairs',
    items: [
      { label: 'Syarat & Ketentuan', icon: 'document' },
      { label: 'Kebijakan Privasi', icon: 'privacy' },
      { label: 'Kebijakan Titip Beli', icon: 'shopping' },
    ],
  },
  {
    title: 'Cargo',
    items: [
      { label: 'FCL Cargo', icon: 'package' },
      { label: 'LCL Cargo', icon: 'package' },
      { label: 'Air Cargo', icon: 'package' },
    ],
  },
  {
    title: 'Lorem Ipsum',
    items: [
      { label: 'FCL Cargo', icon: 'package' },
      { label: 'LCL Cargo', icon: 'package' },
      { label: 'Air Cargo', icon: 'package' },
      { label: 'Syarat & Ketentuan', icon: 'document' },
      { label: 'Kebijakan Privasi', icon: 'privacy' },
      { label: 'Kebijakan Titip Beli', icon: 'shopping' },
      { label: 'Syarat & Ketentuan', icon: 'document' },
      { label: 'Kebijakan Privasi', icon: 'privacy' },
      { label: 'Kebijakan Titip Beli', icon: 'shopping' },
    ],
  },
] as const
</script>

<template>
  <MarketingSectionsPolicyDirectory
    description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
    :groups="policyGroups"
  />
</template>
