<script setup lang="ts">
import {
  ArrowUpRight,
  Container,
  Cuboid,
  Plane,
} from 'lucide-vue-next'
import logo1688 from '~/assets/images/brand/1688.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoAliexpress from '~/assets/images/brand/aliexpress.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoTmall from '~/assets/images/brand/tmall.png'

const marketplaces = [
  { name: '1688', src: logo1688, class: 'h-[44px] w-auto' },
  { name: 'Taobao', src: logoTaobao, class: 'h-[52px] w-auto' },
  { name: 'Tmall', src: logoTmall, class: 'h-[46px] w-auto' },
  { name: 'AliExpress', src: logoAliexpress, class: 'h-[44px] w-auto' },
  { name: 'Alibaba.com', src: logoAlibaba, class: 'h-[46px] w-auto' },
] as const

const marketplaceRows = [marketplaces.slice(0, 3), marketplaces.slice(3)]

const shippingMethods = [
  {
    title: 'FCL Cargo',
    icon: Cuboid,
    description:
      'Sewa kontainer utuh untuk hasil sourcing volume besar dengan kepastian jadwal pelayaran dan biaya paling efisien',
  },
  {
    title: 'LCL Cargo',
    icon: Container,
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
    class="bg-bg-0 py-12 lg:py-16"
  >
    <UiContainer>
      <div class="grid grid-cols-1 items-center gap-5 rounded-[18px] border border-border-200 bg-bg-0 px-5 py-8 shadow-md lg:grid-cols-2 lg:gap-2 lg:px-14 lg:py-10">
        <h2
          id="sourcing-overview-title"
          class="text-[20px] font-medium leading-[1.25] text-text-secondary lg:text-[32px] lg:font-semibold"
        >
          Mengenal Layanan..<br class="hidden lg:block">
          <span class="block text-[32px] font-semibold leading-[1.25] text-primary-500 lg:inline lg:whitespace-nowrap lg:text-[60px] lg:font-bold lg:leading-[1.15]">Jasa Sourcing</span>
        </h2>

        <p class="text-[16px] font-normal leading-[1.6] text-text-secondary">
          Layanan pendampingan impor komprehensif untuk membantu bisnis Anda menemukan produk impian langsung dari manufaktur dan supplier tangan pertama di China. Tim lokal kami di China akan membantu negosiasi harga kuantitas besar (grosir), pengecekan sampel, hingga memastikan kepastian mutu barang sebelum pengiriman.
        </p>
      </div>

      <div class="mt-10 text-center lg:mt-12">
        <h3 class="mx-auto max-w-[320px] text-[24px] font-semibold leading-tight text-primary-500 lg:max-w-none lg:text-[32px]">
          Integrasi Platform E-Commerce China
        </h3>
        <p class="mx-auto mt-3 max-w-[760px] text-[14px] font-normal leading-[1.5] text-text-secondary lg:text-[16px]">
          Cari dan beli produk dari marketplace grosir terbesar di China dengan<br class="hidden lg:block">
          mudah tanpa kendala bahasa atau metode pembayaran lokal.
        </p>

        <div class="marketplace-marquee -mx-4 mt-6 overflow-hidden lg:hidden">
          <div class="marketplace-track">
            <ul
              v-for="copy in 2"
              :key="copy"
              class="marketplace-group"
              :aria-hidden="copy === 2 ? 'true' : undefined"
              :aria-label="copy === 1 ? 'Platform e-commerce China' : undefined"
            >
              <li
                v-for="marketplace in marketplaces"
                :key="marketplace.name"
                class="flex h-14 w-36 shrink-0 items-center justify-center"
              >
                <img
                  :src="marketplace.src"
                  :alt="copy === 1 ? marketplace.name : ''"
                  loading="lazy"
                  decoding="async"
                  class="max-h-8 max-w-[124px] object-contain"
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-6 hidden flex-col items-center gap-y-3 lg:flex">
          <ul
            v-for="(row, rowIndex) in marketplaceRows"
            :key="rowIndex"
            class="flex items-center justify-center gap-x-8"
          >
            <li
              v-for="marketplace in row"
              :key="marketplace.name"
              class="flex h-14 items-center justify-center"
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
      </div>

      <div class="mt-10 text-center lg:mt-11">
        <h3 class="mx-auto max-w-[320px] text-[24px] font-semibold leading-tight text-primary-500 lg:max-w-none lg:text-[32px]">
          Metode Pengiriman Hasil Sourcing
        </h3>
        <p class="mx-auto mt-4 max-w-[720px] text-[16px] font-normal leading-[1.5] text-text-secondary">
          Setelah barang selesai diproduksi atau dibeli, kargo hasil sourcing Anda<br class="hidden lg:block">
          dapat langsung dikirimkan menggunakan jaringan logistik ETH Cargo
        </p>

        <ul class="mt-6 grid grid-cols-1 gap-4 text-left lg:grid-cols-3">
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
            <h4 class="mt-2 text-center text-[20px] font-medium text-text-secondary">
              {{ method.title }}
            </h4>
            <p class="mt-4 text-[16px] font-normal leading-[1.55] text-text-secondary">
              {{ method.description }}
            </p>
          </li>
        </ul>
      </div>

      <div class="mt-14 text-center">
        <p class="text-[16px] font-normal text-text-tertiary">
          Punya foto produk atau link barang yang ingin dicari supplier-nya di China?
        </p>
        <NuxtLink
          to="/#quote"
          class="mt-3 inline-flex h-12 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[16px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Konsultasi Gratis</span>
          <ArrowUpRight :size="18" :stroke-width="2" aria-hidden="true" />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.marketplace-track {
  display: flex;
  width: max-content;
  animation: marketplace-scroll 28s linear infinite;
}

.marketplace-group {
  display: flex;
  flex: none;
  gap: 1.5rem;
  padding-right: 1.5rem;
}

.marketplace-marquee:hover .marketplace-track {
  animation-play-state: paused;
}

@keyframes marketplace-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marketplace-marquee {
    overflow-x: auto;
  }

  .marketplace-track {
    animation: none;
  }

  .marketplace-group[aria-hidden="true"] {
    display: none;
  }
}
</style>
