<script setup lang="ts">
import { ChevronDown, Search } from 'lucide-vue-next'
import { blogArticleToc } from '~/constants/blogArticleToc'

const isOpen = ref(false)
const searchQuery = ref('')
const activeId = ref<string>(blogArticleToc[0].id)
const filteredSections = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('id-ID')
  if (!query) return blogArticleToc

  return blogArticleToc
    .map(section => {
      const sectionMatches = section.title.toLocaleLowerCase('id-ID').includes(query)
      return {
        ...section,
        children: sectionMatches
          ? section.children
          : section.children.filter(child => child.title.toLocaleLowerCase('id-ID').includes(query)),
      }
    })
    .filter(section => section.title.toLocaleLowerCase('id-ID').includes(query) || section.children.length)
})

function selectSection(id: string) {
  activeId.value = id
  isOpen.value = false
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

function updateActiveSection() {
  let currentId: string = blogArticleToc[0].id
  for (const section of blogArticleToc) {
    for (const item of [section, ...section.children]) {
      const heading = document.getElementById(item.id)
      if (heading && heading.getBoundingClientRect().top <= 130)
        currentId = item.id
    }
  }
  activeId.value = currentId
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  updateActiveSection()
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSection)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-if="isOpen"
        type="button"
        aria-label="Tutup Table of Content"
        class="fixed inset-x-0 bottom-0 top-16 z-10 bg-white/30 backdrop-blur-[6px] lg:hidden"
        @click="isOpen = false"
      />
  </Transition>

  <div class="sticky top-16 z-20 bg-white lg:hidden">

    <div class="border-b-2 transition-colors duration-200" :class="isOpen ? 'border-border-200' : 'border-primary-500'">
      <button
        type="button"
        class="flex min-h-12 w-full items-center justify-between gap-4 px-4 text-left text-[14px] font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
        aria-controls="mobile-blog-toc"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span>Table of Content</span>
        <ChevronDown :size="20" class="shrink-0 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" aria-hidden="true" />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-show="isOpen"
        id="mobile-blog-toc"
        aria-label="Table of Content"
        class="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto bg-white px-4 pb-4 pt-3 shadow-[0_14px_28px_rgba(15,23,42,0.14)]"
      >
        <label class="relative block">
          <span class="sr-only">Cari bagian artikel</span>
          <Search :size="18" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" aria-hidden="true" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Cari bagian artikel"
            class="h-11 w-full rounded-full border border-border-200 bg-white pl-10 pr-4 text-[14px] text-text-secondary outline-none placeholder:italic placeholder:text-text-tertiary focus:border-primary-500"
          >
        </label>

        <div class="mt-3 h-px w-24 bg-border-200" aria-hidden="true" />

        <ol v-if="filteredSections.length" class="mt-2 space-y-1">
          <li v-for="section in filteredSections" :key="section.id">
            <button
              type="button"
              class="flex min-h-11 w-full items-center gap-3 rounded-lg px-1 text-left text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
              :class="activeId === section.id ? 'font-medium text-primary-500' : 'text-text-secondary hover:text-primary-500'"
              :aria-current="activeId === section.id ? 'location' : undefined"
              @click="selectSection(section.id)"
            >
              <span class="w-7 shrink-0">{{ section.number }}</span>
              <span>{{ section.title }}</span>
            </button>
            <ol class="pl-6">
              <li v-for="child in section.children" :key="child.id">
                <button
                  type="button"
                  class="flex min-h-11 w-full items-center gap-3 rounded-lg px-1 text-left text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
                  :class="activeId === child.id ? 'font-medium text-primary-500' : 'text-text-tertiary hover:text-primary-500'"
                  :aria-current="activeId === child.id ? 'location' : undefined"
                  @click="selectSection(child.id)"
                >
                  <span class="w-7 shrink-0">{{ child.number }}</span>
                  <span>{{ child.title }}</span>
                </button>
              </li>
            </ol>
            <div class="my-2 h-px w-24 bg-border-200" aria-hidden="true" />
          </li>
        </ol>
        <p v-else class="mt-5 text-[14px] text-text-tertiary">Bagian artikel tidak ditemukan.</p>
      </nav>
    </Transition>
  </div>
</template>
