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

const inactivePromoListRef = ref<HTMLElement | null>(null)
const inactivePromoProgress = ref(0)
let inactivePromoFrame: number | undefined

function updateInactivePromoProgress() {
  const list = inactivePromoListRef.value

  if (!list)
    return

  const maxScroll = list.scrollWidth - list.clientWidth
  inactivePromoProgress.value = maxScroll > 0
    ? Math.min(Math.max(list.scrollLeft / maxScroll, 0), 1)
    : 0
}

function handleInactivePromoScroll() {
  if (inactivePromoFrame !== undefined)
    cancelAnimationFrame(inactivePromoFrame)

  inactivePromoFrame = requestAnimationFrame(updateInactivePromoProgress)
}

onMounted(() => {
  updateInactivePromoProgress()
})

onBeforeUnmount(() => {
  if (inactivePromoFrame !== undefined)
    cancelAnimationFrame(inactivePromoFrame)
})
</script>

<template>
  <section class="bg-bg-0 py-12">
    <UiContainer>
      <div class="flex flex-col items-center gap-1 text-center lg:flex-row lg:justify-between lg:gap-6 lg:text-left">
        <h2 class="text-[22px] font-bold text-primary-500 lg:text-[32px] lg:font-semibold">
          {{ year }} PROMOS
        </h2>
        <p class="text-[16px] font-normal text-text-tertiary lg:text-[20px]">
          Total {{ activeTotal ?? activePromos.length }} Promos
        </p>
      </div>

      <div
        v-if="activePromos.length"
        class="mt-5 grid grid-cols-1 gap-x-5 gap-y-7 lg:grid-cols-3 lg:px-16"
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
            <div class="mx-2 aspect-[1.06/1] overflow-hidden rounded-[14px] bg-bg-100 lg:mx-0">
              <img
                :src="promo.image"
                :alt="promo.imageAlt"
                loading="lazy"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              >
            </div>

            <div class="mt-3 flex items-center justify-between gap-4 px-2 lg:px-0">
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
          class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:flex-nowrap lg:justify-between lg:gap-6 lg:px-16"
          :class="activePromos.length ? 'mt-10 sm:mt-12' : 'mt-5'"
        >
          <h3 class="text-[20px] font-medium text-text-tertiary lg:text-lg">
            Inactive
          </h3>
          <p class="text-[16px] text-text-tertiary">
            Total {{ inactiveTotal ?? inactivePromos.length }} Inactive Promos
          </p>
        </div>

        <div
          ref="inactivePromoListRef"
          class="-mx-4 mt-5 flex gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 snap-x snap-mandatory [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-5 lg:gap-y-7 lg:overflow-visible lg:px-16 lg:pb-0 lg:snap-none [&::-webkit-scrollbar]:hidden"
          aria-label="Promo tidak aktif, geser untuk melihat promo lainnya"
          @scroll.passive="handleInactivePromoScroll"
        >
          <article
            v-for="promo in inactivePromos"
            :key="promo.id"
            class="min-w-0 w-[90%] max-w-[320px] shrink-0 snap-start lg:w-auto lg:max-w-none lg:snap-none"
          >
            <button
              type="button"
              class="group block w-full rounded-[14px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
              :aria-label="`Lihat detail ${promo.title}`"
              @click="emit('select', promo)"
            >
              <div class="mx-2 aspect-[1.06/1] overflow-hidden rounded-[14px] bg-bg-100 lg:mx-0">
                <img
                  :src="promo.image"
                  :alt="promo.imageAlt"
                  loading="lazy"
                  class="size-full object-cover grayscale transition-transform duration-300 group-hover:scale-[1.02]"
                >
              </div>

              <div class="mt-3 flex items-center justify-between gap-4 px-2 lg:px-0">
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

        <div class="mt-1 flex justify-center lg:hidden" aria-hidden="true">
          <div class="h-1.5 w-14 overflow-hidden rounded-full bg-primary-50">
            <div
              class="h-full w-1/2 rounded-full bg-primary-500"
              :style="{ transform: `translateX(${inactivePromoProgress * 100}%)` }"
            />
          </div>
        </div>
      </template>
    </UiContainer>
  </section>
</template>
