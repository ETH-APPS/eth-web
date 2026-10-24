<script setup lang="ts">
import {
  ArrowUpRight,
  Banknote,
  Plane,
  Ship,
  ShoppingBag,
} from 'lucide-vue-next'
import chinaFlagUrl from '~/assets/images/flag/china.png'
import taiwanFlagUrl from '~/assets/images/flag/taiwan.png'
import koreaFlagUrl from '~/assets/images/flag/korea.png'
import singaporeFlagUrl from '~/assets/images/flag/singapore.png'
import malaysiaFlagUrl from '~/assets/images/flag/malaysia.png'
import australiaFlagUrl from '~/assets/images/flag/australia.png'
import usaFlagUrl from '~/assets/images/flag/USA.png'

const multinationalCountries = [
  { name: 'Taiwan', flag: taiwanFlagUrl },
  { name: 'Korea Selatan', flag: koreaFlagUrl },
  { name: 'Singapura', flag: singaporeFlagUrl },
  { name: 'Malaysia', flag: malaysiaFlagUrl },
  { name: 'Australia', flag: australiaFlagUrl },
  { name: 'Amerika Serikat', flag: usaFlagUrl },
] as const
</script>

<template>
  <UiContainer class="grid grid-cols-[0.8fr_1.7fr] gap-16 py-10 text-text-secondary">
    <div>
      <p class="mb-5 text-xs font-medium text-text-tertiary">
        Main Service
      </p>

      <div class="space-y-5">
        <NuxtLink
          to="/china-cargo"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span
            aria-hidden="true"
            class="block size-12 shrink-0 rounded-full bg-bg-0 p-[3px] shadow-[2px_4px_6px_rgb(52_64_81/0.3)]"
          >
            <img
              :src="chinaFlagUrl"
              alt=""
              width="42"
              height="42"
              decoding="async"
              class="size-full rounded-full object-cover object-center"
            >
          </span>
          <span>
            <span class="flex items-center gap-2 text-md font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Cargo China
              <ArrowUpRight
                :size="19"
                aria-hidden="true"
                class="text-primary-500"
              />
            </span>
            <span class="mt-1 block max-w-72 text-xs leading-6 text-text-tertiary">
              Pengiriman cargo China–Indonesia yang aman dan terintegrasi.
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/sea-freight"
          class="group/item flex items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Ship :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-semibold text-text-secondary transition-colors group-hover/item:text-primary-500">Kargo Laut</span>
            <span class="mt-1 flex gap-2 text-xs font-medium text-primary-500">
              <span class="rounded bg-bg-100 px-2 py-0.5">FCL</span>
              <span class="rounded bg-bg-100 px-2 py-0.5">LCL</span>
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/air-freight"
          class="group/item flex items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Plane :size="20" aria-hidden="true" />
          </span>
          <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">Kargo Udara</span>
        </NuxtLink>
      </div>
    </div>

    <div>
      <p class="mb-5 text-xs font-medium text-text-tertiary">
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
            <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">Jasa Transfer RMB</span>
            <span class="mt-2 block text-xs leading-6 text-text-tertiary">Pembayaran supplier China cepat dengan kurs kompetitif.</span>
            <span class="mt-2 block text-[10px] text-text-disable">Alipay &nbsp; Alibaba &nbsp; Bank of China &nbsp; WeChat Pay &nbsp; 1688 &nbsp; Taobao</span>
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
            <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">Jasa Titip Beli</span>
            <span class="mt-2 block text-xs leading-6 text-text-tertiary">Bantu sourcing dan pembelian produk langsung dari China.</span>
          </span>
        </NuxtLink>
      </div>

      <div class="mt-8">
        <p class="mb-4 text-xs font-medium text-text-tertiary">
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
            class="block size-11 rounded-full bg-bg-0 p-[2.5px] shadow-[2px_4px_5px_rgb(52_64_81/0.3)]"
            :title="country.name"
          >
            <img
              :src="country.flag"
              alt=""
              width="39"
              height="39"
              loading="lazy"
              decoding="async"
              class="size-full rounded-full object-cover object-center"
            >
          </span>
        </NuxtLink>
      </div>
    </div>
  </UiContainer>
</template>
