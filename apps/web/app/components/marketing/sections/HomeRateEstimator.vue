<script setup lang="ts">
import connectedWorldUrl from '~/assets/images/marketing/connected-world.png'
</script>

<template>
  <MarketingSectionsRateEstimator
    section-id="home-rate-estimator"
    variant="split"
    title="Kalkulator Estimasi Pengiriman Kargo"
    description="Dapatkan kalkulasi perkiraan biaya pengiriman All-In dari China ke Indonesia secara instan untuk perencanaan modal bisnis Anda."
    calculator-enabled
    animated-submit
    show-shipping-price-field
  >
    <template #aside>
      <div class="mx-auto w-[250px] max-w-full">
        <img
          :src="connectedWorldUrl"
          alt="Ilustrasi jaringan pengiriman kargo internasional"
          width="512"
          height="381"
          loading="lazy"
          class="h-auto w-full object-contain"
        >
      </div>

      <h3 class="mt-1 text-[16px] font-medium text-text-secondary">
        Solusi Kargo Terhubung
      </h3>
      <p class="mt-2 text-[13px] leading-[1.5] text-text-tertiary">
        Dari gudang China hingga tiba di alamat bisnis Anda, ETH Cargo mengurus pengiriman laut atau udara, dokumen bea cukai, dan pelacakan dalam satu alur yang transparan.
      </p>
      <p class="mt-5 text-center text-[14px] text-text-tertiary">
        Layanan Kargo China–Indonesia
      </p>
      <div class="mt-4 text-center">
        <UiAnimatedArrowButton
          to="/china-cargo"
          variant="plain"
          :icon-size="18"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-[14px] font-medium text-primary-500 transition-colors hover:bg-primary-500 hover:text-white focus-visible:bg-primary-500 focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Pelajari Lebih Lanjut
        </UiAnimatedArrowButton>
      </div>
    </template>
  </MarketingSectionsRateEstimator>
</template>
