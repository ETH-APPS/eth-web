<script setup lang="ts">
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'

interface PolicyNavigationGroup {
  label: string
  items: readonly {
    id: string
    label: string
  }[]
}

interface PolicyContentBlock {
  type: 'paragraph' | 'list'
  text?: string
  items?: readonly string[]
}

interface PolicyDocumentItem {
  id: string
  title: string
  updatedAt: string
  content: readonly PolicyContentBlock[]
}

const props = defineProps<{
  navigation: readonly PolicyNavigationGroup[]
  documents: readonly PolicyDocumentItem[]
  initialPolicyId?: string
}>()

const searchQuery = ref('')
const isMobileTocOpen = ref(false)
const documentTop = ref<HTMLElement>()
const activePolicyId = ref(
  props.initialPolicyId
  || props.navigation[0]?.items[0]?.id
  || props.documents[0]?.id
  || '',
)

const activeDocument = computed(() => (
  props.documents.find(document => document.id === activePolicyId.value)
  || props.documents[0]
))

const activeDocumentIndex = computed(() => (
  props.documents.findIndex(document => document.id === activeDocument.value?.id)
))

const previousDocument = computed(() => {
  const index = activeDocumentIndex.value
  return index > 0 ? props.documents[index - 1] : undefined
})

const nextDocument = computed(() => {
  const index = activeDocumentIndex.value
  return index >= 0 && index < props.documents.length - 1
    ? props.documents[index + 1]
    : undefined
})

const filteredNavigation = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('id')
  if (!query) return props.navigation

  return props.navigation
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.label.toLocaleLowerCase('id').includes(query)),
    }))
    .filter(group => group.items.length > 0)
})

function selectPolicy(policyId: string, shouldScroll = true) {
  activePolicyId.value = policyId
  isMobileTocOpen.value = false

  if (!shouldScroll)
    return

  nextTick(() => {
    documentTop.value?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  })
}
</script>

<template>
  <section class="bg-bg-0 pb-8 pt-0 sm:pb-10 sm:pt-0 lg:py-10">
    <UiContainer>
      <div class="hidden flex-col gap-5 pb-7 sm:flex-row sm:items-center sm:justify-between lg:flex">
        <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-[10px] text-text-disable">
          <span>Home</span>
          <ChevronRight :size="14" aria-hidden="true" />
          <span>Legals</span>
          <ChevronRight :size="14" aria-hidden="true" />
          <span class="font-medium text-primary-500">{{ activeDocument?.title }}</span>
        </nav>

        <label class="relative block w-full sm:max-w-[300px]">
          <span class="sr-only">Cari artikel panduan</span>
          <Search
            :size="19"
            :stroke-width="1.8"
            aria-hidden="true"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-disable"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Cari artikel panduan"
            class="h-11 w-full rounded-full border border-border-200 bg-bg-0 pl-11 pr-4 text-[14px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
        </label>
      </div>

      <div class="-mx-4 border-b-2 lg:hidden" :class="isMobileTocOpen ? 'border-transparent' : 'border-primary-500'">
        <button
          type="button"
          class="flex min-h-12 w-full items-center justify-between gap-4 px-4 text-left text-[14px] font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
          aria-controls="mobile-policy-toc"
          :aria-expanded="isMobileTocOpen"
          @click="isMobileTocOpen = !isMobileTocOpen"
        >
          <span>Table of Content</span>
          <ChevronDown :size="20" class="shrink-0 transition-transform duration-200" :class="isMobileTocOpen ? 'rotate-180' : ''" aria-hidden="true" />
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
          v-show="isMobileTocOpen"
          id="mobile-policy-toc"
          aria-label="Table of Content"
          class="pb-4 pt-3 lg:hidden"
        >
          <label class="relative block">
            <span class="sr-only">Cari kebijakan</span>
            <Search :size="18" aria-hidden="true" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-disable" />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Cari artikel"
              class="h-11 w-full rounded-full border border-border-200 bg-bg-0 pl-10 pr-4 text-[14px] text-text-secondary outline-none placeholder:italic placeholder:text-text-disable focus:border-primary-500"
            >
          </label>

          <div class="mt-3 h-px w-24 bg-border-200" aria-hidden="true" />

          <div v-if="filteredNavigation.length" class="mt-2">
            <div v-for="group in filteredNavigation" :key="group.label">
              <ul class="space-y-1">
                <li v-for="item in group.items" :key="item.id">
                  <button
                    type="button"
                    class="flex min-h-11 w-full items-center gap-3 rounded-lg px-1 text-left text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
                    :class="item.id === activePolicyId ? 'font-medium text-primary-500' : 'text-text-secondary hover:text-primary-500'"
                    :aria-current="item.id === activePolicyId ? 'page' : undefined"
                    @click="selectPolicy(item.id)"
                  >
                    <span class="flex size-4 shrink-0 items-center justify-center">
                      <ArrowUpRight v-if="item.id !== activePolicyId" :size="16" aria-hidden="true" />
                    </span>
                    <span>{{ item.label }}</span>
                  </button>
                </li>
              </ul>
              <div class="my-4 h-px w-24 bg-border-200" aria-hidden="true" />
            </div>
          </div>
          <p v-else class="mt-5 text-[14px] text-text-tertiary">Kebijakan tidak ditemukan.</p>

          <NuxtLink to="/legalities" class="mt-2 flex min-h-11 items-center gap-3 px-1 text-[14px] text-text-tertiary focus-visible:outline-2 focus-visible:outline-primary-500">
            <ArrowLeft :size="16" aria-hidden="true" />
            Back to Legalities
          </NuxtLink>
        </nav>
      </Transition>

      <div class="mt-6 grid items-start gap-6 lg:mt-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <aside class="hidden rounded-2xl border border-border-200 bg-bg-0 p-4 shadow-[0_6px_14px_rgba(15,23,42,0.09)] lg:sticky lg:top-28 lg:block">
          <h2 class="mb-4 text-[16px] font-medium text-primary-700">
            Other Policies
          </h2>

          <div v-if="filteredNavigation.length" class="space-y-4">
            <section
              v-for="group in filteredNavigation"
              :key="group.label"
              :aria-labelledby="`policy-group-${group.label.replaceAll(' ', '-').toLowerCase()}`"
            >
              <h3
                :id="`policy-group-${group.label.replaceAll(' ', '-').toLowerCase()}`"
                class="mb-2 text-[16px] font-medium text-text-disable"
              >
                {{ group.label }}
              </h3>
              <ul class="text-[12px] leading-[18px]">
                <li
                  v-for="item in group.items"
                  :key="item.id"
                >
                  <button
                    type="button"
                    class="group flex w-full items-center justify-between gap-3 py-1 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    :class="item.id === activePolicyId
                      ? 'font-medium text-primary-500'
                      : 'text-text-secondary hover:text-primary-500'"
                    :aria-current="item.id === activePolicyId ? 'page' : undefined"
                    @click="selectPolicy(item.id)"
                  >
                    <span>{{ item.label }}</span>
                    <ArrowRight
                      v-if="item.id === activePolicyId"
                      :size="14"
                      aria-hidden="true"
                      class="shrink-0"
                    />
                  </button>
                </li>
              </ul>
            </section>
          </div>

          <p v-else class="text-[12px] leading-5 text-text-tertiary">
            Kebijakan tidak ditemukan.
          </p>
        </aside>

        <article ref="documentTop" class="min-w-0 scroll-mt-28">
          <header v-if="activeDocument">
            <h1 class="text-[32px] font-semibold leading-tight text-text-secondary lg:text-[36px]">
              {{ activeDocument.title }}
            </h1>
            <div class="mt-3 flex items-center gap-3 text-[16px] text-text-secondary">
              <span>Update</span>
              <span class="h-px w-6 bg-border-300" aria-hidden="true" />
              <time>{{ activeDocument.updatedAt }}</time>
            </div>
          </header>

          <div v-if="activeDocument" :key="activeDocument.id" class="mt-9 space-y-6 text-justify text-[14px] leading-[1.65] text-text-secondary lg:text-left">
            <template v-for="(block, index) in activeDocument.content" :key="index">
              <p v-if="block.type === 'paragraph'">
                {{ block.text }}
              </p>
              <ol
                v-else
                class="ml-7 list-decimal space-y-1"
              >
                <li v-for="item in block.items" :key="item">
                  {{ item }}
                </li>
              </ol>
            </template>
          </div>

          <footer
            v-if="previousDocument || nextDocument"
            class="mt-10 border-t border-border-200 pt-6"
          >
            <p class="text-left text-[16px] font-medium text-text-tertiary">
              Another Policies
            </p>
            <div class="mt-6 flex flex-col items-start gap-5 text-[14px] font-normal text-text-tertiary lg:grid lg:grid-cols-2 lg:items-stretch">
              <button
                v-if="previousDocument"
                type="button"
                class="group flex min-h-11 items-center gap-3 text-left transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:min-h-0"
                @click="selectPolicy(previousDocument.id)"
              >
                <ArrowLeft :size="17" aria-hidden="true" class="lg:hidden" />
                <ChevronLeft :size="17" aria-hidden="true" class="hidden transition-transform group-hover:-translate-x-0.5 lg:block" />
                <span>{{ previousDocument.title }}</span>
              </button>
              <span v-else class="hidden lg:block" />

              <button
                v-if="nextDocument"
                type="button"
                class="group flex min-h-11 items-center gap-3 text-left transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:min-h-0 lg:justify-end lg:text-right"
                @click="selectPolicy(nextDocument.id)"
              >
                <ArrowLeft :size="17" aria-hidden="true" class="lg:hidden" />
                <span>{{ nextDocument.title }}</span>
                <ChevronRight :size="17" aria-hidden="true" class="hidden transition-transform group-hover:translate-x-0.5 lg:block" />
              </button>
            </div>
          </footer>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
