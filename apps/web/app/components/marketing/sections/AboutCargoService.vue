<script setup lang="ts">
import { ArrowUpRight, Container, Package, Plane } from 'lucide-vue-next'
import cargoAirUrl from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea-landscape.png'

const shippingMethods = [
  {
    icon: Container,
    title: 'Sea Cargo',
    description:
      'Solusi paling ekonomis untuk pengiriman kargo volume besar via container FCL (Full Container) maupun LCL (Eceran/CBM) dengan jadwal kapal rutin.',
  },
  {
    icon: Plane,
    title: 'Air Cargo',
    description:
      'Layanan pengiriman super cepat (3–7 hari kerja) untuk produk sensitif, barang high-value, atau kebutuhan restok mendesak bisnis Anda.',
  },
] as const

const mobileShippingMethods = [
  {
    icon: Package,
    title: 'FCL Cargo',
    description:
      'Pengiriman satu kontainer penuh untuk kargo volume besar, dengan proses kepabeanan dan pengantaran sampai alamat tujuan.',
  },
  {
    icon: Container,
    title: 'LCL Cargo',
    description:
      'Pengiriman barang tanpa perlu menyewa satu kontainer penuh, cocok untuk kebutuhan impor dengan volume lebih kecil.',
  },
  {
    icon: Plane,
    title: 'Air Cargo',
    description: shippingMethods[1].description,
  },
] as const
</script>

<template>
  <section
    id="main-cargo-service"
    aria-labelledby="main-cargo-service-title"
    class="bg-bg-0 py-6 lg:py-20"
  >
    <UiContainer>
      <picture>
        <source media="(max-width: 1023px)" :srcset="cargoAirUrl">
        <img
          :src="cargoSeaUrl"
          alt="Pengiriman kargo internasional ETH Cargo"
          width="1080"
          height="444"
          loading="lazy"
          decoding="async"
          class="h-auto w-full object-cover object-center lg:h-[444px]"
        >
      </picture>

      <div class="mt-6 text-center lg:mt-10">
        <p class="text-[16px] font-normal text-primary-700 lg:text-[20px]">
          <span class="lg:hidden">Our Service</span>
          <span class="hidden lg:inline">Layanan Utama</span>
        </p>

        <h2
          id="main-cargo-service-title"
          class="mt-1 text-[24px] font-bold leading-tight text-primary-500 lg:mt-2 lg:text-[48px]"
        >
          <span class="lg:hidden">Shipping Method</span>
          <span class="hidden lg:inline">Pengiriman Kargo</span>
        </h2>

        <p class="mx-auto mt-5 max-w-[980px] text-justify text-[16px] font-normal leading-[1.55] text-text-secondary lg:mt-7 lg:text-center lg:text-[20px]">
          Kami menyediakan solusi pengiriman kargo internasional terpercaya untuk skala bisnis kecil hingga industri. Dengan sistem pengiriman All-In Door-to-Door, kami memastikan proses pengurusan bea cukai, kepabeanan, hingga pengantaran barang ke alamat tujuan berjalan lancar dan tepat waktu.
        </p>
      </div>

      <h3 class="mt-8 text-center text-[20px] font-semibold leading-tight text-primary-500 lg:mt-10 lg:text-[32px]">
        <span class="lg:hidden">Shipping Method</span>
        <span class="hidden lg:inline">Pilihan Metode Pengiriman</span>
      </h3>

      <ul class="mt-6 grid gap-4 lg:hidden">
        <li
          v-for="method in mobileShippingMethods"
          :key="method.title"
          class="rounded-[18px] border border-border-200 bg-bg-0 px-4 py-4 text-center"
        >
          <span class="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
            <component
              :is="method.icon"
              :size="25"
              :stroke-width="1.8"
              aria-hidden="true"
            />
          </span>
          <h4 class="mt-3 text-[20px] font-medium text-text-secondary">
            {{ method.title }}
          </h4>
          <p class="mt-4 text-justify text-[16px] font-normal leading-[1.5] text-text-secondary">
            {{ method.description }}
          </p>
        </li>
      </ul>

      <ul class="mt-6 hidden gap-5 lg:grid lg:grid-cols-2">
        <li
          v-for="method in shippingMethods"
          :key="method.title"
          class="rounded-[18px] border border-border-200 px-4 bg-bg-0 py-4 text-center"
        >
          <span class="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
            <component
              :is="method.icon"
              :size="25"
              :stroke-width="1.8"
              aria-hidden="true"
            />
          </span>

          <h4 class="mt-3 text-[20px] font-medium text-text-secondary">
            {{ method.title }}
          </h4>

          <p class="mt-4 text-[16px] font-normal leading-[1.5] text-text-secondary">
            {{ method.description }}
          </p>
        </li>
      </ul>

      <div class="mt-14 text-center">
        <p class="text-[13px] text-text-tertiary">
          Ingin mengetahui estimasi biaya pengiriman kargo bisnis Anda?
        </p>

        <NuxtLink
          to="#quote"
          class="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-[14px] font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Konsultasi Gratis</span>
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
