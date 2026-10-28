<script setup lang="ts">
import {
  Building2,
  ChevronDown,
  ChevronsDown,
  MessageCircle,
  WalletCards,
} from 'lucide-vue-next'
import logo1688 from '~/assets/images/brand/1688.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoTaobao from '~/assets/images/brand/taobao.png'

const accountOptions = [
  { label: 'Alipay', adminFee: 50_000 },
  { label: 'Bank of China', adminFee: 75_000 },
  { label: 'WeChat Pay', adminFee: 50_000 },
  { label: '1688', adminFee: 50_000 },
  { label: 'Taobao', adminFee: 50_000 },
  { label: 'Alibaba', adminFee: 50_000 },
] as const

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
      <div class="grid grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)] items-start gap-20">
        <div class="pt-4">
          <p class="text-[18px] font-normal text-primary-700">
            Layanan Pendukung
          </p>
          <h1 class="mt-2 text-[44px] font-semibold leading-tight text-primary-500">
            Jasa Transfer RMB
          </h1>
          <p class="mt-7 max-w-[620px] text-[16px] leading-[1.5] text-text-secondary">
            Solusi pembayaran kilat dan aman untuk transaksi bisnis Anda ke China.<br>
            Pembayaran langsung diteruskan ke rekening supplier (Bank of China),<br>
            Alipay, WeChat Pay, hingga transaksi platform 1688, Taobao, dan Alibaba<br>
            dengan kurs transparan.
          </p>

          <div class="mt-9 text-center">
            <p class="text-[13px] font-semibold text-primary-500">
              Kurs RMB Hari Ini
            </p>
            <p class="mt-1 text-[22px] font-medium text-text-secondary">
              ¥ 1&nbsp; = &nbsp;Rp 2.600,00
            </p>
            <p class="mt-1 text-[10px] text-text-tertiary">
              Update real-time. Bebas biaya tersembunyi.
            </p>
          </div>

          <div class="mx-auto mt-14 grid max-w-[520px] grid-cols-3 items-center gap-x-8 gap-y-7">
            <div class="flex h-11 items-center justify-center gap-2 text-text-secondary" aria-label="Alipay">
              <span class="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
                <WalletCards :size="20" aria-hidden="true" />
              </span>
              <span class="text-[23px] font-semibold text-slate-900">Alipay</span>
            </div>
            <div class="flex h-11 items-center justify-center gap-2 text-text-secondary" aria-label="Bank of China">
              <Building2 :size="31" :stroke-width="1.7" class="text-primary-500" aria-hidden="true" />
              <span class="text-center text-[10px] font-medium uppercase leading-3">Bank of China</span>
            </div>
            <div class="flex h-11 items-center justify-center gap-2 text-text-secondary" aria-label="WeChat Pay">
              <span class="flex size-9 items-center justify-center rounded-full bg-green-600 text-white">
                <MessageCircle :size="21" fill="currentColor" aria-hidden="true" />
              </span>
              <span class="text-[17px] font-medium">WeChat Pay</span>
            </div>

            <img :src="logoTaobao" alt="Taobao" class="mx-auto h-9 w-auto object-contain">
            <img :src="logo1688" alt="1688" class="mx-auto h-12 w-auto object-contain">
            <img :src="logoAlibaba" alt="Alibaba.com" class="mx-auto h-10 w-auto object-contain">
          </div>

          <a
            href="#rmb-calculator"
            class="mx-auto mt-12 flex w-fit items-center gap-2 text-[14px] font-medium text-text-disable transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <span>Pelajari Prosedur Transfer RMB</span>
            <ChevronsDown :size="18" :stroke-width="1.8" aria-hidden="true" />
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
            <label for="rmb-amount" class="block text-[16px] text-text-secondary">
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
              class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-4 text-[15px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >

            <label for="rmb-account" class="mt-5 block text-[16px] text-text-secondary">
              Akun Tujuan
            </label>
            <div class="relative mt-2">
              <select
                id="rmb-account"
                v-model="selectedAccount"
                class="h-12 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-4 pr-11 text-[15px] text-text-tertiary outline-none transition-[border-color,box-shadow] focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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

            <dl class="mt-4 border-y border-border-200 py-4 text-[15px] text-text-secondary">
              <div class="flex items-center justify-between">
                <dt>Jumlah RMB</dt>
                <dd>¥ {{ formatRmb(calculatedAmount) }}</dd>
              </div>
              <div class="mt-3 flex items-start justify-between">
                <dt>
                  <span class="block">Nilai Kurs</span>
                  <span class="mt-0.5 block text-[10px] text-text-tertiary">Currency rate based on BCA per ¥ 1</span>
                </dt>
                <dd>{{ formatRupiah(exchangeRate) }}</dd>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <dt>Biaya Admin</dt>
                <dd>{{ formatRupiah(adminFee) }}</dd>
              </div>
            </dl>

            <div class="flex items-center justify-between py-5">
              <p class="text-[16px] text-text-secondary">
                Total Pembayaran
              </p>
              <output class="text-[22px] font-semibold text-primary-500">
                {{ formatRupiah(totalPayment) }}
              </output>
            </div>

            <div class="mt-7 flex items-center justify-end gap-7">
              <button
                type="button"
                class="text-[14px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                @click="resetEstimate"
              >
                Atur Ulang
              </button>
              <button
                type="submit"
                class="h-11 rounded-lg bg-primary-500 px-5 text-[14px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
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
