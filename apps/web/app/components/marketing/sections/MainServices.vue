<script setup lang="ts">
import { ArrowUpRight, PackageSearch, ReceiptText, Search } from 'lucide-vue-next'
import { whatsappConsultationUrl } from '~/constants/whatsapp'
import cargoAirUrl from '~/assets/images/marketing/cargo-air.webp'
import cargoSeaUrl from '~/assets/images/marketing/cargo-sea.webp'
import transferUrl from '~/assets/images/marketing/transfer.webp'

const trackingCode = ref('')
const trackingPin = ref('')

const services = [
  {
    title: 'KARGO LAUT (FCL/LCL)',
    description: 'Solusi pengiriman ekonomis untuk kapasitas besar. Pilihan FCL (Full Container) untuk skala industri atau LCL (Eceran) untuk efisiensi modal. Bebas pengurusan bea cukai (All-In Door to Door).',
    eyebrow: 'Cocok untuk Skala Besar & Rutin',
    image: cargoSeaUrl,
    imageAlt: 'Kapal kargo membawa kontainer di laut',
    to: '/sea-freight'
  },
  {
    title: 'KARGO UDARA (EXPRESS)',
    description: 'Prioritas pengiriman cepat 3–7 hari kerja untuk sampel produk, barang dengan tren tinggi, atau kebutuhan mendesak. Sistem pemantauan real-time dengan garansi keamanan barang.',
    eyebrow: 'Cocok untuk Pengiriman Prioritas',
    image: cargoAirUrl,
    imageAlt: 'Pesawat kargo ETH Cargo sedang memuat barang',
    to: '/air-freight'
  },
  {
    title: 'JASA TRANSFER RMB',
    description: 'Proses pembayaran ke supplier di China cepat, transparan, dan tanpa limit. Menggunakan kurs realtime yang kompetitif lengkap dengan bukti kuitansi resmi untuk pembukuan bisnis.',
    eyebrow: 'Proses Cepat & Legal',
    image: transferUrl,
    imageAlt: 'Pembayaran transfer RMB berhasil melalui ponsel dan kartu kredit',
    to: '/transfer-rmb'
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
        class="text-center text-[24px] font-semibold leading-tight text-primary-500 lg:text-[32px]"
      >
        Solusi Logistik Import Terpadu
      </h2>

      <div class="mx-auto mt-11 max-w-[724px] rounded-[34px] border border-border-200 px-5 pb-5 pt-6 shadow-md md:px-6 lg:pb-4 lg:pt-5">
        <div class="flex items-center justify-center gap-3 text-primary-500 lg:gap-4">
          <PackageSearch
            aria-hidden="true"
            :size="40"
            :stroke-width="2.5"
            absolute-stroke-width
            class="size-8 shrink-0 lg:size-10"
          />

          <h3 class="min-w-0 text-[20px] font-semibold leading-tight lg:text-[32px]">
            Lacak Pengiriman Kargo Anda
          </h3>
        </div>

        <form
          class="mt-6 grid grid-cols-1 items-center gap-3 md:grid-cols-2 lg:grid-cols-[240px_360px_48px] lg:gap-2"
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
            class="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 text-[16px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:col-span-2 lg:col-span-1 lg:size-12 lg:rounded-full lg:bg-transparent lg:text-primary-500 lg:hover:bg-primary-50"
          >
            <span class="lg:sr-only">Lacak!</span>
            <Search
              aria-hidden="true"
              :size="28"
              :stroke-width="2"
              absolute-stroke-width
              class="size-6 shrink-0 lg:size-7"
            />
          </button>
        </form>

        <p class="mt-6 hidden text-center text-[#68748c] lg:block lg:text-md">
          Butuh bantuan terkait posisi kargo Anda?
          <a
            :href="whatsappConsultationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group ml-1 inline-flex items-center gap-0 font-semibold text-primary-500 transition-[color,gap] duration-200 hover:gap-1 hover:text-primary-700 focus-visible:gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 motion-reduce:transition-none"
          >
            <span class="underline-offset-2 group-hover:underline group-focus-visible:underline">Hubungi Tim CS Kami</span>

            <span aria-hidden="true" class="inline-flex w-0 min-w-0 overflow-hidden opacity-0 transition-[width,opacity] duration-200 group-hover:w-4 group-hover:opacity-100 group-focus-visible:w-4 group-focus-visible:opacity-100 motion-reduce:transition-none">
              <ArrowUpRight
                :size="16"
                :stroke-width="1.5"
                absolute-stroke-width
                class="size-4 shrink-0"
              />
            </span>
          </a>
        </p>
      </div>

      <div class="mt-11 grid grid-cols-1 gap-6 md:mx-auto md:max-w-[560px] lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-9">
        <MarketingServiceCard
          v-for="service in services"
          :key="service.title"
          v-bind="service"
        />
      </div>
    </UiContainer>
  </section>
</template>