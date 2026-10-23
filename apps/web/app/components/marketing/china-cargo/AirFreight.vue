<script setup lang="ts">
import { ClockCheck } from 'lucide-vue-next'
import airFreightUrl from '~/assets/images/marketing/air-freight.png'

const services = [
  {
    title: 'AIR Cargo',
    description:
      'Solusi pengiriman express untuk sampel produk, barang dengan urgensi tinggi, atau produk berfokus pada tren. Mengombinasikan kecepatan pengiriman udara dengan kemudahan pengurusan pajak dan dokumen clearance secara All-In sampai ke gudang Anda.',
    eta: '3 – 7 Hari',
    image: airFreightUrl,
    imageAlt: 'Pesawat cargo untuk layanan pengiriman udara ETH Cargo',
  },
]
</script>

<template>
  <section
    id="air-freight"
    aria-labelledby="air-freight-title"
    class="bg-bg-0 py-16"
  >
    <UiContainer>
      <div class="text-center">
        <p class="text-[20px] font-medium uppercase text-primary-700">
          Layanan Kami
        </p>
        <h2
          id="air-freight-title"
          class="mt-2 text-[48px] font-semibold uppercase leading-tight tracking-[0.01em] text-primary-500"
        >
          Kargo Udara (Air Freight)
        </h2>
        <p class="mx-auto mt-5 max-w-[900px] text-[20px] leading-[1.5] text-text-secondary">
          Butuh stok produk tiba lebih cepat? Layanan Kargo Udara ETH Cargo menghadirkan solusi
          pengiriman prioritas dengan waktu transit singkat, jadwal penerbangan rutin, serta
          penanganan bea cukai yang aman dan transparan.
        </p>
      </div>

      <div class="mx-auto mt-10 space-y-10">
        <article
          v-for="service in services"
          :key="service.title"
          class="grid grid-cols-[1fr_420px] items-center gap-8 rounded-[20px] border border-border-200 bg-bg-0 px-12 py-10 shadow-md"
        >
          <div>
            <p class="text-[20px] font-medium text-text-secondary">
              Mengenal Layanan...
            </p>
            <h3 class="mt-2 text-[42px] font-bold leading-tight text-primary-500">
              {{ service.title }}
            </h3>
            <p class="mt-7 text-[16px] leading-[1.5] text-text-secondary">
              {{ service.description }}
            </p>

            <div class="mt-8 flex items-center gap-3 text-primary-500">
              <ClockCheck
                :size="24"
                :stroke-width="1.8"
                aria-hidden="true"
              />
              <span class="text-[20px] font-medium">ETA</span>
              <span
                aria-hidden="true"
                class="h-px w-6 bg-border-300"
              />
              <span class="text-[20px] font-medium">{{ service.eta }}</span>
            </div>
          </div>

          <img
            :src="service.image"
            :alt="service.imageAlt"
            width="420"
            loading="lazy"
            decoding="async"
            class="h-auto w-full rounded-2xl"
          >
        </article>
      </div>
    </UiContainer>
  </section>
</template>