<script setup lang="ts">
const route = useRoute()

const headerVariant = computed(() => (
  route.path === '/' ? 'overlay' : 'light'
))
</script>

<template>
  <div class="min-h-screen">
    <MarketingHeader :variant="headerVariant" />

    <main>
      <slot />
    </main>

    <MarketingSectionsFaq />
    <MarketingFooter />
  </div>
</template>
