<script setup lang="ts">
import { ArrowUpRight, PackageSearch } from 'lucide-vue-next'
import { productWhatsappUrl } from '~/constants/whatsapp'
import type { ProductSource } from '../../../shared/types/products'

const props = withDefaults(defineProps<{
  title: string
  priceIdr: number | null
  soldCount?: number | null
  image: string
  detailUrl: string
  source: ProductSource
  loadImage?: boolean
}>(), {
  loadImage: true,
})

const imageFailed = ref(false)
const optimizedImageFailed = ref(false)
const imageRequested = ref(props.loadImage)

const imageSrcset = computed(() => {
  if (!imageRequested.value || optimizedImageFailed.value)
    return undefined

  let url: URL
  try {
    url = new URL(props.image)
  }
  catch {
    return undefined
  }

  if (
    url.protocol !== 'https:'
    || !url.hostname.endsWith('.alicdn.com')
    || !/^\/img\/ibank\/[^/]+\.(?:jpe?g|png)$/i.test(url.pathname)
    || url.search
    || url.hash
  ) return undefined

  return [240, 320, 360, 480, 640, 800, 960, 1200]
    .map(width => `${url.href}_${width}x${width}q75.jpg_.webp ${width}w`)
    .join(', ')
})

// Lazy images use the rendered slot in browsers that support sizes="auto".
const imageSizes = 'auto, (min-width: 80rem) 206px, (min-width: 64rem) min(219px, calc((100vw - 454px) / 3)), (min-width: 48rem) calc((100vw - 48px) / 2), calc((100vw - 44px) / 2)'

watch([() => props.image, () => props.loadImage], ([image, loadImage], [previousImage]) => {
  if (image !== previousImage) {
    imageFailed.value = false
    optimizedImageFailed.value = false
    imageRequested.value = loadImage
  }
  else if (loadImage) {
    // Keep the source after collapse so the closing animation retains its image.
    imageRequested.value = true
  }
})

function handleImageError() {
  if (!imageRequested.value) return

  if (imageSrcset.value)
    optimizedImageFailed.value = true
  else
    imageFailed.value = true
}
const formattedPrice = computed(() => props.priceIdr === null
  ? 'Harga tidak tersedia'
  : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(props.priceIdr))
const formattedSoldCount = computed(() => props.soldCount == null
  ? 'Jumlah terjual belum tersedia'
  : `Terjual ${new Intl.NumberFormat('id-ID').format(props.soldCount)}`)
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
        <picture v-if="!imageFailed" class="block size-full">
          <source v-if="imageSrcset" type="image/webp" :srcset="imageSrcset" :sizes="imageSizes">
          <img
            :src="imageRequested ? image : undefined"
            :alt="title"
            width="320"
            height="320"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            class="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
            @error="handleImageError"
          >
        </picture>
        <div v-else class="flex size-full items-center justify-center text-primary-300">
          <PackageSearch :size="44" aria-hidden="true" />
        </div>
      </div>
      <h3 class="mt-3 line-clamp-2 min-h-[2.8em] px-1 text-[13px] leading-[1.4] text-text-secondary lg:text-[14px]">
        {{ title }}
      </h3>
      <div class="mt-2 flex items-center justify-between gap-2 px-1 text-primary-500">
        <p class="min-w-0 text-[13px] font-semibold lg:text-[15px]">{{ soldCount === undefined ? formattedPrice : formattedSoldCount }}</p>
        <ArrowUpRight :size="20" class="shrink-0" aria-hidden="true" />
      </div>
    </a>
  </article>
</template>
