<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Syarat & Ketentuan | ETH Cargo',
  description: 'Syarat dan ketentuan penggunaan layanan pengiriman ETH Cargo.',
  ogTitle: 'Syarat & Ketentuan | ETH Cargo',
  ogDescription: 'Syarat dan ketentuan penggunaan layanan pengiriman ETH Cargo.',
  ogType: 'website',
})

const policyNavigation = [
  {
    label: 'Umum',
    items: ['Syarat & Ketentuan', 'Kebijakan Privasi'],
  },
  {
    label: 'Cargo',
    items: ['FCL Policies', 'LCL Policies', 'Air Cargo'],
  },
  {
    label: 'Transfer Services',
    items: ['Transfer RMB Policies', 'Transfer RMB Notice'],
  },
] as const

const policyContent = [
  {
    type: 'paragraph',
    text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
  },
  {
    type: 'paragraph',
    text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.',
  },
  {
    type: 'paragraph',
    text: 'Ketentuan layanan ini meliputi:',
  },
  {
    type: 'list',
    items: [
      'Ketentuan penggunaan layanan ETH Cargo.',
      'Tanggung jawab dan kewajiban pengguna layanan.',
      'Prosedur penyerahan serta pemrosesan kargo.',
      'Ketentuan penyimpanan dan pengiriman barang.',
    ],
  },
  {
    type: 'paragraph',
    text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.',
  },
  {
    type: 'paragraph',
    text: 'Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.',
  },
  {
    type: 'paragraph',
    text: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.',
  },
  {
    type: 'paragraph',
    text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.',
  },
] as const
</script>

<template>
  <MarketingSectionsPolicyDocument
    title="Syarat & Ketentuan"
    updated-at="24 SEP 2026"
    active-policy="Syarat & Ketentuan"
    :navigation="policyNavigation"
    :content="policyContent"
    previous-policy="Kebijakan Privasi"
    next-policy="Kebijakan FCL Kargo"
  />
</template>
