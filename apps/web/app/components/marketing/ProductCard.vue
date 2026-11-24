<script setup lang="ts">
import { ArrowUpRight, PackageSearch } from 'lucide-vue-next'
import { productWhatsappUrl } from '~/constants/whatsapp'
import type { ProductSource } from '../../../shared/types/products'

const props = defineProps<{
  title: string
  priceIdr: number | null
  image: string
  detailUrl: string
  source: ProductSource
}>()

const imageFailed = ref(false)
const formattedPrice = computed(() => props.priceIdr === null
  ? 'Harga tidak tersedia'
  : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(props.priceIdr))
const consultationUrl = computed(() => productWhatsappUrl(props))
</script>

<template>
  <article class="min-w-0">
    <a
      :href="consultationUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Konsultasi impor ${title} via WhatsApp ETH Cargo`"
      class="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
    >
      <div class="aspect-square overflow-hidden rounded-2xl bg-primary-50">
        <img
          v-if="!imageFailed"
          :src="image"
          :alt="title"
          width="320"
          height="320"
          loading="lazy"
          referrerpolicy="no-referrer"
          class="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          @error="imageFailed = true"
        >
        <div v-else class="flex size-full items-center justify-center text-primary-300">
          <PackageSearch :size="44" aria-hidden="true" />
        </div>
      </div>
      <h3 class="mt-3 line-clamp-2 min-h-[2.8em] px-1 text-[13px] leading-[1.4] text-text-secondary lg:text-[14px]">
        {{ title }}
      </h3>
      <div class="mt-2 flex items-center justify-between gap-2 px-1 text-primary-500">
        <p class="min-w-0 text-[13px] font-semibold lg:text-[15px]">{{ formattedPrice }}</p>
        <ArrowUpRight :size="20" class="shrink-0" aria-hidden="true" />
      </div>
    </a>
  </article>
</template>
