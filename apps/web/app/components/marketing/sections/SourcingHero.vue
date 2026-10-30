<script setup lang="ts">
import {
  ChevronsDown,
  Shirt,
  Wrench,
} from 'lucide-vue-next'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'

const popularCategories = [
  {
    label: 'Mesin &\nPeralatan Usaha',
    icon: Wrench,
  },
  {
    label: 'Garment &\nNon-garment',
    icon: Shirt,
  },
  {
    label: 'Bahan Baku &\nOtomotif',
    icon: Wrench,
  },
] as const
</script>

<template>
  <section
    aria-labelledby="sourcing-title"
    class="bg-bg-0 py-14 sm:py-16 lg:py-20"
  >
    <UiContainer>
      <div class="grid grid-cols-1 items-center lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-20">
        <div>
          <p class="text-[16px] font-normal uppercase text-primary-700 lg:text-[20px]">
            Layanan Pencarian Supplier
          </p>

          <h1
            id="sourcing-title"
            class="mt-2 text-[32px] font-semibold leading-[1.25] text-primary-500 lg:max-w-[500px] lg:text-[48px] lg:leading-[1.16]"
          >
            Jasa Sourcing<br>
            Barang China
          </h1>

          <p class="mt-6 max-w-[560px] text-[16px] font-normal leading-[1.55] text-text-secondary">
            Solusi praktis menemukan supplier tangan pertama dan pabrik terpercaya di China tanpa kendala bahasa. Kami bantu proses pencarian produk, negosiasi harga terbaik, pemesanan sampel, hingga kontrol kualitas barang sebelum dikirim.
          </p>

          <p class="mt-4 hidden text-[16px] font-medium text-text-tertiary lg:block">
            Kategori Populer:
          </p>

          <ul class="mt-8 grid grid-cols-1 gap-8 lg:mt-4 lg:max-w-[540px] lg:grid-cols-3 lg:gap-5">
            <li
              v-for="category in popularCategories"
              :key="category.label"
              class="flex items-center justify-center gap-2 text-center text-[14px] font-medium leading-[1.35] text-primary-500"
            >
              <span class="whitespace-normal lg:whitespace-pre-line">{{ category.label }}</span>
              <component
                :is="category.icon"
                :size="16"
                :stroke-width="1.8"
                aria-hidden="true"
                class="shrink-0"
              />
            </li>
          </ul>

          <div class="mt-12 flex flex-col items-center lg:mt-5">
            <div class="flex w-full max-w-[540px] justify-center lg:justify-end">
              <NuxtLink
                to="/#quote"
                class="inline-flex h-12 items-center gap-2 rounded-xl bg-green-500 px-6 text-[16px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                <span>Konsultasi</span>
                <img
                  :src="whatsappUrl"
                  alt=""
                  aria-hidden="true"
                  width="20"
                  height="20"
                  class="size-6 object-contain lg:size-5"
                >
              </NuxtLink>
            </div>

            <a
              href="#sourcing-details"
              class="mt-3 hidden items-center gap-2 text-[12px] font-normal text-text-tertiary transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:inline-flex"
            >
              <span>Learn more</span>
              <ChevronsDown :size="15" :stroke-width="1.8" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          class="hidden aspect-[4/3] w-full items-center justify-center bg-[#b7b7b7] text-center text-slate-950 lg:flex"
          role="img"
          aria-label="Placeholder gambar layanan jasa sourcing barang China"
        >
          <p class="text-[18px] leading-[1.75]">
            Image<br>
            W: 520&nbsp;&nbsp;&nbsp; x &nbsp;&nbsp;&nbsp;H: 390<br>
            Rasio&nbsp;&nbsp;&nbsp; x &nbsp;&nbsp;&nbsp;4:3
          </p>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
