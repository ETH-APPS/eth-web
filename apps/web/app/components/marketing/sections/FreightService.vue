<script setup lang="ts">
import { ArrowUpRight, ClockCheck } from 'lucide-vue-next'

interface FreightServiceCard {
  title: string
  description: string
  eta: string
  image: string
  imageAlt: string
}

const props = withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    description: string
    services?: readonly FreightServiceCard[]
    image?: string
    imageAlt?: string
    ctaPrompt?: string
    ctaLabel?: string
    ctaTo?: string
    sectionId?: string
  }>(),
  {
    services: () => [],
    image: undefined,
    imageAlt: '',
    ctaPrompt: undefined,
    ctaLabel: undefined,
    ctaTo: undefined,
    sectionId: 'sea-freight',
  },
)

const titleId = computed(() => `${props.sectionId}-title`)
const hasCta = computed(() => props.ctaPrompt && props.ctaLabel && props.ctaTo)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-0 py-16"
  >
    <UiContainer>
      <img
        v-if="image"
        :src="image"
        :alt="imageAlt"
        width="1006"
        height="600"
        loading="lazy"
        decoding="async"
        class="aspect-[12/5] h-auto w-full rounded-[20px] object-cover object-center lg:aspect-auto lg:h-[430px]"
      >

      <div
        class="text-center"
        :class="image ? 'mt-10' : ''"
      >
        <p class="text-[16px] font-normal uppercase text-primary-700 lg:text-[20px] lg:font-medium">
          {{ eyebrow }}
        </p>

        <h2
          :id="titleId"
          class="mt-2 text-[32px] font-semibold uppercase leading-tight tracking-[0.01em] text-primary-500 lg:text-[48px]"
        >
          {{ title }}
        </h2>

        <p class="mx-auto mt-5 max-w-[900px] text-justify text-[16px] leading-[1.5] text-text-secondary lg:text-center lg:text-[20px]">
          {{ description }}
        </p>
      </div>

      <div
        v-if="services.length"
        class="mx-auto mt-10 space-y-10"
      >
        <article
          v-for="service in services"
          :key="service.title"
          class="grid min-h-[360px] grid-cols-1 items-center gap-8 rounded-[20px] border border-border-200 bg-bg-0 px-5 py-10 shadow-md md:grid-cols-2 lg:grid-cols-[1fr_420px] lg:px-12"
        >
          <div>
            <p class="text-[20px] font-medium text-text-secondary">
              Mengenal Layanan...
            </p>

            <h3 class="mt-2 text-[32px] font-bold leading-tight text-primary-500 lg:text-[42px]">
              {{ service.title }}
            </h3>

            <p class="mt-7 text-[16px] leading-[1.5] text-text-secondary">
              {{ service.description }}
            </p>

            <div class="mt-8 flex items-center gap-3 text-primary-500">
              <ClockCheck
                :size="24"
                :stroke-width="1.8"
                aria-hidden="true"
              />
              <span class="text-[20px] font-medium">ETA</span>
              <span
                aria-hidden="true"
                class="h-px w-6 bg-border-300"
              />
              <span class="text-[20px] font-medium">{{ service.eta }}</span>
            </div>
          </div>

          <img
            :src="service.image"
            :alt="service.imageAlt"
            width="420"
            height="315"
            loading="lazy"
            decoding="async"
            class="h-auto w-full rounded-2xl"
          >
        </article>
      </div>

      <div
        v-if="hasCta"
        class="mt-10 text-center"
      >
        <p class="text-[16px] text-text-tertiary lg:text-[11px]">
          {{ ctaPrompt }}
        </p>

        <NuxtLink
          :to="ctaTo"
          class="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-4 text-[14px] font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:h-9 lg:text-[11px]"
        >
          <span>{{ ctaLabel }}</span>
          <ArrowUpRight
            :size="15"
            :stroke-width="2"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>