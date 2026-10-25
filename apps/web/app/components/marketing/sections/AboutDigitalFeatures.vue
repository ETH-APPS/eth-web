<script setup lang="ts">
import { ArrowUpRight, Headphones, Package, ShieldCheck } from 'lucide-vue-next'

const digitalFeatures = [
  {
    icon: Package,
    title: 'Kalkulator Impor All-In',
    description:
      'Hitung estimasi total biaya pengiriman kargo (Laut & Udara) secara cepat dan transparan sesuai volume/berat barang Anda.',
    ctaLabel: 'Hitung Biaya',
    to: '/calculator',
    featured: true,
  },
  {
    icon: Headphones,
    title: 'Live Tracking System',
    description:
      'Pantau posisi dan status pergerakan kargo Anda dari gudang China hingga tiba di tempat tujuan secara transparan.',
    ctaLabel: 'Lacak Resi',
    to: '/live-tracking',
    featured: false,
  },
  {
    icon: ShieldCheck,
    title: 'Mobile App Ecosystem',
    description:
      'Akses pemesanan pengiriman, cek histori transaksi, serta kelola dokumen impor secara praktis langsung dari smartphone Anda.',
    ctaLabel: 'Unduh Aplikasi',
    to: '#',
    featured: false,
  },
] as const
</script>

<template>
  <section
    id="digital-features"
    aria-labelledby="digital-features-title"
    class="bg-bg-100 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="digital-features-title"
          class="text-[28px] font-semibold leading-tight text-primary-500"
        >
          Fitur Digital Kami
        </h2>

        <p class="mx-auto mt-5 max-w-[680px] text-[16px] font-normal leading-[1.45] text-text-tertiary">
          Nikmati kemudahan pengelolaan impor dengan dukungan teknologi digital ETH Cargo, mulai dari kalkulasi estimasi biaya All-In, pemantauan kargo real-time, hingga kemudahan akses via aplikasi.
        </p>
      </div>

      <ul class="mt-10 grid gap-5 md:grid-cols-3">
        <li
          v-for="feature in digitalFeatures"
          :key="feature.title"
          class="flex min-h-[205px] flex-col rounded-[18px] border bg-bg-0 px-4 py-4"
          :class="feature.featured ? 'border-primary-500' : 'border-border-200'"
        >
          <div class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <component
                :is="feature.icon"
                :size="25"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </span>

            <h3 class="text-[16px] font-medium leading-tight text-text-secondary">
              {{ feature.title }}
            </h3>
          </div>

          <p class="mt-4 text-[13px] font-normal leading-[1.5] text-text-secondary">
            {{ feature.description }}
          </p>

          <div class="mt-auto flex justify-end pt-5">
            <NuxtLink
              :to="feature.to"
              class="inline-flex h-8 items-center gap-2 rounded-xl bg-primary-500 px-4 text-[11px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>{{ feature.ctaLabel }}</span>
              <ArrowUpRight
                :size="14"
                :stroke-width="2"
                aria-hidden="true"
              />
            </NuxtLink>
          </div>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
