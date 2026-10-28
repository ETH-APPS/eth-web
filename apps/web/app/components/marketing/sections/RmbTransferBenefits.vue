<script setup lang="ts">
import {
  Cuboid,
  Headset,
  ShieldCheck,
} from 'lucide-vue-next'

const benefits = [
  {
    icon: Cuboid,
    title: 'Kurs Kompetitif & Transparan',
    description: 'Dapatkan penawaran nilai tukar RMB terbaik yang diupdate secara real-time tanpa ada biaya tersembunyi.',
  },
  {
    icon: Headset,
    title: 'Proses Kilat (< 2 Jam)',
    description: 'Dana diteruskan dan diterima oleh supplier di China pada hari yang sama untuk menjaga kecepatan produksi barang Anda.',
  },
  {
    icon: ShieldCheck,
    title: 'Jaminan Bukti Transfer Resmi',
    description: 'Setiap transaksi dilengkapi dengan nota dan bukti transfer bank/aplikasi resmi sebagai dokumentasi pembukuan bisnis Anda.',
  },
  {
    icon: Cuboid,
    title: 'Dukungan Multi-Metode Pembayaran',
    description: 'Mendukung transfer ke Alipay, WeChat Pay, Bank of China, hingga pembayaran pesanan platform 1688 & Taobao.',
  },
  {
    icon: Headset,
    title: 'Tim Support B2B Responsif',
    description: 'Didampingi oleh tim profesional kami yang siap membantu proses verifikasi dan kendala pembayaran Anda.',
  },
  {
    icon: ShieldCheck,
    title: 'Aman dari Risiko Pembekuan Akun',
    description: 'Menggunakan jalur transaksi resmi yang legal sehingga akun e-commerce atau rekening supplier Anda tetap aman.',
  },
] as const
</script>

<template>
  <section
    id="transfer-benefits"
    aria-labelledby="transfer-benefits-title"
    class="bg-bg-0 pb-20 pt-6"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="transfer-benefits-title"
          class="text-[32px] font-bold leading-tight text-primary-500"
        >
          Mengapa Memilih Layanan Transfer RMB Kami?
        </h2>
        <p class="mx-auto mt-6 max-w-[1100px] text-[20px] font-normal leading-[1.5] text-text-secondary">
          Nikmati transaksi pembayaran ke China yang aman, cepat, dan efisien untuk mendukung<br class="hidden lg:block">
          kelancaran rantai pasok bisnis Anda tanpa kendala bahasa atau regulasi perbankan.
        </p>
      </div>

      <div class="mx-auto mt-10 grid max-w-[1200px] items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="benefit in benefits"
          :key="benefit.title"
          class="flex h-full flex-col rounded-[18px] border border-border-200 bg-bg-0 p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary-500 hover:shadow-md"
        >
          <div class="flex min-h-[3.25rem] items-center gap-3">
            <span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <component
                :is="benefit.icon"
                :size="28"
                :stroke-width="2"
                aria-hidden="true"
              />
            </span>
            <h3 class="text-[20px] font-medium leading-[1.25] text-text-secondary">
              {{ benefit.title }}
            </h3>
          </div>

          <p class="mt-4 text-[16px] font-normal leading-[1.5] text-text-secondary">
            {{ benefit.description }}
          </p>
        </article>
      </div>
    </UiContainer>
  </section>
</template>