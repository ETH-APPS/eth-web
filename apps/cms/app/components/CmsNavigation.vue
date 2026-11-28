<script setup lang="ts">
import type { Component } from 'vue'
import { Folder, Image, Images, LayoutDashboard, LogOut, Newspaper, Settings, Tag } from 'lucide-vue-next'
import type { CmsNavigationItem } from '~/constants/navigation'
import { cmsNavigation } from '~/constants/navigation'

const route = useRoute()
const { isLoggingOut, logout } = useAuth()

const itemClasses = 'ml-5 flex w-[calc(100%-1.25rem)] items-center gap-3 rounded-lg px-3 text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'

const navigationIcons: Record<CmsNavigationItem['icon'], Component> = {
  dashboard: LayoutDashboard,
  article: Newspaper,
  banner: Image,
  category: Folder,
  tag: Tag,
  media: Images,
  settings: Settings,
}

function isCurrent(to: string) {
  return route.path === to || (to === '/articles' && route.path === '/articles/create')
}
</script>

<template>
  <nav aria-label="Navigasi CMS" class="my-auto w-full">
    <section v-for="group in cmsNavigation" :key="group.label" class="not-first:mt-9">
      <h2 class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-disable">
        {{ group.label }}
      </h2>
      <ul class="space-y-4">
        <li v-for="item in group.items" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="min-h-9 active:translate-y-px"
            :class="[itemClasses, isCurrent(item.to) ? 'bg-primary-500 text-white shadow-sm hover:text-primary-50' : 'text-black hover:text-primary-600']"
            :aria-current="route.path === item.to ? 'page' : undefined"
          >
            <component :is="navigationIcons[item.icon]" :size="16" :stroke-width="1.75" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <button
      type="button"
      :disabled="isLoggingOut"
      class="mt-4 min-h-11 text-text-secondary enabled:hover:text-primary-600 disabled:cursor-wait disabled:opacity-60 lg:min-h-9"
      :class="itemClasses"
      @click="logout"
    >
      <LogOut :size="16" :stroke-width="1.75" aria-hidden="true" />
      <span>{{ isLoggingOut ? 'Keluar...' : 'Keluar' }}</span>
    </button>
  </nav>
</template>
