<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import {
  calculateAirCargoEstimate,
  calculateSeaCargoEstimate,
  type CargoEstimate,
} from '~/utils/cargoEstimate'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    cargoServices?: readonly string[]
    submitLabel?: string
    guidePrompt?: string
    guideLabel?: string
    guideTo?: string
    showGuideAction?: boolean
    sectionId?: string
    variant?: 'default' | 'page-hero' | 'split'
    calculatorEnabled?: boolean
    animatedSubmit?: boolean
  }>(),
  {
    title: 'Hitung Estimasi Tarif',
    description:
      'Dapatkan kalkulasi perkiraan biaya pengiriman All-In dari China ke Indonesia secara instan untuk perencanaan modal bisnis Anda.',
    cargoServices: () => [
      'FCL Cargo',
      'LCL Cargo',
      'Air Cargo',
    ],
    submitLabel: 'Hitung Estimasi Tarif',
    guidePrompt: 'Pelajari panduan pengkategorian barang',
    guideLabel: 'Lihat Panduan Kategori',
    guideTo: '/#sourcing',
    showGuideAction: true,
    sectionId: 'rate-estimator',
    variant: 'default',
    calculatorEnabled: false,
    animatedSubmit: false,
  },
)

const titleId = computed(() => `${props.sectionId}-title`)
const itemName = ref('')
const cargoService = ref('')
const lengthCm = ref('')
const widthCm = ref('')
const heightCm = ref('')
const weightPerBoxKg = ref('')
const boxCount = ref('')
const estimate = ref<CargoEstimate | null>(null)

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const decimalFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 4,
})

const totalAirWeightKg = computed(() => {
  if (estimate.value?.mode !== 'air')
    return 0

  return estimate.value.totalWeightKg
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatDecimal(value: number) {
  return decimalFormatter.format(value)
}

function handleSubmit() {
  if (!props.calculatorEnabled)
    return

  const quantity = Number(boxCount.value)

  if (cargoService.value === 'Air Cargo') {
    const totalWeight = Number(weightPerBoxKg.value) * quantity
    estimate.value = calculateAirCargoEstimate(totalWeight)
    return
  }

  estimate.value = calculateSeaCargoEstimate({
    lengthCm: Number(lengthCm.value),
    widthCm: Number(widthCm.value),
    heightCm: Number(heightCm.value),
    boxCount: quantity,
  })
}

watch(
  [itemName, cargoService, lengthCm, widthCm, heightCm, weightPerBoxKg, boxCount],
  () => {
    estimate.value = null
  },
)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-100"
    :class="variant === 'split' ? 'py-10' : 'py-16 sm:py-20'"
  >
    <UiContainer>
      <div class="text-center">
        <component
          :is="variant === 'page-hero' ? 'h1' : 'h2'"
          :id="titleId"
          class="leading-tight text-primary-500"
          :class="variant === 'page-hero'
            ? 'text-[28px] font-semibold lg:text-[32px] lg:font-bold'
            : variant === 'split'
              ? 'text-[24px] font-semibold lg:text-[28px]'
              : 'text-[24px] font-bold lg:text-[32px]'"
        >
          {{ title }}
        </component>

        <p
          class="mx-auto max-w-[900px] font-normal leading-[1.5] text-text-tertiary"
          :class="variant === 'split'
            ? 'mt-4 text-[14px] lg:text-[16px]'
            : variant === 'page-hero'
              ? 'mt-6 text-[16px] lg:text-[20px]'
              : 'mt-6 text-[14px] lg:text-[20px]'"
        >
          {{ description }}
        </p>
      </div>

      <div :class="variant === 'split' ? 'mx-auto mt-3 grid max-w-[840px] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,435px)] lg:gap-12' : 'contents'">
        <div v-if="variant === 'split'" class="mx-auto w-full max-w-[380px] min-w-0 lg:pt-4">
          <slot name="aside" />
        </div>

      <form
        :aria-labelledby="titleId"
        class="mx-auto w-full rounded-[20px] border border-border-200 bg-bg-0 p-5 shadow-md sm:p-7"
        :class="variant === 'split' ? 'split-form max-w-[435px]' : 'mt-8 max-w-[600px]'"
        @submit.prevent="handleSubmit"
      >
        <div>
          <label
            for="item-name"
            class="mb-2 block text-[16px] font-normal text-text-secondary"
          >
            Nama Barang
          </label>
          <input
            id="item-name"
            v-model.trim="itemName"
            name="item-name"
            type="text"
            required
            autocomplete="off"
            placeholder="Masukkan nama barang"
            class="h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
        </div>

        <div class="mt-4">
          <label
            for="cargo-service"
            class="mb-2 block text-[16px] font-normal text-text-secondary"
          >
            Jenis Layanan Kargo
          </label>

          <div class="relative">
            <select
              id="cargo-service"
              v-model="cargoService"
              name="cargo-service"
              required
              class="h-12 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-3 pr-10 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] invalid:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="" disabled>
                Pilih jenis layanan
              </option>
              <option
                v-for="service in cargoServices"
                :key="service"
                :value="service"
              >
                {{ service }}
              </option>
            </select>

            <ChevronDown
              :size="20"
              :stroke-width="1.8"
              aria-hidden="true"
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
          </div>
        </div>

        <fieldset class="mt-4">
          <legend class="sr-only">
            Dimensi barang
          </legend>

          <div class="grid grid-cols-3 gap-3">
            <label class="flex flex-col justify-between text-[16px] font-normal text-text-secondary">
              <span>Panjang <span class="sr-only text-text-tertiary sm:not-sr-only">(cm)</span></span>
              <input
                name="length"
                v-model="lengthCm"
                type="number"
                min="0"
                step="0.1"
                required
                inputmode="decimal"
                placeholder="0 cm"
                class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
            </label>

            <label class="flex flex-col justify-between text-[16px] font-normal text-text-secondary">
              <span>Lebar <span class="sr-only text-text-tertiary sm:not-sr-only">(cm)</span></span>
              <input
                name="width"
                v-model="widthCm"
                type="number"
                min="0"
                step="0.1"
                required
                inputmode="decimal"
                placeholder="0 cm"
                class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
            </label>

            <label class="flex flex-col justify-between text-[16px] font-normal text-text-secondary">
              <span>Tinggi <span class="sr-only text-text-tertiary sm:not-sr-only">(cm)</span></span>
              <input
                name="height"
                v-model="heightCm"
                type="number"
                min="0"
                step="0.1"
                required
                inputmode="decimal"
                placeholder="0 cm"
                class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
            </label>
          </div>
        </fieldset>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <label class="flex flex-col justify-between text-[16px] font-normal text-text-secondary">
            <span>Berat Box <span class="text-text-tertiary">(kg)</span></span>
            <input
              name="weight"
              v-model="weightPerBoxKg"
              type="number"
              min="0"
              step="0.1"
              required
              inputmode="decimal"
              placeholder="0 kg"
              class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
          </label>

          <label class="flex flex-col justify-between text-[16px] font-normal text-text-secondary">
            <span>Jumlah Box <span class="text-text-tertiary">(koli)</span></span>
            <input
              name="box-count"
              v-model="boxCount"
              type="number"
              min="1"
              step="1"
              required
              inputmode="numeric"
              placeholder="0 box"
              class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
          </label>
        </div>

        <div class="mt-8 flex justify-end">
          <UiAnimatedArrowButton
            v-if="animatedSubmit"
            type="submit"
            variant="plain"
            :show-arrow="false"
            class="inline-flex h-14 w-full items-center justify-center rounded-xl bg-primary-500 px-6 text-[16px] font-semibold text-bg-0 transition-[background-color,color,box-shadow] duration-200 hover:bg-primary-100 hover:text-primary-500 hover:ring-2 hover:ring-inset hover:ring-primary-500 focus-visible:bg-primary-100 focus-visible:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 sm:w-auto lg:text-[15px]"
          >
            {{ submitLabel }}
          </UiAnimatedArrowButton>

          <button
            v-else
            type="submit"
            class="inline-flex h-14 w-full items-center justify-center rounded-xl bg-primary-500 px-6 text-[16px] font-semibold text-bg-0 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto lg:text-[15px]"
          >
            {{ submitLabel }}
          </button>
        </div>

        <div
          v-if="calculatorEnabled && estimate"
          class="mt-6 rounded-xl border border-primary-100 bg-primary-50 p-4"
          aria-live="polite"
        >
          <p class="text-[14px] font-normal text-text-tertiary">
            Total Estimasi Biaya
          </p>
          <p class="mt-1 text-[24px] font-semibold leading-tight text-primary-500">
            {{ formatCurrency(estimate.totalPrice) }}
          </p>
          <p v-if="estimate.mode === 'air'" class="mt-2 text-[12px] leading-relaxed text-text-tertiary">
            {{ formatDecimal(totalAirWeightKg) }} kg × {{ formatCurrency(estimate.ratePerKg) }}/kg
          </p>
          <p v-else class="mt-2 text-[12px] leading-relaxed text-text-tertiary">
            {{ formatDecimal(estimate.totalVolumeCbm) }} CBM × {{ formatCurrency(estimate.ratePerCbm) }}/CBM
          </p>
          <p class="mt-2 text-[12px] leading-relaxed text-text-tertiary">
            * Hasil di atas merupakan estimasi awal dan dapat berubah setelah pengecekan barang.
          </p>
        </div>
      </form>
      </div>

      <div v-if="variant !== 'split'" class="mt-14 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
        <p
          class="text-text-tertiary lg:font-normal"
          :class="variant === 'page-hero' ? 'text-[16px] font-normal lg:text-[20px]' : 'text-[14px] font-medium lg:text-[16px]'"
        >
          {{ guidePrompt }}
        </p>

        <UiAnimatedArrowButton
          v-if="showGuideAction"
          :to="guideTo"
          variant="plain"
          :icon-size="16"
          class="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-50 px-5 text-[14px] font-medium text-primary-500 transition-colors hover:bg-primary-500 hover:text-white focus-visible:bg-primary-500 focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          {{ guideLabel }}
        </UiAnimatedArrowButton>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.split-form {
  padding: 1.25rem;
}

.split-form label {
  font-size: 0.8125rem;
  line-height: 1.5;
}

.split-form input,
.split-form select {
  height: 2.75rem;
  font-size: 0.8125rem;
}

.split-form label.mb-2 {
  margin-bottom: 0.375rem;
}

.split-form label input.mt-2 {
  margin-top: 0.375rem;
}

.split-form > .mt-4,
.split-form > fieldset.mt-4 {
  margin-top: 0.75rem;
}

.split-form > .mt-8 {
  margin-top: 1.5rem;
}

.split-form button[type='submit'] {
  height: 3rem;
  font-size: 0.8125rem;
}
</style>
