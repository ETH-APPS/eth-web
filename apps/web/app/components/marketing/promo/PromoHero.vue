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
  <section class="bg-bg-0 py-14 sm:py-16 lg:py-20">
    <UiContainer>
      <header class="mx-auto max-w-[800px] text-center">
        <p class="text-xl text-primary-700">
          {{ eyebrow }}
        </p>
        <h1 class="mt-2 text-[48px] font-semibold leading-tight text-primary-500 sm:text-[40px]">
          {{ title }} 
        </h1>
        <p
          v-if="description"
          class="mt-5 text-xl leading-relaxed text-text-secondary sm:text-lg"
        >
          {{ description }}
        </p>
      </header>

      <div class="mt-10 space-y-6 sm:mt-12">
        <article
          v-for="promo in promos"
          :key="promo.id"
          class="grid overflow-hidden rounded-[20px] border border-border-200 bg-bg-0 shadow-[0_10px_24px_rgba(16,24,40,0.10)] md:grid-cols-[320px_minmax(0,1fr)]"
        >
          <div class="h-full overflow-hidden rounded-3xl bg-bg-100">
            <img
              :src="promo.image"
              :alt="promo.imageAlt"
              class="size-full object-cover"
            >
          </div>

          <div class="flex min-h-[300px] flex-col p-6 sm:p-8">
            <h2 class="text-2xl font-semibold text-text-secondary sm:text-2xl">
              {{ promo.title }}
            </h2>

            <div class="mt-2 flex items-center gap-3 text-xl">
              <span class="text-text-tertiary">Status</span>
              <span class="h-px w-6 bg-border-300" aria-hidden="true" />
              <span class="font-medium text-emerald-500">{{ promo.status }}</span>
            </div>

            <p class="mt-7 text-[22px] text-text-tertiary">
              {{ promo.description }}
            </p>

            <NuxtLink
              :to="promo.termsTo || '/terms-and-conditions'"
              class="mt-10 inline-flex self-start items-center gap-2 rounded-md text-sm font-medium text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 md:self-end"
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
