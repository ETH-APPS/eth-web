<script setup lang="ts">
import type { Component } from 'vue'
import {
  Armchair,
  ArrowUpRight,
  Baby,
  Bike,
  Boxes,
  Dumbbell,
  Laptop,
  Package,
  Palette,
  PenTool,
  Shirt,
  Sparkles,
  ToyBrick,
  Wrench,
} from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  title?: string
  description: string
  categories: readonly {
    title: string
    items: readonly string[]
    note?: string
    icon?: string
  }[]
  sectionId?: string
  ctaPrompt?: string
  ctaLabel?: string
  ctaTo?: string
}>(), {
  title: 'Kategori Barang',
  sectionId: 'cargo-categories',
  ctaPrompt: 'Masih belum menemukan kategori barang Anda?',
  ctaLabel: 'Get a Quote',
  ctaTo: '#quote',
})

const titleId = computed(() => `${props.sectionId}-title`)

const categoryIcons: Record<string, Component> = {
  electronics: Laptop,
  fashion: Shirt,
  industrial: Wrench,
  automotive: Bike,
  furniture: Armchair,
  beauty: Sparkles,
  toys: ToyBrick,
  household: Boxes,
  sports: Dumbbell,
  craft: Palette,
  stationery: PenTool,
  baby: Baby,
}

function categoryIcon(icon?: string) {
  return icon ? categoryIcons[icon] ?? Package : Package
}
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-0 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          :id="titleId"
          class="text-[20px] font-semibold leading-tight text-primary-500 lg:text-[24px]"
        >
          {{ title }}
        </h2>
        <p class="mx-auto mt-6 max-w-[900px] text-[14px] font-normal leading-[1.5] text-text-tertiary lg:text-[20px]">
          {{ description }}
        </p>
      </div>

      <div class="mx-auto mt-8 max-w-[800px] columns-1 gap-6 sm:columns-2 lg:columns-3">
        <div
          v-for="(category, index) in categories"
          :key="`${category.title}-${index}`"
          class="break-inside-avoid pb-6"
        >
          <article class="overflow-hidden rounded-[18px] border border-border-200 bg-bg-0">
            <header class="flex min-h-14 items-center gap-2 bg-bg-100 px-4 py-3">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-bg-0">
                <component
                  :is="categoryIcon(category.icon)"
                  :size="17"
                  :stroke-width="1.8"
                  aria-hidden="true"
                />
              </span>
              <h3 class="text-[16px] font-semibold leading-6 text-text-secondary">
                {{ category.title }}
              </h3>
            </header>

            <div class="px-4 pb-6 pt-3">
              <ul class="space-y-2.5 text-[14px] font-normal leading-[1.35] text-text-secondary">
                <li
                  v-for="(item, itemIndex) in category.items"
                  :key="`${item}-${itemIndex}`"
                >
                  {{ item }}
                </li>
              </ul>

              <p
                v-if="category.note"
                class="mt-6 text-center text-[12px] font-normal leading-[1.45] text-text-tertiary"
              >
                {{ category.note }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <div class="mt-14 hidden text-center lg:block">
        <p class="text-[16px] text-text-tertiary">
          {{ ctaPrompt }}
        </p>
        <NuxtLink
          :to="ctaTo"
          class="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-primary-500 px-6 text-[14px] font-medium text-bg-0 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>{{ ctaLabel }}</span>
          <ArrowUpRight
            :size="17"
            :stroke-width="2"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>
