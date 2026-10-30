<script setup lang="ts">
import {
  ChevronDown,
  ChevronsDown,
} from 'lucide-vue-next'
import logo1688 from '~/assets/images/brand/1688.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoAlipay from '~/assets/images/brand/alipay.png'
import logoBankOfChina from '~/assets/images/brand/bank-of-china.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoWechatPay from '~/assets/images/brand/wechat-pay.png'

const accountOptions = [
  { label: 'Alipay', adminFee: 50_000 },
  { label: 'Bank of China', adminFee: 75_000 },
  { label: 'WeChat Pay', adminFee: 50_000 },
  { label: '1688', adminFee: 50_000 },
  { label: 'Taobao', adminFee: 50_000 },
  { label: 'Alibaba', adminFee: 50_000 },
] as const

const brandLogos = [
  { name: 'Alipay', src: logoAlipay, widthClass: 'w-[140px]' },
  { name: 'Bank of China', src: logoBankOfChina, widthClass: 'w-[130px]' },
  { name: 'WeChat Pay', src: logoWechatPay, widthClass: 'w-[130px]' },
  { name: 'Taobao', src: logoTaobao, widthClass: 'w-[130px]' },
  { name: '1688', src: logo1688, widthClass: 'w-[95px]' },
  { name: 'Alibaba.com', src: logoAlibaba, widthClass: 'w-[160px]' },
]

const exchangeRate = 2_600
const amountInput = ref(10_000)
const selectedAccount = ref<(typeof accountOptions)[number]['label']>('Alipay')
const calculatedAmount = ref(10_000)
const calculatedAccount = ref<(typeof accountOptions)[number]['label']>('Alipay')

const adminFee = computed(() => (
  accountOptions.find(option => option.label === calculatedAccount.value)?.adminFee ?? 50_000
))
const totalPayment = computed(() => (calculatedAmount.value * exchangeRate) + adminFee.value)

function formatRmb(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`
}

function calculateEstimate() {
  calculatedAmount.value = Math.max(0, Number(amountInput.value) || 0)
  calculatedAccount.value = selectedAccount.value
}

function resetEstimate() {
  amountInput.value = 10_000
  selectedAccount.value = 'Alipay'
  calculatedAmount.value = 10_000
  calculatedAccount.value = 'Alipay'
}
</script>

<template>
  <section class="bg-bg-0 py-8 sm:py-12 lg:py-20">
    <UiContainer>
      <div class="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)] lg:gap-10">
        <div class="min-w-0 lg:pt-4">
          <p class="text-[16px] font-normal text-primary-700 lg:text-[20px]">
            Layanan Pendukung
          </p>
          <h1 class="mt-1 text-[32px] font-semibold leading-tight text-primary-500 lg:mt-2 lg:text-[40px]">
            Jasa Transfer RMB
          </h1>
          <p class="mt-4 text-[16px] font-normal leading-[1.5] text-text-secondary lg:mt-7">
            Solusi pembayaran kilat dan aman untuk transaksi bisnis Anda ke China.
            Pembayaran langsung diteruskan ke rekening supplier (Bank of China),
            Alipay, WeChat Pay, hingga transaksi platform 1688, Taobao, dan Alibaba
            dengan kurs transparan.
          </p>

          <div class="mt-9 text-center">
            <p class="text-[14px] font-semibold text-primary-500">
              Kurs RMB Hari Ini
            </p>
            <p class="mt-1 text-[22px] font-medium text-text-secondary">
              ¥ 1&nbsp; = &nbsp;Rp 2.600,00
            </p>
            <p class="mt-1 text-[10px] font-normal text-text-tertiary">
              Update real-time. Bebas biaya tersembunyi.
            </p>
          </div>

          <div class="brand-marquee -mx-4 mb-5 mt-12 overflow-hidden lg:hidden">
            <div class="brand-track">
              <ul
                v-for="copy in 2"
                :key="copy"
                class="brand-group"
                :aria-hidden="copy === 2 ? 'true' : undefined"
                :aria-label="copy === 1 ? 'Metode pembayaran transfer RMB' : undefined"
              >
                <li v-for="logo in brandLogos" :key="logo.name" class="flex h-14 shrink-0 items-center justify-center">
                  <img
                    :src="logo.src"
                    :alt="copy === 1 ? logo.name : ''"
                    class="h-auto max-h-8 max-w-[110px] object-contain"
                    :class="logo.widthClass"
                  >
                </li>
              </ul>
            </div>
          </div>

          <div class="mx-auto mt-14 hidden max-w-[560px] grid-cols-3 gap-x-8 gap-y-6 lg:grid">
            <div
              v-for="logo in brandLogos"
              :key="logo.name"
              class="flex h-14 items-center justify-center"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                class="h-auto max-w-full object-contain"
                :class="logo.widthClass"
              >
            </div>
          </div>

          <a
            href="#rmb-calculator"
            class="mx-auto mt-12 hidden w-fit items-center gap-2 text-[16px] font-medium text-text-disable transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:flex"
          >
            <span>Pelajari Prosedur Transfer RMB</span>
            <ChevronsDown :size="20" :stroke-width="1.8" aria-hidden="true" />
          </a>
        </div>

        <form
          id="rmb-calculator"
          class="overflow-hidden rounded-[20px] border border-border-200 bg-bg-0 shadow-md"
          @submit.prevent="calculateEstimate"
        >
          <h2 class="bg-primary-500 px-4 py-4 text-center text-[16px] font-semibold text-bg-0 lg:px-6 lg:text-start lg:text-[20px]">
            Hitung Estimasi Transfer RMB
          </h2>

          <div class="p-4 lg:p-6">
            <label for="rmb-amount" class="block text-[16px] font-normal text-text-secondary">
              Nominal RMB (¥)
            </label>
            <input
              id="rmb-amount"
              v-model.number="amountInput"
              type="number"
              min="1"
              step="1"
              required
              inputmode="decimal"
              placeholder="Masukkan jumlah nominal"
              class="mt-2 h-11 w-full rounded-lg border border-border-200 bg-bg-0 px-4 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100 lg:h-12"
            >

            <label for="rmb-account" class="mt-5 block text-[16px] font-normal text-text-secondary">
              Akun Tujuan
            </label>
            <div class="relative mt-2">
              <select
                id="rmb-account"
                v-model="selectedAccount"
                class="h-11 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-4 pr-11 text-[16px] font-normal text-text-tertiary outline-none transition-[border-color,box-shadow] focus:border-primary-500 focus:ring-2 focus:ring-primary-100 lg:h-12"
              >
                <option v-for="option in accountOptions" :key="option.label" :value="option.label">
                  {{ option.label }}
                </option>
              </select>
              <ChevronDown
                :size="20"
                :stroke-width="1.8"
                aria-hidden="true"
                class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary"
              />
            </div>

            <dl class="mt-4 border-y border-border-200 py-4 text-[16px] font-normal text-text-secondary">
              <div class="flex items-center justify-between">
                <dt>Jumlah RMB</dt>
                <dd>¥ {{ formatRmb(calculatedAmount) }}</dd>
              </div>
              <div class="mt-3 flex items-start justify-between">
                <dt>
                  <span class="block">Nilai Kurs</span>
                  <span class="mt-0.5 block text-[10px] font-normal text-text-tertiary">Currency rate based on BCA per ¥ 1</span>
                </dt>
                <dd>{{ formatRupiah(exchangeRate) }}</dd>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <dt>Biaya Admin</dt>
                <dd>{{ formatRupiah(adminFee) }}</dd>
              </div>
            </dl>

            <div class="flex flex-col items-center gap-1 py-5 text-center lg:flex-row lg:justify-between lg:gap-0 lg:text-start">
              <p class="text-[16px] font-normal text-text-secondary">
                Total Pembayaran
              </p>
              <output class="text-[24px] font-semibold text-primary-500 lg:text-[22px]">
                {{ formatRupiah(totalPayment) }}
              </output>
            </div>

            <div class="mt-7 flex items-center justify-between gap-4 lg:justify-end lg:gap-7">
              <button
                type="button"
                class="text-[16px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                @click="resetEstimate"
              >
                <span class="lg:hidden">Reset</span>
                <span class="hidden lg:inline">Atur Ulang</span>
              </button>
              <button
                type="submit"
                class="h-11 min-w-[136px] rounded-lg bg-primary-500 px-5 text-[16px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:min-w-0"
              >
                <span class="lg:hidden">Hitung</span>
                <span class="hidden lg:inline">Hitung Estimasi</span>
              </button>
            </div>
          </div>
        </form>

        <a
          href="#rmb-calculator"
          class="mx-auto flex w-fit items-center gap-2 text-center text-[16px] font-medium italic text-text-disable transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:hidden"
        >
          <span>Pelajari Prosedur Transfer RMB</span>
          <ChevronsDown :size="20" :stroke-width="1.8" aria-hidden="true" />
        </a>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.brand-track {
  display: flex;
  width: max-content;
  animation: brand-scroll 28s linear infinite;
}

.brand-group {
  display: flex;
  flex: none;
  align-items: center;
  gap: 1.75rem;
  padding-right: 1.75rem;
}

.brand-marquee:hover .brand-track {
  animation-play-state: paused;
}

@keyframes brand-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-marquee {
    overflow-x: auto;
  }

  .brand-track {
    animation: none;
  }

  .brand-group[aria-hidden="true"] {
    display: none;
  }
}
</style>
