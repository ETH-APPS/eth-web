<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { CARGO_DELIVERY_ESTIMATES } from '~/constants/cargoDelivery'
import { shippingPriceWhatsappUrl } from '~/constants/whatsapp'
import {
  calculateAirCargoEstimate,
  calculateSeaCargoEstimate,
  formatShippingPriceInput,
  type CargoEstimate,
} from '~/utils/cargoEstimate'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    cargoServices?: readonly string[]
    defaultCargoService?: string
    submitLabel?: string
    guidePrompt?: string
    guideLabel?: string
    guideTo?: string
    showGuideAction?: boolean
    sectionId?: string
    variant?: 'default' | 'page-hero' | 'split'
    calculatorEnabled?: boolean
    animatedSubmit?: boolean
    showShippingPriceField?: boolean
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
    guideTo: '/artikel',
    showGuideAction: true,
    sectionId: 'rate-estimator',
    variant: 'default',
    calculatorEnabled: false,
    animatedSubmit: false,
    showShippingPriceField: false,
  },
)

const titleId = computed(() => `${props.sectionId}-title`)
const itemName = ref('')
const cargoService = ref(props.defaultCargoService ?? (props.showShippingPriceField ? 'LCL Cargo' : ''))
const shippingPrice = ref('')
const lengthCm = ref('')
const widthCm = ref('')
const heightCm = ref('')
const weightPerBoxKg = ref('')
const boxCount = ref('')
const estimate = ref<CargoEstimate | null>(null)
const detailsOpen = ref(true)

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

function handleShippingPriceInput(event: Event) {
  const input = event.target as HTMLInputElement
  const digitsBeforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, '').length
  const formatted = formatShippingPriceInput(input.value)

  shippingPrice.value = formatted.replaceAll('.', '')
  input.value = formatted
  const caret = formatShippingPriceInput(shippingPrice.value.slice(0, digitsBeforeCaret)).length
  input.setSelectionRange(caret, caret)
}

function handleSubmit() {
  if (!props.calculatorEnabled)
    return

  const quantity = Number(boxCount.value)
  const enteredRate = props.showShippingPriceField ? Number(shippingPrice.value) : undefined
  detailsOpen.value = cargoService.value === 'Air Cargo'

  if (cargoService.value === 'Air Cargo') {
    const totalWeight = Number(weightPerBoxKg.value) * quantity
    estimate.value = calculateAirCargoEstimate(totalWeight, enteredRate)
    return
  }

  estimate.value = calculateSeaCargoEstimate({
    lengthCm: Number(lengthCm.value),
    widthCm: Number(widthCm.value),
    heightCm: Number(heightCm.value),
    boxCount: quantity,
  }, enteredRate)
}

watch(
  [itemName, cargoService, shippingPrice, lengthCm, widthCm, heightCm, weightPerBoxKg, boxCount],
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
        v-if="!showShippingPriceField || !estimate"
        :aria-labelledby="titleId"
        class="mx-auto w-full rounded-[20px] border border-border-200 bg-bg-0 p-5 shadow-md sm:p-7"
        :class="variant === 'split' ? 'split-form max-w-[435px]' : 'mt-8 max-w-[600px]'"
        @submit.prevent="handleSubmit"
      >
        <div v-if="!showShippingPriceField">
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

        <div :class="showShippingPriceField ? undefined : 'mt-4'">
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

        <div v-if="showShippingPriceField" class="mt-4">
          <label
            :for="`${sectionId}-shipping-price`"
            class="mb-2 block text-[16px] font-normal text-text-secondary"
          >
            Harga Pengiriman
            <span v-if="cargoService" class="text-text-tertiary">{{ cargoService === 'Air Cargo' ? '(Rp/kg)' : '(Rp/m³)' }}</span>
          </label>
          <input
            :id="`${sectionId}-shipping-price`"
            :value="formatShippingPriceInput(shippingPrice)"
            name="shipping-price"
            type="text"
            pattern="[1-9][0-9]{0,2}([.][0-9]{3})*"
            maxlength="19"
            required
            inputmode="numeric"
            placeholder="Masukkan harga pengiriman"
            class="h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            @input="handleShippingPriceInput"
          >
          <p class="mt-2 text-[13px] leading-relaxed text-text-tertiary">
            Bingung menentukan harga pengiriman?
            <a
              :href="shippingPriceWhatsappUrl(cargoService)"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-primary-500 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >Hubungi Customer Service</a>
          </p>
        </div>

        <fieldset v-if="!showShippingPriceField || (cargoService && cargoService !== 'Air Cargo')" class="mt-4">
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

        <div
          v-if="!showShippingPriceField || cargoService"
          class="mt-4 grid grid-cols-2 gap-4"
        >
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
          v-if="calculatorEnabled && estimate && !showShippingPriceField"
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
            {{ formatDecimal(estimate.totalVolumeCbm) }} {{ showShippingPriceField ? 'm³' : 'CBM' }} × {{ formatCurrency(estimate.ratePerCbm) }}/{{ showShippingPriceField ? 'm³' : 'CBM' }}
          </p>
          <p class="mt-2 text-[12px] leading-relaxed text-text-tertiary">
            * Hasil di atas merupakan estimasi awal dan dapat berubah setelah pengecekan barang.
          </p>
        </div>
      </form>

      <div
        v-if="showShippingPriceField && estimate"
        class="mx-auto mt-8 w-full max-w-[600px] rounded-[20px] border border-border-200 bg-bg-0 px-4 py-5 shadow-md sm:px-5 sm:py-6"
        :class="variant === 'split' ? 'split-result' : ''"
        aria-live="polite"
      >
        <h2 class="text-center text-[20px] font-semibold leading-tight text-text-secondary sm:text-[23px]">
          Rincian Perhitungan Estimasi
        </h2>

        <div class="result-section mt-8 flex items-center gap-4">
          <h3 class="shrink-0 text-[15px] font-normal text-primary-500 sm:text-[16px]">
            Keterangan Kargo
          </h3>
          <div class="h-px flex-1 bg-border-200" aria-hidden="true" />
        </div>
        <dl class="result-list mt-4 grid grid-cols-2 gap-4 text-center">
          <div class="min-w-0">
            <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Jenis Layanan</dt>
            <dd class="mt-2 text-[16px] font-medium text-text-secondary">{{ cargoService }}</dd>
          </div>
          <div class="min-w-0">
            <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Estimasi Waktu Sampai</dt>
            <dd class="mt-2 text-[16px] font-medium text-text-secondary">{{ CARGO_DELIVERY_ESTIMATES[cargoService] ?? '-' }}</dd>
          </div>
        </dl>

        <div
          :id="`${sectionId}-estimate-details`"
          class="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out motion-reduce:transition-none"
          :class="[
            detailsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            detailsOpen ? (variant === 'split' ? 'mt-5' : 'mt-7') : 'mt-0',
          ]"
          :aria-hidden="!detailsOpen"
        >
          <div class="min-h-0 overflow-hidden">
            <div class="flex items-center gap-4">
              <h3 class="shrink-0 text-[15px] font-normal text-primary-500 sm:text-[16px]">
                Dimensi Kargo
              </h3>
              <div class="h-px flex-1 bg-border-200" aria-hidden="true" />
            </div>
            <dl class="result-list mt-4 grid grid-cols-2 gap-x-2 gap-y-5 text-center sm:grid-cols-3 sm:gap-x-4">
              <template v-if="estimate.mode === 'sea'">
                <div class="min-w-0">
                  <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Panjang</dt>
                  <dd class="mt-2 text-[16px] font-medium text-text-secondary">{{ formatDecimal(estimate.lengthCm) }} cm</dd>
                </div>
                <div class="min-w-0">
                  <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Lebar</dt>
                  <dd class="mt-2 text-[16px] font-medium text-text-secondary">{{ formatDecimal(estimate.widthCm) }} cm</dd>
                </div>
                <div class="min-w-0">
                  <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Tinggi</dt>
                  <dd class="mt-2 text-[16px] font-medium text-text-secondary">{{ formatDecimal(estimate.heightCm) }} cm</dd>
                </div>
              </template>
              <div class="min-w-0">
                <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Berat Box</dt>
                <dd class="mt-2 text-[16px] font-medium text-text-secondary">{{ formatDecimal(Number(weightPerBoxKg)) }} kg</dd>
              </div>
              <div class="min-w-0">
                <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Jumlah Box</dt>
                <dd class="mt-2 text-[16px] font-medium text-text-secondary">{{ boxCount }}</dd>
              </div>
              <div class="min-w-0">
                <dt class="text-[13px] text-text-tertiary sm:text-[15px]">Harga Pengiriman</dt>
                <dd class="mt-2 text-[16px] font-medium text-text-secondary [overflow-wrap:anywhere]">
                  {{ formatCurrency(estimate.mode === 'air' ? estimate.ratePerKg : estimate.ratePerCbm) }}
                  <span class="whitespace-nowrap text-[13px] font-normal">/ {{ estimate.mode === 'air' ? 'kg' : 'm³' }}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="result-total mt-6 border-t border-border-300 pt-4 text-center">
          <h3 class="text-[24px] font-semibold text-text-secondary sm:text-[26px]">Total</h3>
          <p class="result-total-price mt-1 text-[32px] font-semibold leading-tight text-primary-500 [overflow-wrap:anywhere] sm:text-[48px]">
            {{ formatCurrency(estimate.totalPrice) }}
          </p>
          <p class="result-note mt-5 text-[12px] italic text-text-tertiary">* Harga diatas bersifat estimasi</p>
        </div>

        <div class="result-actions mt-8 flex flex-wrap items-center gap-3" :class="estimate.mode === 'sea' ? 'justify-between' : 'justify-end'">
          <button
            v-if="estimate.mode === 'sea'"
            type="button"
            :aria-expanded="detailsOpen"
            :aria-controls="`${sectionId}-estimate-details`"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-[14px] font-medium text-text-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:text-[16px]"
            @click="detailsOpen = !detailsOpen"
          >
            {{ detailsOpen ? 'Tutup Detail' : 'Lihat Detail' }}
            <ChevronDown :size="20" :class="detailsOpen ? 'rotate-180' : ''" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary-500 px-5 text-[15px] font-semibold text-bg-0 transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:text-[16px]"
            @click="estimate = null"
          >
            Hitung Ulang
          </button>
        </div>
      </div>
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

.split-result {
  max-width: 435px;
  padding: 1.25rem;
}

.split-result h2 {
  font-size: 1.125rem;
}

.split-result h3 {
  font-size: 0.875rem;
}

.split-result dt {
  font-size: 0.75rem;
}

.split-result dd {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
}

.split-result .result-section {
  margin-top: 1.25rem;
}

.split-result .result-list {
  margin-top: 0.75rem;
  gap: 0.75rem;
}

.split-result .result-total {
  margin-top: 1.25rem;
  padding-top: 0.875rem;
}

.split-result .result-total h3 {
  font-size: 1.25rem;
}

.split-result .result-total-price {
  font-size: 2rem;
}

.split-result .result-note,
.split-result .result-actions {
  margin-top: 1.25rem;
}

.split-result .result-actions button {
  font-size: 0.8125rem;
}
</style>
