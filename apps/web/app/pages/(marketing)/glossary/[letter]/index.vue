<script setup lang="ts">
import {
  ArrowUpRight,
  FileText,
  Search,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'marketing',
  validate: route => {
    const letter = String(route.params.letter ?? '').toLowerCase()
    return Boolean(getGlossaryGroup(letter))
  },
})

const route = useRoute()
const { letters } = useGlossaryData()
const activeGroup = computed(() => getGlossaryGroup(String(route.params.letter ?? '').toLowerCase()))
const activeLetter = computed(() => activeGroup.value?.letter ?? '')

useSeoMeta({
  title: () => `${activeLetter.value} Glossary | ETH Cargo`,
  description: () => `Daftar istilah industri kargo berawalan ${activeLetter.value} di glossary ETH Cargo.`,
  ogTitle: () => `${activeLetter.value} Glossary | ETH Cargo`,
  ogDescription: () => `Daftar istilah industri kargo berawalan ${activeLetter.value} di glossary ETH Cargo.`,
  ogType: 'website',
})

const searchQuery = ref('')
const terms = computed(() => activeGroup.value?.terms ?? [])

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
  return glossaryLetterPath(letter)
}
</script>

<template>
  <section class="bg-bg-0 pb-20 pt-10 lg:pt-16">
    <UiContainer>
      <header class="text-center">
        <NuxtLink
          to="/glossary"
          class="text-[28px] font-semibold leading-tight text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Glossary
        </NuxtLink>
        <p class="mx-auto mt-6 max-w-[800px] text-justify text-[16px] font-normal leading-[1.45] text-text-tertiary lg:mt-5 lg:max-w-[660px] lg:text-center lg:leading-5">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae<br class="hidden lg:inline">
          pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>

        <label class="relative mx-auto mt-6 block w-full max-w-[460px] lg:mt-5">
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
            class="h-12 w-full rounded-full border border-primary-300 bg-bg-0 pl-11 pr-5 text-[16px] font-normal text-text-secondary outline-none focus:outline-none focus:ring-0 placeholder:text-text-disable lg:h-10 lg:transition-[border-color,box-shadow] lg:focus:border-primary-500 lg:focus:shadow-[0_0_0_3px_var(--color-primary-50)]"
          >
        </label>
      </header>

      <nav
        aria-label="Navigasi huruf glossary"
        class="mx-auto mt-6 grid max-w-[820px] grid-cols-9 gap-y-1 text-center lg:mt-7 lg:flex lg:items-center lg:justify-between"
      >
        <NuxtLink
          v-for="letter in letters"
          :key="letter"
          :to="letterPath(letter)"
          :aria-current="letter === activeLetter ? 'page' : undefined"
          class="flex min-h-10 items-center justify-center text-[24px] font-semibold transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:block lg:min-h-0 lg:text-[22px]"
          :class="letter === activeLetter ? 'text-primary-500 lg:text-text-secondary' : 'text-text-secondary'"
        >
          {{ letter }}
        </NuxtLink>
      </nav>

      <div class="mt-10">
        <h1 class="border-b border-border-300 pb-3 text-[42px] font-semibold leading-none text-text-secondary lg:border-0 lg:pb-0 lg:text-primary-500">
          {{ activeLetter }}
        </h1>
        <p class="mt-5 text-[14px] font-normal text-text-tertiary">
          Found {{ terms.length }} articles
        </p>
        <div class="mt-5 hidden h-px bg-border-300 lg:block" />
      </div>

      <div
        v-if="filteredTerms.length"
        class="mt-5 grid grid-cols-1 gap-y-8 lg:mt-6 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-0"
      >
        <ul
          v-for="(column, columnIndex) in termColumns"
          :key="columnIndex"
          class="space-y-8 lg:space-y-6"
        >
          <li
            v-for="term in column"
            :key="term.id"
          >
            <NuxtLink
              :to="glossaryTermPath(term)"
              class="group flex w-full items-start gap-3 text-left focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <FileText
                :size="18"
                :stroke-width="1.7"
                aria-hidden="true"
                class="mt-[3px] shrink-0 text-text-tertiary transition-colors group-hover:text-primary-500 lg:mt-0.5 lg:size-[14px]"
              />
              <span
                class="flex min-w-0 flex-1 items-start justify-between gap-2 text-[16px] font-normal leading-[1.45] text-text-secondary transition-colors group-hover:text-primary-500 lg:gap-3 lg:leading-[1.5]"
              >
                <span>{{ term.title }}</span>
                <ArrowUpRight
                  :size="14"
                  :stroke-width="2"
                  aria-hidden="true"
                  class="mt-0.5 hidden shrink-0 translate-y-1 opacity-0 transition-[opacity,transform] group-hover:translate-y-0 group-hover:opacity-100 lg:block"
                />
              </span>
            </NuxtLink>
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

      <footer class="mt-16 text-center lg:mt-14 lg:border-t lg:border-border-200 lg:pt-8">
        <p class="mx-auto max-w-[800px] text-[14px] font-medium leading-[1.6] text-text-tertiary lg:max-w-[700px] lg:font-normal">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque<br class="hidden lg:inline">
          sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
        <NuxtLink
          to="/calculator"
          class="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary-500 px-5 text-[14px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:mt-4 lg:h-9"
        >
          <span>Get a Quote</span>
          <ArrowUpRight :size="16" :stroke-width="2" aria-hidden="true" class="lg:size-[15px]" />
        </NuxtLink>
      </footer>
    </UiContainer>
  </section>
</template>
