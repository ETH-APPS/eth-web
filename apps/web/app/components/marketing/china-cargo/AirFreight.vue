<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import cargoAirUrl from '~/assets/images/marketing/cargo-air.png'
</script>

<template>
  <section
    id="air-freight"
    aria-labelledby="air-freight-title"
    class="bg-white py-16"
  >
    <UiContainer>
      <div class="text-center">
        <p class="text-[15px] font-medium uppercase text-primary-700">
          Layanan Kami
        </p>
        <h2
          id="air-freight-title"
          class="mt-2 text-[38px] font-semibold uppercase leading-tight tracking-[0.01em] text-primary-500"
        >
          Kargo Udara (Air Freight)
        </h2>
        <p class="mx-auto mt-5 max-w-[760px] text-[14px] leading-[1.5] text-slate-700">
          Butuh stok produk tiba lebih cepat? Layanan Kargo Udara ETH Cargo menghadirkan solusi
          pengiriman prioritas dengan waktu transit singkat, jadwal penerbangan rutin, serta
          penanganan bea cukai yang aman dan transparan.
        </p>
      </div>

      <article class="mx-auto mt-10 grid min-h-[320px] max-w-[865px] grid-cols-[1fr_390px] items-center gap-10 rounded-[20px] border border-slate-200 bg-white px-10 py-8 shadow-[0_5px_12px_rgba(15,23,42,0.10)] transition-transform duration-300 hover:-translate-y-1">
        <div>
          <p class="text-[15px] font-medium text-slate-700">
            Mengenal Layanan...
          </p>
          <h3 class="mt-2 text-[34px] font-semibold leading-tight text-primary-500">
            AIR Cargo
          </h3>
          <p class="mt-7 text-[13px] leading-[1.5] text-slate-700">
            Solusi pengiriman express untuk sampel produk, barang dengan urgensi tinggi, atau
            produk berfokus pada tren. Mengombinasikan kecepatan pengiriman udara dengan kemudahan
            pengurusan pajak dan dokumen clearance secara All-In sampai ke gudang Anda.
          </p>

          <div class="mt-8 flex items-center gap-3 text-primary-500">
            <Clock3
              :size="21"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span class="text-[15px] font-medium">ETA</span>
            <span
              aria-hidden="true"
              class="h-px w-5 bg-slate-300"
            />
            <span class="text-[15px] font-medium">3 – 7 Hari</span>
          </div>
        </div>

        <img
          :src="cargoAirUrl"
          width="390"
          height="240"
          alt="Pesawat cargo untuk layanan pengiriman udara ETH Cargo"
          loading="lazy"
          decoding="async"
          class="h-[240px] w-full rounded-2xl object-cover object-center"
        >
      </article>
    </UiContainer>
  </section>
</template>
