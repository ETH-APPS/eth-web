<script setup lang="ts">
import { faqContentByPath, homeFaqContent } from '~/constants/faq'

const route = useRoute()
const isPolicyPage = computed(() => (
  route.path === '/terms-and-conditions' || route.path === '/legalities'
))

const headerVariant = computed(() => (
  route.path === '/' ? 'overlay' : 'light'
))

const showCalculatorShippingTypes = computed(() => route.path === '/calculator')
const showMultinationalRoutes = computed(() => (
  route.path !== '/' && route.path !== '/calculator' && !isPolicyPage.value
))
const faqContent = computed(() => faqContentByPath[route.path] ?? homeFaqContent)

const calculatorShippingTypes = [
  {
    mode: 'sea',
    title: 'Sea Freight',
    description:
      'Pilihan ekonomis untuk pengiriman barang bervolume besar melalui layanan FCL atau LCL dengan proses yang aman dan transparan.',
    eta: '3~4 minggu',
    to: '/sea-freight',
  },
  {
    mode: 'air',
    title: 'Air Freight',
    description:
      'Pilihan cepat untuk sampel, stok mendesak, dan kargo sensitif waktu melalui jadwal penerbangan yang terukur.',
    eta: '3~7 hari',
    to: '/air-freight',
  },
] as const
</script>

<template>
  <div class="min-h-screen">
    <MarketingHeader :variant="headerVariant" />

    <main>
      <slot />
    </main>

    <MarketingSectionsFaq v-if="!isPolicyPage" v-bind="faqContent">
      <MarketingSectionsCargoShippingTypes
        v-if="showCalculatorShippingTypes"
        description="Pilih jalur pengiriman sesuai volume, urgensi, dan kebutuhan operasional bisnis Anda."
        :services="calculatorShippingTypes"
      />
    </MarketingSectionsFaq>
    <MarketingSectionsMultinationalRoutes v-if="showMultinationalRoutes" />
    <MarketingFooter />
  </div>
</template>
