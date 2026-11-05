<script setup lang="ts">
import {
  ArrowUpRight,
  BadgePercent,
  Notebook,
  Route,
} from 'lucide-vue-next'
import NewsIcon from '../NewsIcon.vue'
</script>

<template>
  <UiContainer class="grid !max-w-[720px] grid-cols-2 gap-16 py-10 text-text-secondary">
    <div role="group" aria-labelledby="articles-news-title">
      <p
        id="articles-news-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        Berita &amp; Penawaran
      </p>

      <div class="space-y-5">
        <NuxtLink
          to="/promo"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <BadgePercent :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Promo &amp; Penawaran Spesial
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Dapatkan promo cashback, diskon ongkir kargo laut/udara, dan voucher potongan biaya transfer RMB terbaru.
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/blog"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <NewsIcon :size="20" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Blog &amp; Berita Impor
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Artikel edukasi seputar tips impor barang dari China, tren komoditas, hingga analisis peluang bisnis.
            </span>
          </span>
        </NuxtLink>
      </div>
    </div>

    <div role="group" aria-labelledby="guides-title">
      <p
        id="guides-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        Panduan
      </p>

      <div class="space-y-5">
        <NuxtLink
          to="/glossary"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <Notebook :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Kamus Istilah Impor
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Pahami istilah-istilah kepabeanan dan logistik seperti CBM, FCL, LCL, HS Code, Bill of Lading (BL), dan Lartas.
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/complete-guide"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <Route :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Cara Import Barang dari China
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Panduan langkah demi langkah proses pengiriman kargo All-In Door-to-Door dari supplier China hingga tiba di alamat Anda.
            </span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </UiContainer>
</template>
