<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

const props = defineProps<{
  id: string
  title: string
  releaseDate: string
  image: string
  imageAlt: string
  to?: string
}>()
</script>

<template>
  <NuxtLink
    :to="props.to?.startsWith('/') ? props.to : `/blog/${props.id}`"
    class="group flex min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
  >
    <div class="aspect-[16/9] overflow-hidden bg-bg-200">
      <img
        :src="props.image"
        :alt="props.imageAlt"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      >
    </div>

    <div class="flex min-h-[106px] flex-1 flex-col px-2.5 pb-3 pt-2.5">
      <h3 class="line-clamp-2 text-[16px] font-normal leading-6 text-text-secondary transition-colors group-hover:text-primary-500 group-focus-visible:text-primary-500">
        {{ props.title }}
      </h3>

      <div class="mt-auto flex items-center justify-between gap-2 pt-3">
        <time class="text-[12px] font-normal text-text-tertiary">
          {{ props.releaseDate }}
        </time>
        <ArrowUpRight
          :size="24"
          :stroke-width="1.9"
          class="shrink-0 text-primary-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        />
      </div>
    </div>
  </NuxtLink>
</template>
