<script setup lang="ts">
import { cmsNavigation } from '~/constants/navigation'
</script>

<template>
  <nav aria-label="Navigasi CMS" class="space-y-6">
    <section v-for="group in cmsNavigation" :key="group.label">
      <h2 class="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-disable">
        {{ group.label }}
      </h2>
      <ul class="space-y-1">
        <li v-for="item in group.items" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-text-tertiary transition hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            active-class="bg-primary-50 !text-primary-600"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </nav>
</template>
