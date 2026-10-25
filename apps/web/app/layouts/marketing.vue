<script setup lang="ts">
const route = useRoute()
const isPolicyPage = computed(() => (
  route.path === '/terms-and-conditions' || route.path === '/legalities'
))

const headerVariant = computed(() => (
  route.path === '/' ? 'overlay' : 'light'
))

const showMultinationalRoutes = computed(() => (
  route.path !== '/' && route.path !== '/calculator' && !isPolicyPage.value
))
</script>

<template>
  <div class="min-h-screen">
    <MarketingHeader :variant="headerVariant" />

    <main>
      <slot />
    </main>

    <MarketingSectionsMultinationalRoutes v-if="showMultinationalRoutes" />
    <MarketingFooter />
  </div>
</template>
