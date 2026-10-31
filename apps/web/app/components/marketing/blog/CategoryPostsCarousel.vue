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
  autoplayDelay?: number
}>(), {
  viewAllTo: '#featured-blog',
  autoplayDelay: 5000,
})

const carouselViewport = ref<HTMLElement>()
const router = useRouter()
const isReady = ref(false)
let autoplayTimer: ReturnType<typeof setInterval> | undefined
let normalizeTimer: ReturnType<typeof setTimeout> | undefined

const isLooping = computed(() => props.posts.length > 4)

const sets = computed(() => (isReady.value && isLooping.value ? [0, 1, 2] : [1]))

function goToTag(tag: string) {
  router.push({
    path: '/blog/tags',
    query: { tag },
  })
}

function clearAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function getCards() {
  return Array.from(carouselViewport.value?.querySelectorAll<HTMLElement>('[data-category-card]') ?? [])
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

function startAutoplay() {
  clearAutoplay()

  if (!import.meta.client || !isLooping.value)
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
    :id="sectionId"
    :aria-labelledby="`${sectionId}-title`"
    class="bg-bg-0 py-12 sm:py-14 lg:py-16"
  >
    <UiContainer>
      <div
        class="mx-auto max-w-[1080px]"
        @mouseenter="clearAutoplay"
        @mouseleave="startAutoplay"
        @focusin="clearAutoplay"
        @focusout="startAutoplay"
      >
        <div class="flex items-center justify-between gap-5 lg:px-[58px]">
          <h2
            :id="`${sectionId}-title`"
            class="text-[28px] font-semibold text-primary-500"
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

        <div class="mt-5 space-y-4 lg:hidden">
          <NuxtLink
            v-for="post in posts.slice(0, 4)"
            :key="post.id"
            :to="post.to?.startsWith('/') ? post.to : `/blog/${post.id}`"
            class="group flex min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <div class="aspect-[16/9] overflow-hidden bg-bg-200">
              <img
                :src="post.image"
                :alt="post.imageAlt"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              >
            </div>

            <div class="flex flex-col px-2.5 pb-3 pt-2.5">
              <h3 class="line-clamp-2 text-[15px] font-normal leading-6 text-text-secondary transition-colors group-hover:text-primary-500 group-focus-visible:text-primary-500">
                {{ post.title }}
              </h3>

              <ul class="mt-3 flex flex-wrap gap-2" aria-label="Tag artikel">
                <li v-for="tag in post.tags" :key="tag">
                  <button
                    type="button"
                    class="rounded bg-bg-100 px-2 py-1 text-[12px] text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500"
                    @click.prevent.stop="goToTag(tag)"
                  >
                    {{ tag }}
                  </button>
                </li>
              </ul>

              <div class="mt-3 flex items-center justify-between gap-2">
                <time class="text-[12px] font-normal text-text-tertiary">
                  {{ post.releaseDate }}
                </time>
                <ArrowUpRight
                  :size="24"
                  :stroke-width="1.9"
                  class="shrink-0 text-primary-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="relative mt-5 hidden px-8 sm:px-10 lg:flow-root lg:px-[58px]">
          <button
            type="button"
            :aria-label="`Tampilkan artikel ${title} sebelumnya`"
            class="absolute left-0 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-500 transition-[background-color,transform] hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:left-2.5"
            @click="showPrevious"
          >
            <ChevronLeft :size="26" :stroke-width="1.8" aria-hidden="true" />
          </button>

          <div
            ref="carouselViewport"
            class="category-posts-scroll -mb-4 -mt-1.5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pt-1.5"
            @scroll="scheduleNormalize"
          >
            <template v-for="setIndex in sets" :key="setIndex">
              <NuxtLink
                v-for="post in posts"
                :key="`${setIndex}-${post.id}`"
                :to="post.to?.startsWith('/') ? post.to : `/blog/${post.id}`"
                :inert="setIndex === 1 ? undefined : true"
                data-category-card
                class="category-post-card group flex min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <div class="aspect-[16/9] overflow-hidden bg-bg-200">
                  <img
                    :src="post.image"
                    :alt="post.imageAlt"
                    class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  >
                </div>

                <div class="flex min-h-[144px] flex-1 flex-col px-2.5 pb-3 pt-2.5">
                  <h3 class="line-clamp-2 text-[16px] font-normal leading-6 text-text-secondary transition-colors group-hover:text-primary-500 group-focus-visible:text-primary-500">
                    {{ post.title }}
                  </h3>

                  <ul class="mt-3 flex flex-wrap gap-2" aria-label="Tag artikel">
                    <li
                      v-for="tag in post.tags"
                      :key="tag"
                    >
                      <button
                        type="button"
                        class="rounded bg-bg-100 px-2 py-1 text-[12px] text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500"
                        @click.prevent.stop="goToTag(tag)"
                      >
                        {{ tag }}
                      </button>
                    </li>
                  </ul>

                  <div class="mt-auto flex items-center justify-between gap-2 pt-3">
                    <time class="text-[12px] font-normal text-text-tertiary">
                      {{ post.releaseDate }}
                    </time>
                    <ArrowUpRight
                      :size="24"
                      :stroke-width="1.9"
                      class="shrink-0 text-primary-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </NuxtLink>
            </template>
          </div>

          <button
            type="button"
            :aria-label="`Tampilkan artikel ${title} berikutnya`"
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
