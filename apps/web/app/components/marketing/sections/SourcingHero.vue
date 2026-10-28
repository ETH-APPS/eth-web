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
    class="bg-bg-0 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="grid grid-cols-[minmax(0,1fr)_520px] items-center gap-20">
        <div>
          <p class="text-[20px] font-normal uppercase text-primary-700">
            Layanan Pencarian Supplier
          </p>

          <h1
            id="sourcing-title"
            class="mt-2 max-w-[500px] text-[48px] font-semibold leading-[1.16] text-primary-500"
          >
            Jasa Sourcing<br>
            Barang China
          </h1>

          <p class="mt-6 max-w-[560px] text-[16px] font-normal leading-[1.55] text-text-secondary">
            Solusi praktis menemukan supplier tangan pertama dan pabrik terpercaya di China tanpa kendala bahasa. Kami bantu proses pencarian produk, negosiasi harga terbaik, pemesanan sampel, hingga kontrol kualitas barang sebelum dikirim.
          </p>

          <p class="mt-4 text-[16px] font-medium text-text-tertiary">
            Kategori Populer:
          </p>

          <ul class="mt-4 grid max-w-[540px] grid-cols-3 gap-5">
            <li
              v-for="category in popularCategories"
              :key="category.label"
              class="flex items-center justify-center gap-2 text-center text-[14px] font-medium leading-[1.35] text-primary-500"
            >
              <span class="whitespace-pre-line">{{ category.label }}</span>
              <component
                :is="category.icon"
                :size="16"
                :stroke-width="1.8"
                aria-hidden="true"
                class="shrink-0"
              />
            </li>
          </ul>

          <div class="mt-5 flex flex-col items-center">
            <div class="flex w-full max-w-[540px] justify-end">
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
                  class="size-5 object-contain"
                >
              </NuxtLink>
            </div>

            <a
              href="#sourcing-details"
              class="mt-3 inline-flex items-center gap-2 text-[12px] font-normal text-text-tertiary transition-colors hover:text-primary-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>Learn more</span>
              <ChevronsDown :size="15" :stroke-width="1.8" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          class="flex aspect-[4/3] w-full items-center justify-center bg-[#b7b7b7] text-center text-slate-950"
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