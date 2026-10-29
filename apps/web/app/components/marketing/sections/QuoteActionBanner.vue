<script setup lang="ts">
import { Calculator, Mail } from 'lucide-vue-next'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'
import type { MarketingFaqContent } from '~/constants/faq'

const props = withDefaults(defineProps<{
  content: Pick<MarketingFaqContent, 'quoteTitle' | 'quoteDescription' | 'calculatorTo'>
  sectionId?: string
  emailLabel?: string
  email?: string
  calculatorLabel?: string
  consultationLabel?: string
  consultationTo?: string
}>(), {
  sectionId: 'quote',
  emailLabel: 'Atau hubungi kami via email:',
  email: 'email@ethcargo.co.id',
  calculatorLabel: 'Hitung Biaya',
  consultationLabel: 'Konsultasi Gratis',
  consultationTo: '#quote',
})

const titleId = computed(() => `${props.sectionId}-title`)
const emailHref = computed(() => `mailto:${props.email}`)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-primary-600 py-7 text-bg-0 lg:py-14"
  >
    <div class="mx-auto w-full max-w-[1250px] px-6">
      <div class="flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
        <div class="max-w-[600px]">
          <h2
            :id="titleId"
            class="text-[32px] font-bold leading-tight lg:text-[30px] lg:font-semibold"
          >
            {{ content.quoteTitle }}
          </h2>
          <p class="mt-3 text-[22px] font-medium leading-[1.5] text-bg-0/95 lg:text-[20px] lg:leading-[1.35]">
            {{ content.quoteDescription }}
          </p>

          <p class="mt-9 text-[16px] font-medium text-bg-0/90 lg:mt-6 lg:text-[13px]">
            {{ emailLabel }}
          </p>
          <a
            :href="emailHref"
            class="mt-2 inline-flex items-center gap-2 text-[14px] text-bg-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0 lg:mt-1.5 lg:text-[13px]"
          >
            <Mail
              :size="18"
              :stroke-width="1.8"
              aria-hidden="true"
              class="size-6 shrink-0 lg:size-[18px]"
            />
            <span>{{ email }}</span>
          </a>
        </div>

        <div class="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:gap-3 lg:shrink-0">
          <NuxtLink
            :to="content.calculatorTo"
            class="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-primary-500 px-2 text-[16px] font-medium text-bg-0 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0 lg:h-12 lg:min-h-0 lg:rounded-xl lg:px-6 lg:text-[14px] lg:font-normal"
          >
            <Calculator
              :size="19"
              :stroke-width="1.8"
              aria-hidden="true"
              class="size-[22px] lg:size-[19px]"
            />
            <span>{{ calculatorLabel }}</span>
          </NuxtLink>
          <NuxtLink
            :to="consultationTo"
            class="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-green-500 px-2 text-[16px] font-medium text-bg-0 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0 lg:h-12 lg:min-h-0 lg:rounded-xl lg:px-6 lg:text-[14px] lg:font-normal"
          >
            <span>{{ consultationLabel }}</span>
            <img
              :src="whatsappUrl"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
              class="size-6 shrink-0 object-contain lg:size-5"
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
