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
  <section class="bg-bg-0 py-16 sm:py-20">
    <UiContainer>
      <div class="grid grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)] items-start gap-10">
        <div class="pt-4">
          <p class="text-[20px] font-normal text-primary-700">
            Layanan Pendukung
          </p>
          <h1 class="mt-2 text-[40px] font-semibold leading-tight text-primary-500">
            Jasa Transfer RMB
          </h1>
          <p class="mt-7 text-[16px] font-normal leading-[1.5] text-text-secondary">
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

          <div class="mx-auto mt-14 grid max-w-[560px] grid-cols-3 gap-x-8 gap-y-6">
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
            class="mx-auto mt-12 flex w-fit items-center gap-2 text-[16px] font-medium text-text-disable transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
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
          <h2 class="bg-primary-500 px-6 py-4 text-[20px] font-semibold text-bg-0">
            Hitung Estimasi Transfer RMB
          </h2>

          <div class="p-6">
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
              class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-4 text-[16px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >

            <label for="rmb-account" class="mt-5 block text-[16px] font-normal text-text-secondary">
              Akun Tujuan
            </label>
            <div class="relative mt-2">
              <select
                id="rmb-account"
                v-model="selectedAccount"
                class="h-12 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-4 pr-11 text-[16px] font-normal text-text-tertiary outline-none transition-[border-color,box-shadow] focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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

            <div class="flex items-center justify-between py-5">
              <p class="text-[16px] font-normal text-text-secondary">
                Total Pembayaran
              </p>
              <output class="text-[22px] font-semibold text-primary-500">
                {{ formatRupiah(totalPayment) }}
              </output>
            </div>

            <div class="mt-7 flex items-center justify-end gap-7">
              <button
                type="button"
                class="text-[16px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                @click="resetEstimate"
              >
                Atur Ulang
              </button>
              <button
                type="submit"
                class="h-11 rounded-lg bg-primary-500 px-5 text-[16px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                Hitung Estimasi
              </button>
            </div>
          </div>
        </form>
      </div>
    </UiContainer>
  </section>
</template>