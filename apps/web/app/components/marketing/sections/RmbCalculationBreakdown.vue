<script setup lang="ts">
import {
  Equal,
  Plus,
  X,
} from 'lucide-vue-next'
</script>

<template>
  <section
    id="rmb-calculation-breakdown"
    aria-labelledby="rmb-calculation-breakdown-title"
    class="bg-bg-100 py-14 sm:py-16"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="rmb-calculation-breakdown-title"
          class="text-[24px] font-bold uppercase leading-tight text-primary-500 lg:text-[32px] lg:font-semibold"
        >
          Our Calculation
        </h2>

        <p class="mx-auto mt-5 max-w-[760px] text-[14px] font-normal leading-[1.5] text-text-tertiary lg:text-[18px]">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.
        </p>
      </div>

      <div class="mx-auto mt-10 flex max-w-[920px] flex-col items-center gap-3 md:grid md:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)_40px_minmax(0,1fr)_40px_minmax(0,1.55fr)] md:gap-4">
        <div class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-bg-0 px-4 py-4 md:max-w-none">
          <p class="text-[14px] font-normal text-text-secondary">
            RMB Amount
          </p>
          <p class="mt-3 whitespace-nowrap text-[18px] font-medium text-text-secondary">
            ¥ 999,990.99
          </p>
        </div>

        <X
          :size="30"
          :stroke-width="1.8"
          aria-hidden="true"
          class="shrink-0 text-text-secondary"
        />

        <div class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-bg-0 px-4 py-4 md:max-w-none">
          <p class="text-[14px] font-normal text-text-secondary">
            Rate
          </p>
          <p class="mt-3 whitespace-nowrap text-[18px] font-medium text-text-secondary">
            Rp 2,300.00
          </p>
        </div>

        <Plus
          :size="30"
          :stroke-width="1.8"
          aria-hidden="true"
          class="shrink-0 text-text-secondary"
        />

        <div class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-bg-0 px-4 py-4 md:max-w-none">
          <p class="text-[14px] font-normal text-text-secondary">
            Admin Fee
          </p>
          <p class="mt-3 whitespace-nowrap text-[18px] font-medium text-text-secondary">
            Rp 50,000.00
          </p>
        </div>

        <Equal
          :size="30"
          :stroke-width="1.8"
          aria-hidden="true"
          class="shrink-0 text-text-secondary"
        />

        <div class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-primary-50 px-4 py-4 md:max-w-none">
          <p class="text-[14px] font-normal text-primary-500">
            Total Payments
          </p>
          <p class="mt-3 whitespace-nowrap text-[20px] font-semibold text-primary-500">
            Rp 999,999,999.00
          </p>
        </div>
      </div>

      <div class="mx-auto mt-8 grid max-w-[920px] gap-7 border-t-2 border-border-200 pt-8 md:grid-cols-3 md:gap-12">
        <article>
          <h3 class="text-[18px] font-medium text-primary-500">
            Rate
          </h3>
          <p class="mt-4 text-[14px] font-semibold text-text-secondary">
            ¥ 1 = 2,300
          </p>
          <p class="mt-4 text-[14px] font-normal leading-[1.5] text-text-secondary">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </article>

        <article>
          <h3 class="text-[18px] font-medium text-text-secondary">
            Admin Fee
          </h3>
          <p class="mt-4 text-[14px] font-normal leading-[1.5] text-text-secondary">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </article>

        <article>
          <h3 class="text-[18px] font-medium text-text-secondary">
            Total Payment
          </h3>
          <p class="mt-4 text-[14px] font-normal leading-[1.5] text-text-secondary">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.
          </p>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
