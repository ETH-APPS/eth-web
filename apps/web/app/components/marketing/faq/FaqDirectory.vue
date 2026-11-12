<script setup lang="ts">
import {
  ChevronDown,
  Search,
} from 'lucide-vue-next'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'

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
  eyebrow?: string
  title?: string
  description?: string
  searchPlaceholder?: string
  contactPrompt?: string
  contactLabel?: string
  contactTo?: string
}>(), {
  eyebrow: 'Frequently Asked Question',
  title: 'FAQ',
  description:
    'Temukan informasi dan jawaban yang Anda butuhkan seputar layanan, pengiriman, dan fitur ETH Cargo.',
  searchPlaceholder: 'Cari artikel',
  contactPrompt: 'Belum menemukan jawaban yang Anda cari?',
  contactLabel: 'Ingin Bertanya',
  contactTo: '#footer',
})

const searchQuery = ref('')
const initialGroup = props.groups[0]
const activeGroupId = ref(initialGroup?.id ?? '')
const initialOpenKey = initialGroup
  ? `${initialGroup.id}-${initialGroup.items.length > 1 ? 1 : 0}`
  : ''
const openItems = ref<string[]>(initialOpenKey ? [initialOpenKey] : [])

const activeGroup = computed(() => (
  props.groups.find(group => group.id === activeGroupId.value) ?? props.groups[0]
))

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('id-ID')
  const group = activeGroup.value

  if (!group) return []
  if (!query) return group.items

  return group.items.filter(item => (
    `${item.question} ${item.answer}`
      .toLocaleLowerCase('id-ID')
      .includes(query)
  ))
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

function selectGroup(group: FaqDirectoryGroup) {
  activeGroupId.value = group.id
  searchQuery.value = ''

  const defaultIndex = group.items.length > 1 ? 1 : 0
  const key = group.items.length ? itemKey(group.id, defaultIndex) : ''
  openItems.value = key ? [key] : []
}
</script>

<template>
  <section aria-labelledby="faq-directory-title" class="bg-bg-0 py-16 sm:py-20">
    <UiContainer>
      <header class="text-center">
        <p class="text-[16px] font-medium text-text-disable lg:text-[24px]">
          {{ eyebrow }}
        </p>
        <h1 id="faq-directory-title" class="mt-2 text-[56px] font-bold leading-none text-primary-500 lg:text-[120px]">
          {{ title }}
        </h1>
        <p class="mx-auto mt-7 max-w-[900px] text-[14px] font-normal leading-[1.55] text-text-tertiary lg:text-[20px]">
          {{ description }}
        </p>

        <label class="relative mx-auto mt-5 block max-w-[440px]">
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
            class="h-12 w-full rounded-full border border-border-300 bg-bg-0 pl-11 pr-4 text-[16px] font-normal text-text-secondary outline-none transition-colors placeholder:text-text-disable focus:border-primary-500"
          >
        </label>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4">
          <p class="text-[14px] text-text-tertiary">
            {{ contactPrompt }}
          </p>
          <NuxtLink
            :to="contactTo"
            class="inline-flex h-11 items-center gap-2 rounded-full bg-green-500 px-5 text-[14px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 lg:h-10 lg:text-[16px]"
          >
            <span>{{ contactLabel }}</span>
            <img
              :src="whatsappUrl"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
              class="size-4 object-contain"
            >
          </NuxtLink>
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
              <button
                type="button"
                class="grid min-h-10 w-full grid-cols-[18px_minmax(0,1fr)] items-center gap-x-2 rounded-lg px-1.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                :class="activeGroupId === group.id ? 'bg-primary-50' : 'hover:bg-primary-50/60'"
                :aria-current="activeGroupId === group.id ? 'true' : undefined"
                :aria-controls="group.id"
                @click="selectGroup(group)"
              >
                <span class="text-[16px] leading-[1.45] text-text-secondary">
                  {{ groupIndex + 1 }}
                </span>
                <span class="min-w-0 text-[16px] font-medium leading-[1.45] text-text-secondary">
                  {{ group.title }}
                </span>
              </button>
            </li>
          </ol>
        </nav>

        <div v-if="activeGroup" class="min-w-0">
          <p
            v-if="filteredItems.length === 0"
            class="rounded-2xl border border-border-200 px-6 py-10 text-center text-[14px] text-text-tertiary"
          >
            Tidak ada artikel yang sesuai dengan pencarian Anda.
          </p>

          <section
            v-else
            :id="activeGroup.id"
            :aria-labelledby="`${activeGroup.id}-title`"
          >
            <h2 :id="`${activeGroup.id}-title`" class="text-[22px] font-semibold text-text-secondary lg:text-[26px]">
              {{ activeGroup.title }}
            </h2>
            <p class="mt-1 text-[16px] text-text-tertiary lg:text-[20px]">
              {{ activeGroup.description }}
            </p>

            <div class="mt-4 space-y-2">
              <article
                v-for="(item, itemIndex) in filteredItems"
                :id="`${itemKey(activeGroup.id, itemIndex)}-question`"
                :key="item.question"
                class="scroll-mt-32 overflow-hidden rounded-2xl border border-border-200 shadow-md"
              >
                <h3>
                  <button
                    type="button"
                    class="flex w-full items-start gap-2.5 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
                    :aria-expanded="isOpen(itemKey(activeGroup.id, itemIndex))"
                    :aria-controls="`${itemKey(activeGroup.id, itemIndex)}-answer`"
                    @click="toggleItem(itemKey(activeGroup.id, itemIndex))"
                  >
                    <span aria-hidden="true" class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#10b7a5] text-[9px] font-semibold text-bg-0">
                      Q
                    </span>
                    <span
                      class="flex-1 text-[16px] leading-[1.5] transition-colors"
                      :class="isOpen(itemKey(activeGroup.id, itemIndex))
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
                      :class="isOpen(itemKey(activeGroup.id, itemIndex)) ? 'rotate-180' : ''"
                    />
                  </button>
                </h3>

                <div
                  :id="`${itemKey(activeGroup.id, itemIndex)}-answer`"
                  :aria-hidden="!isOpen(itemKey(activeGroup.id, itemIndex))"
                  :inert="!isOpen(itemKey(activeGroup.id, itemIndex))"
                  class="grid transition-[grid-template-rows] duration-250 ease-out"
                  :class="isOpen(itemKey(activeGroup.id, itemIndex)) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
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
