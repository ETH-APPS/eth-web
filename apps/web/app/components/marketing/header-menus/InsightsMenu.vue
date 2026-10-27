<script setup lang="ts">
import {
  ArrowUpRight,
  BookOpenText,
  Gift,
  Newspaper,
  Route,
} from 'lucide-vue-next'
</script>

<template>
  <UiContainer class="grid grid-cols-2 gap-16 py-10 text-text-secondary">
    <section aria-labelledby="articles-news-title">
      <p
        id="articles-news-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        Articles &amp; News
      </p>

      <div class="space-y-5">
        <NuxtLink
          to="/promo"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <Gift :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Our Promo
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Temukan promo dan penawaran terbaru untuk kebutuhan pengiriman bisnis Anda.
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/blog"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <Newspaper :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Our Blog
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Baca artikel, kabar, dan insight terbaru seputar logistik serta impor.
            </span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section aria-labelledby="guides-title">
      <p
        id="guides-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        Guides
      </p>

      <div class="space-y-5">
        <NuxtLink
          to="/glossary"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <BookOpenText :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Glossary
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Pelajari istilah penting dalam pengiriman, logistik, dan proses impor.
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/#alur-pengiriman"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white">
            <Route :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Proses Impor
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
              />
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Pahami tahapan pengiriman dan proses impor barang bersama ETH Cargo.
            </span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </UiContainer>
</template>