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
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Gift :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="flex items-center gap-2 text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Our Promo
              <ArrowUpRight
                :size="18"
                aria-hidden="true"
                class="text-primary-500"
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
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Newspaper :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Our Blog
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
          to="#footer"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <BookOpenText :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Glossary
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
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Route :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              Proses Impor
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
