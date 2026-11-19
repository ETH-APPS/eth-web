<script setup lang="ts">
import { ArrowUpRight, ChevronDown } from 'lucide-vue-next'
import {
  calculateAirCargoEstimate,
  calculateSeaCargoEstimate,
  type CargoEstimate,
} from '~/utils/cargoEstimate'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    categories?: readonly string[]
    cargoServices?: readonly string[]
    submitLabel?: string
    guidePrompt?: string
    guideLabel?: string
    guideTo?: string
    showGuideAction?: boolean
    contactTo?: string
    sectionId?: string
    variant?: 'default' | 'page-hero'
    calculatorEnabled?: boolean
  }>(),
  {
    title: 'Hitung Estimasi Tarif',
    description:
      'Dapatkan kalkulasi perkiraan biaya pengiriman All-In dari China ke Indonesia secara instan untuk perencanaan modal bisnis Anda.',
    categories: () => [
      'Barang umum',
      'Elektronik',
      'Fashion & tekstil',
      'Mesin & perlengkapan industri',
      'Furnitur & perlengkapan rumah',
      'Kosmetik & perawatan diri',
    ],
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
    contactTo: '#quote',
    sectionId: 'rate-estimator',
    variant: 'default',
    calculatorEnabled: false,
  },
)

const titleId = computed(() => `${props.sectionId}-title`)
const itemName = ref('')
const category = ref('')
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
  [itemName, category, cargoService, lengthCm, widthCm, heightCm, weightPerBoxKg, boxCount],
  () => {
    estimate.value = null
  },
)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-100 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="text-center">
        <component
          :is="variant === 'page-hero' ? 'h1' : 'h2'"
          :id="titleId"
          class="leading-tight text-primary-500 lg:text-[32px]"
          :class="variant === 'page-hero' ? 'text-[28px] font-semibold lg:font-bold' : 'text-[24px] font-bold'"
        >
          {{ title }}
        </component>

        <p
          class="mx-auto mt-6 max-w-[900px] font-normal leading-[1.5] text-text-tertiary lg:text-[20px]"
          :class="variant === 'page-hero' ? 'text-[16px]' : 'text-[14px]'"
        >
          {{ description }}
        </p>
      </div>

      <form
        :aria-labelledby="titleId"
        class="mx-auto mt-8 max-w-[600px] rounded-[20px] border border-border-200 bg-bg-0 p-5 shadow-md sm:p-7"
        @submit.prevent="handleSubmit"
      >
        <div class="grid gap-4 sm:grid-cols-2">
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

          <div>
            <label
              for="item-category"
              class="mb-2 block text-[16px] font-normal text-text-secondary"
            >
              Kategori Barang
            </label>

            <div class="relative">
              <select
                id="item-category"
                v-model="category"
                name="item-category"
                required
                class="h-12 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-3 pr-10 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] invalid:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>

              <ChevronDown
                :size="20"
                :stroke-width="1.8"
                aria-hidden="true"
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              />
            </div>

            <p class="mt-1.5 text-[12px] leading-tight text-text-tertiary">
              Bingung kategori?
              <NuxtLink
                :to="contactTo"
                class="font-medium text-primary-500 underline underline-offset-2 hover:text-primary-700"
              >
                Hubungi Customer Service
              </NuxtLink>
            </p>
          </div>
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
          <button
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

      <div class="mt-14 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
        <p
          class="text-text-tertiary lg:font-normal"
          :class="variant === 'page-hero' ? 'text-[16px] font-normal lg:text-[20px]' : 'text-[14px] font-medium lg:text-[16px]'"
        >
          {{ guidePrompt }}
        </p>

        <NuxtLink
          v-if="showGuideAction"
          :to="guideTo"
          class="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-50 px-5 text-[14px] font-medium text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>{{ guideLabel }}</span>
          <ArrowUpRight
            :size="16"
            :stroke-width="2"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>
