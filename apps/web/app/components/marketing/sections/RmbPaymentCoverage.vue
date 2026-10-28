<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import logo1688 from '~/assets/images/brand/1688.png'
import logoAlipay from '~/assets/images/brand/alipay.png'
import logoBankOfChina from '~/assets/images/brand/bank-of-china.png'
import logoWechatPay from '~/assets/images/brand/wechat-pay.png'

const paymentChannels = [
  {
    id: 'alipay',
    title: 'Alipay',
    logo: logoAlipay,
    logoClass: 'h-10 max-w-[150px]',
    description: 'Opsi pembayaran tercepat dan paling praktis untuk transfer langsung ke akun Alipay supplier atau merchant e-commerce China.',
    features: [
      'Transfer instan dalam hitungan menit',
      'Konfirmasi penerimaan via bukti transaksi resmi',
      'Bebas batas limit transfer harian akun pribadi',
      'Cocok untuk transaksi skala kecil hingga sedang',
    ],
  },
  {
    id: 'bank-of-china',
    title: 'Bank of China',
    logo: logoBankOfChina,
    logoClass: 'h-16 max-w-[220px]',
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
    logo: logo1688,
    logoClass: 'h-10 max-w-[150px]',
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
    logo: logoWechatPay,
    logoClass: 'h-10 max-w-[150px]',
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
          class="text-[32px] font-bold leading-tight text-primary-500"
        >
          Jangkauan Layanan Pembayaran
        </h2>
        <p class="mx-auto mt-6 max-w-[1100px] text-[20px] font-normal leading-[1.5] text-text-secondary">
          ETH Cargo mendukung berbagai kanal pembayaran populer di China. Pilih jalur transfer yang<br class="hidden lg:block">
          paling sesuai dengan metode pembayaran yang diminta oleh supplier atau vendor Anda.
        </p>
      </div>

      <div class="mx-auto mt-10 grid max-w-[1200px] gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="channel in paymentChannels"
          :key="channel.id"
          class="row-span-3 grid grid-rows-subgrid gap-y-0 rounded-[18px] border border-border-200 bg-bg-0 px-5 pb-6 pt-5 transition-[border-color,box-shadow] duration-200 hover:border-primary-500 hover:shadow-md"
        >
          <div class="-my-3 flex h-16 items-center">
            <img
              :src="channel.logo"
              :alt="channel.title"
              class="w-auto object-contain object-left"
              :class="channel.logoClass"
            >
          </div>

          <p class="mt-4 text-[14px] font-normal leading-[1.45] text-text-secondary">
            {{ channel.description }}
          </p>

          <ul class="mt-4 border-t border-border-200 pt-4">
            <li
              v-for="feature in channel.features"
              :key="feature"
              class="flex items-start gap-3 py-1.5 text-[16px] font-normal leading-[1.45] text-text-secondary"
            >
              <Check
                :size="18"
                :stroke-width="2"
                class="mt-[3px] shrink-0 text-primary-500"
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