<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

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
  title?: string
  sectionId?: string
}>(), {
  autoplayDelay: 4500,
  title: 'Terpopuler',
  sectionId: 'popular-posts',
})

const carouselViewport = ref<HTMLElement>()
const isReady = ref(false)
let autoplayTimer: ReturnType<typeof setInterval> | undefined
let normalizeTimer: ReturnType<typeof setTimeout> | undefined

const isLooping = computed(() => props.posts.length > 4)

const sets = computed(() => (isReady.value && isLooping.value ? [0, 1, 2] : [1]))

function clearAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function getCards() {
  return Array.from(carouselViewport.value?.querySelectorAll<HTMLElement>('[data-popular-card]') ?? [])
}

function getScrollAmount() {
  const [firstCard, secondCard] = getCards()

  if (!firstCard || !secondCard)
    return 0

  return secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left
}

function getSetWidth() {
  const cards = getCards()
  const firstCard = cards[0]
  const firstCardOfNextSet = cards[props.posts.length]

  if (!firstCard || !firstCardOfNextSet)
    return 0

  return firstCardOfNextSet.getBoundingClientRect().left - firstCard.getBoundingClientRect().left
}

function centerCarousel() {
  const viewport = carouselViewport.value
  const setWidth = getSetWidth()

  if (!viewport || !setWidth)
    return

  viewport.scrollTo({ left: setWidth, behavior: 'instant' })
}

function normalizePosition() {
  const viewport = carouselViewport.value
  const setWidth = getSetWidth()

  if (!viewport || !setWidth)
    return

  if (viewport.scrollLeft >= setWidth * 2 - 1)
    viewport.scrollTo({ left: viewport.scrollLeft - setWidth, behavior: 'instant' })
  else if (viewport.scrollLeft < setWidth - 1)
    viewport.scrollTo({ left: viewport.scrollLeft + setWidth, behavior: 'instant' })
}

function scheduleNormalize() {
  if (!isLooping.value)
    return

  clearTimeout(normalizeTimer)
  normalizeTimer = setTimeout(normalizePosition, 150)
}

function scrollToPrevious() {
  carouselViewport.value?.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' })
}

function scrollToNext() {
  carouselViewport.value?.scrollBy({ left: getScrollAmount(), behavior: 'smooth' })
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

  if (!import.meta.client || !isLooping.value)
    return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  autoplayTimer = setInterval(scrollToNext, props.autoplayDelay)
}

onMounted(async () => {
  isReady.value = true
  await nextTick()
  centerCarousel()
  startAutoplay()
  window.addEventListener('resize', centerCarousel)
})

onBeforeUnmount(() => {
  clearAutoplay()
  clearTimeout(normalizeTimer)
  window.removeEventListener('resize', centerCarousel)
})
</script>

<template>
  <section
    :aria-labelledby="`${sectionId}-title`"
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
          :id="`${sectionId}-title`"
          class="text-[28px] font-semibold text-primary-500"
        >
          {{ title }}
        </h2>

        <div class="relative mt-5 flow-root px-8 sm:px-10 lg:px-[58px]">
          <button
            type="button"
            aria-label="Tampilkan artikel populer sebelumnya"
            class="absolute left-0 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-500 transition-[background-color,transform] hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:left-2.5"
            @click="showPrevious"
          >
            <ChevronLeft :size="26" :stroke-width="1.8" aria-hidden="true" />
          </button>

          <div
            ref="carouselViewport"
            class="popular-posts-scroll -mb-4 -mt-1.5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pt-1.5"
            @scroll="scheduleNormalize"
          >
            <template v-for="setIndex in sets" :key="setIndex">
              <MarketingBlogArticlePreviewCard
                v-for="post in posts"
                :id="post.id"
                :key="`${setIndex}-${post.id}`"
                :title="post.title"
                :release-date="post.releaseDate"
                :image="post.image"
                :image-alt="post.imageAlt"
                :to="post.to"
                :inert="setIndex === 1 ? undefined : ''"
                data-popular-card
                class="popular-post-card shrink-0 snap-start"
              />
            </template>
          </div>

          <button
            type="button"
            aria-label="Tampilkan artikel populer berikutnya"
            class="absolute right-0 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-500 transition-[background-color,transform] hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:right-2.5"
            @click="showNext"
          >
            <ChevronRight :size="26" :stroke-width="1.8" aria-hidden="true" />
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
    flex-basis: calc((100% - 16px) / 2);
  }
}

@media (min-width: 1024px) {
  .popular-post-card {
    flex-basis: calc((100% - 48px) / 4);
  }
}
</style>