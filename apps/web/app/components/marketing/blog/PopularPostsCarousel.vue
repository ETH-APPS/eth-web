<script setup lang="ts">
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface PopularPost {
  id: string
  title: string
  releaseDate: string
  image: string
  imageAlt: string
  to?: string
}

const props = withDefaults(defineProps<{
  posts: readonly PopularPost[]
  autoplayDelay?: number
}>(), {
  autoplayDelay: 4500,
})

const carouselViewport = ref<HTMLElement>()
let autoplayTimer: ReturnType<typeof setInterval> | undefined

function clearAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function getScrollAmount() {
  const viewport = carouselViewport.value
  const firstCard = viewport?.querySelector<HTMLElement>('[data-popular-card]')

  if (!viewport || !firstCard)
    return 0

  const gap = Number.parseFloat(getComputedStyle(viewport).columnGap || '0')
  return firstCard.offsetWidth + gap
}

function scrollToPrevious() {
  const viewport = carouselViewport.value

  if (!viewport)
    return

  const amount = getScrollAmount()
  const isAtStart = viewport.scrollLeft <= 2

  viewport.scrollTo({
    left: isAtStart ? viewport.scrollWidth - viewport.clientWidth : viewport.scrollLeft - amount,
    behavior: 'smooth',
  })
}

function scrollToNext() {
  const viewport = carouselViewport.value

  if (!viewport)
    return

  const amount = getScrollAmount()
  const isAtEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2

  viewport.scrollTo({
    left: isAtEnd ? 0 : viewport.scrollLeft + amount,
    behavior: 'smooth',
  })
}

function restartAutoplay() {
  startAutoplay()
}

function showPrevious() {
  scrollToPrevious()
  restartAutoplay()
}

function showNext() {
  scrollToNext()
  restartAutoplay()
}

function startAutoplay() {
  clearAutoplay()

  if (!import.meta.client || props.posts.length < 2)
    return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  autoplayTimer = setInterval(scrollToNext, props.autoplayDelay)
}

onMounted(startAutoplay)
onBeforeUnmount(clearAutoplay)
</script>

<template>
  <section
    aria-labelledby="popular-posts-title"
    class="bg-bg-100 py-10 sm:py-12 lg:py-14"
  >
    <UiContainer>
      <div
        class="mx-auto max-w-[1080px]"
        @mouseenter="clearAutoplay"
        @mouseleave="startAutoplay"
        @focusin="clearAutoplay"
        @focusout="startAutoplay"
      >
        <h2
          id="popular-posts-title"
          class="text-[20px] font-semibold text-primary-500 sm:text-[22px]"
        >
          Terpopuler
        </h2>

        <div class="relative mt-5 px-8 sm:px-10">
          <button
            type="button"
            aria-label="Tampilkan artikel populer sebelumnya"
            class="absolute left-0 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-500 transition-[background-color,transform] hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            @click="showPrevious"
          >
            <ChevronLeft :size="20" :stroke-width="1.8" aria-hidden="true" />
          </button>

          <div
            ref="carouselViewport"
            class="popular-posts-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
          >
            <NuxtLink
              v-for="post in posts"
              :key="post.id"
              :to="post.to?.startsWith('/') ? post.to : `/blog/${post.id}`"
              data-popular-card
              class="popular-post-card group flex min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <div class="aspect-[16/9] overflow-hidden bg-bg-200">
                <img
                  :src="post.image"
                  :alt="post.imageAlt"
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                >
              </div>

              <div class="flex min-h-[114px] flex-1 flex-col px-3 pb-3 pt-2.5">
                <h3 class="line-clamp-2 text-[13px] font-normal leading-[1.35] text-text-secondary transition-colors group-hover:text-primary-500">
                  {{ post.title }}
                </h3>

                <div class="mt-auto flex items-end justify-between gap-2 pt-3">
                  <time class="text-[10px] text-text-tertiary">
                    {{ post.releaseDate }}
                  </time>
                  <ArrowUpRight
                    :size="15"
                    :stroke-width="1.9"
                    class="shrink-0 text-primary-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </NuxtLink>
          </div>

          <button
            type="button"
            aria-label="Tampilkan artikel populer berikutnya"
            class="absolute right-0 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-500 transition-[background-color,transform] hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            @click="showNext"
          >
            <ChevronRight :size="20" :stroke-width="1.8" aria-hidden="true" />
          </button>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.popular-posts-scroll {
  scrollbar-width: none;
}

.popular-posts-scroll::-webkit-scrollbar {
  display: none;
}

.popular-post-card {
  flex-basis: 100%;
}

@media (min-width: 640px) {
  .popular-post-card {
    flex-basis: calc((100% - 12px) / 2);
  }
}

@media (min-width: 1024px) {
  .popular-post-card {
    flex-basis: calc((100% - 36px) / 4);
  }
}
</style>
