<script setup lang="ts">
import {
  BadgeInfo,
  BookOpenText,
  ScrollText,
} from 'lucide-vue-next'
</script>

<template>
  <UiContainer class="grid grid-cols-2 gap-16 py-10 text-text-secondary">
    <section aria-labelledby="about-eth-cargo-title">
      <p
        id="about-eth-cargo-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        About ETH Cargo
      </p>

      <div class="space-y-5">
        <NuxtLink
          to="/about-us"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <BadgeInfo :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              About Us
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Kenali ETH Cargo dan komitmen kami dalam mendukung kebutuhan logistik bisnis Anda.
            </span>
          </span>
        </NuxtLink>

        <NuxtLink
          to="/faq"
          class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <BookOpenText :size="20" aria-hidden="true" />
          </span>
          <span>
            <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
              FAQ
            </span>
            <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
              Temukan jawaban atas pertanyaan umum seputar layanan dan proses pengiriman.
            </span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section aria-labelledby="legalities-title">
      <p
        id="legalities-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        Legalities
      </p>

      <NuxtLink
        to="/terms-and-conditions"
        class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
      >
        <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <ScrollText :size="20" aria-hidden="true" />
        </span>
        <span>
          <span class="text-base font-medium text-text-secondary transition-colors group-hover/item:text-primary-500">
            Syarat &amp; Ketentuan
          </span>
          <span class="mt-2 block max-w-80 text-xs leading-6 text-text-tertiary">
            Pelajari ketentuan penggunaan layanan dan informasi legal ETH Cargo.
          </span>
        </span>
      </NuxtLink>
    </section>
  </UiContainer>
</template>
