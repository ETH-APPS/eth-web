<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import whatsappIcon from '@eth/ui/whatsapp.png'
import { whatsappConsultationUrl } from '~/constants/whatsapp'

const props = withDefaults(defineProps<{
  variant?: 'standard' | 'background' | 'compact'
  backgroundImage?: string
  shiftImageLeftOnWideScreens?: boolean
  largeImageOnWideScreens?: boolean
  title: string
  description: string
  email: string
  emailLabel?: string
  ctaLabel?: string
  ctaTo: string
  animatedCta?: boolean
  image: string
  imageAlt?: string
  imageWidth: number
  imageHeight: number
  imageMaxWidth?: number
  standardImageMaxWidth?: number
  imageTopOffset?: number
  imageRightOffset?: number
  imageBottomOffset?: number
  imageAlign?: 'right' | 'center'
}>(), {
  variant: 'standard',
  backgroundImage: '',
  shiftImageLeftOnWideScreens: false,
  largeImageOnWideScreens: false,
  emailLabel: 'Atau hubungi kami via email:',
  ctaLabel: 'Konsultasi Gratis',
  ctaTo: whatsappConsultationUrl,
  animatedCta: false,
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
        <p class="max-w-[520px] text-justify text-[15px] font-medium leading-[1.4]">
          {{ description }}
        </p>

        <div class="mt-4 flex max-w-[480px] flex-wrap items-end gap-x-5 gap-y-3 xl:max-w-[520px]">
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

          <div class="ml-auto flex flex-wrap gap-2">
            <UiAnimatedArrowButton
              v-if="animatedCta"
              :href="ctaTo"
              target="_blank"
              rel="noopener noreferrer"
              variant="plain"
              class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-green-500 px-3 text-[12px] font-semibold text-white transition-[background-color,color,box-shadow] hover:bg-green-100 hover:text-green-700 hover:ring-2 hover:ring-inset hover:ring-green-700 focus-visible:bg-green-100 focus-visible:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-700"
            >
              {{ ctaLabel }}
              <template #trailing>
                <UiWhatsappIcon class="size-5" />
              </template>
            </UiAnimatedArrowButton>
            <a
              v-else
              :href="ctaTo"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-green-500 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span>{{ ctaLabel }}</span>
              <img :src="whatsappIcon" alt="" aria-hidden="true" width="20" height="20" class="size-5 shrink-0 object-contain">
            </a>
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
          variant === 'standard' ? 'w-[45%] max-w-[560px]' : largeImageOnWideScreens ? 'w-[32%] max-w-[369px] xl:w-[46%] xl:max-w-[570px]' : 'w-[32%] max-w-[369px]',
          shiftImageLeftOnWideScreens ? variant === 'standard' ? 'xl:-translate-x-10' : 'xl:-translate-x-24' : '',
        ]"
        :style="{
          right: variant === 'standard' ? '0' : largeImageOnWideScreens ? '3%' : `calc(11% + ${props.imageRightOffset}px)`,
          maxWidth: variant === 'standard' && props.standardImageMaxWidth ? `${props.standardImageMaxWidth}px` : undefined,
        }"
      >
    </div>
    <UiArticleCtaBanner
      v-else
      :title-id="titleId"
      :title="title"
      :description="description"
      :email="email"
      :email-label="emailLabel"
      :cta-label="ctaLabel"
      :cta-to="ctaTo"
      :image="image"
      :image-alt="imageAlt"
      :image-width="imageWidth"
      :image-height="imageHeight"
      :image-align="imageAlign"
      :image-right-offset="imageRightOffset"
      :image-bottom-offset="imageBottomOffset"
      :image-top-offset="imageTopOffset"
      :image-max-width="imageMaxWidth"
      class="pl-7 xl:pl-8"
    />
  </section>
</template>
