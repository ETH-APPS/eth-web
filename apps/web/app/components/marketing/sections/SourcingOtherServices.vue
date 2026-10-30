<script setup lang="ts">
import {
  ArrowUpRight,
  Cuboid,
  Headphones,
} from 'lucide-vue-next'

const services = [
  {
    title: 'Kargo China',
    icon: Cuboid,
    mobileTo: '/china-cargo',
    description:
      'Kirim barang hasil sourcing Anda secara efisien via kargo laut (FCL/LCL) atau Udara express dengan pengurusan izin bea cukai resmi sampai ke gudang Anda.',
    links: [
      { label: 'Sea Cargo', to: '/sea-freight' },
      { label: 'Air Cargo', to: '/air-freight' },
    ],
  },
  {
    title: 'Jasa Transfer RMB',
    icon: Headphones,
    mobileTo: '/transfer-rmb',
    description:
      'Fasilitas bayar supplier, invoice pabrik, atau tagihan 1688/Taobao dengan kurs transparan real-time dan jaminan bukti transfer resmi.',
    links: [
      { label: 'Kalkulator Transfer RMB', to: '/transfer-rmb' },
    ],
  },
] as const
</script>

<template>
  <section
    aria-labelledby="sourcing-other-services-title"
    class="bg-bg-100 py-14"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="sourcing-other-services-title"
          class="text-[24px] font-bold leading-tight text-primary-500 lg:text-[32px] lg:font-semibold"
        >
          <span class="lg:hidden">Hitung Estimasi Tarif</span>
          <span class="hidden lg:inline">Layanan ETH Cargo Lainnya</span>
        </h2>
        <p class="mx-auto mt-6 max-w-[820px] text-[14px] font-normal leading-[1.5] text-text-tertiary lg:mt-5 lg:text-[20px]">
          Lengkapi kebutuhan impor bisnis Anda dengan ekosistem layanan B2B<br class="hidden lg:block">
          ETH Cargo, mulai dari pengiriman kargo All-In hingga fasilitas<br class="hidden lg:block">
          pembayaran kilat ke supplier China.
        </p>
      </div>

      <ul class="mx-auto mt-8 grid grid-cols-1 items-stretch gap-4 lg:mt-10 lg:grid-cols-2">
        <li
          v-for="service in services"
          :key="service.title"
          class="group flex min-h-[220px] flex-col rounded-[18px] border border-border-200 bg-bg-0 p-4 shadow-md transition-[border-color,box-shadow] duration-200 hover:border-primary-500 lg:p-5"
        >
          <div class="flex items-center gap-3">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500 lg:size-10">
              <component
                :is="service.icon"
                :size="25"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </span>
            <h3 class="text-[20px] font-medium text-text-secondary">
              {{ service.title }}
            </h3>
          </div>

          <p class="mt-4 text-[16px] font-normal leading-[1.55] text-text-secondary">
            {{ service.description }}
          </p>

          <div class="mt-auto flex justify-end pt-5 lg:hidden">
            <NuxtLink
              :to="service.mobileTo"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary-500 px-5 text-[14px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>Selengkapnya</span>
              <ArrowUpRight :size="16" :stroke-width="2" aria-hidden="true" />
            </NuxtLink>
          </div>

          <div class="mt-auto hidden justify-end gap-3 pt-5 lg:flex">
            <NuxtLink
              v-for="link in service.links"
              :key="link.label"
              :to="link.to"
              class="inline-flex h-10 items-center gap-1.5 rounded-xl bg-transparent px-4 text-[14px] font-medium text-primary-500 transition-[background-color,color,translate] duration-200 hover:-translate-y-0.5 group-hover:bg-primary-500 group-hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>{{ link.label }}</span>
              <ArrowUpRight :size="16" :stroke-width="2" aria-hidden="true" />
            </NuxtLink>
          </div>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
