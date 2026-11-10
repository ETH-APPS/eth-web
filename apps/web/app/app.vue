<script setup lang="ts">
const route = useRoute()
const siteUrl = useRuntimeConfig().public.siteUrl || (import.meta.dev ? useRequestURL().origin : '')
const routesWithoutCanonical = new Set(['/blog/search', '/blog/tags'])

const canonicalUrl = computed(() => {
  if (!siteUrl || routesWithoutCanonical.has(route.path))
    return ''

  const canonicalPath = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
  return new URL(canonicalPath, siteUrl).href
})

useHead(() => ({
  link: canonicalUrl.value
    ? [{ key: 'canonical', rel: 'canonical', href: canonicalUrl.value }]
    : [],
}))
</script>

<template>
  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
