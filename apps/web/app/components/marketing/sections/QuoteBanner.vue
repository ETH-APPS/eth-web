<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'

const props = withDefaults(defineProps<{
  compact?: boolean
  sectionId?: string
  title: string
  description: string
  emailLabel?: string
  email: string
  ctaLabel?: string
  ctaTo?: string
  image?: string
  imageAlt?: string
  imagePlaceholder?: string
  showImage?: boolean
}>(), {
  compact: false,
  sectionId: 'quote',
  emailLabel: 'via Email',
  ctaLabel: 'Get A Quote',
  ctaTo: '#quote',
  image: '',
  imageAlt: '',
  imagePlaceholder: 'Image\nW: 532   x   H: 230',
  showImage: true,
})

const titleId = computed(() => `${props.sectionId}-title`)
const emailHref = computed(() => `mailto:${props.email}`)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-primary-600 text-bg-0"
    :class="compact ? 'py-7 sm:py-8' : 'py-10 sm:py-12'"
  >
    <div
      class="mx-auto grid w-[calc(100%-2rem)] max-w-[1250px] items-center gap-12"
      :class="showImage ? 'lg:grid-cols-[minmax(0,1fr)_minmax(420px,532px)]' : ''"
    >
      <div>
        <h2
          :id="titleId"
          class="font-bold leading-tight"
          :class="compact ? 'text-[24px]' : 'text-[32px]'"
        >
          {{ title }}
        </h2>
        <p class="mt-3 font-medium leading-relaxed text-bg-0/95" :class="compact ? 'text-[16px]' : 'text-[20px]'">
          {{ description }}
        </p>

        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between" :class="compact ? 'mt-6 gap-4' : 'mt-8 gap-5'">
          <div>
            <p class="font-medium text-bg-0/90" :class="compact ? 'text-[13px]' : 'text-[16px]'">
              {{ emailLabel }}
            </p>
            <a
              :href="emailHref"
              :class="compact ? 'text-[12px]' : 'text-[14px]'"
              class="mt-1.5 inline-flex items-center gap-2 text-bg-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
            >
              <Mail :size="compact ? 16 : 18" :stroke-width="1.8" aria-hidden="true" />
              <span>{{ email }}</span>
            </a>
          </div>

          <NuxtLink
            :to="ctaTo"
            :class="compact ? 'h-11 px-5 text-[14px]' : 'h-12 px-6 text-[16px]'"
            class="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#22c55e] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0 sm:self-auto"
          >
            <span>{{ ctaLabel }}</span>
            <img
              :src="whatsappUrl"
              alt=""
              aria-hidden="true"
              width="20"
              height="20"
              class="size-5 shrink-0 object-contain"
            >
          </NuxtLink>
        </div>
      </div>

      <div v-if="showImage" class="aspect-[532/230] overflow-hidden bg-bg-100">
        <img
          v-if="image"
          :src="image"
          :alt="imageAlt"
          loading="lazy"
          class="size-full object-cover"
        >
        <div
          v-else
          role="img"
          :aria-label="imageAlt || 'Placeholder gambar banner'"
          class="flex size-full items-center justify-center whitespace-pre-line text-center text-[18px] leading-[1.8] text-slate-950"
        >
          {{ imagePlaceholder }}
        </div>
      </div>
    </div>
  </section>
</template>
