<script setup lang="ts">
import {
  ArrowUpRight,
  FileText,
  Search,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'marketing',
  path: '/glossary/:letter',
})

const route = useRoute()
const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#']
const validSlugs = [...'abcdefghijklmnopqrstuvwxyz', 'other']

const activeLetter = computed(() => {
  const routeLetter = String(route.params.letter ?? '').toLowerCase()

  if (!validSlugs.includes(routeLetter))
    return 'A'

  return routeLetter === 'other' ? '#' : routeLetter.toUpperCase()
})

useSeoMeta({
  title: () => `${activeLetter.value} Glossary | ETH Cargo`,
  description: () => `Daftar istilah industri kargo berawalan ${activeLetter.value} di glossary ETH Cargo.`,
  ogTitle: () => `${activeLetter.value} Glossary | ETH Cargo`,
  ogDescription: () => `Daftar istilah industri kargo berawalan ${activeLetter.value} di glossary ETH Cargo.`,
  ogType: 'website',
})

const termTemplates = [
  'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet consectetur',
  'Quisque faucibus ex sapien',
  'Tempus leo eu aenean',
  'Pulvinar vivamus fringilla lacus',
  'Pulvinar vivamus fringilla lacus',
]

const searchQuery = ref('')

const terms = computed(() => Array.from({ length: 18 }, (_, index) => ({
  id: `term-${index + 1}`,
  title: termTemplates[index % termTemplates.length]!,
})))

const filteredTerms = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase('id-ID')

  if (!normalizedQuery)
    return terms.value

  return terms.value.filter(term => term.title.toLocaleLowerCase('id-ID').includes(normalizedQuery))
})

const termColumns = computed(() => {
  const columnCount = 3
  const itemsPerColumn = Math.ceil(filteredTerms.value.length / columnCount)

  return Array.from({ length: columnCount }, (_, index) => (
    filteredTerms.value.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)
  ))
})

function letterPath(letter: string) {
  return `/glossary/${letter === '#' ? 'other' : letter.toLowerCase()}`
}
</script>

<template>
  <section class="bg-bg-0 pb-20 pt-16">
    <UiContainer>
      <header class="text-center">
        <NuxtLink
          to="/glossary"
          class="text-[24px] font-semibold leading-tight text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Glossary
        </NuxtLink>
        <p class="mx-auto mt-5 max-w-[660px] text-[12px] leading-5 text-text-tertiary">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae<br>
          pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>

        <label class="relative mx-auto mt-5 block w-full max-w-[460px]">
          <span class="sr-only">Cari pembahasan glossary</span>
          <Search
            :size="18"
            :stroke-width="1.7"
            aria-hidden="true"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Cari pembahasan"
            class="h-10 w-full rounded-full border border-primary-300 bg-bg-0 pl-11 pr-5 text-[12px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:shadow-[0_0_0_3px_var(--color-primary-50)]"
          >
        </label>
      </header>

      <nav
        aria-label="Navigasi huruf glossary"
        class="mx-auto mt-7 flex max-w-[820px] items-center justify-between"
      >
        <NuxtLink
          v-for="letter in letters"
          :key="letter"
          :to="letterPath(letter)"
          :aria-current="letter === activeLetter ? 'page' : undefined"
          class="text-[13px] font-semibold text-text-secondary transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          {{ letter }}
        </NuxtLink>
      </nav>

      <div class="mt-10">
        <h1 class="text-[32px] font-semibold leading-none text-primary-500">
          {{ activeLetter }}
        </h1>
        <p class="mt-5 text-[11px] text-text-tertiary">
          Found 120 articles
        </p>
        <div class="mt-5 h-px bg-border-300" />
      </div>

      <div
        v-if="filteredTerms.length"
        class="mt-6 grid grid-cols-3 gap-x-16"
      >
        <ul
          v-for="(column, columnIndex) in termColumns"
          :key="columnIndex"
          class="space-y-6"
        >
          <li
            v-for="term in column"
            :key="term.id"
          >
            <button
              type="button"
              class="group flex w-full items-start gap-3 text-left focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <FileText
                :size="14"
                :stroke-width="1.7"
                aria-hidden="true"
                class="mt-0.5 shrink-0 text-text-tertiary transition-colors group-hover:text-primary-500"
              />
              <span
                class="flex min-w-0 flex-1 items-start justify-between gap-3 text-[12px] leading-[1.5] text-text-secondary transition-colors group-hover:text-primary-500"
              >
                <span>{{ term.title }}</span>
                <ArrowUpRight
                  :size="14"
                  :stroke-width="2"
                  aria-hidden="true"
                  class="mt-0.5 shrink-0 translate-y-1 opacity-0 transition-[opacity,transform] group-hover:translate-y-0 group-hover:opacity-100"
                />
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div
        v-else
        class="py-16 text-center"
      >
        <p class="text-[14px] font-medium text-text-secondary">
          Pembahasan tidak ditemukan.
        </p>
        <p class="mt-2 text-[12px] text-text-tertiary">
          Coba gunakan kata kunci lain.
        </p>
      </div>

      <footer class="mt-14 border-t border-border-200 pt-8 text-center">
        <p class="mx-auto max-w-[700px] text-[11px] leading-[1.6] text-text-tertiary">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque<br>
          sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
        <NuxtLink
          to="/calculator"
          class="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-primary-500 px-5 text-[12px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Get a Quote</span>
          <ArrowUpRight :size="15" :stroke-width="2" aria-hidden="true" />
        </NuxtLink>
      </footer>
    </UiContainer>
  </section>
</template>
