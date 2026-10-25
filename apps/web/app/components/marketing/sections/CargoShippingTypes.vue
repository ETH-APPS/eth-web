<script setup lang="ts">
import { ArrowUpRight, Box, Clock3, Plane, Ship } from 'lucide-vue-next'

interface CargoShippingType {
  mode: 'calculator' | 'sea' | 'air' | 'fcl' | 'lcl'
  title: string
  description: string
  eta?: string
  tags?: readonly string[]
  to: string
  linkLabel?: string
}

const props = withDefaults(defineProps<{
  title?: string
  description: string
  services: readonly CargoShippingType[]
  sectionId?: string
  variant?: 'default' | 'compact'
  surface?: 'auto' | 'plain' | 'muted'
  prominentHeader?: boolean
}>(), {
  title: 'Tipe Pengiriman Kargo',
  sectionId: 'cargo-shipping-types',
  variant: 'default',
  surface: 'auto',
  prominentHeader: false,
})

const titleId = computed(() => `${props.sectionId}-title`)

function serviceIcon(mode: CargoShippingType['mode']) {
  if (mode === 'calculator' || mode === 'lcl') return Box
  if (mode === 'sea' || mode === 'fcl') return Ship
  return Plane
}
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="py-16 sm:py-20"
    :class="surface === 'muted'
      ? 'bg-bg-100'
      : surface === 'plain'
        ? 'bg-bg-0'
        : variant === 'compact' ? 'bg-bg-0' : 'bg-bg-100'"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          :id="titleId"
          class="text-[24px] font-semibold leading-tight text-primary-500"
        >
          {{ title }}
        </h2>
        <p class="mx-auto mt-6 max-w-[850px] text-[20px] leading-[1.5] text-text-tertiary">
          {{ description }}
        </p>
      </div>

      <div
        class="mx-auto mt-8 grid gap-6"
        :class="variant === 'compact' ? 'md:grid-cols-3' : 'md:grid-cols-2'"
      >
        <article
          v-for="service in services"
          :key="service.mode"
          class="flex h-full flex-col border border-border-200 bg-bg-0"
          :class="variant === 'compact' ? 'overflow-hidden rounded-[16px]' : 'rounded-[18px] p-5'"
        >
          <div
            class="flex items-center gap-2 bg-border-200"
            :class="variant === 'compact'
              ? prominentHeader ? 'gap-4 bg-border-200 px-6 py-3' : 'bg-bg-200 px-4 py-3'
              : ''"
          >
            <span
              class="flex shrink-0 items-center justify-center bg-primary-500 text-bg-0"
              :class="prominentHeader && variant === 'compact' ? 'size-11 rounded-xl' : 'size-11 rounded-xl'"
            >
              <component
                :is="serviceIcon(service.mode)"
                :size="26"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </span>
            <h3
              class="font-semibold leading-tight"
              :class="variant === 'compact'
                ? ['text-[24px]', 'text-primary-500']
                : 'text-[24px] uppercase text-text-secondary'"
            >
              {{ service.title }}
            </h3>
          </div>

          <div
            class="flex flex-1 flex-col"
            :class="variant === 'compact' ? 'p-4' : ''"
          >
            <p
              class="text-[12px] font-normal leading-[1.55] text-text-secondary"
              :class="variant === 'compact' ? '' : 'mt-4'"
            >
              {{ service.description }}
            </p>

            <div class="mt-auto flex min-h-10 items-center justify-between gap-4 pt-5">
              <p
                v-if="service.eta"
                class="flex items-center gap-2 text-[12px] font-normal text-text-disable"
              >
                <Clock3
                  :size="16"
                  :stroke-width="1.8"
                  aria-hidden="true"
                />
                <span>{{ service.eta }}</span>
              </p>

              <p
                v-else
                class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-normal text-text-disable"
              >
                <span v-for="tag in service.tags" :key="tag">{{ tag }}</span>
              </p>

              <NuxtLink
                :to="service.to"
                class="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary-500 px-4 text-[14px] font-medium text-bg-0 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <span>{{ service.linkLabel ?? 'Pelajari' }}</span>
                <ArrowUpRight
                  :size="16"
                  :stroke-width="3"
                  aria-hidden="true"
                />
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
