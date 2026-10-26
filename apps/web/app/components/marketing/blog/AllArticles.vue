<script setup lang="ts">
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-vue-next'

interface Article {
  id: string
  title: string
  releaseDate: string
  tags: readonly string[]
  image: string
  imageAlt: string
  to?: string
}

const props = withDefaults(defineProps<{
  articles: readonly Article[]
  perPage?: number
}>(), {
  perPage: 12,
})

const searchTerm = ref('')
const selectedTags = ref<string[]>([])
const currentPage = ref(1)
const filterOpen = ref(false)
const allArticlesSection = ref<HTMLElement>()

const availableTags = computed(() => (
  [...new Set(props.articles.flatMap(article => article.tags))].sort()
))

const filteredArticles = computed(() => {
  const query = searchTerm.value.trim().toLocaleLowerCase('id-ID')

  return props.articles.filter((article) => {
    const matchesSearch = !query
      || article.title.toLocaleLowerCase('id-ID').includes(query)
      || article.tags.some(tag => tag.toLocaleLowerCase('id-ID').includes(query))

    const matchesTags = selectedTags.value.length === 0
      || selectedTags.value.every(tag => article.tags.includes(tag))

    return matchesSearch && matchesTags
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / props.perPage)))

const visibleArticles = computed(() => {
  const start = (currentPage.value - 1) * props.perPage
  return filteredArticles.value.slice(start, start + props.perPage)
})

const paginationItems = computed<(number | string)[]>(() => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7)
    return Array.from({ length: total }, (_, index) => index + 1)

  if (current <= 4)
    return [1, 2, 3, 4, 5, 'ellipsis-right', total]

  if (current >= total - 3)
    return [1, 'ellipsis-left', total - 4, total - 3, total - 2, total - 1, total]

  return [1, 'ellipsis-left', current - 1, current, current + 1, 'ellipsis-right', total]
})

function setPage(page: number) {
  const nextPage = Math.min(Math.max(page, 1), totalPages.value)

  if (nextPage === currentPage.value)
    return

  currentPage.value = nextPage

  nextTick(() => {
    allArticlesSection.value?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  })
}

function toggleTag(tag: string) {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter(selectedTag => selectedTag !== tag)
    : [...selectedTags.value, tag]
}

function clearFilters() {
  selectedTags.value = []
}

watch([searchTerm, () => selectedTags.value.join('|')], () => {
  currentPage.value = 1
})

watch(totalPages, (total) => {
  if (currentPage.value > total)
    currentPage.value = total
})
</script>

<template>
  <section
    id="all-articles"
    ref="allArticlesSection"
    aria-labelledby="all-articles-title"
    class="scroll-mt-20 bg-bg-0 py-14 sm:py-16 lg:py-20"
  >
    <UiContainer>
      <div class="mx-auto max-w-[1080px]">
        <h2
          id="all-articles-title"
          class="text-[24px] font-semibold text-primary-500 sm:text-[28px]"
        >
          All Article
        </h2>

        <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <label class="relative block w-full sm:max-w-[360px]">
            <span class="sr-only">Cari artikel</span>
            <Search
              :size="18"
              :stroke-width="1.7"
              class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
              aria-hidden="true"
            />
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Cari artikel"
              class="h-11 w-full rounded-full border border-border-200 bg-bg-0 pl-11 pr-4 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
          </label>

          <div class="relative self-end sm:self-start">
            <button
              type="button"
              :aria-expanded="filterOpen"
              aria-controls="article-filter-panel"
              class="inline-flex h-11 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              @click="filterOpen = !filterOpen"
            >
              <span>Filter Article</span>
              <span
                v-if="selectedTags.length"
                class="flex size-5 items-center justify-center rounded-full bg-primary-500 text-[10px] text-white"
              >
                {{ selectedTags.length }}
              </span>
              <SlidersHorizontal :size="18" :stroke-width="1.8" aria-hidden="true" />
            </button>

            <div
              v-if="filterOpen"
              id="article-filter-panel"
              class="absolute right-0 z-20 mt-2 w-[260px] rounded-xl border border-border-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.14)]"
            >
              <div class="flex items-center justify-between gap-4">
                <p class="text-[13px] font-semibold text-text-secondary">
                  Filter berdasarkan tag
                </p>
                <button
                  v-if="selectedTags.length"
                  type="button"
                  class="text-[11px] text-primary-500 hover:underline"
                  @click="clearFilters"
                >
                  Reset
                </button>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2">
                <label
                  v-for="tag in availableTags"
                  :key="tag"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-text-secondary hover:bg-bg-100"
                >
                  <input
                    type="checkbox"
                    :checked="selectedTags.includes(tag)"
                    class="size-3.5 accent-primary-500"
                    @change="toggleTag(tag)"
                  >
                  <span>{{ tag }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-text-tertiary">
          <span>Total of {{ filteredArticles.length }} Articles</span>
          <span class="h-px w-5 bg-border-200" aria-hidden="true" />
          <span>Newest to Oldest</span>
        </div>

        <div
          v-if="visibleArticles.length"
          class="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <NuxtLink
            v-for="article in visibleArticles"
            :key="article.id"
            :to="article.to?.startsWith('/') ? article.to : `/blog/${article.id}`"
            class="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-transparent bg-white transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-border-200 hover:shadow-[0_8px_22px_rgba(15,23,42,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <div class="aspect-[16/9] overflow-hidden bg-bg-200">
              <img
                :src="article.image"
                :alt="article.imageAlt"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
              >
            </div>

            <div class="flex min-h-[126px] flex-1 flex-col px-3 pb-3 pt-3">
              <h3 class="line-clamp-2 text-[13px] leading-[1.45] text-text-secondary transition-colors group-hover:text-primary-500">
                {{ article.title }}
              </h3>

              <ul class="mt-2.5 flex flex-wrap gap-2" aria-label="Tag artikel">
                <li
                  v-for="tag in article.tags"
                  :key="tag"
                  class="rounded bg-bg-100 px-2 py-1 text-[10px] text-primary-500"
                >
                  {{ tag }}
                </li>
              </ul>

              <div class="mt-auto flex items-end justify-between gap-2 pt-3">
                <time class="text-[10px] text-text-tertiary">
                  {{ article.releaseDate }}
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

        <div
          v-else
          class="mt-8 rounded-2xl border border-border-200 bg-bg-100 px-6 py-12 text-center"
        >
          <p class="text-[14px] font-medium text-text-secondary">
            Artikel tidak ditemukan.
          </p>
          <p class="mt-2 text-[12px] text-text-tertiary">
            Coba gunakan kata kunci atau filter yang berbeda.
          </p>
        </div>

        <nav
          v-if="filteredArticles.length > perPage"
          class="mt-12 flex items-center justify-center gap-1.5"
          aria-label="Pagination artikel"
        >
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            :disabled="currentPage === 1"
            class="flex size-8 items-center justify-center rounded-md text-primary-500 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:text-border-300"
            @click="setPage(currentPage - 1)"
          >
            <ChevronLeft :size="17" :stroke-width="1.8" aria-hidden="true" />
          </button>

          <template v-for="item in paginationItems" :key="item">
            <span
              v-if="typeof item === 'string'"
              class="flex size-8 items-center justify-center text-[12px] text-text-tertiary"
              aria-hidden="true"
            >
              …
            </span>
            <button
              v-else
              type="button"
              :aria-label="`Halaman ${item}`"
              :aria-current="currentPage === item ? 'page' : undefined"
              :class="currentPage === item
                ? 'bg-primary-50 font-medium text-primary-500'
                : 'text-text-secondary hover:bg-bg-100'"
              class="flex size-8 items-center justify-center rounded-md text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              @click="setPage(item)"
            >
              {{ item }}
            </button>
          </template>

          <button
            type="button"
            aria-label="Halaman berikutnya"
            :disabled="currentPage === totalPages"
            class="flex size-8 items-center justify-center rounded-md text-primary-500 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:text-border-300"
            @click="setPage(currentPage + 1)"
          >
            <ChevronRight :size="17" :stroke-width="1.8" aria-hidden="true" />
          </button>
        </nav>

        <div class="mt-16 text-center">
          <p class="mx-auto max-w-[680px] text-[12px] leading-relaxed text-text-tertiary">
            Temukan insight terbaru seputar ekspor, impor, dan pengiriman kargo untuk mendukung perkembangan bisnis Anda.
          </p>
          <NuxtLink
            to="/calculator"
            class="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-primary-500 px-5 text-[13px] font-medium text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <span>Get a Quote</span>
            <ArrowUpRight :size="16" :stroke-width="2" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
