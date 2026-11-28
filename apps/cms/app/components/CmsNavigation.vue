<script setup lang="ts">
import type { Component } from 'vue'
import { Folder, Image, Images, LayoutDashboard, Newspaper, Settings, Tag } from 'lucide-vue-next'
import type { CmsNavigationItem } from '~/constants/navigation'
import { cmsNavigation } from '~/constants/navigation'

const route = useRoute()

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
  <nav aria-label="Navigasi CMS" class="my-auto w-full space-y-9">
    <section v-for="group in cmsNavigation" :key="group.label">
      <h2 class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-disable">
        {{ group.label }}
      </h2>
      <ul class="space-y-4">
        <li v-for="item in group.items" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="ml-5 flex min-h-9 w-[calc(100%-1.25rem)] items-center gap-3 rounded-lg px-3 text-[12px] text-black transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 active:translate-y-px"
            :class="isCurrent(item.to) ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:text-white' : ''"
            :aria-current="route.path === item.to ? 'page' : undefined"
          >
            <component :is="navigationIcons[item.icon]" :size="16" :stroke-width="1.75" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </nav>
</template>
