<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea.png'
</script>

<template>
  <section
    id="sea-freight"
    aria-labelledby="multinational-sea-freight-title"
    class="bg-white py-16"
  >
    <UiContainer>
      <img
        :src="cargoSeaUrl"
        width="865"
        height="336"
        alt="Kapal kontainer untuk layanan sea freight multinational ETH Cargo"
        loading="lazy"
        decoding="async"
        class="mx-auto h-[336px] w-full max-w-[865px] rounded-[20px] object-cover object-center"
      >

      <div class="mx-auto mt-10 max-w-[760px] text-center">
        <p class="text-[13px] font-medium uppercase text-primary-700">
          Our Service
        </p>

        <h2
          id="multinational-sea-freight-title"
          class="mt-2 text-[38px] font-semibold uppercase leading-tight tracking-[0.01em] text-primary-500"
        >
          Sea Freight
        </h2>

        <p class="mx-auto mt-5 max-w-[700px] text-[14px] leading-[1.55] text-slate-700">
          Kirim barang bervolume besar melalui layanan Full Container Load (FCL) yang aman dan
          andal. Dengan kepastian alokasi kontainer serta penguncian tarif hingga 45 hari,
          perencanaan logistik bisnis menjadi lebih efisien dan terukur.
        </p>

        <p class="mt-10 text-[11px] text-text-tertiary">
          Pelajari layanan pengiriman laut untuk kebutuhan bisnis internasional Anda
        </p>

        <NuxtLink
          to="#quote"
          class="mt-3 inline-flex h-9 items-center gap-2 rounded-xl bg-primary-500 px-4 text-[11px] font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Learn more</span>
          <ArrowUpRight
            :size="15"
            :stroke-width="2"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>
