<script setup lang="ts">
import type { Component } from 'vue'
import {
  Headphones,
  Package,
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

const serviceIcons: Record<AboutServiceIcon, Component> = {
  cargo: Package,
  sourcing: Headphones,
  transfer: ShieldCheck,
}
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-0 pb-20 pt-16 sm:pb-24 sm:pt-20"
  >
    <UiContainer>
      <div class="text-center">
        <p class="text-[20px] font-normal text-primary-700">
          {{ eyebrow }}
        </p>

        <div class="mx-auto mt-3 w-fit">
          <h1 :id="titleId" class="sr-only">
            ETH Cargo
          </h1>
          <img
            :src="logoUrl"
            width="600"
            height="180"
            alt="ETH Cargo"
            class="h-auto w-[360px] object-contain sm:w-[460px]"
          >
        </div>

        <p class="mx-auto mt-14 max-w-[960px] text-[23px] font-normal leading-[1.4] text-text-secondary">
          {{ description }}
        </p>
      </div>

      <div class="mt-16 grid gap-8 rounded-[22px] border border-border-200 bg-bg-0 px-8 py-10 shadow-[0_5px_10px_rgba(15,23,42,0.10)] md:grid-cols-[380px_minmax(0,1fr)] md:px-12">
        <div>
          <p class="text-[31px] font-semibold leading-tight text-text-secondary">
            {{ overviewEyebrow }}
          </p>
          <h2 class="mt-3 text-[40px] font-semibold leading-tight text-primary-500">
            {{ overviewTitle }}
          </h2>
        </div>

        <p class="self-center text-[16px] font-normal leading-[1.45] text-text-secondary">
          {{ overviewDescription }}
        </p>
      </div>

      <ul class="mt-16 grid gap-10 md:grid-cols-3 md:gap-14">
        <li
          v-for="service in services"
          :key="service.title"
          class="text-center"
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
    </UiContainer>
  </section>
</template>
