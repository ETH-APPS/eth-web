<script setup lang="ts">
import {
  Building2,
  Check,
  MessageCircle,
  WalletCards,
} from 'lucide-vue-next'
import logo1688 from '~/assets/images/brand/1688.png'

const paymentChannels = [
  {
    id: 'alipay',
    title: 'Alipay',
    description: 'Opsi pembayaran tercepat dan paling praktis untuk transfer langsung ke akun Alipay supplier atau merchant e-commerce China.',
    features: [
      'Transfer instan dalam hitungan menit',
      'Konfirmasi penerimaan via bukti transaksi resmi',
      'Bebas batas limit transfer harian akun pribadi',
      'Cocok untuk transaksi skala kecil hingga sedang',
    ],
    featured: true,
  },
  {
    id: 'bank-of-china',
    title: 'Bank of China',
    description: 'Pembayaran antar-bank resmi langsung ke rekening lokal perusahaan atau individu supplier di seluruh wilayah China.',
    features: [
      'Mendukung seluruh jaringan bank utama di China',
      'Ideal untuk transaksi B2B jumlah besar (Bulk Order)',
      'Dilengkapi dokumen invoice & bukti transfer bank',
      'Estimasi dana masuk di hari yang sama (Same-day)',
    ],
  },
  {
    id: '1688',
    title: '1688',
    description: 'Layanan bantu bayar (Pay for Others) untuk menyelesaikan tagihan belanja bahan baku dan produk di e-commerce B2B China.',
    features: [
      'Proses mudah via fitur 代付 (Pay for Me)',
      'Mencegah risiko akun e-commerce terblokir',
      'Verifikasi pesanan langsung oleh tim kami',
      'Solusi praktis bagi pembeli tanpa rekening lokal China',
    ],
  },
  {
    id: 'wechat-pay',
    title: 'WeChat Pay',
    description: 'Transfer langsung ke dompet digital WeChat Pay supplier untuk mempermudah transaksi cepat dan komunikasi personal bisnis.',
    features: [
      'Pembayaran langsung via nomor/QR code WeChat',
      'Terhubung langsung dengan akun komunikasi supplier',
      'Proses verifikasi dan transfer kilat',
      'Tanda terima transfer resmi dalam format digital',
    ],
  },
] as const
</script>

<template>
  <section
    id="payment-coverage"
    aria-labelledby="payment-coverage-title"
    class="bg-bg-0 py-16"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="payment-coverage-title"
          class="text-[30px] font-semibold leading-tight text-primary-500"
        >
          Jangkauan Layanan Pembayaran
        </h2>
        <p class="mx-auto mt-6 max-w-[900px] text-[16px] leading-[1.5] text-text-secondary">
          ETH Cargo mendukung berbagai kanal pembayaran populer di China. Pilih jalur transfer yang<br class="hidden lg:block">
          paling sesuai dengan metode pembayaran yang diminta oleh supplier atau vendor Anda.
        </p>
      </div>

      <div class="mx-auto mt-10 grid max-w-[1080px] gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="channel in paymentChannels"
          :key="channel.id"
          class="flex min-h-[465px] flex-col rounded-[18px] border bg-bg-0 px-5 pb-6 pt-5 transition-[border-color,box-shadow] duration-200 hover:border-primary-500 hover:shadow-md"
          :class="channel.featured ? 'border-primary-500' : 'border-border-200'"
        >
          <div class="flex h-10 items-center">
            <div v-if="channel.id === 'alipay'" class="flex items-center gap-2" aria-label="Alipay">
              <span class="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
                <WalletCards :size="20" aria-hidden="true" />
              </span>
              <span class="text-[22px] font-semibold text-slate-900">Alipay</span>
            </div>

            <div v-else-if="channel.id === 'bank-of-china'" class="flex items-center gap-2" aria-label="Bank of China">
              <Building2 :size="30" :stroke-width="1.7" class="text-primary-500" aria-hidden="true" />
              <span class="text-[11px] font-medium uppercase leading-[1.1] text-text-secondary">Bank of China</span>
            </div>

            <img
              v-else-if="channel.id === '1688'"
              :src="logo1688"
              alt="1688"
              class="h-10 w-auto object-contain"
            >

            <div v-else class="flex items-center gap-2" aria-label="WeChat Pay">
              <span class="flex size-9 items-center justify-center rounded-full bg-green-600 text-white">
                <MessageCircle :size="21" fill="currentColor" aria-hidden="true" />
              </span>
              <span class="text-[16px] font-medium leading-[1.1] text-text-secondary">WeChat Pay</span>
            </div>
          </div>

          <p class="mt-4 min-h-[104px] text-[12px] leading-[1.45] text-text-secondary">
            {{ channel.description }}
          </p>

          <ul class="mt-3 flex-1 border-t border-border-200 pt-4">
            <li
              v-for="feature in channel.features"
              :key="feature"
              class="flex items-start gap-3 py-1.5 text-[12px] leading-[1.45] text-text-secondary"
            >
              <Check
                :size="16"
                :stroke-width="2"
                class="mt-0.5 shrink-0 text-primary-500"
                aria-hidden="true"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
