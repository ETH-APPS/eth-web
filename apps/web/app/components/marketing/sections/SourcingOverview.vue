<script setup lang="ts">
import {
  ArrowUpRight,
  Box,
  Plane,
  Ship,
} from 'lucide-vue-next'
import logo1688 from '~/assets/images/brand/1688.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoAliexpress from '~/assets/images/brand/aliexpress.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoTmall from '~/assets/images/brand/tmall.png'

const marketplaces = [
  { name: '1688', src: logo1688, class: 'h-[44px] w-auto' },
  { name: 'Taobao', src: logoTaobao, class: 'h-[39px] w-auto' },
  { name: 'Tmall', src: logoTmall, class: 'h-[34px] w-auto' },
  { name: 'AliExpress', src: logoAliexpress, class: 'h-[31px] w-auto' },
  { name: 'Alibaba.com', src: logoAlibaba, class: 'h-[34px] w-auto' },
] as const

const shippingMethods = [
  {
    title: 'FCL Cargo',
    icon: Ship,
    description:
      'Sewa kontainer utuh untuk hasil sourcing volume besar dengan kepastian jadwal pelayaran dan biaya paling efisien',
  },
  {
    title: 'LCL Cargo',
    icon: Box,
    description:
      'Solusi hemat untuk impor produk hasil sourcing skala menengah tanpa harus menyewa satu kontainer penuh',
  },
  {
    title: 'Air Cargo',
    icon: Plane,
    description:
      'Pengiriman express via jalur udara yang ideal untuk pengiriman sampel produk (sample check) atau restok mendesak',
  },
] as const
</script>

<template>
  <section
    id="sourcing-details"
    aria-labelledby="sourcing-overview-title"
    class="bg-bg-0 py-16"
  >
    <UiContainer>
      <div class="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-16 rounded-[18px] border border-border-200 bg-bg-0 px-12 py-9 shadow-md">
        <h2
          id="sourcing-overview-title"
          class="text-[32px] font-semibold leading-[1.25] text-text-secondary"
        >
          Mengenal Layanan..<br>
          <span class="text-[46px] text-primary-500">Jasa Sourcing</span>
        </h2>

        <p class="text-[15px] leading-[1.55] text-text-secondary">
          Layanan pendampingan impor komprehensif untuk membantu bisnis Anda menemukan produk impian langsung dari manufaktur dan supplier tangan pertama di China. Tim lokal kami di China akan membantu negosiasi harga kuantitas besar (grosir), pengecekan sampel, hingga memastikan kepastian mutu barang sebelum pengiriman.
        </p>
      </div>

      <div class="mt-12 text-center">
        <h3 class="text-[30px] font-semibold leading-tight text-primary-500">
          Integrasi Platform E-Commerce China
        </h3>
        <p class="mx-auto mt-3 max-w-[720px] text-[15px] leading-[1.5] text-text-secondary">
          Cari dan beli produk dari marketplace grosir terbesar di China dengan<br>
          mudah tanpa kendala bahasa atau metode pembayaran lokal.
        </p>

        <ul class="mx-auto mt-6 flex max-w-[660px] flex-wrap items-center justify-center gap-x-8 gap-y-6">
          <li
            v-for="marketplace in marketplaces"
            :key="marketplace.name"
            class="flex h-[46px] items-center justify-center"
          >
            <img
              :src="marketplace.src"
              :alt="marketplace.name"
              loading="lazy"
              decoding="async"
              :class="marketplace.class"
            >
          </li>
        </ul>
      </div>

      <div class="mt-11 text-center">
        <h3 class="text-[30px] font-semibold leading-tight text-primary-500">
          Metode Pengiriman Hasil Sourcing
        </h3>
        <p class="mx-auto mt-4 max-w-[650px] text-[15px] leading-[1.5] text-text-secondary">
          Setelah barang selesai diproduksi atau dibeli, kargo hasil sourcing Anda<br>
          dapat langsung dikirimkan menggunakan jaringan logistik ETH Cargo
        </p>

        <ul class="mt-6 grid grid-cols-3 gap-4 text-left">
          <li
            v-for="method in shippingMethods"
            :key="method.title"
            class="flex min-h-[195px] flex-col rounded-[18px] border border-border-200 bg-bg-0 px-5 py-4"
          >
            <span class="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <component
                :is="method.icon"
                :size="26"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </span>
            <h4 class="mt-2 text-center text-[18px] font-medium text-text-secondary">
              {{ method.title }}
            </h4>
            <p class="mt-4 text-[14px] leading-[1.55] text-text-secondary">
              {{ method.description }}
            </p>
          </li>
        </ul>
      </div>

      <div class="mt-14 text-center">
        <p class="text-[14px] text-text-tertiary">
          Punya foto produk atau link barang yang ingin dicari supplier-nya di China?
        </p>
        <NuxtLink
          to="/#quote"
          class="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[14px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Konsultasi Gratis</span>
          <ArrowUpRight :size="17" :stroke-width="2" aria-hidden="true" />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>
