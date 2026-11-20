<script setup lang="ts">
const route = useRoute()
const isPolicyPage = computed(() => (
  route.path === '/terms-and-conditions' || route.path === '/legalities'
))

const headerVariant = computed(() => {
  const isBlogDirectoryPage = route.path === '/artikel/search'
    || route.path === '/artikel/tags'
    || route.path.startsWith('/artikel/author/')
  const isBlogDetail = route.path.startsWith('/artikel/') && !isBlogDirectoryPage

  return route.path === '/' || isBlogDetail ? 'overlay' : 'light'
})

const showMultinationalRoutes = computed(() => (
  route.path !== '/' && route.path !== '/about-us' && !route.path.startsWith('/artikel') && route.path !== '/calculator' && route.path !== '/calculator-transfer-rmb' && !route.path.startsWith('/faq') && !route.path.startsWith('/glossary') && route.path !== '/promo' && route.path !== '/transfer-rmb' && route.path !== '/sourcing' && route.path !== '/complete-guide' && !isPolicyPage.value
))
</script>

<template>
  <div class="min-h-screen">
    <MarketingHeader :variant="headerVariant" />

    <main>
      <slot />

      <MarketingSectionsMultinationalRoutes
        v-if="showMultinationalRoutes"
        :show-top-border="!['/china-cargo', '/sea-freight', '/air-freight', '/live-tracking'].includes(route.path) && !route.path.startsWith('/multinational-cargo')"
      />
    </main>
    <MarketingFooter />
    <MarketingFloatingWhatsapp />
  </div>
</template>
