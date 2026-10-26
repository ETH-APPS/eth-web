<script setup lang="ts">
const route = useRoute()
const isPolicyPage = computed(() => (
  route.path === '/terms-and-conditions' || route.path === '/legalities'
))

const headerVariant = computed(() => (
  route.path === '/' || route.path.startsWith('/blog/') ? 'overlay' : 'light'
))

const showMultinationalRoutes = computed(() => (
  route.path !== '/' && route.path !== '/about-us' && !route.path.startsWith('/blog') && route.path !== '/calculator' && route.path !== '/faq' && route.path !== '/promo' && !isPolicyPage.value
))
</script>

<template>
  <div class="min-h-screen">
    <MarketingHeader :variant="headerVariant" />

    <main>
      <slot />
    </main>

    <MarketingSectionsMultinationalRoutes
      v-if="showMultinationalRoutes"
      :show-top-border="true"
    />
    <MarketingFooter />
  </div>
</template>
