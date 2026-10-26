<script setup lang="ts">
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface BlogPost {
  id: string
  title: string
  description: string
  author: string
  releaseDate: string
  tags: readonly string[]
  image: string
  imageAlt: string
  to?: string
}

const props = withDefaults(defineProps<{
  posts: readonly BlogPost[]
  autoplayDelay?: number
}>(), {
  autoplayDelay: 5000,
})

const activeIndex = ref(0)
const transitionName = ref('blog-slide-next')
let autoplayTimer: ReturnType<typeof setInterval> | undefined

const currentPost = computed(() => props.posts[activeIndex.value])

function clearAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function startAutoplay() {
  clearAutoplay()

  if (props.posts.length < 2 || !import.meta.client)
    return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  autoplayTimer = setInterval(() => {
    transitionName.value = 'blog-slide-next'
    activeIndex.value = (activeIndex.value + 1) % props.posts.length
  }, props.autoplayDelay)
}

function showPrevious() {
  if (props.posts.length < 2)
    return

  transitionName.value = 'blog-slide-previous'
  activeIndex.value = (activeIndex.value - 1 + props.posts.length) % props.posts.length
  startAutoplay()
}

function showNext() {
  if (props.posts.length < 2)
    return

  transitionName.value = 'blog-slide-next'
  activeIndex.value = (activeIndex.value + 1) % props.posts.length
  startAutoplay()
}

watch(() => props.posts.length, () => {
  if (activeIndex.value >= props.posts.length)
    activeIndex.value = 0

  startAutoplay()
})

onMounted(startAutoplay)
onBeforeUnmount(clearAutoplay)
</script>

<template>
  <section
    id="featured-blog"
    aria-label="Artikel blog pilihan"
    class="overflow-hidden bg-bg-0 py-14 sm:py-16 lg:py-20"
  >
    <UiContainer>
      <div
        v-if="currentPost"
        class="relative px-9 sm:px-11"
        @mouseenter="clearAutoplay"
        @mouseleave="startAutoplay"
        @focusin="clearAutoplay"
        @focusout="startAutoplay"
      >
        <button
          type="button"
          aria-label="Tampilkan artikel sebelumnya"
          class="absolute left-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition-[background-color,color,transform] hover:scale-105 hover:bg-primary-50 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          @click="showPrevious"
        >
          <ChevronLeft :size="25" :stroke-width="1.8" aria-hidden="true" />
        </button>

        <Transition :name="transitionName" mode="out-in">
          <article
            :key="currentPost.id"
            class="grid items-center gap-8 md:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)] lg:gap-10"
            aria-live="polite"
          >
            <div class="aspect-[16/9] overflow-hidden rounded-[18px] bg-bg-100">
              <img
                :src="currentPost.image"
                :alt="currentPost.imageAlt"
                class="size-full object-cover"
              >
            </div>

            <div class="min-w-0">
              <h1 class="text-[28px] font-semibold leading-tight text-text-secondary sm:text-[32px]">
                {{ currentPost.title }}
              </h1>

              <p class="mt-4 text-[15px] font-normal leading-[1.55] text-text-secondary sm:text-[16px]">
                {{ currentPost.description }}
              </p>

              <dl class="mt-5 space-y-2 text-[13px] text-text-secondary sm:text-[14px]">
                <div class="flex items-center gap-3">
                  <dt>Author</dt>
                  <span class="h-px w-5 bg-border-300" aria-hidden="true" />
                  <dd>{{ currentPost.author }}</dd>
                </div>
                <div class="flex items-center gap-3">
                  <dt>Release</dt>
                  <span class="h-px w-5 bg-border-300" aria-hidden="true" />
                  <dd>{{ currentPost.releaseDate }}</dd>
                </div>
              </dl>

              <div class="mt-5">
                <p class="text-[14px] text-text-secondary">
                  Tags
                </p>
                <ul class="mt-2 flex flex-wrap gap-2" aria-label="Tag artikel">
                  <li
                    v-for="tag in currentPost.tags"
                    :key="tag"
                    class="rounded-md bg-bg-100 px-2.5 py-1.5 text-[13px] text-primary-500"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </div>

              <div class="mt-8 flex justify-end">
                <NuxtLink
                  :to="currentPost.to?.startsWith('/') ? currentPost.to : `/blog/${currentPost.id}`"
                  class="inline-flex items-center gap-2 rounded-md text-[16px] font-medium text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-500"
                >
                  <span>Read more</span>
                  <ArrowUpRight :size="18" :stroke-width="2" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </article>
        </Transition>

        <button
          type="button"
          aria-label="Tampilkan artikel berikutnya"
          class="absolute right-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition-[background-color,color,transform] hover:scale-105 hover:bg-primary-50 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          @click="showNext"
        >
          <ChevronRight :size="25" :stroke-width="1.8" aria-hidden="true" />
        </button>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.blog-slide-next-enter-active,
.blog-slide-next-leave-active,
.blog-slide-previous-enter-active,
.blog-slide-previous-leave-active {
  transition: opacity 260ms ease, transform 260ms ease;
}

.blog-slide-next-enter-from,
.blog-slide-previous-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.blog-slide-next-leave-to,
.blog-slide-previous-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
