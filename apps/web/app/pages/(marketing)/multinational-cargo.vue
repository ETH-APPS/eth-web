<script setup lang="ts">
import { ArrowUpRight, Package, ScanLine } from 'lucide-vue-next'
import multinationalCargoHeroUrl from '~/assets/images/marketing/multinational-cargo-hero.png'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Multinational Cargo Amerika | ETH Cargo',
  description:
    'Layanan pengiriman kargo laut dan udara untuk kebutuhan logistik internasional dari dan menuju Amerika bersama ETH Cargo.',
  ogTitle: 'Multinational Cargo Amerika | ETH Cargo',
  ogDescription:
    'Layanan pengiriman kargo laut dan udara untuk kebutuhan logistik internasional dari dan menuju Amerika bersama ETH Cargo.',
  ogType: 'website',
})

const services = ['Sea Cargo', 'Air Cargo']
</script>

<template>
  <section
    aria-labelledby="multinational-cargo-title"
    class="flex min-h-[calc(100svh-70px)] items-center bg-white py-12"
  >
    <UiContainer>
      <div class="grid grid-cols-[1fr_520px] items-center gap-16">
        <div>
          <p class="text-[18px] font-medium text-primary-700">
            Multinational Cargo
          </p>

          <h1
            id="multinational-cargo-title"
            class="mt-3 text-[52px] font-semibold leading-[1.2] tracking-[0.01em] text-primary-500"
          >
            America
          </h1>

          <p class="mt-6 max-w-[500px] text-[16px] leading-[1.55] text-slate-700">
            Solusi pengiriman kargo laut dan udara dari dan menuju Amerika yang aman, transparan,
            dan terintegrasi untuk mendukung kebutuhan logistik internasional bisnis Anda.
          </p>

          <p class="mt-6 text-[15px] text-slate-500">
            In this page
          </p>

          <ul class="mt-6 grid max-w-[360px] grid-cols-2 gap-6">
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
              <span>Track Shipment</span>
              <ScanLine
                :size="19"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </NuxtLink>

            <NuxtLink
              to="#quote"
              class="inline-flex h-12 w-fit items-center gap-2 rounded-xl bg-primary-500 px-6 text-[14px] font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>Get a Quote</span>
              <ArrowUpRight
                :size="18"
                :stroke-width="2"
                aria-hidden="true"
              />
            </NuxtLink>
          </div>
        </div>

        <img
          :src="multinationalCargoHeroUrl"
          width="520"
          height="390"
          alt="Pelabuhan dan bandara kargo untuk layanan pengiriman multinational ETH Cargo"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          class="h-[430px] w-full rounded-[20px] object-cover object-center shadow-[0_12px_30px_rgba(15,23,42,0.10)]"
        >
      </div>
    </UiContainer>
  </section>

  <MarketingMultinationalCargoHighlights />
  <MarketingMultinationalCargoSeaFreight />
  <MarketingMultinationalCargoStats />
  <MarketingMultinationalCargoAirFreight />
</template>
