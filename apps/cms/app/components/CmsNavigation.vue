<script setup lang="ts">
import { cmsNavigation } from '~/constants/navigation'

const route = useRoute()

function isCurrent(to: string) {
  return route.path === to || (to === '/articles' && route.path === '/articles/create')
}
</script>

<template>
  <nav aria-label="Navigasi CMS" class="space-y-9">
    <section v-for="group in cmsNavigation" :key="group.label">
      <h2 class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-disable">
        {{ group.label }}
      </h2>
      <ul class="space-y-1">
        <li v-for="item in group.items" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="relative flex min-h-10 items-center rounded-lg px-4 text-[13px] font-medium text-text-tertiary transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            :class="isCurrent(item.to) ? 'bg-primary-50 font-semibold text-primary-500 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-primary-500' : ''"
            :aria-current="route.path === item.to ? 'page' : undefined"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </nav>
</template>
