
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import {
  RMB_TRANSFER_ADMIN_FEE_RMB,
  RMB_TRANSFER_RATE,
  calculateRmbTransferTotal,
} from '~/utils/rmbTransfer'

const stats = [
  { value: '+10.000', label: 'Pengiriman\nSelesai' },
  { value: '98%', label: 'Tingkat Ketepatan\nWaktu' },
  { value: '+5', label: 'Rute Pengiriman\nInternasional' },
  { value: '+10', label: 'Tahun\nPengalaman' },
]

const transferTargets = [
  'Alipay',
  'Bank of China',
  'WeChat Pay',
  '1688',
  'Taobao',
  'Alibaba',
] as const

const rmbAmount = ref<number | ''>('')
const transferTarget = ref<(typeof transferTargets)[number]>('Alipay')
const calculatedRmb = ref<number | null>(null)
const cardsIndependent = ref(false)

const totalPayment = computed(() => (
  calculatedRmb.value === null
    ? null
    : calculateRmbTransferTotal(calculatedRmb.value)
))

const rupiahFormatter = new Intl.NumberFormat('id-ID')

const rmbFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatRupiah(value: number) {
  return `Rp ${rupiahFormatter.format(value)}`
}

function calculateRmb() {
  const amount = Number(rmbAmount.value)

  if (!Number.isFinite(amount) || amount <= 0)
    return

  calculatedRmb.value = amount
  cardsIndependent.value = true
}

function resetRmb() {
  rmbAmount.value = ''
  transferTarget.value = 'Alipay'
  calculatedRmb.value = null
}

watch([rmbAmount, transferTarget], () => {
  calculatedRmb.value = null
})
</script>

<template>
  <section
    id="home-logistics-estimator"
    aria-labelledby="home-logistics-estimator-title"
    class="bg-bg-0"
  >
    <!-- Logistics Estimator -->
    <div class="py-12 lg:py-14">
      <UiContainer>
        <div class="text-center">
          <h2
            id="home-logistics-estimator-title"
            class="text-[26px] font-semibold leading-tight text-primary-500 lg:text-[32px]"
          >
            Solusi Logistik Import Terpadu
          </h2>

          <p class="mx-auto mt-4 max-w-[850px] text-[16px] font-normal leading-[1.5] text-text-secondary lg:text-[20px]">
            Cari referensi produk dari marketplace China, hitung estimasi pengiriman kargo, dan perkirakan transfer RMB untuk perencanaan impor bisnis Anda.
          </p>
        </div>

        <div
          class="mx-auto mt-10 grid max-w-[960px] gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-10"
          :class="cardsIndependent ? 'lg:items-start' : ''"
        >
          <!-- RMB Transfer Estimator -->
          <form
            id="home-rmb-estimator-form"
            aria-labelledby="home-rmb-estimator-title"
            class="mx-auto flex w-full min-w-0 max-w-[500px] flex-col overflow-hidden rounded-[20px] border border-border-200 bg-bg-0 lg:min-h-[535px] lg:max-w-none"
            @submit.prevent="calculateRmb"
          >
            <h3
              id="home-rmb-estimator-title"
              class="bg-primary-500 px-5 py-3 text-[16px] font-semibold text-white"
            >
              Hitung Estimasi Transfer RMB
            </h3>

            <div class="flex flex-1 flex-col p-5">
              <label
                for="home-rmb-amount"
                class="text-[14px] text-text-secondary"
              >
                Nominal RMB (¥)
              </label>

              <input
                id="home-rmb-amount"
                v-model.number="rmbAmount"
                name="rmb-amount"
                type="number"
                min="1"
                step="1"
                required
                inputmode="decimal"
                placeholder="Masukkan jumlah nominal"
                class="mt-2 h-11 w-full rounded-lg border border-border-200 px-3 text-[14px] text-text-secondary outline-none placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >

              <label
                for="home-rmb-target"
                class="mt-4 text-[14px] text-text-secondary"
              >
                Akun Tujuan
              </label>

              <div class="relative mt-2">
                <select
                  id="home-rmb-target"
                  v-model="transferTarget"
                  name="rmb-target"
                  class="h-11 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-3 pr-10 text-[14px] text-text-tertiary outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
                  aria-hidden="true"
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
              </div>

              <dl class="mt-4 flex items-start justify-between gap-3 border-b border-border-200 pb-4 text-[14px] text-text-secondary">
                <dt>
                  <span class="block">Nilai Kurs</span>
                  <span class="block text-[10px] leading-tight text-text-tertiary">
                    Currency rate based on BCA per ¥ 1
                  </span>
                </dt>

                <dd class="shrink-0">
                  {{ formatRupiah(RMB_TRANSFER_RATE) }}
                </dd>
              </dl>

              <div
                class="flex flex-1 items-center justify-center py-8"
                aria-live="polite"
              >
                <p
                  v-if="totalPayment === null"
                  class="text-center text-[13px] italic text-text-disable"
                >
                  Mohon isi nominal dan akun penerima terlebih dahulu
                </p>

                <dl
                  v-else
                  class="w-full space-y-3 text-[14px] text-text-secondary"
                >
                  <div class="flex items-center justify-between gap-4">
                    <dt>Jumlah RMB</dt>
                    <dd>
                      ¥ {{ rmbFormatter.format(calculatedRmb ?? 0) }}
                    </dd>
                  </div>

                  <div class="flex items-center justify-between gap-4">
                    <dt>Biaya Admin</dt>
                    <dd>
                      ¥ {{ rmbFormatter.format(RMB_TRANSFER_ADMIN_FEE_RMB) }}
                    </dd>
                  </div>

                  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border-200 pt-3">
                    <dt id="home-rmb-total-label">
                      Total Pembayaran
                    </dt>

                    <dd>
                      <output
                        for="home-rmb-amount home-rmb-target"
                        aria-labelledby="home-rmb-total-label"
                        class="text-[20px] font-semibold text-primary-500"
                      >
                        {{ formatRupiah(totalPayment) }}
                      </output>
                    </dd>
                  </div>
                </dl>
              </div>

              <div
                class="flex items-center gap-3"
                :class="totalPayment === null ? 'justify-end' : 'justify-between'"
              >
                <UiAnimatedArrowButton
                  v-if="totalPayment !== null"
                  type="button"
                  variant="plain"
                  :show-arrow="false"
                  class="min-h-12 px-1 text-[14px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  @click="resetRmb"
                >
                  Hitung Ulang
                </UiAnimatedArrowButton>

                <UiAnimatedArrowButton
                  type="submit"
                  variant="plain"
                  :show-arrow="false"
                  class="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary-500 px-5 text-[14px] font-semibold text-white transition-[background-color,color,box-shadow] duration-200 hover:bg-primary-100 hover:text-primary-500 hover:ring-2 hover:ring-inset hover:ring-primary-500 focus-visible:bg-primary-100 focus-visible:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                >
                  Hitung Estimasi
                </UiAnimatedArrowButton>
              </div>
            </div>
          </form>

          <!-- Cargo Estimator -->
          <MarketingSectionsRateEstimator
            section-id="home-cargo-estimator"
            title="Hitung Estimasi Kargo"
            submit-label="Hitung Estimasi Tarif"
            variant="card"
            show-shipping-price-field
            calculator-enabled
            animated-submit
            @layout-change="cardsIndependent = true"
          />
        </div>
      </UiContainer>
    </div>

        <!-- ETH Cargo Statistics -->
    <div class="bg-primary-500 py-12 text-white">
      <UiContainer>
        <dl class="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
          >
            <dt class="text-[46px] font-bold leading-none tracking-tight lg:text-[56px]">
              {{ stat.value }}
            </dt>

            <dd class="mt-4 whitespace-pre-line text-xl font-semibold leading-[1.3]">
              {{ stat.label }}
            </dd>
          </div>
        </dl>
      </UiContainer>
    </div>
  </section>
</template>
