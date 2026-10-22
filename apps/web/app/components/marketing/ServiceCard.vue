<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
  eyebrow: string
  image?: string
  imageAlt?: string
}>()
</script>

<template>
  <article class="flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e2e5ea] bg-white shadow-[0_5px_12px_rgba(25,35,55,0.10)]">
    <img
      v-if="image"
      :src="image"
      :alt="imageAlt || ''"
      width="336"
      height="200"
      loading="lazy"
      class="h-[200px] w-full object-cover object-center"
    >
    <div
      v-else
      aria-hidden="true"
      class="h-[200px] w-full bg-[#d9d9d9]"
    />

    <div class="flex flex-1 flex-col px-4 pb-4 pt-3">
      <h3 class="text-[20px] font-medium leading-tight text-text-secondary">
        {{ title }}
      </h3>

      <p class="mt-4 text-[11.5px] leading-[1.5] text-text-tertiary">
        {{ description }}
      </p>

      <div class="mt-auto flex items-end justify-between gap-3 pt-5">
        <p class="text-[10px] leading-snug text-[#14a444]">
          {{ eyebrow }}
        </p>

        <NuxtLink
          to="#layanan"
          class="inline-flex shrink-0 items-center gap-2 rounded-sm text-[13px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span>Lihat Detail</span>
          <ChevronRight
            aria-hidden="true"
            :size="22"
            :stroke-width="1.5"
            absolute-stroke-width
          />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>