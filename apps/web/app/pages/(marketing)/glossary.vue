<script setup lang="ts">
import {
  ArrowUpRight,
  ChevronsDown,
  FileText,
  Search,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Glossary | ETH Cargo',
  description: 'Pelajari istilah penting seputar industri kargo, logistik, ekspor, dan impor bersama ETH Cargo.',
  ogTitle: 'Glossary | ETH Cargo',
  ogDescription: 'Pelajari istilah penting seputar industri kargo, logistik, ekspor, dan impor bersama ETH Cargo.',
  ogType: 'website',
})

interface GlossaryTerm {
  id: string
  title: string
}

interface GlossaryGroup {
  letter: string
  terms: GlossaryTerm[]
}

const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#']
const placeholderTerms = [
  'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  'Quisque faucibus ex sapien',
  'Tempus leo eu aenean',
  'Pulvinar vivamus fringilla lacus',
  'Iaculis massa nisl malesuada',
  'Ad litora torquent per conubia',
  'Ut hendrerit semper vel class',
]

const glossaryGroups: GlossaryGroup[] = letters.map(letter => ({
  letter,
  terms: placeholderTerms.map((title, index) => ({
    id: `${letter.toLowerCase().replace('#', 'other')}-${index + 1}`,
    title,
  })),
}))

const searchQuery = ref('')
const expandedLetters = ref(new Set(['B', 'C']))

const normalizedQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase('id-ID'))

const filteredGroups = computed(() => {
  if (!normalizedQuery.value)
    return glossaryGroups

  return glossaryGroups
    .map(group => ({
      ...group,
      terms: group.terms.filter(term => term.title.toLocaleLowerCase('id-ID').includes(normalizedQuery.value)),
    }))
    .filter(group => group.terms.length > 0)
})

const totalTopics = computed(() => glossaryGroups.reduce((total, group) => total + group.terms.length, 0))

function visibleTerms(group: GlossaryGroup) {
  if (normalizedQuery.value || expandedLetters.value.has(group.letter))
    return group.terms

  return group.terms.slice(0, 5)
}

function toggleGroup(letter: string) {
  const nextExpandedLetters = new Set(expandedLetters.value)

  if (nextExpandedLetters.has(letter))
    nextExpandedLetters.delete(letter)
  else
    nextExpandedLetters.add(letter)

  expandedLetters.value = nextExpandedLetters
}

function letterPath(letter: string) {
  return `/glossary/${letter === '#' ? 'other' : letter.toLowerCase()}`
}
</script>

<template>
  <section class="bg-bg-0 pb-20 pt-16">
    <UiContainer>
      <header class="text-center">
        <h1 class="text-[24px] font-semibold leading-tight text-primary-500">
          Glossary
        </h1>
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
          class="text-[13px] font-semibold text-text-secondary transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          {{ letter }}
        </NuxtLink>
      </nav>

      <div class="mt-8 flex items-center gap-4 text-[11px] text-text-tertiary">
        <span>Total Bahasan</span>
        <span aria-hidden="true" class="h-px w-5 bg-border-300" />
        <span>+{{ totalTopics }} Bahasan Seputar Industri Kargo</span>
      </div>

      <div
        v-if="filteredGroups.length"
        class="mt-8 grid grid-cols-3 items-start gap-x-12 gap-y-10"
      >
        <section
          v-for="group in filteredGroups"
          :id="`glossary-${group.letter === '#' ? 'other' : group.letter.toLowerCase()}`"
          :key="group.letter"
          class="scroll-mt-28"
          :aria-labelledby="`glossary-title-${group.letter === '#' ? 'other' : group.letter.toLowerCase()}`"
        >
          <h2
            :id="`glossary-title-${group.letter === '#' ? 'other' : group.letter.toLowerCase()}`"
            class="border-b border-border-300 pb-2 text-[28px] font-semibold leading-none"
            :class="group.letter === 'B' ? 'text-primary-500' : 'text-text-disable'"
          >
            {{ group.letter }}
          </h2>

          <ul class="mt-4 space-y-4">
            <li
              v-for="term in visibleTerms(group)"
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
                  class="flex min-w-0 flex-1 items-start justify-between gap-2 text-[12px] leading-[1.45] text-text-secondary transition-colors group-hover:text-primary-500"
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

          <button
            v-if="!normalizedQuery && group.terms.length > 5"
            type="button"
            class="mx-auto mt-5 flex items-center gap-2 text-[11px] text-text-disable transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            :aria-expanded="expandedLetters.has(group.letter)"
            @click="toggleGroup(group.letter)"
          >
            <span>{{ expandedLetters.has(group.letter) ? 'View less' : `View more (+${group.terms.length - 5})` }}</span>
            <ChevronsDown
              :size="14"
              :stroke-width="1.8"
              aria-hidden="true"
              class="text-primary-500 transition-transform"
              :class="expandedLetters.has(group.letter) ? 'rotate-180' : ''"
            />
          </button>
        </section>
      </div>

      <div
        v-else
        class="mt-12 rounded-2xl border border-border-200 bg-bg-100 px-6 py-12 text-center"
      >
        <p class="text-[14px] font-medium text-text-secondary">
          Pembahasan tidak ditemukan.
        </p>
        <p class="mt-2 text-[12px] text-text-tertiary">
          Coba gunakan kata kunci lain untuk mencari istilah kargo.
        </p>
      </div>

      <footer class="mt-16 text-center">
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
