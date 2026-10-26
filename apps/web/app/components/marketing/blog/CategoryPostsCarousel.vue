<script setup lang="ts">
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface CategoryPost {
  id: string
  title: string
  releaseDate: string
  tags: readonly string[]
  image: string
  imageAlt: string
  to?: string
}

const props = withDefaults(defineProps<{
  sectionId: string
  title: string
  posts: readonly CategoryPost[]
  viewAllTo?: string
  tone?: 'plain' | 'soft'
  autoplayDelay?: number
}>(), {
  viewAllTo: '#featured-blog',
  tone: 'plain',
  autoplayDelay: 5000,
})

const carouselViewport = ref<HTMLElement>()
let autoplayTimer: ReturnType<typeof setInterval> | undefined

const sectionClass = computed(() => (
  props.tone === 'soft' ? 'bg-[#F5F6F8]' : 'bg-bg-0'
))

function clearAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function getScrollAmount() {
  const viewport = carouselViewport.value
  const firstCard = viewport?.querySelector<HTMLElement>('[data-category-card]')

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

function startAutoplay() {
  clearAutoplay()

  if (!import.meta.client || props.posts.length < 2)
    return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  autoplayTimer = setInterval(scrollToNext, props.autoplayDelay)
}

function showPrevious() {
  scrollToPrevious()
  startAutoplay()
}

function showNext() {
  scrollToNext()
  startAutoplay()
}

onMounted(startAutoplay)
onBeforeUnmount(clearAutoplay)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="`${sectionId}-title`"
    :class="sectionClass"
    class="py-12 sm:py-14 lg:py-16"
  >
    <UiContainer>
      <div
        class="mx-auto max-w-[1080px]"
        @mouseenter="clearAutoplay"
        @mouseleave="startAutoplay"
        @focusin="clearAutoplay"
        @focusout="startAutoplay"
      >
        <div class="flex items-center justify-between gap-5 px-8 sm:px-10">
          <h2
            :id="`${sectionId}-title`"
            class="text-[24px] font-semibold text-primary-500 sm:text-[28px]"
          >
            {{ title }}
          </h2>

          <NuxtLink
            :to="viewAllTo"
            class="inline-flex shrink-0 items-center gap-2 text-[13px] font-medium text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-500"
          >
            <span>View All</span>
            <ArrowRight :size="16" :stroke-width="1.8" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div class="relative mt-6 px-8 sm:px-10">
          <button
            type="button"
            :aria-label="`Tampilkan artikel ${title} sebelumnya`"
            class="absolute left-0 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-500 transition-[background-color,transform] hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            @click="showPrevious"
          >
            <ChevronLeft :size="21" :stroke-width="1.8" aria-hidden="true" />
          </button>

          <div
            ref="carouselViewport"
            class="category-posts-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
          >
            <NuxtLink
              v-for="post in posts"
              :key="post.id"
              :to="post.to?.startsWith('/') ? post.to : `/blog/${post.id}`"
              data-category-card
              class="category-post-card group flex min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-transparent bg-white shadow-[0_2px_7px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-border-200 hover:shadow-[0_8px_20px_rgba(15,23,42,0.11)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <div class="aspect-[16/9] overflow-hidden bg-bg-200">
                <img
                  :src="post.image"
                  :alt="post.imageAlt"
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                >
              </div>

              <div class="flex min-h-[142px] flex-1 flex-col px-3 pb-3 pt-3">
                <h3 class="line-clamp-2 text-[14px] font-normal leading-[1.45] text-text-secondary transition-colors group-hover:text-primary-500">
                  {{ post.title }}
                </h3>

                <ul class="mt-3 flex flex-wrap gap-2" aria-label="Tag artikel">
                  <li
                    v-for="tag in post.tags"
                    :key="tag"
                    class="rounded bg-bg-100 px-2 py-1 text-[10px] text-primary-500"
                  >
                    {{ tag }}
                  </li>
                </ul>

                <div class="mt-auto flex items-end justify-between gap-2 pt-3">
                  <time class="text-[10px] text-text-tertiary">
                    {{ post.releaseDate }}
                  </time>
                  <ArrowUpRight
                    :size="16"
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
            :aria-label="`Tampilkan artikel ${title} berikutnya`"
            class="absolute right-0 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-500 transition-[background-color,transform] hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            @click="showNext"
          >
            <ChevronRight :size="21" :stroke-width="1.8" aria-hidden="true" />
          </button>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.category-posts-scroll {
  scrollbar-width: none;
}

.category-posts-scroll::-webkit-scrollbar {
  display: none;
}

.category-post-card {
  flex-basis: 100%;
}

@media (min-width: 640px) {
  .category-post-card {
    flex-basis: calc((100% - 16px) / 2);
  }
}

@media (min-width: 1024px) {
  .category-post-card {
    flex-basis: calc((100% - 48px) / 4);
  }
}
</style>
