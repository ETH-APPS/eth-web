<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

defineProps<{
  title: string
  price: string
  image: string
  imageAlt: string
  mobilePlaceholderTitle?: string
}>()
</script>

<template>
  <article>
    <img
      :src="image"
      :alt="imageAlt"
      width="253"
      height="145"
      loading="lazy"
      class="h-[145px] w-full rounded-2xl object-cover object-center"
    >

    <p class="mt-3 px-2 text-[14px] leading-[1.4] text-text-tertiary">
      <span v-if="mobilePlaceholderTitle" class="line-clamp-2 text-black lg:hidden">{{ mobilePlaceholderTitle }}</span>
      <span :class="mobilePlaceholderTitle ? 'hidden lg:inline' : ''">{{ title }}</span>
    </p>

    <div class="mt-3 flex items-center justify-between gap-3 px-2 text-primary-500">
      <p class="text-[15px] font-medium">
        {{ price }}
      </p>
      <a
        href="#quote"
        :aria-label="`Lihat ${title}`"
        class="rounded-md p-1 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <ArrowUpRight
          :size="20"
          :stroke-width="2"
          aria-hidden="true"
        />
      </a>
    </div>
  </article>
</template>
