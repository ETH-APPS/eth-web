<script setup lang="ts">
const route = useRoute()

const headerVariant = computed(() => (
  route.path === '/' ? 'overlay' : 'light'
))

const showMultinationalRoutes = computed(() => route.path !== '/')
</script>

<template>
  <div class="min-h-screen">
    <MarketingHeader :variant="headerVariant" />

    <main>
      <slot />
    </main>

    <MarketingSectionsFaq />
    <MarketingSectionsMultinationalRoutes v-if="showMultinationalRoutes" />
    <MarketingFooter />
  </div>
</template>
