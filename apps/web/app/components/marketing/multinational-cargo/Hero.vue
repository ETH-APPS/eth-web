<script setup lang="ts">
import {
  ArrowUpRight,
  Blocks,
  Clock3,
  Cuboid,
  Headset,
  PackageCheck,
  PackageSearch,
  ShieldCheck,
} from 'lucide-vue-next'
import multinationalCargoHeroUrl from '~/assets/images/marketing/multinational-cargo-hero.png'

const services = ['Sea Cargo', 'Air Cargo']

const highlights = [
  {
    label: 'Guaranteed\nSafety',
    icon: ShieldCheck,
  },
  {
    label: '24/7\nLive Tracking',
    icon: Clock3,
  },
  {
    label: 'All-in Service',
    icon: Blocks,
  },
  {
    label: 'Door-to-door',
    icon: PackageCheck,
  },
  {
    label: 'Dedicated\nSupport',
    icon: Headset,
  },
]
</script>

<template>
  <section
    aria-labelledby="multinational-cargo-title"
    class="flex min-h-[calc(100svh-70px)] flex-col"
  >
    <div class="flex flex-1 items-center bg-bg-0 py-12">
      <UiContainer>
        <div class="grid grid-cols-[1fr_520px] items-center gap-10">
          <div>
            <p class="text-[20px] font-normal uppercase text-primary-700">
              Multinational Cargo
            </p>

            <h1
              id="multinational-cargo-title"
              class="mt-2 text-[48px] font-semibold leading-[1.2] tracking-[0.01em] text-primary-500"
            >
              America
            </h1>

            <p class="mt-6 max-w-[500px] text-[16px] leading-[1.55] text-text-secondary">
              Solusi pengiriman kargo laut dan udara dari dan menuju Amerika yang aman, transparan,
              dan terintegrasi untuk mendukung kebutuhan logistik internasional bisnis Anda.
            </p>

            <p class="mt-3 text-[16px] text-text-tertiary">
              In this page
            </p>

            <ul class="mt-6 grid max-w-[470px] grid-cols-3 gap-6">
              <li
                v-for="service in services"
                :key="service"
                class="flex items-center gap-2.5 text-[15px] font-medium text-text-secondary"
              >
                <Cuboid
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
                class="inline-flex items-center gap-2 text-[16px] font-medium text-primary-500 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <span>Track Shipment</span>
                <PackageSearch
                  :size="19"
                  :stroke-width="1.8"
                  aria-hidden="true"
                />
              </NuxtLink>

              <NuxtLink
                to="#quote"
                class="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-5 text-[16px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <span>Get a Quote</span>
                <ArrowUpRight
                  :size="19"
                  :stroke-width="2"
                  aria-hidden="true"
                />
              </NuxtLink>
            </div>
          </div>

          <img
            :src="multinationalCargoHeroUrl"
            width="520"
            height="430"
            alt="Pelabuhan dan bandara kargo untuk layanan pengiriman multinational ETH Cargo"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            class="h-[430px] w-full rounded-[20px] object-cover object-center shadow-md"
          >
        </div>
      </UiContainer>
    </div>

    <div class="bg-primary-500 py-10 text-white">
      <UiContainer>
        <ul
          aria-label="Multinational cargo service benefits"
          class="grid grid-cols-5 gap-8"
        >
          <li
            v-for="highlight in highlights"
            :key="highlight.label"
            class="flex flex-col items-center text-center"
          >
            <component
              :is="highlight.icon"
              :size="48"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span class="mt-4 whitespace-pre-line text-[18px] font-semibold leading-[1.35]">
              {{ highlight.label }}
            </span>
          </li>
        </ul>
      </UiContainer>
    </div>
  </section>
</template>
