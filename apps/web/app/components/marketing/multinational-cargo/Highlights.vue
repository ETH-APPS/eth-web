<script setup lang="ts">
import {
  Blocks,
  Clock3,
  Headphones,
  PackageCheck,
  ShieldCheck,
} from 'lucide-vue-next'

const highlights = [
  {
    label: 'Guaranteed\nSafety',
    icon: ShieldCheck,
  },
  {
    label: '24/7\nLive Tracking',
    icon: Clock3,
  },
  {
    label: 'All-in Service',
    icon: Blocks,
  },
  {
    label: 'Door-to-door',
    icon: PackageCheck,
  },
  {
    label: 'Dedicated\nSupport',
    icon: Headphones,
  },
]
</script>

<template>
  <section
    aria-label="Multinational cargo service benefits"
    class="bg-primary-500 py-8 text-white"
  >
    <UiContainer>
      <ul class="grid grid-cols-5 gap-8">
        <li
          v-for="highlight in highlights"
          :key="highlight.label"
          class="flex flex-col items-center text-center"
        >
          <component
            :is="highlight.icon"
            :size="40"
            :stroke-width="1.8"
            aria-hidden="true"
          />

          <span class="mt-3 whitespace-pre-line text-[16px] font-semibold leading-[1.35]">
            {{ highlight.label }}
          </span>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
