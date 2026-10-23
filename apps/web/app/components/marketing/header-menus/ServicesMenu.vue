<script setup lang="ts">
import {
  ArrowUpRight,
  Banknote,
  Plane,
  Ship,
  ShoppingBag,
} from 'lucide-vue-next'

const multinationalCountries = [
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'Korea Selatan', flag: '🇰🇷' },
  { name: 'Singapura', flag: '🇸🇬' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Amerika Serikat', flag: '🇺🇸' },
] as const
</script>

<template>
  <UiContainer class="grid grid-cols-[0.8fr_1.7fr] gap-16 py-10 text-slate-800">
    <div>
      <p class="mb-5 text-sm font-medium text-text-tertiary">
        Main Service
      </p>

      <div class="space-y-5">
        <NuxtLink
          to="/china-cargo"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500 text-2xl shadow-md">🇨🇳</span>
          <span>
            <span class="flex items-center gap-2 text-lg font-semibold text-slate-950 transition-colors group-hover/item:text-primary-500">
              Cargo China
              <ArrowUpRight :size="19" aria-hidden="true" />
            </span>
            <span class="mt-1 block max-w-72 text-sm leading-6 text-text-tertiary">
              Pengiriman cargo China–Indonesia yang aman dan terintegrasi.
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/china-cargo#sea-freight"
          class="group/item flex items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Ship :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-semibold text-slate-950 transition-colors group-hover/item:text-primary-500">Kargo Laut</span>
            <span class="mt-1 flex gap-2 text-xs font-medium text-primary-500">
              <span class="rounded bg-slate-100 px-2 py-0.5">FCL</span>
              <span class="rounded bg-slate-100 px-2 py-0.5">LCL</span>
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/china-cargo#air-freight"
          class="group/item flex items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Plane :size="20" aria-hidden="true" />
          </span>
          <span class="text-base font-semibold text-slate-950 transition-colors group-hover/item:text-primary-500">Kargo Udara</span>
        </NuxtLink>
      </div>
    </div>

    <div>
      <p class="mb-5 text-sm font-medium text-text-tertiary">
        Additional Services
      </p>

      <div class="grid grid-cols-2 gap-10">
        <NuxtLink
          to="/#layanan"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Banknote :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-semibold text-slate-950 transition-colors group-hover/item:text-primary-500">Jasa Transfer RMB</span>
            <span class="mt-2 block text-sm leading-6 text-text-tertiary">Pembayaran supplier China cepat dengan kurs kompetitif.</span>
            <span class="mt-2 block text-xs text-text-disable">Alipay &nbsp; Alibaba &nbsp; Bank of China &nbsp; WeChat Pay &nbsp; 1688 &nbsp; Taobao</span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/#sourcing"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <ShoppingBag :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-semibold text-slate-950 transition-colors group-hover/item:text-primary-500">Jasa Titip Beli</span>
            <span class="mt-2 block text-sm leading-6 text-text-tertiary">Bantu sourcing dan pembelian produk langsung dari China.</span>
          </span>
        </NuxtLink>
      </div>

      <div class="mt-8">
        <p class="mb-4 text-sm font-medium text-text-tertiary">
          Multinational Shipping
        </p>
        <NuxtLink
          to="/multinational-cargo"
          class="flex w-fit gap-5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
          aria-label="Lihat layanan multinational shipping"
        >
          <span
            v-for="country in multinationalCountries"
            :key="country.name"
            class="flex size-11 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-3xl shadow-md transition-transform duration-200 hover:-translate-y-1"
            :title="country.name"
          >
            {{ country.flag }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </UiContainer>
</template>
