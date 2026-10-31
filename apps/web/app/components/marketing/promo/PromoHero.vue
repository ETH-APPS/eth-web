<script setup lang="ts">
import { FileText } from 'lucide-vue-next'

export interface PromoItem {
  id: string
  title: string
  status: string
  description: string
  image: string
  imageAlt: string
  termsLabel?: string
  termsTo?: string
}

withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  promos: readonly PromoItem[]
}>(), {
  eyebrow: 'PROMO',
  title: 'OUR PROMO',
  description: '',
})
</script>

<template>
  <section class="bg-bg-0 py-6 sm:py-8 lg:py-20">
    <UiContainer>
      <header class="mx-auto hidden max-w-[800px] text-center lg:block">
        <p class="text-[20px] font-normal text-primary-700">
          {{ eyebrow }}
        </p>
        <h1 class="mt-2 text-[48px] font-semibold leading-tight text-primary-500">
          {{ title }} 
        </h1>
        <p
          v-if="description"
          class="mt-5 text-[20px] font-normal leading-[1.4] text-text-secondary"
        >
          {{ description }}
        </p>
      </header>

      <div class="space-y-6 lg:mt-12">
        <article
          v-for="promo in promos"
          :key="promo.id"
          class="grid overflow-hidden rounded-[20px] border border-border-200 bg-bg-0 shadow-[0_10px_24px_rgba(16,24,40,0.10)] lg:grid-cols-[320px_minmax(0,1fr)]"
        >
          <div class="mx-2 aspect-[1.06/1] overflow-hidden rounded-3xl bg-bg-100 lg:mx-0 lg:aspect-auto lg:h-full">
            <img
              :src="promo.image"
              :alt="promo.imageAlt"
              class="size-full object-cover"
            >
          </div>

          <div class="flex min-h-0 flex-col p-6 sm:p-8 lg:min-h-[300px]">
            <h2 class="text-[20px] font-semibold text-text-secondary lg:text-2xl">
              {{ promo.title }}
            </h2>

            <div class="mt-2 flex items-center gap-3 text-[16px] font-medium lg:text-xl lg:font-normal">
              <span class="text-text-tertiary">Status</span>
              <span class="h-px w-6 bg-border-300" aria-hidden="true" />
              <span class="font-medium text-emerald-500">{{ promo.status }}</span>
            </div>

            <p class="mt-4 text-[14px] font-normal text-text-tertiary lg:mt-7 lg:text-[22px]">
              {{ promo.description }}
            </p>

            <NuxtLink
              :to="promo.termsTo || '/terms-and-conditions'"
              class="mt-6 inline-flex min-h-11 self-end items-center gap-2 rounded-md text-sm font-medium text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 lg:mt-10 lg:min-h-0"
            >
              {{ promo.termsLabel || 'Terms & Conditions' }}
              <FileText :size="17" :stroke-width="1.8" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
