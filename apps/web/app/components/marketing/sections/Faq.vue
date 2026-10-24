<script setup lang="ts">
import {
  Calculator,
  ChevronDown,
  Mail,
  MessageCircle,
} from 'lucide-vue-next'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'

const props = withDefaults(defineProps<{
  title?: string
  subtitle: string
  description: string
  items: readonly {
    question: string
    answer: string
  }[]
  defaultOpenIndex?: number | null
  sectionId?: string
  quoteSectionId?: string
  quoteTitle?: string
  quoteDescription?: string
  emailLabel?: string
  email?: string
  calculatorLabel?: string
  calculatorTo?: string
  consultationLabel?: string
  consultationTo?: string
}>(), {
  title: 'FAQ',
  defaultOpenIndex: 1,
  sectionId: 'faq',
  quoteSectionId: 'quote',
  quoteTitle: 'Siap Kirim Kargo Impor Anda?',
  quoteDescription:
    'Hitung estimasi pengiriman dengan kalkulator kargo kami, atau konsultasikan kebutuhan impor bisnis Anda langsung bersama tim ahli ETH Cargo.',
  emailLabel: 'Atau hubungi kami via email:',
  email: 'email@ethcargo.co.id',
  calculatorLabel: 'Hitung Biaya',
  calculatorTo: '#main-services',
  consultationLabel: 'Konsultasi Gratis',
  consultationTo: '#quote',
})

const activeFaq = ref<number | null>(props.defaultOpenIndex)
const titleId = computed(() => `${props.sectionId}-title`)
const quoteTitleId = computed(() => `${props.quoteSectionId}-title`)
const emailHref = computed(() => `mailto:${props.email}`)

watch(
  [() => props.items, () => props.defaultOpenIndex],
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
    class="bg-bg-0 py-16"
  >
    <UiContainer>
      <div class="grid grid-cols-[380px_minmax(0,1fr)] items-start gap-8">
        <div>
          <h2
            :id="titleId"
            class="text-[120px] font-bold leading-none tracking-tight text-primary-500"
          >
            {{ title }}
          </h2>
          <p class="mt-5 text-[24px] font-normal text-text-disable">
            {{ subtitle }}
          </p>
          <p class="mt-8 text-[16px] font-normal leading-[1.55] text-text-secondary">
            {{ description }}
          </p>
        </div>

        <div class="space-y-2">
          <article
            v-for="(faq, index) in items"
            :key="faq.question"
            class="rounded-2xl border transition-[border-color,box-shadow] duration-300"
            :class="activeFaq === index
              ? 'border-border-200 shadow-[0_5px_12px_rgba(15,23,42,0.10)]'
              : 'border-transparent hover:border-border-200 hover:shadow-[0_2px_6px_rgba(15,23,42,0.06)]'"
          >
            <h3>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                :aria-expanded="activeFaq === index"
                :aria-controls="`${sectionId}-answer-${index}`"
                @click="toggleFaq(index)"
              >
                <span
                  aria-hidden="true"
                  class="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4fb3a5] text-[12px] font-medium text-bg-0"
                >
                  Q
                </span>
                <span
                  class="flex-1 text-[16px] transition-colors duration-200"
                  :class="activeFaq === index ? 'font-medium text-primary-500' : 'font-normal text-text-secondary'"
                >
                  {{ faq.question }}
                </span>
                <ChevronDown
                  :size="20"
                  :stroke-width="1.8"
                  aria-hidden="true"
                  class="shrink-0 text-text-disable transition-transform duration-300"
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
                <div class="mx-5 flex gap-3 border-t border-border-200 pb-5 pt-4">
                  <span
                    aria-hidden="true"
                    class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-300 text-[12px] font-medium text-bg-0"
                  >
                    A
                  </span>
                  <p class="text-[16px] font-normal leading-[1.55] text-text-secondary">
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

  <section
    :id="quoteSectionId"
    :aria-labelledby="quoteTitleId"
    class="bg-primary-600 py-14 text-bg-0"
  >
    <div class="mx-auto w-full max-w-[1250px] px-6">
      <div class="flex items-end justify-between gap-14">
        <div class="max-w-[600px]">
          <h2
            :id="quoteTitleId"
            class="text-[30px] font-semibold leading-tight"
          >
            {{ quoteTitle }}
          </h2>
          <p class="mt-3 text-[20px] font-medium leading-[1.35] text-bg-0/95">
            {{ quoteDescription }}
          </p>

          <p class="mt-6 text-[13px] font-medium text-bg-0/90">
            {{ emailLabel }}
          </p>
          <a
            :href="emailHref"
            class="mt-1.5 inline-flex items-center gap-2 text-[13px] text-bg-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
          >
            <Mail
              :size="18"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span>{{ email }}</span>
          </a>
        </div>

        <div class="flex shrink-0 items-center gap-3">
          <NuxtLink
            :to="calculatorTo"
            class="inline-flex h-12 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[14px] text-bg-0 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
          >
            <Calculator
              :size="19"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span>{{ calculatorLabel }}</span>
          </NuxtLink>
          <NuxtLink
            :to="consultationTo"
            class="inline-flex h-12 items-center gap-2 rounded-xl bg-green-500 px-6 text-[14px] text-bg-0 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
          >
            <span>{{ consultationLabel }}</span>
            <img
              :src="whatsappUrl"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
              class="size-5 shrink-0 object-contain"
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
