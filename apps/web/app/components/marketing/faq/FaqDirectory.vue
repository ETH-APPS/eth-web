<script setup lang="ts">
import {
  ChevronDown,
  Search,
} from 'lucide-vue-next'
import { whatsappConsultationUrl } from '~/constants/whatsapp'

interface FaqDirectoryItem {
  question: string
  answer: string
}

interface FaqDirectoryGroup {
  id: string
  title: string
  description: string
  items: readonly FaqDirectoryItem[]
}

const props = withDefaults(defineProps<{
  groups: readonly FaqDirectoryGroup[]
  selectedGroupId?: string
  eyebrow?: string
  title?: string
  description?: string
  searchPlaceholder?: string
  contactPrompt?: string
  contactLabel?: string
  contactTo?: string
}>(), {
  eyebrow: 'Pusat Bantuan',
  title: 'FAQ ETH Cargo',
  description:
    'Temukan informasi dan jawaban yang Anda butuhkan seputar layanan, pengiriman, dan fitur ETH Cargo.',
  searchPlaceholder: 'Cari topik, istilah, atau pertanyaan seputar impor...',
  contactPrompt: 'Tidak menemukan jawaban yang Anda cari?',
  contactLabel: 'Hubungi Tim Kami',
  contactTo: whatsappConsultationUrl,
})

const searchQuery = ref('')
const initialGroup = props.groups.find(group => group.id === props.selectedGroupId) ?? props.groups[0]
const activeGroupId = computed(() => props.selectedGroupId ?? props.groups[0]?.id ?? '')
const initialOpenKey = initialGroup
  ? `${initialGroup.id}-${initialGroup.items.length > 1 ? 1 : 0}`
  : ''
const openItems = ref<string[]>(initialOpenKey ? [initialOpenKey] : [])

const visibleGroups = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('id-ID')

  return props.groups
    .filter(group => query || group.id === activeGroupId.value)
    .map((group) => {
      const items = group.items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !query || `${item.question} ${item.answer}`
          .toLocaleLowerCase('id-ID')
          .includes(query))

      if (query) {
        items.sort((first, second) =>
          Number(second.item.question.toLocaleLowerCase('id-ID').includes(query))
          - Number(first.item.question.toLocaleLowerCase('id-ID').includes(query)))
      }

      return { group, items }
    })
    .filter(({ items }) => items.length > 0)
    .sort((first, second) =>
      Number(second.group.id === activeGroupId.value)
      - Number(first.group.id === activeGroupId.value))
})

function itemKey(groupId: string, itemIndex: number) {
  return `${groupId}-${itemIndex}`
}

function isOpen(key: string) {
  return openItems.value.includes(key)
}

function toggleItem(key: string) {
  openItems.value = isOpen(key)
    ? openItems.value.filter(item => item !== key)
    : [...openItems.value, key]
}

watch(activeGroupId, (groupId) => {
  searchQuery.value = ''

  const group = props.groups.find(item => item.id === groupId)
  if (!group) return
  const defaultIndex = group.items.length > 1 ? 1 : 0
  const key = group.items.length ? itemKey(group.id, defaultIndex) : ''
  openItems.value = key ? [key] : []
})
</script>

<template>
  <section aria-labelledby="faq-directory-title" class="bg-bg-0 py-8 sm:py-10 lg:pb-20 lg:pt-16">
    <UiContainer>
      <header class="text-center">
        <p class="text-[16px] font-medium text-text-disable lg:text-[20px]">
          {{ eyebrow }}
        </p>
        <h1 id="faq-directory-title" class="mt-3 text-[40px] font-bold leading-[1.05] text-primary-500 sm:text-[56px] lg:text-[84px]">
          {{ title }}
        </h1>
        <p class="mx-auto mt-6 max-w-[860px] text-[14px] font-normal leading-[1.45] text-text-tertiary lg:text-[18px]">
          {{ description }}
        </p>

        <label class="relative mx-auto mt-5 block max-w-[410px]">
          <span class="sr-only">{{ searchPlaceholder }}</span>
          <Search
            :size="18"
            :stroke-width="1.8"
            aria-hidden="true"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-disable"
          />
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="searchPlaceholder"
            class="h-11 w-full rounded-full border border-border-300 bg-bg-0 pl-10 pr-4 text-[14px] font-normal text-text-secondary outline-none transition-colors placeholder:text-text-disable focus:border-primary-500"
          >
        </label>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4">
          <p class="text-[14px] text-text-tertiary">
            {{ contactPrompt }}
          </p>
          <UiAnimatedArrowButton
            :href="contactTo"
            target="_blank"
            variant="plain"
            class="inline-flex min-h-12 items-center gap-2 rounded-full bg-green-500 px-5 text-[14px] font-medium text-bg-0 transition-[background-color,color,box-shadow] hover:bg-green-100 hover:text-green-700 hover:ring-2 hover:ring-inset hover:ring-green-700 focus-visible:bg-green-100 focus-visible:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-700 lg:text-[16px]"
          >
            {{ contactLabel }}
            <template #trailing>
              <UiWhatsappIcon class="size-5" />
            </template>
          </UiAnimatedArrowButton>
        </div>
      </header>

      <div class="mt-14 grid items-start gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
        <nav aria-labelledby="faq-toc-title" class="rounded-2xl border border-border-200 bg-bg-0 p-4 shadow-md lg:sticky lg:top-28">
          <h2 id="faq-toc-title" class="text-[20px] font-medium text-primary-500">
            Daftar FAQ
          </h2>

          <ol class="mt-4 grid gap-2 sm:grid-cols-2 lg:block lg:space-y-2">
            <li
              v-for="(group, groupIndex) in groups"
              :key="group.id"
            >
              <NuxtLink
                :to="`/faq/${group.id}`"
                class="grid min-h-10 w-full grid-cols-[18px_minmax(0,1fr)] items-center gap-x-2 rounded-lg px-1.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                :class="activeGroupId === group.id ? 'bg-primary-50' : 'hover:bg-primary-50/60'"
                :aria-current="activeGroupId === group.id ? 'page' : undefined"
                @click="searchQuery = ''"
              >
                <span class="text-[16px] leading-[1.45] text-text-secondary">
                  {{ groupIndex + 1 }}
                </span>
                <span class="min-w-0 text-[16px] font-medium leading-[1.45] text-text-secondary">
                  {{ group.title }}
                </span>
              </NuxtLink>
            </li>
          </ol>
        </nav>

        <div class="min-w-0">
          <p
            v-if="visibleGroups.length === 0"
            class="rounded-2xl border border-border-200 px-6 py-10 text-center text-[14px] text-text-tertiary"
          >
            Tidak ada pertanyaan yang sesuai dengan pencarian Anda.
          </p>

          <section
            v-for="({ group, items }, groupIndex) in visibleGroups"
            :id="group.id"
            :key="group.id"
            :aria-labelledby="`${group.id}-title`"
            :class="groupIndex > 0 ? 'mt-8' : undefined"
          >
            <h2 :id="`${group.id}-title`" class="text-[22px] font-semibold text-text-secondary lg:text-[26px]">
              {{ group.title }}
            </h2>
            <p class="mt-1 text-[16px] text-text-tertiary lg:text-[20px]">
              {{ group.description }}
            </p>

            <div class="mt-4 space-y-2">
              <article
                v-for="{ item, index } in items"
                :id="`${itemKey(group.id, index)}-question`"
                :key="itemKey(group.id, index)"
                class="scroll-mt-32 overflow-hidden rounded-2xl border border-border-200 shadow-md"
              >
                <h3>
                  <button
                    type="button"
                    class="flex w-full items-start gap-2.5 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
                    :aria-expanded="isOpen(itemKey(group.id, index))"
                    :aria-controls="`${itemKey(group.id, index)}-answer`"
                    @click="toggleItem(itemKey(group.id, index))"
                  >
                    <span aria-hidden="true" class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#10b7a5] text-[9px] font-semibold text-bg-0">
                      Q
                    </span>
                    <span
                      class="flex-1 text-[16px] leading-[1.5] transition-colors"
                      :class="isOpen(itemKey(group.id, index))
                        ? 'font-medium text-primary-500'
                        : 'font-normal text-text-secondary'"
                    >
                      {{ item.question }}
                    </span>
                    <ChevronDown
                      :size="17"
                      :stroke-width="1.8"
                      aria-hidden="true"
                      class="mt-0.5 shrink-0 text-text-disable transition-transform duration-200"
                      :class="isOpen(itemKey(group.id, index)) ? 'rotate-180' : ''"
                    />
                  </button>
                </h3>

                <div
                  :id="`${itemKey(group.id, index)}-answer`"
                  :aria-hidden="!isOpen(itemKey(group.id, index))"
                  :inert="!isOpen(itemKey(group.id, index))"
                  class="grid transition-[grid-template-rows] duration-250 ease-out"
                  :class="isOpen(itemKey(group.id, index)) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                >
                  <div class="overflow-hidden">
                    <div class="mx-4 flex gap-2.5 border-t border-border-200 pb-4 pt-3">
                      <span aria-hidden="true" class="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary-300 text-[9px] font-semibold text-bg-0">
                        A
                      </span>
                      <p class="text-[16px] leading-[1.55] text-text-secondary">
                        {{ item.answer }}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
