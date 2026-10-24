<script setup lang="ts">
import { ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'

interface PolicyNavigationGroup {
  label: string
  items: readonly string[]
}

interface PolicyContentBlock {
  type: 'paragraph' | 'list'
  text?: string
  items?: readonly string[]
}

const props = defineProps<{
  title: string
  updatedAt: string
  activePolicy: string
  navigation: readonly PolicyNavigationGroup[]
  content: readonly PolicyContentBlock[]
  previousPolicy?: string
  nextPolicy?: string
}>()

const searchQuery = ref('')

const filteredNavigation = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('id')
  if (!query) return props.navigation

  return props.navigation
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.toLocaleLowerCase('id').includes(query)),
    }))
    .filter(group => group.items.length > 0)
})
</script>

<template>
  <section class="bg-bg-0 py-8 sm:py-10">
    <UiContainer>
      <div class="flex flex-col gap-5 border-b border-border-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-[12px] text-text-disable">
          <span>Home</span>
          <ChevronRight :size="14" aria-hidden="true" />
          <span>Legals</span>
          <ChevronRight :size="14" aria-hidden="true" />
          <span class="font-medium text-primary-500">{{ title }}</span>
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
            class="h-11 w-full rounded-full border border-border-200 bg-bg-0 pl-11 pr-4 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
        </label>
      </div>

      <div class="mt-8 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside class="rounded-2xl border border-border-200 bg-bg-0 p-4 shadow-[0_6px_14px_rgba(15,23,42,0.09)] lg:sticky lg:top-28">
          <h2 class="mb-4 text-[15px] font-semibold text-primary-700">
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
                class="mb-2 text-[14px] font-medium text-text-disable"
              >
                {{ group.label }}
              </h3>
              <ul class="space-y-2.5 text-[12px]">
                <li
                  v-for="item in group.items"
                  :key="item"
                  class="flex items-center justify-between gap-3"
                  :class="item === activePolicy ? 'font-medium text-primary-500' : 'text-text-secondary'"
                >
                  <span>{{ item }}</span>
                  <ChevronRight
                    v-if="item === activePolicy"
                    :size="14"
                    aria-hidden="true"
                    class="shrink-0"
                  />
                </li>
              </ul>
            </section>
          </div>

          <p v-else class="text-[12px] leading-5 text-text-tertiary">
            Kebijakan tidak ditemukan.
          </p>
        </aside>

        <article class="min-w-0">
          <header>
            <h1 class="text-[32px] font-semibold leading-tight text-text-secondary sm:text-[36px]">
              {{ title }}
            </h1>
            <div class="mt-3 flex items-center gap-3 text-[13px] text-text-secondary">
              <span>Update</span>
              <span class="h-px w-6 bg-border-300" aria-hidden="true" />
              <time>{{ updatedAt }}</time>
            </div>
          </header>

          <div class="mt-9 space-y-6 text-[14px] leading-[1.65] text-text-secondary">
            <template v-for="(block, index) in content" :key="index">
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
            v-if="previousPolicy || nextPolicy"
            class="mt-10 border-t border-border-200 pt-6"
          >
            <p class="text-[14px] font-medium text-text-tertiary">
              Another Policies
            </p>
            <div class="mt-6 grid gap-5 text-[12px] text-text-tertiary sm:grid-cols-2">
              <div class="flex items-center gap-3">
                <ChevronLeft v-if="previousPolicy" :size="15" aria-hidden="true" />
                <span>{{ previousPolicy }}</span>
              </div>
              <div class="flex items-center justify-end gap-3 text-right">
                <span>{{ nextPolicy }}</span>
                <ChevronRight v-if="nextPolicy" :size="15" aria-hidden="true" />
              </div>
            </div>
          </footer>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
