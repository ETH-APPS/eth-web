<script setup lang="ts">
import { ArrowUpRight, PackageSearch, ReceiptText, Search } from 'lucide-vue-next'
import cargoAirUrl from '~/assets/images/marketing/cargo-air.png'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea.png'
import transferUrl from '~/assets/images/marketing/transfer.png'

const trackingCode = ref('')
const trackingPin = ref('')

const services = [
  {
    title: 'KARGO LAUT (FCL/LCL)',
    description: 'Solusi pengiriman ekonomis untuk kapasitas besar. Pilihan FCL (Full Container) untuk skala industri atau LCL (Eceran) untuk efisiensi modal. Bebas pengurusan bea cukai (All-In Door to Door).',
    eyebrow: 'Cocok untuk Skala Besar & Rutin',
    image: cargoSeaUrl,
    imageAlt: 'Kapal kargo membawa kontainer di laut'
  },
  {
    title: 'KARGO UDARA (EXPRESS)',
    description: 'Prioritas pengiriman cepat 3–7 hari kerja untuk sampel produk, barang dengan tren tinggi, atau kebutuhan mendesak. Sistem pemantauan real-time dengan garansi keamanan barang.',
    eyebrow: 'Cocok untuk Pengiriman Prioritas',
    image: cargoAirUrl,
    imageAlt: 'Pesawat kargo ETH Cargo sedang memuat barang'
  },
  {
    title: 'JASA TRANSFER RMB',
    description: 'Proses pembayaran ke supplier di China cepat, transparan, dan tanpa limit. Menggunakan kurs realtime yang kompetitif lengkap dengan bukti kuitansi resmi untuk pembukuan bisnis.',
    eyebrow: 'Proses Cepat & Legal',
    image: transferUrl,
  }
] as const
</script>

<template>
  <section
    id="main-services"
    aria-labelledby="main-services-title"
    class="bg-white py-16"
  >
    <UiContainer>
      <h2
        id="main-services-title"
        class="text-center text-[32px] font-semibold leading-tight text-primary-500"
      >
        Solusi Logistik Import Terpadu
      </h2>

      <div class="mx-auto mt-11 max-w-[724px] rounded-[34px] border border-border-200  px-6 pb-4 pt-5 shadow-md">
        <div class="flex items-center justify-center gap-4 text-primary-500">
          <PackageSearch
            aria-hidden="true"
            :size="40"
            :stroke-width="2.5"
            absolute-stroke-width
            class="shrink-0"
          />

          <h3 class="text-[32px] font-semibold leading-tight">
            Lacak Pengiriman Kargo Anda
          </h3>
        </div>

        <form
          class="mt-6 grid grid-cols-[240px_360px_48px] items-center gap-2"
          @submit.prevent
        >
          <UiInput
            id="tracking-code"
            v-model="trackingCode"
            label="Kode marking"
            name="tracking-code"
            autocomplete="off"
            placeholder="Masukkan Kode Marking"
          />

          <UiInput
            id="tracking-pin"
            v-model="trackingPin"
            label="PIN pengiriman"
            name="tracking-pin"
            inputmode="numeric"
            autocomplete="off"
            placeholder="Masukkan PIN"
            accent
          >
            <template #leading>
              <ReceiptText
                aria-hidden="true"
                :size="20"
                :stroke-width="1.5"
                absolute-stroke-width
              />
            </template>
          </UiInput>

          <button
            type="submit"
            aria-label="Lacak pengiriman"
            class="grid size-12 place-items-center rounded-full text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <Search
              aria-hidden="true"
              :size="28"
              :stroke-width="2"
              absolute-stroke-width
            />
          </button>
        </form>

        <p class="mt-6 text-center text-md text-[#68748c]">
          Butuh bantuan terkait posisi kargo Anda?
          <NuxtLink
            to="#quote"
            class="ml-1 inline-flex items-center gap-1 font-semibold text-primary-500 underline underline-offset-2 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <span>Hubungi Tim CS Kami</span>

            <ArrowUpRight
              aria-hidden="true"
              :size="16"
              :stroke-width="1.5"
              absolute-stroke-width
            />
          </NuxtLink>
        </p>
      </div>

      <div class="mt-11 grid grid-cols-3 gap-9">
        <MarketingServiceCard
          v-for="service in services"
          :key="service.title"
          v-bind="service"
        />
      </div>
    </UiContainer>
  </section>
</template>