<script setup lang="ts">
import { ClockCheck } from 'lucide-vue-next'
import fclCargoUrl from '~/assets/images/marketing/fcl-cargo.png'
import lclCargoUrl from '~/assets/images/marketing/lcl-cargo.png'

const services = [
  {
    title: 'FCL Cargo',
    description:
      'Layanan sewa kontainer utuh (20ft / 40ft) khusus untuk pengiriman kargo bisnis Anda. Tanpa bercampur dengan barang milik orang lain, FCL memberikan keamanan maksimal, proses bongkar muat lebih cepat, dan biaya per unit yang jauh lebih murah untuk volume besar.',
    eta: '3 – 4 Minggu',
    image: fclCargoUrl,
    imageAlt: 'Kapal kontainer untuk layanan FCL Cargo',
  },
  {
    title: 'LCL Cargo',
    description:
      'Solusi pengiriman hemat tanpa harus menyewa satu kontainer penuh. Kargo Anda dikonsolidasikan secara rapi dan dihitung berdasarkan kubikasi (CBM). Pilihan tepat untuk mengoptimalkan arus kas (cash flow) dan modal kerja bisnis Anda.',
    eta: '3 – 4 Minggu',
    image: lclCargoUrl,
    imageAlt: 'Muatan kontainer untuk layanan LCL Cargo',
  },
]
</script>

<template>
  <section
    id="sea-freight"
    aria-labelledby="sea-freight-title"
    class="bg-bg-0 py-16"
  >
    <UiContainer>
      <div class="text-center">
        <p class="text-[20px] font-medium uppercase text-primary-700">
          Layanan Kami
        </p>
        <h2
          id="sea-freight-title"
          class="mt-2 text-[48px] font-semibold uppercase leading-tight tracking-[0.01em] text-primary-500"
        >
          Kargo Laut (Sea Freight)
        </h2>
        <p class="mx-auto mt-5 max-w-[900px] text-[20px] leading-[1.5] text-text-secondary">
          Kirim barang kapasitas besar dari China ke Indonesia dengan tarif paling ekonomis. Kami
          menyediakan pilihan Full Container Load (FCL) dan Less Container Load (LCL) dengan
          kepastian alokasi ruang kapal, pengurusan bea cukai lengkap, serta harga All-In yang
          transparan.
        </p>
      </div>

      <div class="mx-auto mt-10 space-y-10">
        <article
          v-for="service in services"
          :key="service.title"
          class="grid min-h-[360px] grid-cols-[1fr_420px] items-center gap-8 rounded-[20px] border border-border-200 bg-bg-0 px-12 py-10 shadow-md"
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
            height="255"
            loading="lazy"
            decoding="async"
            class="h-[255px] w-full rounded-2xl object-cover object-center"
          >
        </article>
      </div>
    </UiContainer>
  </section>
</template>