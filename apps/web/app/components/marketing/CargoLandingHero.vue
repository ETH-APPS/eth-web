<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowUpRight, Cuboid, PackageSearch } from 'lucide-vue-next'

interface HeroHighlight {
  label: string
  icon: Component
}

defineProps<{
  titleId: string
  eyebrow: string
  title: string
  description: string
  serviceLabel: string
  services: readonly string[]
  trackingLabel: string
  quoteLabel: string
  image: string
  imageAlt: string
  highlights: readonly HeroHighlight[]
  highlightsAriaLabel: string
}>()
</script>

<template>
  <section
    :aria-labelledby="titleId"
    class="flex min-h-[calc(100svh-70px)] flex-col"
  >
    <div class="flex flex-1 items-center bg-bg-0 py-12">
      <UiContainer>
        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_520px]">
          <div>
            <p class="text-[15px] font-normal uppercase text-primary-700 lg:text-[20px]">
              {{ eyebrow }}
            </p>

            <h1
              :id="titleId"
              class="mt-2 whitespace-pre-line text-[32px] font-semibold leading-[1.2] tracking-[0.01em] text-primary-500 lg:text-[48px]"
            >
              {{ title }}
            </h1>

            <p class="mt-6 max-w-[500px] text-[16px] leading-[1.55] text-text-secondary">
              {{ description }}
            </p>

            <p class="mt-3 text-center text-[16px] text-text-tertiary lg:text-start">
              {{ serviceLabel }}
            </p>

            <ul class="mx-auto mt-6 grid max-w-[470px] grid-cols-[auto_auto] justify-center justify-items-center gap-x-14 gap-y-6 lg:mx-0 lg:grid-cols-3 lg:justify-normal lg:justify-items-stretch lg:gap-6">
              <li
                v-for="service in services"
                :key="service"
                class="flex items-center gap-2.5 text-[14px] font-medium text-text-secondary last:odd:col-span-2 lg:text-[15px] lg:last:odd:col-auto"
              >
                <Cuboid
                  :size="22"
                  :stroke-width="1.8"
                  aria-hidden="true"
                  class="shrink-0 text-primary-500"
                />
                <span>{{ service }}</span>
              </li>
            </ul>

            <div class="mx-auto mt-8 flex max-w-[490px] flex-col items-center gap-5 lg:mx-0 lg:flex-row lg:justify-between">
              <NuxtLink
                to="/#main-services"
                class="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:min-h-0"
              >
                <span>{{ trackingLabel }}</span>
                <PackageSearch
                  :size="19"
                  :stroke-width="1.8"
                  aria-hidden="true"
                />
              </NuxtLink>

              <NuxtLink
                to="#quote"
                class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-[16px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:w-auto lg:justify-normal"
              >
                <span>{{ quoteLabel }}</span>
                <ArrowUpRight
                  :size="19"
                  :stroke-width="2"
                  aria-hidden="true"
                />
              </NuxtLink>
            </div>
          </div>

          <img
            :src="image"
            width="520"
            height="430"
            :alt="imageAlt"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            class="aspect-[4/3] h-auto w-full rounded-[20px] object-cover object-center shadow-md lg:aspect-auto lg:h-[430px]"
          >
        </div>
      </UiContainer>
    </div>

    <div class="bg-primary-500 py-10 text-white">
      <div class="hero-highlights-marquee overflow-hidden lg:hidden">
        <div class="hero-highlights-track flex w-max">
          <ul
            v-for="copy in 2"
            :key="copy"
            :aria-label="copy === 1 ? highlightsAriaLabel : undefined"
            :aria-hidden="copy === 2 ? 'true' : undefined"
            class="flex shrink-0 items-start gap-8 pr-8"
          >
            <li
              v-for="highlight in highlights"
              :key="highlight.label"
              class="flex w-[180px] shrink-0 flex-col items-center text-center"
            >
              <component
                :is="highlight.icon"
                :size="48"
                :stroke-width="1.8"
                aria-hidden="true"
              />
              <span class="mt-4 whitespace-pre-line text-[20px] font-semibold leading-[1.35]">
                {{ highlight.label }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <UiContainer class="hidden lg:block">
        <ul
          :aria-label="highlightsAriaLabel"
          class="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-5 lg:gap-8"
        >
          <li
            v-for="highlight in highlights"
            :key="highlight.label"
            class="flex flex-col items-center text-center last:col-span-2 lg:last:col-auto"
          >
            <component
              :is="highlight.icon"
              :size="48"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span class="mt-4 whitespace-pre-line text-[18px] font-semibold leading-[1.35]">
              {{ highlight.label }}
            </span>
          </li>
        </ul>
      </UiContainer>
    </div>
  </section>
</template>

<style scoped>
.hero-highlights-track {
  animation: hero-highlights-scroll 32s linear infinite;
}

.hero-highlights-marquee:hover .hero-highlights-track {
  animation-play-state: paused;
}

@keyframes hero-highlights-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-highlights-marquee {
    overflow-x: auto;
  }

  .hero-highlights-track {
    animation: none;
  }

  .hero-highlights-track ul[aria-hidden="true"] {
    display: none;
  }
}
</style>
