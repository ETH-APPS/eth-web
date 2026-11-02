<script setup lang="ts">
import type { Component } from 'vue'
import {
  Headphones,
  Cuboid,
  ShieldCheck,
} from 'lucide-vue-next'
import logoUrl from '~/assets/images/brand/logo-white.png'

type AboutServiceIcon = 'cargo' | 'sourcing' | 'transfer'

interface AboutService {
  icon: AboutServiceIcon
  title: string
  description: string
}

const props = withDefaults(defineProps<{
  eyebrow?: string
  description: string
  overviewEyebrow?: string
  overviewTitle?: string
  overviewDescription: string
  services: readonly AboutService[]
  sectionId?: string
}>(), {
  eyebrow: 'Tentang Kami',
  overviewEyebrow: 'Mengenal Lebih Dekat..',
  overviewTitle: 'Layanan Kami',
  sectionId: 'about-us',
})

const titleId = computed(() => `${props.sectionId}-title`)
const servicesId = computed(() => `${props.sectionId}-services`)
const servicesRef = ref<HTMLElement | null>(null)
const activeServiceIndex = ref(0)

function updateActiveService() {
  const list = servicesRef.value
  if (!list || !list.clientWidth) return

  activeServiceIndex.value = Math.min(
    Math.round(list.scrollLeft / list.clientWidth),
    props.services.length - 1,
  )
}

function showService(index: number) {
  const list = servicesRef.value
  if (!list) return

  activeServiceIndex.value = index
  list.scrollTo({
    left: index * list.clientWidth,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

const serviceIcons: Record<AboutServiceIcon, Component> = {
  cargo: Cuboid,
  sourcing: Headphones,
  transfer: ShieldCheck,
}
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-0 pb-20 pt-6 sm:pt-10 lg:pb-24 lg:pt-20"
  >
    <UiContainer>
      <div class="text-center">
        <p class="text-[16px] font-normal text-primary-700 lg:text-[20px]">
          <span class="lg:hidden">About Us</span>
          <span class="hidden lg:inline">{{ eyebrow }}</span>
        </p>

        <div class="mx-auto mt-3 w-full max-w-[360px] sm:max-w-[460px] lg:w-fit">
          <h1 :id="titleId" class="sr-only">
            ETH Cargo
          </h1>
          <img
            :src="logoUrl"
            width="600"
            height="180"
            alt="ETH Cargo"
            class="h-auto w-full object-contain lg:w-[460px]"
          >
        </div>
 
        <p class="mx-auto mt-10 text-justify text-[15px] font-normal leading-[1.5] text-text-secondary lg:text-center lg:text-2xl lg:leading-[1.4]">
          {{ description }}
        </p>
      </div>

      <div class="mt-12 grid gap-4 rounded-[22px] border border-border-200 bg-bg-0 px-5 py-6 shadow-[0_5px_10px_rgba(15,23,42,0.10)] lg:mt-16 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-10">
        <div>
          <p class="text-[20px] font-medium leading-tight text-text-secondary lg:text-[32px] lg:font-semibold">
            <span class="lg:hidden">What is...</span>
            <span class="hidden lg:inline">{{ overviewEyebrow }}</span>
          </p>
          <h2 class="mt-1 text-[32px] font-bold leading-tight text-primary-500 lg:text-[41px]">
            <span class="lg:hidden">Our Services</span>
            <span class="hidden lg:inline">{{ overviewTitle }}</span>
          </h2>
        </div>

        <p class="self-center text-justify text-[16px] font-normal leading-[1.5] text-text-secondary lg:text-left lg:leading-[1.45]">
          {{ overviewDescription }}
        </p>
      </div>

      <ul
        :id="servicesId"
        ref="servicesRef"
        class="mt-16 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-14 lg:overflow-visible lg:snap-none [&::-webkit-scrollbar]:hidden"
        @scroll.passive="updateActiveService"
      >
        <li
          v-for="service in services"
          :key="service.title"
          class="min-w-0 w-full shrink-0 snap-start text-center lg:w-auto lg:shrink lg:snap-none"
        >
          <component
            :is="serviceIcons[service.icon]"
            :size="31"
            :stroke-width="1.8"
            aria-hidden="true"
            class="mx-auto text-primary-500"
          />
          <h3 class="mt-4 text-[20px] font-medium leading-tight text-text-tertiary">
            {{ service.title }}
          </h3>
          <p class="mt-5 text-left text-[14px] font-normal leading-[1.45] text-text-tertiary">
            {{ service.description }}
          </p>
        </li>
      </ul>
      <nav v-if="services.length > 1" class="mt-8 flex items-center justify-center lg:hidden" aria-label="Pilih layanan">
        <button
          v-for="(service, index) in services"
          :key="service.title"
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          :aria-label="`Tampilkan layanan ${service.title}`"
          :aria-controls="servicesId"
          :aria-current="activeServiceIndex === index ? 'true' : undefined"
          @click="showService(index)"
        >
          <span class="h-2 w-10 rounded-full" :class="activeServiceIndex === index ? 'bg-primary-500' : 'bg-primary-100'" />
        </button>
      </nav>
    </UiContainer>
  </section>
</template>
