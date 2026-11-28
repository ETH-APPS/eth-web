<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import whatsappIcon from '../assets/images/whatsapp.png'

const props = withDefaults(defineProps<{
  titleId?: string
  title: string
  description: string
  email?: string
  emailLabel?: string
  ctaLabel?: string
  ctaTo?: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  imageAlign?: 'right' | 'center'
  imageRightOffset?: number
  imageBottomOffset?: number
  imageTopOffset?: number
  imageMaxWidth?: number
}>(), {
  email: 'ethcargo@hotmail.com',
  emailLabel: 'Atau hubungi kami via email:',
  ctaLabel: 'Konsultasi Gratis',
  imageAlt: '',
  imageAlign: 'right',
  imageRightOffset: 0,
  imageBottomOffset: 0,
  imageTopOffset: 0,
  imageMaxWidth: 480,
})
</script>

<template>
  <div
    class="grid min-w-0 grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4 rounded-[32px] bg-linear-to-r from-[#a52832] via-[#ad2630] to-[#8d2930] text-white"
  >
    <div class="flex min-w-0 flex-col py-7">
      <h2 :id="titleId" class="text-[20px] font-bold leading-[1.2]">
        {{ title }}
      </h2>
      <p class="mt-3 text-[13px] font-medium leading-[1.5]">
        {{ description }}
      </p>

      <div class="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
        <div class="min-w-0">
          <p class="text-[11px] font-medium leading-[1.5]">{{ emailLabel }}</p>
          <a
            :href="`mailto:${email}`"
            class="mt-1 inline-flex max-w-full items-center gap-2 text-[11px] font-normal leading-[1.5] transition-opacity hover:opacity-80 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Mail :size="14" class="shrink-0" aria-hidden="true" />
            <span class="min-w-0 break-words">{{ email }}</span>
          </a>
        </div>

        <a
          :href="ctaTo"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-9 max-w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-center text-[12px] font-medium leading-[1.4] transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span>{{ ctaLabel }}</span>
          <img :src="whatsappIcon" alt="" aria-hidden="true" width="20" height="20" class="size-5 shrink-0 object-contain">
        </a>
      </div>
    </div>

    <div class="relative min-w-0">
      <img
        v-if="image"
        :src="image"
        :alt="imageAlt"
        :width="imageWidth"
        :height="imageHeight"
        loading="lazy"
        decoding="async"
        class="pointer-events-none absolute bottom-0 w-full object-contain"
        :class="imageAlign === 'center' ? 'left-1/2 -translate-x-1/2 object-bottom' : 'object-right-bottom'"
        :style="{
          right: imageAlign === 'right' ? `${props.imageRightOffset}px` : undefined,
          bottom: `${props.imageBottomOffset}px`,
          height: `calc(100% + ${props.imageTopOffset}px)`,
          maxWidth: `${props.imageMaxWidth}px`,
        }"
      >
    </div>
  </div>
</template>
