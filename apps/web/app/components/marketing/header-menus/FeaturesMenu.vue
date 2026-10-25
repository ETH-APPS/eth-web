<script setup lang="ts">
import {
  ArrowUpRight,
  Calculator,
  PackageSearch,
  Search,
} from 'lucide-vue-next'

const trackingCode = ref('')
const trackingPin = ref('')

async function submitTracking() {
  const query = {
    ...(trackingCode.value ? { markingId: trackingCode.value } : {}),
    ...(trackingPin.value ? { pin: trackingPin.value } : {}),
  }

  await navigateTo({
    path: '/live-tracking',
    query,
  })
}
</script>

<template>
  <UiContainer class="grid grid-cols-2 gap-16 py-10 text-text-secondary">
    <section aria-labelledby="quotation-service-title">
      <p
        id="quotation-service-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        Quotation Service
      </p>

      <div class="flex items-start gap-4">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <Calculator :size="20" aria-hidden="true" />
        </span>

        <div class="min-w-0 flex-1">
          <h2 class="text-base font-medium text-text-secondary">
            Kalkulator
          </h2>
          <p class="mt-2 text-xs leading-6 text-text-tertiary">
            Hitung estimasi biaya pengiriman sesuai jenis dan kebutuhan kargo Anda.
          </p>

          <div class="mt-5 flex items-center justify-between gap-5">
            <div class="flex items-center gap-3 text-xs text-text-tertiary">
              <span>Cargo</span>
              <span class="rounded bg-bg-100 px-2 py-1 font-medium text-primary-500">Sea</span>
              <span class="rounded bg-bg-100 px-2 py-1 font-medium text-primary-500">Air</span>
            </div>

            <NuxtLink
              to="/calculator"
              class="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary-500 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>Calculate</span>
              <ArrowUpRight :size="18" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="tracking-service-title">
      <p
        id="tracking-service-title"
        class="mb-5 text-xs font-medium text-text-tertiary"
      >
        Tracking Service
      </p>

      <div class="flex items-start gap-4">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <PackageSearch :size="20" aria-hidden="true" />
        </span>

        <div class="min-w-0 flex-1">
          <h2 class="text-base font-medium text-text-secondary">
            Live Tracking Order
          </h2>
          <p class="mt-2 text-xs leading-6 text-text-tertiary">
            Pantau status dan perjalanan kargo Anda secara cepat melalui Marking ID dan PIN.
          </p>

          <form
            class="mt-5 grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_40px] gap-2"
            @submit.prevent="submitTracking"
          >
            <label class="sr-only" for="header-tracking-code">
              Marking ID
            </label>
            <input
              id="header-tracking-code"
              v-model="trackingCode"
              name="tracking-code"
              type="text"
              autocomplete="off"
              placeholder="Marking ID"
              class="h-10 min-w-0 rounded-xl border border-border-200 bg-bg-0 px-3 text-sm text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >

            <label class="sr-only" for="header-tracking-pin">
              PIN
            </label>
            <input
              id="header-tracking-pin"
              v-model="trackingPin"
              name="tracking-pin"
              type="text"
              autocomplete="off"
              placeholder="PIN"
              class="h-10 min-w-0 rounded-xl border border-border-200 bg-bg-0 px-3 text-sm text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >

            <button
              type="submit"
              aria-label="Cari pengiriman"
              class="flex size-10 items-center justify-center rounded-xl bg-primary-500 text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <Search :size="20" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  </UiContainer>
</template>
