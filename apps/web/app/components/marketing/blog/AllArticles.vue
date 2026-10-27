<script setup lang="ts">
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Funnel, Search, Tags } from 'lucide-vue-next'

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
  variant?: 'directory' | 'search-results' | 'tag-results'
  initialSearch?: string
  initialTag?: string
}>(), {
  perPage: 12,
  variant: 'directory',
  initialSearch: '',
  initialTag: '',
})

type SortOption = 'newest' | 'oldest' | 'az' | 'za'

const sortOptions: { value: SortOption, label: string }[] = [
  { value: 'newest', label: 'Newest to Oldest' },
  { value: 'oldest', label: 'Oldest to Newest' },
  { value: 'az', label: 'A to Z' },
  { value: 'za', label: 'Z to A' },
]

const router = useRouter()
const searchTerm = ref(props.initialSearch)
const selectedTags = ref<string[]>([])
const currentPage = ref(1)
const filterOpen = ref(false)
const tagOpen = ref(false)
const appliedSort = ref<SortOption>('newest')
const pendingSort = ref<SortOption>('newest')
const appliedTag = ref(props.initialTag)
const pendingTag = ref(props.initialTag)
const allArticlesSection = ref<HTMLElement>()
const filterMenu = ref<HTMLElement>()
const tagMenu = ref<HTMLElement>()
const isSearchResults = computed(() => props.variant === 'search-results')
const isTagResults = computed(() => props.variant === 'tag-results')

const availableTags = computed(() => (
  [...new Set(props.articles.flatMap(article => article.tags))].sort()
))

const filteredArticles = computed(() => {
  const rawQuery = props.variant === 'directory'
    ? ''
    : searchTerm.value.trim().toLocaleLowerCase('id-ID')
  const query = rawQuery === 'ekspor'
    ? 'export'
    : rawQuery === 'impor'
      ? 'import'
      : rawQuery

  return props.articles.filter((article) => {
    const matchesSearch = !query
      || article.title.toLocaleLowerCase('id-ID').includes(query)
      || article.tags.some(tag => tag.toLocaleLowerCase('id-ID').includes(query))

    const activeTags = isTagResults.value
      ? appliedTag.value ? [appliedTag.value] : []
      : selectedTags.value
    const matchesTags = activeTags.length === 0
      || activeTags.every(tag => article.tags.includes(tag))

    return matchesSearch && matchesTags
  })
})

const sortedArticles = computed(() => {
  const articles = [...filteredArticles.value]

  if (appliedSort.value === 'oldest')
    return articles.reverse()

  if (appliedSort.value === 'az')
    return articles.sort((first, second) => first.title.localeCompare(second.title, 'id-ID'))

  if (appliedSort.value === 'za')
    return articles.sort((first, second) => second.title.localeCompare(first.title, 'id-ID'))

  return articles
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedArticles.value.length / props.perPage)))

const visibleArticles = computed(() => {
  const start = (currentPage.value - 1) * props.perPage
  return sortedArticles.value.slice(start, start + props.perPage)
})

const sortLabel = computed(() => sortOptions.find(option => option.value === appliedSort.value)?.label ?? '')

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

function submitSearch() {
  const query = searchTerm.value.trim()

  if (!query)
    return

  navigateTo({
    path: '/blog/search',
    query: { q: query },
  })
}

function openFilter() {
  pendingSort.value = appliedSort.value
  filterOpen.value = !filterOpen.value
  tagOpen.value = false
}

function openTagFilter() {
  pendingTag.value = appliedTag.value
  tagOpen.value = !tagOpen.value
  filterOpen.value = false
}

function applySort() {
  appliedSort.value = pendingSort.value
  currentPage.value = 1
  filterOpen.value = false
}

function resetSort() {
  pendingSort.value = 'newest'
  appliedSort.value = 'newest'
  currentPage.value = 1
  filterOpen.value = false
}

function applyTag() {
  appliedTag.value = pendingTag.value
  currentPage.value = 1
  tagOpen.value = false

  router.replace({
    path: '/blog/tags',
    query: appliedTag.value ? { tag: appliedTag.value } : undefined,
  })
}

function resetTag() {
  pendingTag.value = ''
  appliedTag.value = ''
  currentPage.value = 1
  tagOpen.value = false
  router.replace('/blog/tags')
}

function goToTag(tag: string) {
  router.push({
    path: '/blog/tags',
    query: { tag },
  })
}

function handleOutsideFilterClick(event: PointerEvent) {
  if (!filterOpen.value && !tagOpen.value)
    return

  const target = event.target as Node | null

  if (target && (filterMenu.value?.contains(target) || tagMenu.value?.contains(target)))
    return

  filterOpen.value = false
  tagOpen.value = false
}

watch([searchTerm, () => selectedTags.value.join('|'), appliedSort, appliedTag], () => {
  currentPage.value = 1
})

watch(() => props.initialSearch, (value) => {
  searchTerm.value = value
})

watch(() => props.initialTag, (value) => {
  appliedTag.value = value
  pendingTag.value = value
})

watch(totalPages, (total) => {
  if (currentPage.value > total)
    currentPage.value = total
})

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsideFilterClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsideFilterClick)
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
          class="text-[28px] font-semibold text-primary-500"
        >
          {{ isTagResults ? 'Tags' : isSearchResults ? 'Search Result' : 'All Article' }}
        </h2>

        <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <form class="w-full sm:max-w-[360px]" role="search" @submit.prevent="submitSearch">
            <label class="relative block w-full">
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
                class="h-11 w-full rounded-full border border-border-200 bg-bg-0 pl-11 pr-4 text-[14px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
            </label>
          </form>

          <div ref="filterMenu" class="relative self-end sm:self-start">
            <button
              type="button"
              :aria-expanded="filterOpen"
              :aria-controls="isSearchResults || isTagResults ? 'article-sort-panel' : 'article-filter-panel'"
              class="inline-flex h-11 items-center gap-2 rounded-lg px-3 text-[16px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              @click="isSearchResults || isTagResults ? openFilter() : filterOpen = !filterOpen"
            >
              <span>Filter Article</span>
              <span
                v-if="!isSearchResults && !isTagResults && selectedTags.length"
                class="flex size-5 items-center justify-center rounded-full bg-primary-500 text-[10px] text-white"
              >
                {{ selectedTags.length }}
              </span>
              <Funnel :size="18" :stroke-width="1.8" aria-hidden="true" />
            </button>

            <div
              v-if="!isSearchResults && !isTagResults && filterOpen"
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

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="-translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="-translate-y-1 opacity-0"
            >
              <div
                v-if="(isSearchResults || isTagResults) && filterOpen"
                id="article-sort-panel"
                role="dialog"
                aria-labelledby="article-filter-title"
                class="absolute right-0 z-30 mt-2 w-[min(380px,calc(100vw-2rem))] rounded-[20px] border border-border-200 bg-white p-5 shadow-xl sm:p-6"
                @keydown.esc="filterOpen = false"
              >
                <h2 id="article-filter-title" class="text-[24px] font-semibold text-text-secondary">
                  Filter
                </h2>
                <div class="mt-4 h-px bg-border-200" />

                <fieldset class="mt-4 space-y-1">
                  <legend class="sr-only">
                    Urutkan artikel
                  </legend>
                  <label
                    v-for="option in sortOptions"
                    :key="option.value"
                    class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-text-secondary transition-colors hover:bg-primary-50"
                  >
                    <input
                      v-model="pendingSort"
                      type="radio"
                      name="article-sort"
                      :value="option.value"
                      class="size-5 shrink-0 accent-primary-500"
                    >
                    <span>{{ option.label }}</span>
                  </label>
                </fieldset>

                <div class="mt-5 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    class="h-11 rounded-xl text-[16px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="resetSort"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    class="h-11 rounded-xl bg-primary-500 text-[16px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="applySort"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </Transition>

          </div>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-text-tertiary">
          <template v-if="isTagResults">
            <div ref="tagMenu" class="relative">
              <button
                type="button"
                :aria-expanded="tagOpen"
                aria-controls="tag-filter-panel"
                class="inline-flex items-center gap-2 rounded-full bg-primary-500 px-3 py-1.5 font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                @click="openTagFilter"
              >
                <Tags :size="15" :stroke-width="2" aria-hidden="true" />
                {{ appliedTag || 'Semua Tag' }}
              </button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="-translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-1 opacity-0"
              >
                <div
                  v-if="tagOpen"
                  id="tag-filter-panel"
                  role="dialog"
                  aria-labelledby="tag-filter-title"
                  class="absolute left-0 z-30 mt-2 w-[min(380px,calc(100vw-2rem))] rounded-[20px] border border-border-200 bg-white p-5 shadow-xl sm:p-6"
                  @keydown.esc="tagOpen = false"
                >
                  <h2 id="tag-filter-title" class="text-[24px] font-semibold text-text-secondary">
                    Tag List
                  </h2>
                  <div class="mt-4 h-px bg-border-200" />

                  <div class="mt-4 max-h-[300px] space-y-1 overflow-y-auto pr-1">
                    <button
                      v-for="tag in availableTags"
                      :key="tag"
                      type="button"
                      class="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors"
                      :class="pendingTag === tag
                        ? 'font-medium text-primary-500'
                        : 'text-text-tertiary hover:bg-primary-50 hover:text-primary-500'"
                      @click="pendingTag = tag"
                    >
                      <span>{{ tag }}</span>
                      <Check
                        v-if="pendingTag === tag"
                        :size="18"
                        :stroke-width="2"
                        class="shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div class="mt-5 grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      class="h-11 rounded-xl text-[16px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      @click="resetTag"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      class="h-11 rounded-xl bg-primary-500 text-[16px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      @click="applyTag"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
            <span class="h-px w-5 bg-border-200" aria-hidden="true" />
            <span>Found {{ sortedArticles.length }} articles</span>
          </template>
          <template v-else-if="isSearchResults">
            <span>Hasil Pencarian <strong class="font-medium text-text-secondary">“{{ searchTerm || 'Semua Artikel' }}”</strong></span>
            <span class="h-px w-5 bg-border-200" aria-hidden="true" />
            <span>Found {{ sortedArticles.length }} articles</span>
          </template>
          <template v-else>
            <span>Total of {{ sortedArticles.length }} Articles</span>
            <span class="h-px w-5 bg-border-200" aria-hidden="true" />
            <span>{{ sortLabel }}</span>
          </template>
        </div>

        <div
          v-if="visibleArticles.length"
          class="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <NuxtLink
            v-for="article in visibleArticles"
            :key="article.id"
            :to="article.to?.startsWith('/') ? article.to : `/blog/${article.id}`"
            class="group flex min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <div class="aspect-[16/9] overflow-hidden bg-bg-200">
              <img
                :src="article.image"
                :alt="article.imageAlt"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              >
            </div>

            <div class="flex min-h-[144px] flex-1 flex-col px-2.5 pb-3 pt-2.5">
              <h3 class="line-clamp-2 text-[16px] font-normal leading-6 text-text-secondary transition-colors group-hover:text-primary-500 group-focus-visible:text-primary-500">
                {{ article.title }}
              </h3>

              <ul class="mt-3 flex flex-wrap gap-2" aria-label="Tag artikel">
                <li
                  v-for="tag in article.tags"
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
                  {{ article.releaseDate }}
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
          v-if="sortedArticles.length > perPage"
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
