<script setup lang="ts">
import calculatorLogisticsUrl from '~/assets/images/marketing/kalkulator-logistik.webp'
import { whatsappConsultationUrl } from '~/constants/whatsapp'
</script>

<template>
  <MarketingSectionsRateEstimator
    section-id="home-rate-estimator"
    variant="split"
    title="Kalkulator Estimasi Pengiriman Cargo China ke Indonesia"
    description="Hitung perkiraan biaya pengiriman All-In rute China–Indonesia untuk membantu perencanaan anggaran impor bisnis Anda."
    calculator-enabled
    animated-submit
    show-shipping-price-field
  >
    <template #aside>
      <div class="mx-auto w-[320px] max-w-full">
        <img
          :src="calculatorLogisticsUrl"
          alt="Gudang logistik impor dengan pesawat dan kapal kargo"
          width="1132"
          height="840"
          loading="lazy"
          class="h-auto w-full object-contain"
        >
      </div>

      <h3 class="mt-5 text-[16px] font-medium text-text-secondary">
        Perencanaan Biaya yang Lebih Terukur
      </h3>
      <p class="mt-2 text-[13px] leading-[1.5] text-text-tertiary">
        Masukkan dimensi dan berat kiriman untuk memperoleh gambaran estimasi biaya logistik dari gudang ke tujuan. Hasil perhitungan bersifat estimasi awal dan mengikuti ketentuan serta tarif berlaku yang dikonfirmasi bersama tim ETH Cargo.
      </p>
      <p class="mt-5 text-center text-[14px] text-text-tertiary">
        Butuh penawaran resmi atau rute khusus?
      </p>
      <div class="mt-4 text-center">
        <UiAnimatedArrowButton
          :href="whatsappConsultationUrl"
          target="_blank"
          rel="noopener noreferrer"
          variant="plain"
          :icon-size="18"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-[14px] font-medium text-primary-500 transition-colors hover:bg-primary-500 hover:text-white focus-visible:bg-primary-500 focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Konsultasi Gratis
        </UiAnimatedArrowButton>
      </div>
    </template>
  </MarketingSectionsRateEstimator>
</template>
