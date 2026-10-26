<script setup lang="ts">
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'

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
  <section class="bg-bg-0 py-8 sm:py-10">
    <UiContainer>
      <div class="flex flex-col gap-5 pb-7 sm:flex-row sm:items-center sm:justify-between">
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

      <div class="mt-8 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <aside class="rounded-2xl border border-border-200 bg-bg-0 p-4 shadow-[0_6px_14px_rgba(15,23,42,0.09)] lg:sticky lg:top-28">
          <h2 class="mb-4 text-[16px] font-medium text-primary-700">
            Other Policies
          </h2>

          <div v-if="filteredNavigation.length" class="space-y-5">
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
              <ul class="space-y-2.5 text-[12px]">
                <li
                  v-for="item in group.items"
                  :key="item.id"
                >
                  <button
                    type="button"
                    class="group flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
                    :class="item.id === activePolicyId
                      ? 'bg-primary-50 font-medium text-primary-500'
                      : 'text-text-secondary hover:bg-primary-50 hover:text-primary-500'"
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
            <h1 class="text-[32px] font-semibold leading-tight text-text-secondary sm:text-[36px]">
              {{ activeDocument.title }}
            </h1>
            <div class="mt-3 flex items-center gap-3 text-[16px] text-text-secondary">
              <span>Update</span>
              <span class="h-px w-6 bg-border-300" aria-hidden="true" />
              <time>{{ activeDocument.updatedAt }}</time>
            </div>
          </header>

          <div v-if="activeDocument" :key="activeDocument.id" class="mt-9 space-y-6 text-[14px] leading-[1.65] text-text-secondary">
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
            <p class="text-[16px] font-medium text-text-tertiary">
              Another Policies
            </p>
            <div class="mt-6 grid gap-5 text-[14px] text-text-tertiary sm:grid-cols-2">
              <button
                v-if="previousDocument"
                type="button"
                class="group flex items-center gap-3 text-left transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                @click="selectPolicy(previousDocument.id)"
              >
                <ChevronLeft :size="17" aria-hidden="true" class="transition-transform group-hover:-translate-x-0.5" />
                <span>{{ previousDocument.title }}</span>
              </button>
              <span v-else />

              <button
                v-if="nextDocument"
                type="button"
                class="group flex items-center justify-end gap-3 text-right transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                @click="selectPolicy(nextDocument.id)"
              >
                <span>{{ nextDocument.title }}</span>
                <ChevronRight :size="17" aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </footer>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
