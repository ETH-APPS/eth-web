<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const transferTargets = [
  'Alipay',
  'Bank of China',
  'WeChat Pay',
  '1688',
  'Taobao',
  'Alibaba',
] as const

const transferAmount = ref<number | null>(null)
const selectedTarget = ref<(typeof transferTargets)[number]>('Alipay')
</script>

<template>
  <section
    id="rmb-rate-estimator"
    aria-labelledby="rmb-rate-estimator-title"
    class="bg-bg-100 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="text-center">
        <h1
          id="rmb-rate-estimator-title"
          class="text-[28px] font-semibold leading-tight text-primary-500 lg:text-[32px] lg:font-bold"
        >
          Hitung Estimasi Tarif
        </h1>

        <p class="mx-auto mt-6 max-w-[900px] text-[16px] font-normal leading-[1.5] text-text-tertiary lg:text-[20px]">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
      </div>

      <form
        aria-labelledby="rmb-rate-estimator-title"
        class="mx-auto mt-8 max-w-[360px] rounded-[20px] border border-border-200 bg-bg-0 p-5 shadow-md sm:p-6"
        @submit.prevent
      >
        <label
          for="rmb-transfer-amount"
          class="mb-2 block text-[14px] font-normal text-text-secondary"
        >
          Nominal RMB Transfer (¥)
        </label>
        <input
          id="rmb-transfer-amount"
          v-model.number="transferAmount"
          name="rmb-transfer-amount"
          type="number"
          min="1"
          step="1"
          required
          inputmode="decimal"
          placeholder="Nominal transfer"
          class="h-12 w-full rounded-xl border border-border-200 bg-bg-0 px-3 text-[14px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        >

        <label
          for="rmb-transfer-target"
          class="mb-2 mt-4 block text-[14px] font-normal text-text-secondary"
        >
          Transfer Tujuan
        </label>
        <div class="relative">
          <select
            id="rmb-transfer-target"
            v-model="selectedTarget"
            name="rmb-transfer-target"
            class="h-12 w-full appearance-none rounded-xl border border-border-200 bg-bg-0 px-3 pr-10 text-[14px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option
              v-for="target in transferTargets"
              :key="target"
              :value="target"
            >
              {{ target }}
            </option>
          </select>

          <ChevronDown
            :size="18"
            :stroke-width="1.8"
            aria-hidden="true"
            class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
        </div>

        <dl class="mt-4 flex items-start justify-between gap-5 border-t border-border-200 pt-4 text-text-secondary">
          <dt>
            <p class="text-[14px] font-normal">
              Currency Rate
            </p>
            <p class="mt-0.5 text-[9px] font-normal text-text-tertiary">
              Currency rate based on BCA per ¥ 1
            </p>
          </dt>
          <dd class="shrink-0 text-[14px] font-medium">
            Rp 2,300
          </dd>
        </dl>

        <div class="mt-5 flex justify-end">
          <button
            type="submit"
            class="inline-flex h-12 items-center justify-center rounded-xl bg-primary-500 px-5 text-[14px] font-semibold text-bg-0 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            Hitung Transfer
          </button>
        </div>
      </form>

      <p class="mx-auto mt-14 text-center text-[16px] font-normal text-text-tertiary lg:text-[20px]">
        Lorem ipsum dolor sit amet consectetur adipiscing elit.
      </p>
    </UiContainer>
  </section>
</template>
