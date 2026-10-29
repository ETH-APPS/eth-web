<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import type { MarketingFaqContent } from '~/constants/faq'

const props = withDefaults(defineProps<{
  title?: string
  content: MarketingFaqContent
  defaultOpenIndex?: number | null
  sectionId?: string
}>(), {
  title: 'FAQ',
  defaultOpenIndex: 1,
  sectionId: 'faq',
})

const activeFaq = ref<number | null>(props.defaultOpenIndex)
const titleId = computed(() => `${props.sectionId}-title`)

watch(
  [() => props.content.items, () => props.defaultOpenIndex],
  () => {
    activeFaq.value = props.defaultOpenIndex
  },
)

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-0 py-12 lg:py-16"
  >
    <UiContainer>
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8">
        <div class="text-center lg:text-left">
          <h2
            :id="titleId"
            class="text-[56px] font-bold leading-none tracking-tight text-primary-500 lg:text-[120px]"
          >
            {{ title }}
          </h2>
          <p class="mt-3 text-[14px] font-medium text-text-disable lg:mt-5 lg:text-[24px] lg:font-normal">
            {{ content.subtitle }}
          </p>
          <p class="mt-5 text-[16px] font-medium leading-[1.45] text-text-secondary lg:mt-8 lg:font-normal lg:leading-[1.55]">
            {{ content.description }}
          </p>
        </div>

        <div class="mx-auto w-full max-w-[720px] space-y-2 lg:max-w-none">
          <article
            v-for="(faq, index) in content.items"
            :key="`${sectionId}-${index}`"
            class="rounded-md border transition-[border-color,box-shadow] duration-300 lg:rounded-2xl"
            :class="activeFaq === index
              ? 'border-border-200 shadow-[0_5px_12px_rgba(15,23,42,0.10)]'
              : 'border-transparent hover:border-border-200 hover:shadow-[0_2px_6px_rgba(15,23,42,0.06)]'"
          >
            <h3>
              <button
                type="button"
                class="flex min-h-12 w-full items-start gap-2 rounded-md px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:items-center lg:gap-3 lg:rounded-2xl lg:px-5 lg:py-4"
                :aria-expanded="activeFaq === index"
                :aria-controls="`${sectionId}-answer-${index}`"
                @click="toggleFaq(index)"
              >
                <span
                  aria-hidden="true"
                  class="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#4fb3a5] text-[10px] font-medium text-bg-0 lg:mt-0 lg:size-6 lg:text-[12px]"
                >
                  Q
                </span>
                <span
                  class="min-w-0 flex-1 text-[16px] leading-[1.5] transition-colors duration-200 lg:leading-normal"
                  :class="activeFaq === index ? 'font-semibold text-primary-500 lg:font-medium' : 'font-normal text-text-secondary'"
                >
                  {{ faq.question }}
                </span>
                <ChevronDown
                  :size="20"
                  :stroke-width="1.8"
                  aria-hidden="true"
                  class="mt-0.5 shrink-0 text-text-disable transition-transform duration-300 lg:mt-0"
                  :class="activeFaq === index ? 'rotate-180' : ''"
                />
              </button>
            </h3>

            <div
              :id="`${sectionId}-answer-${index}`"
              class="grid transition-[grid-template-rows] duration-300 ease-out"
              :class="activeFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden">
                <div class="mx-4 flex gap-2 border-t border-border-200 pb-5 pt-4 lg:mx-5 lg:gap-3">
                  <span
                    aria-hidden="true"
                    class="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary-300 text-[10px] font-medium text-bg-0 lg:mt-0 lg:size-6 lg:text-[12px]"
                  >
                    A
                  </span>
                  <p class="min-w-0 text-[16px] font-normal leading-[1.55] text-text-secondary">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </UiContainer>
  </section>

  <slot />
</template>
