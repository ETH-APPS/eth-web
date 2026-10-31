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
const pendingTags = ref<string[]>([])
const currentPage = ref(1)
const filterOpen = ref(false)
const tagOpen = ref(false)
const appliedSort = ref<SortOption>('newest')
const pendingSort = ref<SortOption>('newest')
const appliedTag = ref(props.initialTag)
const pendingTag = ref(props.initialTag)
const allArticlesSection = ref<HTMLElement>()
const dialogRef = ref<HTMLElement>()
let previousBodyOverflow = ''
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

function resetDirectoryFilter() {
  pendingTags.value = []
  selectedTags.value = []
  filterOpen.value = false
}

function applyDirectoryFilter() {
  selectedTags.value = [...pendingTags.value]
  filterOpen.value = false
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
  pendingTags.value = [...selectedTags.value]
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

function closeDialogs() {
  filterOpen.value = false
  tagOpen.value = false
}

function handleDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && (filterOpen.value || tagOpen.value))
    closeDialogs()
}

watch([filterOpen, tagOpen], async ([filter, tag]) => {
  if (!import.meta.client)
    return

  if (filter || tag) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    dialogRef.value?.focus()
  }
  else {
    document.body.style.overflow = previousBodyOverflow
  }
})

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
  document.addEventListener('keydown', handleDialogKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleDialogKeydown)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <section
    id="all-articles"
    ref="allArticlesSection"
    aria-labelledby="all-articles-title"
    class="scroll-mt-20 bg-bg-0 py-14 sm:py-16 lg:py-20"
  >
    <div
      v-if="filterOpen || tagOpen"
      class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]"
      aria-hidden="true"
      @click="closeDialogs"
    />
    <UiContainer>
      <div class="mx-auto max-w-[1080px]">
        <h2
          id="all-articles-title"
          class="text-[28px] font-semibold text-primary-500"
        >
          {{ isTagResults ? 'Tags' : isSearchResults ? 'Search Result' : 'All Article' }}
        </h2>

        <div class="mt-5 flex items-center justify-between gap-4 sm:items-start">
          <form class="min-w-0 flex-1 sm:max-w-[360px]" role="search" @submit.prevent="submitSearch">
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

          <div class="relative shrink-0 sm:self-start">
            <button
              type="button"
              aria-label="Filter Article"
              :aria-expanded="filterOpen"
              :aria-controls="isSearchResults || isTagResults ? 'article-sort-panel' : 'article-filter-panel'"
              class="inline-flex size-11 items-center justify-center rounded-full bg-primary-500 text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:h-11 lg:w-auto lg:gap-2 lg:rounded-lg lg:bg-transparent lg:px-3 lg:text-[16px] lg:font-medium lg:text-primary-500 lg:hover:bg-primary-50"
              @click="isSearchResults || isTagResults ? openFilter() : filterOpen = !filterOpen"
            >
              <span class="hidden lg:inline">Filter Article</span>
              <span
                v-if="!isSearchResults && !isTagResults && selectedTags.length"
                class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-primary-500 bg-white text-[10px] text-primary-500 lg:static lg:border-0 lg:bg-primary-500 lg:text-white"
              >
                {{ selectedTags.length }}
              </span>
              <Funnel :size="18" :stroke-width="1.8" aria-hidden="true" />
            </button>

            <div
              v-if="!isSearchResults && !isTagResults && filterOpen"
              id="article-filter-panel"
              ref="dialogRef"
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-tag-filter-title"
              tabindex="-1"
              class="fixed left-1/2 top-1/2 z-[101] max-h-[calc(100dvh-2rem)] w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] border border-border-200 bg-white p-5 shadow-xl outline-none sm:p-6"
            >
              <h2 id="article-tag-filter-title" class="text-[24px] font-semibold text-text-secondary lg:text-[13px]">
                Filter berdasarkan tag
              </h2>
              <div class="mt-4 h-px bg-border-200" />

              <div class="mt-4 max-h-[min(50dvh,320px)] space-y-1 overflow-y-auto">
                <label
                  v-for="tag in availableTags"
                  :key="tag"
                  class="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-[14px] font-medium transition-colors focus-within:outline-2 focus-within:outline-primary-500 lg:text-[11px] lg:font-normal"
                  :class="pendingTags.includes(tag) ? 'bg-primary-50 text-primary-500' : 'text-text-tertiary hover:bg-primary-50'"
                >
                  <input
                    v-model="pendingTags"
                    type="checkbox"
                    :value="tag"
                    class="sr-only"
                  >
                  <span>{{ tag }}</span>
                  <Check v-if="pendingTags.includes(tag)" :size="18" aria-hidden="true" />
                </label>
              </div>

              <div class="mt-5 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  class="h-11 rounded-xl text-[14px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:text-[11px]"
                  @click="resetDirectoryFilter"
                >
                  Reset
                </button>
                <button
                  type="button"
                  class="h-11 rounded-xl bg-primary-500 text-[14px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:text-[11px]"
                  @click="applyDirectoryFilter"
                >
                  Apply
                </button>
              </div>
            </div>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div
                v-if="(isSearchResults || isTagResults) && filterOpen"
                id="article-sort-panel"
                ref="dialogRef"
                role="dialog"
                aria-modal="true"
                aria-labelledby="article-filter-title"
                tabindex="-1"
                class="fixed left-1/2 top-1/2 z-[101] max-h-[calc(100dvh-2rem)] w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] border border-border-200 bg-white p-5 shadow-xl outline-none sm:p-6"
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
                    class="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors focus-within:outline-2 focus-within:outline-primary-500 lg:text-[15px] lg:font-normal"
                    :class="pendingSort === option.value ? 'text-primary-500' : 'text-text-tertiary hover:bg-primary-50'"
                  >
                    <input
                      v-model="pendingSort"
                      type="radio"
                      name="article-sort"
                      :value="option.value"
                      class="sr-only"
                    >
                    <span>{{ option.label }}</span>
                    <Check v-if="pendingSort === option.value" :size="18" aria-hidden="true" />
                  </label>
                </fieldset>

                <div class="mt-5 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    class="h-11 rounded-xl text-[14px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:text-[16px]"
                    @click="resetSort"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    class="h-11 rounded-xl bg-primary-500 text-[14px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:text-[16px]"
                    @click="applySort"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </Transition>

          </div>
        </div>

        <div
          class="mt-5 flex flex-wrap items-center gap-3 text-[14px] font-normal text-text-tertiary"
          :class="!isTagResults && !isSearchResults ? 'justify-between lg:justify-start' : ''"
        >
          <template v-if="isTagResults">
            <div class="relative">
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
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="tagOpen"
                  id="tag-filter-panel"
                  ref="dialogRef"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="tag-filter-title"
                  tabindex="-1"
                  class="fixed left-1/2 top-1/2 z-[101] max-h-[calc(100dvh-2rem)] w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] border border-border-200 bg-white p-5 shadow-xl outline-none sm:p-6"
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
                      class="flex min-h-11 w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition-colors lg:text-[15px] lg:font-normal"
                      :class="pendingTag === tag
                        ? 'bg-primary-50 text-primary-500 lg:font-medium'
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
                      class="h-11 rounded-xl text-[14px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:text-[16px]"
                      @click="resetTag"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      class="h-11 rounded-xl bg-primary-500 text-[14px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:text-[16px]"
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
            <span class="hidden h-px w-5 bg-border-200 lg:block" aria-hidden="true" />
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
              <h3 class="line-clamp-2 text-[15px] font-normal leading-6 text-text-secondary transition-colors group-hover:text-primary-500 group-focus-visible:text-primary-500 lg:text-[16px]">
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
