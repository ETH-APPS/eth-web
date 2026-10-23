<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import cargoAirUrl from '~/assets/images/marketing/cargo-air.png'
</script>

<template>
  <section
    id="air-freight"
    aria-labelledby="multinational-air-freight-title"
    class="bg-white py-16"
  >
    <UiContainer>
      <img
        :src="cargoAirUrl"
        width="865"
        height="336"
        alt="Pesawat cargo untuk layanan air freight multinational ETH Cargo"
        loading="lazy"
        decoding="async"
        class="mx-auto h-[336px] w-full max-w-[865px] rounded-[20px] object-cover object-center"
      >

      <div class="mx-auto mt-10 max-w-[760px] text-center">
        <p class="text-[13px] font-medium uppercase text-primary-700">
          Our Service
        </p>

        <h2
          id="multinational-air-freight-title"
          class="mt-2 text-[38px] font-semibold uppercase leading-tight tracking-[0.01em] text-primary-500"
        >
          Air Freight
        </h2>

        <p class="mx-auto mt-5 max-w-[700px] text-[14px] leading-[1.55] text-slate-700">
          Butuh pengiriman internasional yang lebih cepat? Layanan Air Freight kami memberikan
          waktu transit singkat, jadwal penerbangan yang terukur, serta penanganan kargo yang aman
          dari titik keberangkatan hingga tiba di negara tujuan.
        </p>

        <p class="mt-10 text-[11px] text-text-tertiary">
          Pelajari layanan pengiriman udara untuk kebutuhan bisnis internasional Anda
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
