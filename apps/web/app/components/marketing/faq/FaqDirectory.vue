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
const activeQuestion = ref('')
const openItems = ref<string[]>(
  props.groups.flatMap((group, groupIndex) => (
    group.items.length > 1 && groupIndex < 3 ? [`${group.id}-1`] : []
  )),
)
const expandedTocGroups = ref<string[]>(props.groups.slice(0, 1).map(group => group.id))

const filteredGroups = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('id-ID')

  if (!query) return props.groups

  return props.groups
    .map((group) => {
      const groupMatches = `${group.title} ${group.description}`
        .toLocaleLowerCase('id-ID')
        .includes(query)
      const items = groupMatches
        ? group.items
        : group.items.filter(item => (
            `${item.question} ${item.answer}`
              .toLocaleLowerCase('id-ID')
              .includes(query)
          ))

      return { ...group, items }
    })
    .filter(group => group.items.length > 0)
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
  activeQuestion.value = key
}

function isTocGroupExpanded(groupId: string) {
  return expandedTocGroups.value.includes(groupId)
}

function toggleTocGroup(groupId: string) {
  expandedTocGroups.value = isTocGroupExpanded(groupId)
    ? expandedTocGroups.value.filter(id => id !== groupId)
    : [...expandedTocGroups.value, groupId]
}

function goToQuestion(groupId: string, itemIndex: number) {
  const key = itemKey(groupId, itemIndex)
  activeQuestion.value = key
  if (!isOpen(key)) openItems.value = [...openItems.value, key]

  document.getElementById(`${key}-question`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
</script>

<template>
  <section class="bg-bg-0 py-16 sm:py-20">
    <UiContainer>
      <header class="text-center">
        <p class="text-[24px] font-medium text-text-disable">
          {{ eyebrow }}
        </p>
        <h1 class="mt-2 text-[120px] font-bold leading-none text-primary-500">
          {{ title }}
        </h1>
        <p class="mx-auto mt-7 max-w-[900px] text-[20px] leading-[1.55] text-text-tertiary">
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
            class="h-12 w-full rounded-full border border-border-300 bg-bg-0 pl-11 pr-4 text-[16px] text-text-secondary outline-none transition-colors placeholder:text-text-disable focus:border-primary-500"
          >
        </label>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4">
          <p class="text-[14px] text-text-tertiary">
            {{ contactPrompt }}
          </p>
          <NuxtLink
            :to="contactTo"
            class="inline-flex h-10 items-center gap-2 rounded-full bg-green-500 px-5 text-[16px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
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
        <aside class="rounded-2xl border border-border-200 bg-bg-0 p-4 shadow-md lg:sticky lg:top-28">
          <h2 class="text-[20px] font-medium text-primary-500">
            Table of Content
          </h2>

          <ol class="mt-4 space-y-3">
            <li
              v-for="(group, groupIndex) in groups"
              :key="group.id"
            >
              <button
                type="button"
                class="grid w-full grid-cols-[18px_minmax(0,1fr)_16px] items-start gap-x-1.5 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                :aria-expanded="isTocGroupExpanded(group.id)"
                @click="toggleTocGroup(group.id)"
              >
                <span class="text-[16px] leading-[1.45] text-text-secondary">
                  {{ groupIndex + 1 }}
                </span>
                <span class="min-w-0 text-[16px] font-medium leading-[1.45] text-text-secondary">
                  {{ group.title }}
                </span>
                <ChevronDown
                  :size="16"
                  :stroke-width="1.8"
                  aria-hidden="true"
                  class="mt-[3px] shrink-0 text-primary-500 transition-transform"
                  :class="isTocGroupExpanded(group.id) ? 'rotate-180' : ''"
                />
              </button>

              <div
                class="grid transition-[grid-template-rows] duration-200"
                :class="isTocGroupExpanded(group.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <div class="overflow-hidden">
                  <div class="ml-6 mt-2 space-y-1">
                    <button
                      v-for="(item, itemIndex) in group.items"
                      :key="item.question"
                      type="button"
                      class="block w-full rounded-md px-2 py-1.5 text-left text-[14px] leading-[1.45] transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
                      :class="activeQuestion === itemKey(group.id, itemIndex)
                        ? 'bg-primary-50 text-text-secondary'
                        : 'text-text-secondary hover:bg-primary-50'"
                      @click="goToQuestion(group.id, itemIndex)"
                    >
                      {{ item.question }}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </aside>

        <div>
          <p
            v-if="filteredGroups.length === 0"
            class="rounded-2xl border border-border-200 px-6 py-10 text-center text-[14px] text-text-tertiary"
          >
            Tidak ada artikel yang sesuai dengan pencarian Anda.
          </p>

          <section
            v-for="(group, groupIndex) in filteredGroups"
            :id="group.id"
            :key="group.id"
            :class="groupIndex > 0 ? 'mt-10' : ''"
          >
            <h2 class="text-[22px] font-semibold text-text-secondary">
              {{ group.title }}
            </h2>
            <p class="mt-1 text-[20px] text-text-tertiary">
              {{ group.description }}
            </p>

            <div class="mt-4 space-y-2">
              <article
                v-for="(item, itemIndex) in group.items"
                :id="`${itemKey(group.id, itemIndex)}-question`"
                :key="item.question"
                class="scroll-mt-32 overflow-hidden rounded-2xl border border-border-200 shadow-md"
              >
                <h3>
                  <button
                    type="button"
                    class="flex w-full items-start gap-2.5 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
                    :aria-expanded="isOpen(itemKey(group.id, itemIndex))"
                    :aria-controls="`${itemKey(group.id, itemIndex)}-answer`"
                    @click="toggleItem(itemKey(group.id, itemIndex))"
                  >
                    <span class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#10b7a5] text-[9px] font-semibold text-bg-0">
                      Q
                    </span>
                    <span
                      class="flex-1 text-[16px] leading-[1.5] transition-colors"
                      :class="isOpen(itemKey(group.id, itemIndex))
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
                      :class="isOpen(itemKey(group.id, itemIndex)) ? 'rotate-180' : ''"
                    />
                  </button>
                </h3>

                <div
                  :id="`${itemKey(group.id, itemIndex)}-answer`"
                  class="grid transition-[grid-template-rows] duration-250 ease-out"
                  :class="isOpen(itemKey(group.id, itemIndex)) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                >
                  <div class="overflow-hidden">
                    <div class="mx-4 flex gap-2.5 border-t border-border-200 pb-4 pt-3">
                      <span class="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary-300 text-[9px] font-semibold text-bg-0">
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
