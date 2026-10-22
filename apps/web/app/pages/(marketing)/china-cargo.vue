<script setup lang="ts">
import { ArrowUpRight, Package, ScanLine } from 'lucide-vue-next'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea.png'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Jasa Cargo China ke Indonesia | ETH Cargo',
  description:
    'Layanan cargo laut dan udara B2B dari China ke Indonesia dengan biaya All-In Door-to-Door yang transparan.',
  ogTitle: 'Jasa Cargo China ke Indonesia | ETH Cargo',
  ogDescription:
    'Layanan cargo laut dan udara B2B dari China ke Indonesia dengan biaya All-In Door-to-Door yang transparan.',
  ogType: 'website',
})

const services = ['FCL Cargo', 'LCL Cargo', 'Air Cargo']
</script>

<template>
  <section
    aria-labelledby="china-cargo-title"
    class="flex min-h-[calc(100svh-70px)] items-center bg-white py-12"
  >
    <UiContainer>
      <div class="grid grid-cols-[1fr_520px] items-center gap-16">
        <div>
          <p class="text-[18px] font-medium uppercase text-primary-700">
            Spesialis Impor China
          </p>

          <h1
            id="china-cargo-title"
            class="mt-3 text-[52px] font-semibold leading-[1.2] tracking-[0.01em] text-primary-500"
          >
            Jasa Cargo China<br>
            ke Indonesia #1
          </h1>

          <p class="mt-6 max-w-[500px] text-[16px] leading-[1.55] text-slate-700">
            Solusi pengiriman cargo laut dan udara B2B yang aman, transparan, dan tepat waktu.
            Bebas urus bea cukai dengan skema All-In Door-to-Door langsung sampai ke gudang Anda.
          </p>

          <p class="mt-3 text-[15px] text-slate-500">
            Pilihan Layanan:
          </p>

          <ul class="mt-6 grid max-w-[470px] grid-cols-3 gap-6">
            <li
              v-for="service in services"
              :key="service"
              class="flex items-center gap-2.5 text-[15px] font-medium text-slate-700"
            >
              <Package
                :size="22"
                :stroke-width="1.8"
                aria-hidden="true"
                class="shrink-0 text-primary-500"
              />
              <span>{{ service }}</span>
            </li>
          </ul>

          <div class="mt-8 flex max-w-[490px] items-center justify-between gap-5">
            <NuxtLink
              to="/#main-services"
              class="inline-flex items-center gap-2 text-[15px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>Lacak Pengiriman</span>
              <ScanLine
                :size="19"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </NuxtLink>

            <NuxtLink
              to="#quote"
              class="inline-flex h-12 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[14px] font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>Konsultasi Tarif</span>
              <ArrowUpRight
                :size="17"
                :stroke-width="2"
                aria-hidden="true"
              />
            </NuxtLink>
          </div>
        </div>

        <img
          :src="cargoSeaUrl"
          width="520"
          height="430"
          alt="Kapal cargo untuk pengiriman barang dari China ke Indonesia"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          class="h-[430px] w-full rounded-[20px] object-cover object-center shadow-[0_12px_30px_rgba(15,23,42,0.10)]"
        >
      </div>
    </UiContainer>
  </section>

  <MarketingChinaCargoHighlights />
  <MarketingChinaCargoSeaFreight />
  <MarketingChinaCargoStats />
  <MarketingChinaCargoAirFreight />
  <MarketingChinaCargoShippingWorkflow />
</template>
