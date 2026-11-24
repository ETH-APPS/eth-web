<script setup lang="ts">
import {
  Equal,
  Plus,
  X,
} from 'lucide-vue-next'

const nominalRmb = 1_000
const adminFeeRmb = 50
const exchangeRate = 2_700
const totalPayment = (nominalRmb + adminFeeRmb) * exchangeRate
const numberFormatter = new Intl.NumberFormat('id-ID')
</script>

<template>
  <section
    id="rmb-calculation-breakdown"
    aria-labelledby="rmb-calculation-breakdown-title"
    class="bg-bg-100 py-14 sm:py-16"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="rmb-calculation-breakdown-title"
          class="text-[24px] font-bold uppercase leading-tight text-primary-500 lg:text-[32px] lg:font-semibold"
        >
          Simulasi Perhitungan Biaya
        </h2>

        <p class="mx-auto mt-5 max-w-[740px] text-[14px] font-normal leading-[1.5] text-text-tertiary lg:text-[18px]">
          Pahami rincian perhitungan transfer RMB Anda. Kami mengutamakan transparansi penuh tanpa biaya tersembunyi untuk setiap kelancaran transaksi ke supplier China Anda.
        </p>
      </div>

      <p class="sr-only">Nominal RMB ditambah Biaya Admin, kemudian hasilnya dikalikan Kurs Rupiah, sama dengan Total Pembayaran.</p>

      <div class="mx-auto mt-8 flex max-w-[920px] flex-col items-center gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)_40px_minmax(0,1fr)_40px_minmax(0,1.55fr)] lg:gap-4">
        <div class="flex w-full max-w-[340px] items-stretch gap-2 lg:col-span-3 lg:max-w-none">
          <span aria-hidden="true" class="w-3 shrink-0 rounded-[50%] border-l-[3px] border-primary-500" />
          <div class="flex min-w-0 flex-1 flex-col items-center gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_32px_minmax(0,1fr)] lg:gap-2">
            <dl class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-bg-0 px-4 py-4 lg:max-w-none">
              <dt class="text-[14px] font-normal text-text-secondary">
                Nominal RMB
              </dt>
              <dd class="mt-3 whitespace-nowrap text-[18px] font-medium text-text-secondary">
                ¥ {{ numberFormatter.format(nominalRmb) }}
              </dd>
            </dl>

            <Plus
              :size="30"
              :stroke-width="1.8"
              aria-hidden="true"
              class="shrink-0 text-text-secondary"
            />

            <dl class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-bg-0 px-4 py-4 lg:max-w-none">
              <dt class="text-[14px] font-normal text-text-secondary">
                Biaya Admin
              </dt>
              <dd class="mt-3 whitespace-nowrap text-[18px] font-medium text-text-secondary">
                ¥ {{ numberFormatter.format(adminFeeRmb) }}
              </dd>
            </dl>
          </div>
          <span aria-hidden="true" class="w-3 shrink-0 rounded-[50%] border-r-[3px] border-primary-500" />
        </div>

        <X
          :size="30"
          :stroke-width="1.8"
          aria-hidden="true"
          class="shrink-0 text-text-secondary"
        />

        <dl class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-bg-0 px-4 py-4 lg:max-w-none">
          <dt class="text-[14px] font-normal text-text-secondary">
            Kurs Rupiah
          </dt>
          <dd class="mt-3 whitespace-nowrap text-[18px] font-medium text-text-secondary">
            Rp {{ numberFormatter.format(exchangeRate) }}
          </dd>
        </dl>

        <Equal
          :size="30"
          :stroke-width="1.8"
          aria-hidden="true"
          class="shrink-0 text-text-secondary"
        />

        <dl class="w-full max-w-[300px] rounded-[18px] border border-border-200 bg-primary-50 px-4 py-4 lg:max-w-none">
          <dt class="text-[14px] font-normal text-primary-500">
            Total Pembayaran
          </dt>
          <dd class="mt-3 whitespace-nowrap text-[20px] font-semibold text-primary-500">
            Rp {{ numberFormatter.format(totalPayment) }}
          </dd>
        </dl>
      </div>

      <div class="mx-auto mt-8 grid max-w-[920px] gap-7 border-t-2 border-border-200 pt-8 md:grid-cols-3 md:gap-12">
        <article>
          <h3 class="text-[18px] font-medium text-primary-500">
            Kurs Rupiah
          </h3>
          <p class="mt-4 text-[14px] font-semibold text-text-secondary">
            ¥ 1 = Rp {{ numberFormatter.format(exchangeRate) }}
          </p>
          <p class="mt-4 text-[14px] font-normal leading-[1.5] text-text-secondary">
            Kurs pada simulasi ini hanya contoh. Hubungi tim CS untuk mengetahui kurs yang berlaku saat transaksi.
          </p>
        </article>

        <article>
          <h3 class="text-[18px] font-medium text-text-secondary">
            Biaya Admin Layanan
          </h3>
          <p class="mt-4 text-[14px] font-normal leading-[1.5] text-text-secondary">
            Biaya admin pada contoh ini sebesar ¥ {{ numberFormatter.format(adminFeeRmb) }} dan ditambahkan ke nominal transfer sebelum dikonversi ke Rupiah.
          </p>
        </article>

        <article>
          <h3 class="text-[18px] font-medium text-text-secondary">
            Total Pembayaran Akhir
          </h3>
          <p class="mt-4 text-[14px] font-normal leading-[1.5] text-text-secondary">
            Jumlah keseluruhan dalam Rupiah yang perlu ditransfer ke rekening resmi ETH Cargo. Dana ini sudah mencakup seluruh proses hingga RMB cair ke platform tujuan.
          </p>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
