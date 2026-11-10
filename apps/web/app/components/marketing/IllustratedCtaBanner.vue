<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'contained' | 'compact' | 'dense' | 'cargo'
  fullWidth?: boolean
  backgroundImage?: string
  title: string
  description: string
  email: string
  emailLabel?: string
  ctaLabel?: string
  ctaTo: string
  estimateLabel?: string
  estimateTo?: string
  image: string
  imageAlt?: string
  imageWidth: number
  imageHeight: number
  imageMaxWidth?: number
  imageTopOffset?: number
  imageRightOffset?: number
  imageBottomOffset?: number
  imageAlign?: 'right' | 'center'
}>(), {
  variant: 'default',
  fullWidth: false,
  backgroundImage: '',
  emailLabel: 'Atau hubungi kami via email:',
  ctaLabel: 'Konsultasi Gratis',
  ctaTo: '/#quote',
  estimateLabel: 'Hitung Biaya',
  estimateTo: '/calculator',
  imageAlt: '',
  imageMaxWidth: 480,
  imageTopOffset: 72,
  imageRightOffset: 0,
  imageBottomOffset: 0,
  imageAlign: 'right',
})

const titleId = `illustrated-cta-${useId()}`
</script>

<template>
  <section
    :aria-labelledby="titleId"
    class="hidden lg:block"
    :style="{ paddingTop: variant === 'cargo' ? '32px' : `${props.imageTopOffset}px` }"
  >
    <div v-if="variant === 'cargo'" class="relative mx-auto max-w-[1250px]">
      <div class="absolute inset-0 overflow-hidden rounded-[32px] bg-linear-to-r from-[#a52832] to-[#8d2930]">
        <img
          v-if="backgroundImage"
          :src="backgroundImage"
          alt=""
          width="1230"
          height="315"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          class="size-full object-cover object-center"
        >
      </div>

      <div class="relative z-10 flex min-h-[315px] w-[58%] flex-col justify-center gap-4 px-8 py-8 text-white lg:pl-10 xl:pl-20">
        <h2 :id="titleId" class="max-w-[520px] text-[26px] font-bold leading-[1.2]">
          {{ title }}
        </h2>
        <p class="max-w-[520px] text-[15px] font-medium leading-[1.4]">
          {{ description }}
        </p>

        <div class="mt-4 flex flex-wrap items-end gap-x-5 gap-y-3">
          <div class="min-w-0">
            <p class="text-[13px] font-semibold leading-[1.5]">{{ emailLabel }}</p>
            <a
              :href="`mailto:${email}`"
              class="mt-1 inline-flex max-w-full items-center gap-2 text-[12px] leading-[1.5] transition-opacity hover:opacity-80 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Mail :size="14" class="shrink-0" aria-hidden="true" />
              <span class="min-w-0 break-words">{{ email }}</span>
            </a>
          </div>

          <div class="flex flex-wrap gap-2">
            <NuxtLink
              :to="estimateTo"
              class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-primary-500 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {{ estimateLabel }}
              <span aria-hidden="true" class="size-4 rounded-full bg-white/80" />
            </NuxtLink>
            <NuxtLink
              :to="ctaTo"
              class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-green-500 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {{ ctaLabel }}
              <span aria-hidden="true" class="size-4 rounded-full bg-white/80" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <img
        :src="image"
        :alt="imageAlt"
        :width="imageWidth"
        :height="imageHeight"
        loading="lazy"
        decoding="async"
        class="pointer-events-none absolute bottom-0 right-[11%] z-10 h-auto w-[32%] max-w-[369px] object-contain"
      >
    </div>
    <div v-else :class="fullWidth ? 'bg-linear-to-r from-[#a52832] via-[#ad2630] to-[#8d2930]' : ''">
    <div
      class="grid min-w-0 text-white"
      :class="[fullWidth
        ? 'mx-auto w-full max-w-[1250px] px-6'
        : 'rounded-[32px] bg-linear-to-r from-[#a52832] via-[#ad2630] to-[#8d2930] pl-6 xl:pl-8',
      variant === 'dense'
        ? 'grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-3'
        : variant === 'compact'
        ? 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4'
        : 'grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6']"
    >
      <div
        class="flex min-w-0 flex-col"
        :class="variant === 'dense' ? 'py-5' : variant === 'compact' ? 'py-7' : variant === 'contained' ? 'py-9' : 'py-10'"
      >
        <h2
          :id="titleId"
          class="font-bold leading-[1.2]"
          :class="variant === 'dense' ? 'text-[18px]' : variant === 'compact' ? 'text-[20px]' : variant === 'contained' ? 'text-[28px]' : 'text-[32px]'"
        >
          {{ title }}
        </h2>
        <p
          class="font-medium leading-[1.4]"
          :class="variant === 'dense' ? 'mt-2 text-[12px]' : variant === 'compact' ? 'mt-3 text-[14px]' : variant === 'contained' ? 'mt-4 text-[18px]' : 'mt-5 text-[20px]'"
        >
          {{ description }}
        </p>

        <div
          class="mt-auto flex flex-wrap items-end justify-between"
          :class="variant === 'dense' ? 'gap-2 pt-3' : variant === 'compact' ? 'gap-3 pt-4' : variant === 'contained' ? 'gap-4 pt-5' : 'gap-5 pt-6'"
        >
          <div class="min-w-0">
            <p
              class="font-medium leading-[1.5]"
              :class="variant === 'dense' ? 'text-[10px]' : variant === 'compact' ? 'text-[12px]' : variant === 'contained' ? 'text-[14px]' : 'text-[16px]'"
            >
              {{ emailLabel }}
            </p>
            <a
              :href="`mailto:${email}`"
              class="mt-1 inline-flex max-w-full items-center gap-2 font-normal leading-[1.5] transition-opacity hover:opacity-80 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              :class="variant === 'dense' ? 'text-[10px]' : variant === 'compact' ? 'text-[11px]' : variant === 'contained' ? 'text-[12px]' : 'text-[14px]'"
            >
              <Mail :size="variant === 'dense' ? 12 : variant === 'compact' || variant === 'contained' ? 14 : 16" class="shrink-0" aria-hidden="true" />
              <span class="min-w-0 break-words">{{ email }}</span>
            </a>
          </div>

          <NuxtLink
            :to="ctaTo"
            class="inline-flex max-w-full items-center justify-center bg-green-500 text-center font-medium leading-[1.4] transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            :class="variant === 'dense'
              ? 'min-h-8 rounded-lg px-3 py-1.5 text-[11px]'
              : variant === 'compact'
                ? 'min-h-9 rounded-lg px-3 py-2 text-[12px]'
              : variant === 'contained'
                ? 'min-h-11 rounded-xl px-4 py-2 text-[12px]'
              : 'min-h-11 rounded-xl px-5 py-2.5 text-[14px]'"
          >
            {{ ctaLabel }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative min-w-0">
        <img
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
    </div>
  </section>
</template>
