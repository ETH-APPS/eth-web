<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'

interface PromoItem {
  id: string
  image: string
  imageAlt: string
  period: string
  remainingLabel: string
  title: string
  status: string
  description: string
  inactive?: boolean
  termsLabel?: string
  termsTo?: string
}

withDefaults(defineProps<{
  year?: string
  activePromos: readonly PromoItem[]
  inactivePromos?: readonly PromoItem[]
  activeTotal?: number
  inactiveTotal?: number
}>(), {
  year: '2026',
  inactivePromos: () => [],
  activeTotal: undefined,
  inactiveTotal: undefined,
})

const emit = defineEmits<{
  select: [promo: PromoItem]
}>()
</script>

<template>
  <section class="bg-bg-0 py-12">
    <UiContainer>
      <div class="flex items-center justify-between gap-6">
        <h2 class="text-[32px] font-semibold text-primary-500">
          {{ year }} PROMOS
        </h2>
        <p class="text-[20px] text-text-tertiary">
          Total {{ activeTotal ?? activePromos.length }} Promos
        </p>
      </div>

      <div
        v-if="activePromos.length"
        class="mt-5 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 lg:px-16"
      >
        <article
          v-for="promo in activePromos"
          :key="promo.id"
          class="min-w-0"
        >
          <button
            type="button"
            class="group block w-full rounded-[14px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
            :aria-label="`Lihat detail ${promo.title}`"
            @click="emit('select', promo)"
          >
            <div class="aspect-[1.06/1] overflow-hidden rounded-[14px] bg-bg-100">
              <img
                :src="promo.image"
                :alt="promo.imageAlt"
                loading="lazy"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              >
            </div>

            <div class="mt-3 flex items-center justify-between gap-4">
              <div class="flex min-w-0 items-center gap-2 text-[20px] font-medium text-text-tertiary">
                <CalendarDays :size="16" :stroke-width="1.8" aria-hidden="true" />
                <span aria-hidden="true">—</span>
                <span class="truncate">{{ promo.period }}</span>
              </div>
              <span class="shrink-0 text-[16px] font-medium text-primary-500">
                {{ promo.remainingLabel }}
              </span>
            </div>
          </button>
        </article>
      </div>

      <template v-if="inactivePromos.length">
        <div
          class="flex items-center justify-between gap-6 lg:px-16"
          :class="activePromos.length ? 'mt-10 sm:mt-12' : 'mt-5'"
        >
          <h3 class="text-base font-medium text-text-tertiary sm:text-lg">
            Inactive
          </h3>
          <p class="text-sm text-text-tertiary sm:text-base">
            Total {{ inactiveTotal ?? inactivePromos.length }} Inactive Promos
          </p>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 lg:px-16">
          <article
            v-for="promo in inactivePromos"
            :key="promo.id"
            class="min-w-0"
          >
            <button
              type="button"
              class="group block w-full rounded-[14px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
              :aria-label="`Lihat detail ${promo.title}`"
              @click="emit('select', promo)"
            >
              <div class="aspect-[1.06/1] overflow-hidden rounded-[14px] bg-bg-100">
                <img
                  :src="promo.image"
                  :alt="promo.imageAlt"
                  loading="lazy"
                  class="size-full object-cover grayscale transition-transform duration-300 group-hover:scale-[1.02]"
                >
              </div>

              <div class="mt-3 flex items-center justify-between gap-4">
                <div class="flex min-w-0 items-center gap-2 text-[20px] font-medium text-primary-500">
                  <CalendarDays :size="16" :stroke-width="1.8" aria-hidden="true" />
                  <span aria-hidden="true">—</span>
                  <span class="truncate">{{ promo.period }}</span>
                </div>
                <span class="shrink-0 text-[16px] font-medium uppercase text-text-tertiary">
                  {{ promo.remainingLabel }}
                </span>
              </div>
            </button>
          </article>
        </div>
      </template>
    </UiContainer>
  </section>
</template>