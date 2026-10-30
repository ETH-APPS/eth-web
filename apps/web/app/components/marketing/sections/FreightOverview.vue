<script setup lang="ts">
import type { Component } from 'vue'
import {
  ArrowUpRight,
  Boxes,
  ClockCheck,
  Headphones,
  Package,
  PackageSearch,
  ShieldCheck,
} from 'lucide-vue-next'

type FreightFeatureIcon = 'delivery' | 'support' | 'security' | 'shipping'

interface FreightFeature {
  icon: FreightFeatureIcon
  title: string
  description: string
}

const props = withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    subtitle: string
    description: string
    eta: string
    features: readonly FreightFeature[]
    trackingLabel: string
    trackingTo: string
    ctaLabel: string
    ctaTo: string
    sectionId?: string
  }>(),
  {
    sectionId: 'freight-overview',
  },
)

const iconComponents: Record<FreightFeatureIcon, Component> = {
  delivery: Package,
  support: Headphones,
  security: ShieldCheck,
  shipping: Boxes,
}

const titleId = computed(() => `${props.sectionId}-title`)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-0 py-10 sm:py-12"
  >
    <UiContainer>
      <div
        class="grid gap-6 rounded-[22px] border border-border-200 bg-bg-0 p-5 shadow-md md:p-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:p-12"
      >
        <div class="min-w-0">
          <p class="text-[20px] font-medium leading-tight text-text-secondary lg:truncate lg:text-[32px] lg:font-semibold">
            {{ eyebrow }}
          </p>

          <h2
            :id="titleId"
            class="mt-3 text-[32px] font-bold leading-none text-primary-500 lg:text-[60px]"
          >
            {{ title }}
          </h2>

          <p class="mt-6 text-[16px] font-medium text-text-secondary lg:text-[14px]">
            {{ subtitle }}
          </p>
        </div>

        <div class="min-w-0">
          <p class="text-[16px] text-text-secondary">
            {{ description }}
          </p>

          <p class="mt-4 flex flex-wrap items-center gap-2 text-[20px] font-medium text-primary-500 lg:flex-nowrap lg:text-[16px] lg:font-normal">
            <ClockCheck
              :size="20"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span>ETA</span>
            <span
              aria-hidden="true"
              class="h-[2px] w-6 bg-border-300"
            />
            <span>{{ eta }}</span>
          </p>
        </div>
      </div>

      <ul class="mt-5 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
        <li
          v-for="feature in features"
          :key="feature.title"
          class=" rounded-[18px] border border-border-200 bg-bg-0 p-4"
        >
          <span
            aria-hidden="true"
            class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500"
          >
            <component
              :is="iconComponents[feature.icon]"
              :size="30"
              :stroke-width="1.8"
            />
          </span>

          <h3 class="mt-3 text-[20px] font-medium leading-tight text-text-secondary lg:text-text-tertiary">
            {{ feature.title }}
          </h3>

          <p class="mt-4 text-[14px] leading-[1.45] text-text-tertiary">
            {{ feature.description }}
          </p>
        </li>
      </ul>

      <div class="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-14">
        <NuxtLink
          :to="trackingTo"
          class="inline-flex h-12 items-center gap-2 rounded-lg px-3 text-[16px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <PackageSearch
            :size="24"
            :stroke-width="1.8"
            aria-hidden="true"
          />
          <span>{{ trackingLabel }}</span>
        </NuxtLink>

        <NuxtLink
          :to="ctaTo"
          class="inline-flex h-14 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[16px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>{{ ctaLabel }}</span>
          <ArrowUpRight
            :size="20"
            :stroke-width="2"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>
