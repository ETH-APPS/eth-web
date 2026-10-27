<script setup lang="ts">
import {
  ArrowUpRight,
  BadgeInfo,
  BookOpenText,
  ScrollText,
} from 'lucide-vue-next'

const sections = [
  {
    id: 'about-eth-cargo-title',
    title: 'About ETH Cargo',
    items: [
      {
        to: '/about-us',
        label: 'About Us',
        icon: BadgeInfo,
        description: 'Kenali ETH Cargo dan komitmen kami dalam mendukung kebutuhan logistik bisnis Anda.',
      },
      {
        to: '/faq',
        label: 'FAQ',
        icon: BookOpenText,
        description: 'Temukan jawaban atas pertanyaan umum seputar layanan dan proses pengiriman.',
      },
    ],
  },
  {
    id: 'legalities-title',
    title: 'Legalities',
    items: [
      {
        to: '/terms-and-conditions',
        label: 'Syarat & Ketentuan',
        icon: ScrollText,
        description: 'Pelajari ketentuan penggunaan layanan dan informasi legal ETH Cargo.',
      },
    ],
  },
]
</script>

<template>
  <UiContainer class="grid grid-cols-2 gap-16 py-10 text-text-secondary">
    <section
      v-for="section in sections"
      :key="section.id"
      :aria-labelledby="section.id"
    >
      <p :id="section.id" class="mb-5 text-xs font-medium text-text-tertiary">
        {{ section.title }}
      </p>

      <div class="space-y-5">
        <NuxtLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white"
          >
            <component :is="item.icon" :size="20" aria-hidden="true" />
          </span>

          <span>
            <span
              class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500"
            >
              {{ item.label }}
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              {{ item.description }}
            </span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </UiContainer>
</template>