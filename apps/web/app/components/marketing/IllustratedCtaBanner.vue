<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  variant?: 'standard' | 'background' | 'compact'
  backgroundImage?: string
  shiftImageLeftOnWideScreens?: boolean
  title: string
  description: string
  email: string
  emailLabel?: string
  ctaLabel?: string
  ctaTo: string
  estimateLabel?: string
  estimateTo?: string
  showEstimate?: boolean
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
  variant: 'standard',
  backgroundImage: '',
  shiftImageLeftOnWideScreens: false,
  emailLabel: 'Atau hubungi kami via email:',
  ctaLabel: 'Konsultasi Gratis',
  ctaTo: '/#quote',
  estimateLabel: 'Hitung Biaya',
  estimateTo: '/calculator',
  showEstimate: true,
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
    :class="variant === 'standard' ? 'pt-8 xl:pt-20' : variant === 'background' ? 'pt-8' : ''"
    :style="variant === 'compact' ? { paddingTop: `${props.imageTopOffset}px` } : undefined"
  >
    <div v-if="variant !== 'compact'" class="relative mx-auto max-w-[1250px]">
      <div class="absolute inset-0 overflow-hidden rounded-[32px] bg-linear-to-r from-[#a52832] to-[#8d2930]">
        <img
          v-if="variant === 'background' && backgroundImage"
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
              v-if="variant === 'background' && showEstimate"
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
        class="pointer-events-none absolute bottom-0 z-10 h-auto object-contain"
        :class="[
          variant === 'standard' ? 'w-[45%] max-w-[560px]' : 'w-[32%] max-w-[369px]',
          shiftImageLeftOnWideScreens ? 'xl:-translate-x-24' : '',
        ]"
        :style="{ right: variant === 'standard' ? '0' : `calc(11% + ${props.imageRightOffset}px)` }"
      >
    </div>
    <div
      v-else
      class="grid min-w-0 grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4 rounded-[32px] bg-linear-to-r from-[#a52832] via-[#ad2630] to-[#8d2930] pl-7 text-white xl:pl-8"
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

          <NuxtLink
            :to="ctaTo"
            class="inline-flex min-h-9 max-w-full items-center justify-center rounded-lg bg-green-500 px-3 py-2 text-center text-[12px] font-medium leading-[1.4] transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
  </section>
</template>
