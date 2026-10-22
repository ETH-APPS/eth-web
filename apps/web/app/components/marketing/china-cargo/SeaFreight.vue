<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea.png'
import heroUrl from '~/assets/images/marketing/hero.png'

const services = [
  {
    title: 'FCL Cargo',
    description:
      'Layanan sewa kontainer utuh (20ft / 40ft) khusus untuk pengiriman kargo bisnis Anda. Tanpa bercampur dengan barang milik orang lain, FCL memberikan keamanan maksimal, proses bongkar muat lebih cepat, dan biaya per unit yang jauh lebih murah untuk volume besar.',
    eta: '3 – 4 Minggu',
    image: cargoSeaUrl,
    imageAlt: 'Kapal kontainer untuk layanan FCL Cargo',
  },
  {
    title: 'LCL Cargo?',
    description:
      'Solusi pengiriman hemat tanpa harus menyewa satu kontainer penuh. Kargo Anda dikonsolidasikan secara rapi dan dihitung berdasarkan kubikasi (CBM). Pilihan tepat untuk mengoptimalkan arus kas (cash flow) dan modal kerja bisnis Anda.',
    eta: '3 – 4 Minggu',
    image: heroUrl,
    imageAlt: 'Muatan kontainer untuk layanan LCL Cargo',
  },
]
</script>

<template>
  <section
    id="sea-freight"
    aria-labelledby="sea-freight-title"
    class="bg-white py-16"
  >
    <UiContainer>
      <div class="text-center">
        <p class="text-[15px] font-medium uppercase text-primary-700">
          Layanan Kami
        </p>
        <h2
          id="sea-freight-title"
          class="mt-2 text-[38px] font-semibold uppercase leading-tight tracking-[0.01em] text-primary-500"
        >
          Kargo Laut (Sea Freight)
        </h2>
        <p class="mx-auto mt-5 max-w-[760px] text-[16px] leading-[1.5] text-slate-700">
          Kirim barang kapasitas besar dari China ke Indonesia dengan tarif paling ekonomis. Kami
          menyediakan pilihan Full Container Load (FCL) dan Less Container Load (LCL) dengan
          kepastian alokasi ruang kapal, pengurusan bea cukai lengkap, serta harga All-In yang
          transparan.
        </p>
      </div>

      <div class="mx-auto mt-10 max-w-[865px] space-y-8">
        <article
          v-for="service in services"
          :key="service.title"
          class="grid min-h-[320px] grid-cols-[1fr_390px] items-center gap-10 rounded-[20px] border border-slate-200 bg-white px-10 py-8 shadow-[0_5px_12px_rgba(15,23,42,0.10)] transition-transform duration-300 hover:-translate-y-1"
        >
          <div>
            <p class="text-[15px] font-medium text-slate-700">
              Mengenal Layanan...
            </p>
            <h3 class="mt-2 text-[34px] font-semibold leading-tight text-primary-500">
              {{ service.title }}
            </h3>
            <p class="mt-7 text-[13px] leading-[1.5] text-slate-700">
              {{ service.description }}
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
              <span class="text-[15px] font-medium">{{ service.eta }}</span>
            </div>
          </div>

          <img
            :src="service.image"
            :alt="service.imageAlt"
            width="390"
            height="240"
            loading="lazy"
            decoding="async"
            class="h-[240px] w-full rounded-2xl object-cover object-center"
          >
        </article>
      </div>
    </UiContainer>
  </section>
</template>
