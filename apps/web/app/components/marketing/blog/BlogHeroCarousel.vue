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
    class="overflow-hidden bg-bg-0 py-4 sm:py-8 lg:py-20"
  >
    <UiContainer>
      <div
        v-if="currentPost"
        class="relative flex flex-col lg:block lg:px-11 xl:px-0"
        @mouseenter="clearAutoplay"
        @mouseleave="startAutoplay"
        @focusin="clearAutoplay"
        @focusout="startAutoplay"
      >
        <div class="order-2 mt-5 flex justify-center gap-1 lg:contents">
          <button
            type="button"
            aria-label="Tampilkan artikel sebelumnya"
            class="z-10 flex size-11 items-center justify-center rounded-full text-text-secondary transition-[background-color,color,transform] hover:scale-105 hover:bg-primary-50 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:absolute lg:left-0 lg:top-1/2 lg:size-8 lg:-translate-y-1/2 xl:-left-12"
            @click="showPrevious"
          >
            <ChevronLeft :size="25" :stroke-width="1.8" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Tampilkan artikel berikutnya"
            class="z-10 flex size-11 items-center justify-center rounded-full text-text-secondary transition-[background-color,color,transform] hover:scale-105 hover:bg-primary-50 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:absolute lg:right-0 lg:top-1/2 lg:size-8 lg:-translate-y-1/2 xl:-right-12"
            @click="showNext"
          >
            <ChevronRight :size="25" :stroke-width="1.8" aria-hidden="true" />
          </button>
        </div>

        <Transition :name="transitionName" mode="out-in">
          <article
            :key="currentPost.id"
            class="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)] lg:gap-10"
            aria-live="polite"
          >
            <div class="relative w-full overflow-hidden rounded-xl bg-bg-100 lg:rounded-[18px]">
              <img
                :src="currentPost.image"
                :alt="currentPost.imageAlt"
                class="block aspect-[16/9] w-full object-cover lg:absolute lg:inset-0 lg:size-full lg:aspect-auto"
              >
            </div>

            <div class="min-w-0">
              <h1
                :title="currentPost.title"
                class="text-[32px] font-semibold leading-tight text-text-secondary lg:truncate"
              >
                {{ currentPost.title }}
              </h1>

              <p class="mt-4 text-justify text-[16px] font-normal leading-[1.55] text-text-secondary lg:line-clamp-4 lg:min-h-[6.2em]">
                {{ currentPost.description }}
              </p>

              <div class="flex flex-col lg:block">
                <dl class="order-2 mt-4 space-y-2 text-[14px] text-text-secondary lg:mt-5">
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

                <div class="order-1 mt-5">
                  <p class="text-[14px] text-text-secondary">
                    Tags
                  </p>
                  <ul class="mt-2 flex flex-wrap gap-2" aria-label="Tag artikel">
                    <li
                      v-for="tag in currentPost.tags"
                      :key="tag"
                    >
                      <NuxtLink
                        :to="{ path: '/blog/tags', query: { tag } }"
                        class="block rounded-md bg-bg-100 px-1.5 py-0.5 text-[14px] text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500 lg:px-2.5 lg:py-1.5"
                      >
                        {{ tag }}
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
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
