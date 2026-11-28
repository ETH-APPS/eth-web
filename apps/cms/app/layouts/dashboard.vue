<script setup lang="ts">
import logoWhiteUrl from '../../../web/app/assets/images/brand/logo-white.png'
import { cmsNavigation } from '~/constants/navigation'

const route = useRoute()
const menuOpen = ref(false)
const { user } = useUserSession()

const userName = computed(() => {
  if (!user.value)
    return 'ETH Cargo CMS'
  return [user.value.firstName, user.value.lastName].filter(Boolean).join(' ')
})

const userInitial = computed(() => user.value?.firstName?.charAt(0).toUpperCase() || 'E')

const breadcrumbs = computed(() => {
  if (route.path === '/articles/create') return ['Konten', 'Buat artikel']

  for (const group of cmsNavigation) {
    const item = group.items.find(entry => entry.to === route.path)
    if (item) return [group.label, item.label]
  }

  return []
})

watch(() => route.path, () => {
  menuOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-bg-0 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <button
      v-if="menuOpen"
      type="button"
      aria-label="Tutup navigasi"
      class="fixed inset-0 z-30 bg-black/30 lg:hidden"
      @click="menuOpen = false"
    />

    <aside
      id="cms-sidebar"
      class="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-border-200 bg-bg-0 px-4 pt-8 pb-5 transition-transform duration-200 motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:visible lg:pointer-events-auto"
      :class="menuOpen ? 'translate-x-0 visible pointer-events-auto' : '-translate-x-full invisible pointer-events-none'"
      @keydown.esc="menuOpen = false"
    >
      <NuxtLink to="/dashboard" aria-label="ETH Cargo CMS, halaman ringkasan" class="mx-auto inline-flex w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
        <img :src="logoWhiteUrl" alt="ETH Cargo" width="145" height="44" class="h-auto w-[145px]">
      </NuxtLink>

      <div class="flex min-h-0 flex-1 overflow-y-auto py-6">
        <CmsNavigation />
      </div>

      <div class="border-t border-border-200 px-3 pt-4 text-[11px] leading-5 text-text-tertiary">
        <p class="font-semibold text-text-secondary">ETH Cargo CMS</p>
        <p>{{ new Date().getFullYear() }}</p>
      </div>
    </aside>

    <div class="min-w-0">
      <header class="sticky top-0 z-20 flex min-h-[68px] items-center justify-between gap-4 border-b border-border-200 bg-bg-0 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:hidden"
            :aria-expanded="menuOpen"
            aria-controls="cms-sidebar"
            aria-label="Buka navigasi"
            @click="menuOpen = true"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-5" aria-hidden="true"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>

          <nav aria-label="Breadcrumb" class="flex min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap text-[12px] text-text-tertiary sm:gap-4">
            <NuxtLink to="/dashboard" class="truncate hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500">Workspace</NuxtLink>
            <template v-for="(crumb, index) in breadcrumbs" :key="`${index}-${crumb}`">
              <span class="text-border-300" aria-hidden="true">/</span>
              <span class="truncate" :class="index === breadcrumbs.length - 1 ? 'font-semibold text-primary-500' : ''">{{ crumb }}</span>
            </template>
          </nav>
        </div>

        <div class="flex shrink-0 items-center gap-4">
          <label class="hidden h-9 w-[220px] items-center gap-2 rounded-lg border border-border-200 px-3 text-text-disable xl:flex">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-4 shrink-0" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path stroke-linecap="round" d="m16 16 4.5 4.5" /></svg>
            <input type="search" disabled aria-label="Cari konten, belum tersedia" placeholder="Cari konten..." class="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-text-disable">
          </label>
          <div class="hidden h-8 w-px bg-border-200 sm:block" aria-hidden="true" />
          <div class="flex items-center gap-3 p-1">
            <div class="hidden leading-4 sm:block">
              <p class="text-[11px] font-semibold text-text-secondary">{{ userName }}</p>
              <p class="text-[10px] text-text-disable">CMS</p>
            </div>
            <span class="flex size-9 items-center justify-center rounded-full bg-primary-500 text-[12px] font-semibold text-white" aria-hidden="true">{{ userInitial }}</span>
          </div>
        </div>
      </header>

      <main class="min-w-0 px-4 py-7 sm:px-6 lg:px-8 lg:py-9 xl:px-12">
        <slot />
      </main>
    </div>
  </div>
</template>
