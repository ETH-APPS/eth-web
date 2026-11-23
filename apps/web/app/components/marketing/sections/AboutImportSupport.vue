<script setup lang="ts">
import { Cuboid, Landmark } from 'lucide-vue-next'

const supportServices = [
  {
    icon: Cuboid,
    title: 'Jasa Sourcing',
    description:
      'Pendampingan pencarian pabrik/supplier terpercaya di China, negosiasi harga grosir modal, hingga pengecekan sampel produk tanpa kendala bahasa.',
    ctaLabel: 'Learn more',
    to: '/sourcing',
  },
  {
    icon: Landmark,
    title: 'Jasa Transfer RMB',
    description:
      'Fasilitas pembayaran kilat dan aman ke rekening bank China, Alipay, WeChat Pay, atau tagihan 1688 dengan kurs real-time dan bukti transfer resmi.',
    ctaLabel: 'Learn more',
    to: '/transfer-rmb',
  },
] as const
</script>

<template>
  <section
    id="import-support-services"
    aria-labelledby="import-support-services-title"
    class="bg-bg-100 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="import-support-services-title"
          class="text-[36px] font-semibold leading-tight text-primary-500 sm:text-[48px]"
        >
          Layanan Pendukung Impor
        </h2>

        <p class="mx-auto mt-7 max-w-[900px] text-[17px] font-normal leading-[1.5] text-text-tertiary sm:text-[20px]">
          Selain pengiriman kargo, ETH Cargo menyediakan layanan pendukung impor terlengkap untuk membantu pencarian supplier tangan pertama di China serta transaksi pembayaran kilat secara aman dan legal.
        </p>
      </div>

      <h3 class="mt-10 text-center text-[28px] font-semibold leading-tight text-primary-500 sm:text-[32px]">
        Solusi Ekosistem Bisnis
      </h3>

      <ul class="mt-7 grid gap-5 md:grid-cols-2">
        <li
          v-for="service in supportServices"
          :key="service.title"
          class="group flex min-h-[265px] flex-col rounded-[18px] border border-border-200 bg-bg-0 p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary-500 hover:shadow-md focus-within:border-primary-500 focus-within:shadow-md"
        >
          <span class="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
            <component
              :is="service.icon"
              :size="27"
              :stroke-width="1.8"
              aria-hidden="true"
            />
          </span>

          <h4 class="mt-3 text-center text-[20px] font-medium text-text-secondary">
            {{ service.title }}
          </h4>

          <p class="mt-5 text-[16px] font-normal leading-[1.5] text-text-secondary">
            {{ service.description }}
          </p>

          <div class="mt-auto flex justify-end pt-5">
            <UiAnimatedArrowButton
              :to="service.to"
              :aria-label="`${service.ctaLabel} ${service.title}`"
              variant="plain"
              :icon-size="16"
              class="inline-flex h-10 items-center gap-2 rounded-xl px-5 text-[14px] font-medium text-primary-500 transition-[background-color,color,box-shadow] duration-200 group-hover:bg-primary-500 group-hover:text-white group-hover:hover:bg-primary-100 group-hover:hover:text-primary-500 group-hover:hover:ring-2 group-hover:hover:ring-inset group-hover:hover:ring-primary-500 group-focus-within:bg-primary-500 group-focus-within:text-white group-focus-within:focus-visible:bg-primary-100 group-focus-within:focus-visible:text-primary-500 group-focus-within:focus-visible:ring-2 group-focus-within:focus-visible:ring-inset group-focus-within:focus-visible:ring-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {{ service.ctaLabel }}
            </UiAnimatedArrowButton>
          </div>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
