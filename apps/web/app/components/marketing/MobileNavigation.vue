<script setup lang="ts">
import {
  ArrowUpRight,
  Banknote,
  BookOpenText,
  Calculator,
  ChevronDown,
  Gift,
  Info,
  Newspaper,
  PackageSearch,
  Plane,
  Search,
  Ship,
  ShoppingBag,
  X,
} from 'lucide-vue-next'
import logoUrl from '~/assets/images/brand/logo-white.png'
import chinaFlagUrl from '~/assets/images/flag/china.png'
import taiwanFlagUrl from '~/assets/images/flag/taiwan.png'
import koreaFlagUrl from '~/assets/images/flag/korea.png'
import singaporeFlagUrl from '~/assets/images/flag/singapore.png'
import malaysiaFlagUrl from '~/assets/images/flag/malaysia.png'
import australiaFlagUrl from '~/assets/images/flag/australia.png'
import usaFlagUrl from '~/assets/images/flag/USA.png'
import { quoteNavigation } from '~/constants/navigation'

const emit = defineEmits<{
  close: []
}>()

type MobileSection = 'Layanan' | 'Fitur' | 'Informasi' | 'Insights'

const activeSection = ref<MobileSection | null>('Layanan')
const trackingCode = ref('')
const trackingPin = ref('')

const multinationalCountries = [
  { name: 'Taiwan', flag: taiwanFlagUrl },
  { name: 'Korea Selatan', flag: koreaFlagUrl },
  { name: 'Singapura', flag: singaporeFlagUrl },
  { name: 'Malaysia', flag: malaysiaFlagUrl },
  { name: 'Australia', flag: australiaFlagUrl },
  { name: 'Amerika Serikat', flag: usaFlagUrl },
] as const

const simpleSections = {
  Informasi: [
    {
      to: '/about-us',
      label: 'Tentang Kami',
      description: 'Kenali ETH Cargo dan layanan logistik terintegrasi kami.',
      icon: Info,
    },
    {
      to: '/faq',
      label: 'FAQ',
      description: 'Jawaban untuk pertanyaan umum seputar layanan ETH Cargo.',
      icon: BookOpenText,
    },
    {
      to: '/terms-and-conditions',
      label: 'Syarat & Ketentuan',
      description: 'Informasi ketentuan penggunaan layanan ETH Cargo.',
      icon: BookOpenText,
    },
  ],
  Insights: [
    {
      to: '/promo',
      label: 'Our Promo',
      description: 'Lihat promo dan penawaran terbaru dari ETH Cargo.',
      icon: Gift,
    },
    {
      to: '/blog',
      label: 'Our Blog',
      description: 'Artikel dan kabar terbaru seputar logistik dan impor.',
      icon: Newspaper,
    },
    {
      to: '/glossary',
      label: 'Glossary',
      description: 'Pelajari istilah penting dalam pengiriman dan logistik.',
      icon: BookOpenText,
    },
  ],
} as const

function toggleSection(section: MobileSection) {
  activeSection.value = activeSection.value === section ? null : section
}

async function submitTracking() {
  await navigateTo({
    path: '/live-tracking',
    query: {
      ...(trackingCode.value ? { markingId: trackingCode.value } : {}),
      ...(trackingPin.value ? { pin: trackingPin.value } : {}),
    },
  })

  emit('close')
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-bg-0 text-text-secondary">
    <div class="sticky top-0 z-10 bg-bg-0 px-4 pt-4">
      <div class="flex h-12 items-center justify-between border-b border-border-200 pb-3">
        <NuxtLink
          to="/"
          aria-label="ETH Cargo home"
          class="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          @click="emit('close')"
        >
          <img
            :src="logoUrl"
            width="128"
            height="40"
            alt="ETH Cargo"
            class="h-9 w-32 object-contain object-left"
          >
        </NuxtLink>

        <button
          type="button"
          aria-label="Tutup menu navigasi"
          class="flex size-10 items-center justify-center rounded-lg text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500"
          @click="emit('close')"
        >
          <X :size="25" :stroke-width="2" aria-hidden="true" />
        </button>
      </div>
    </div>

    <nav aria-label="Navigasi mobile" class="flex-1 px-4 pb-12 pt-3">
      <div class="space-y-1">
        <section>
          <button
            type="button"
            class="flex w-full items-center justify-between py-2 text-left text-2xl font-semibold transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500"
            :class="activeSection === 'Layanan' ? 'text-primary-500' : 'text-text-secondary'"
            :aria-expanded="activeSection === 'Layanan'"
            aria-controls="mobile-services-menu"
            @click="toggleSection('Layanan')"
          >
            <span>Layanan</span>
            <ChevronDown
              :size="20"
              aria-hidden="true"
              class="transition-transform duration-200"
              :class="activeSection === 'Layanan' ? 'rotate-180' : ''"
            />
          </button>

          <div
            id="mobile-services-menu"
            class="grid transition-[grid-template-rows,opacity] duration-300"
            :class="activeSection === 'Layanan' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="border-l-[3px] border-primary-500 pb-2 pl-4 pt-1">
                <p class="mb-3 text-xs font-medium text-text-tertiary">
                  Main Service
                </p>

                <div class="space-y-4">
                  <NuxtLink
                    to="/china-cargo"
                    class="group flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="block size-10 shrink-0 rounded-full bg-bg-0 p-0.5 shadow-md">
                      <img :src="chinaFlagUrl" alt="" class="size-full rounded-full object-cover">
                    </span>
                    <span class="min-w-0">
                      <span class="flex items-center gap-2 text-base font-medium text-black">
                        Cargo China
                        <ArrowUpRight :size="18" class="text-primary-500" aria-hidden="true" />
                      </span>
                      <span class="mt-1 block text-xs leading-5 text-text-tertiary">
                        Pengiriman cargo China–Indonesia yang aman dan terintegrasi.
                      </span>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/sea-freight"
                    class="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      <Ship :size="17" aria-hidden="true" />
                    </span>
                    <span>
                      <span class="block text-base font-medium text-black">Kargo Laut</span>
                      <span class="mt-1 flex gap-2 text-[10px] font-medium text-primary-500">
                        <span class="rounded bg-bg-100 px-2 py-0.5">FCL</span>
                        <span class="rounded bg-bg-100 px-2 py-0.5">LCL</span>
                      </span>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/air-freight"
                    class="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      <Plane :size="17" aria-hidden="true" />
                    </span>
                    <span class="text-base font-medium text-black">Kargo Udara</span>
                  </NuxtLink>
                </div>

                <p class="mb-3 mt-7 text-xs font-medium text-text-tertiary">
                  Additional Services
                </p>

                <div class="space-y-5">
                  <NuxtLink
                    to="/transfer-rmb"
                    class="flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      <Banknote :size="17" aria-hidden="true" />
                    </span>
                    <span class="min-w-0">
                      <span class="block text-base font-medium text-black">Jasa Transfer RMB</span>
                      <span class="mt-1 block text-xs leading-5 text-text-tertiary">
                        Pembayaran supplier China cepat dengan kurs kompetitif.
                      </span>
                      <span class="mt-2 block text-[8px] text-text-disable">
                        Alipay&nbsp;&nbsp; Alibaba&nbsp;&nbsp; Bank of China&nbsp;&nbsp; WeChat Pay&nbsp;&nbsp; 1688&nbsp;&nbsp; Taobao
                      </span>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/sourcing"
                    class="flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      <ShoppingBag :size="17" aria-hidden="true" />
                    </span>
                    <span>
                      <span class="block text-base font-medium text-black">Jasa Sourcing</span>
                      <span class="mt-1 block text-xs leading-5 text-text-tertiary">
                        Bantu sourcing dan pembelian produk langsung dari China.
                      </span>
                    </span>
                  </NuxtLink>
                </div>

                <div class="mt-7">
                  <p class="mb-3 text-xs font-medium text-text-tertiary">
                    Multinational Shipping
                  </p>
                  <NuxtLink
                    to="/multinational-cargo"
                    aria-label="Lihat layanan multinational shipping"
                    class="flex w-fit flex-wrap gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span
                      v-for="country in multinationalCountries"
                      :key="country.name"
                      class="block size-9 rounded-full bg-bg-0 p-0.5 shadow-md"
                      :title="country.name"
                    >
                      <img :src="country.flag" alt="" class="size-full rounded-full object-cover">
                    </span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <button
            type="button"
            class="flex w-full items-center justify-between py-3 text-left text-2xl font-semibold transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500"
            :class="activeSection === 'Fitur' ? 'text-primary-500' : 'text-text-secondary'"
            :aria-expanded="activeSection === 'Fitur'"
            aria-controls="mobile-features-menu"
            @click="toggleSection('Fitur')"
          >
            <span>Fitur</span>
            <ChevronDown
              :size="20"
              aria-hidden="true"
              class="transition-transform duration-200"
              :class="activeSection === 'Fitur' ? 'rotate-180' : ''"
            />
          </button>

          <div
            id="mobile-features-menu"
            class="grid transition-[grid-template-rows,opacity] duration-300"
            :class="activeSection === 'Fitur' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="border-l-[3px] border-primary-500 pb-4 pl-10 pr-0.5 pt-1">
                <section aria-labelledby="mobile-quotation-service-title">
                  <p
                    id="mobile-quotation-service-title"
                    class="mb-3 text-sm font-medium text-text-tertiary"
                  >
                    Quotation Service
                  </p>

                  <NuxtLink
                    to="/calculator"
                    class="group flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                      <Calculator :size="18" aria-hidden="true" />
                    </span>
                    <span class="text-lg font-medium text-black">Kalkulator</span>
                  </NuxtLink>

                  <p class="mt-3 text-sm leading-5 text-text-tertiary">
                    Hitung estimasi biaya pengiriman sesuai jenis dan kebutuhan kargo Anda.
                  </p>

                  <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2 text-sm text-text-tertiary">
                      <span>Cargo</span>
                      <span class="rounded bg-bg-100 px-2 py-1 font-medium text-primary-500">Sea</span>
                      <span class="rounded bg-bg-100 px-2 py-1 font-medium text-primary-500">Air</span>
                    </div>

                    <NuxtLink
                      to="/calculator"
                      class="ml-auto inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-primary-500 px-4 text-base font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      @click="emit('close')"
                    >
                      <span>Calculate</span>
                      <ArrowUpRight :size="18" aria-hidden="true" />
                    </NuxtLink>
                  </div>
                </section>

                <section class="mt-7" aria-labelledby="mobile-tracking-service-title">
                  <p
                    id="mobile-tracking-service-title"
                    class="mb-3 text-sm font-medium text-text-tertiary"
                  >
                    Tracking Service
                  </p>

                  <NuxtLink
                    to="/live-tracking"
                    class="group flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                      <PackageSearch :size="18" aria-hidden="true" />
                    </span>
                    <span class="text-lg font-medium text-black">Live Tracking Order</span>
                  </NuxtLink>

                  <p class="mt-3 text-sm leading-5 text-text-tertiary">
                    Pantau status dan perjalanan kargo Anda secara cepat melalui Marking ID dan PIN.
                  </p>

                  <form
                    class="mt-4 space-y-2"
                    @submit.prevent="submitTracking"
                  >
                    <label class="sr-only" for="mobile-tracking-code">Marking ID</label>
                    <input
                      id="mobile-tracking-code"
                      v-model="trackingCode"
                      name="mobile-tracking-code"
                      type="text"
                      autocomplete="off"
                      placeholder="Marking ID"
                      class="h-12 w-full rounded-2xl border border-border-200 bg-bg-0 px-4 text-base text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >

                    <label class="sr-only" for="mobile-tracking-pin">PIN</label>
                    <input
                      id="mobile-tracking-pin"
                      v-model="trackingPin"
                      name="mobile-tracking-pin"
                      type="text"
                      autocomplete="off"
                      placeholder="PIN"
                      class="h-12 w-full rounded-2xl border border-border-200 bg-bg-0 px-4 text-base text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:italic placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >

                    <button
                      type="submit"
                      class="ml-auto flex h-12 items-center gap-2 rounded-2xl bg-primary-500 px-5 text-base font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      <span>Track</span>
                      <Search :size="19" aria-hidden="true" />
                    </button>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section v-for="section in (['Informasi', 'Insights'] as const)" :key="section">
          <button
            type="button"
            class="flex w-full items-center justify-between py-3 text-left text-2xl font-semibold text-text-secondary transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500"
            :aria-expanded="activeSection === section"
            :aria-controls="`mobile-${section.toLowerCase()}-menu`"
            @click="toggleSection(section)"
          >
            <span>{{ section }}</span>
            <ChevronDown
              :size="20"
              aria-hidden="true"
              class="transition-transform duration-200"
              :class="activeSection === section ? 'rotate-180' : ''"
            />
          </button>

          <div
            :id="`mobile-${section.toLowerCase()}-menu`"
            class="grid transition-[grid-template-rows,opacity] duration-300"
            :class="activeSection === section ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="space-y-4 border-l-[3px] border-primary-500 pb-4 pl-4 pt-2">
                <NuxtLink
                  v-for="item in simpleSections[section]"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  @click="emit('close')"
                >
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <component :is="item.icon" :size="17" aria-hidden="true" />
                  </span>
                  <span>
                    <span class="block text-base font-medium text-black">{{ item.label }}</span>
                    <span class="mt-1 block text-xs leading-5 text-text-tertiary">{{ item.description }}</span>
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </nav>

    <div class="bg-primary-50 px-6 py-9 text-center">
      <p class="mx-auto max-w-72 text-xs leading-5 text-text-tertiary">
        Solusi logistik dan impor terintegrasi untuk kebutuhan bisnis Anda.
      </p>
      <NuxtLink
        :to="quoteNavigation.to"
        class="mt-4 inline-flex h-10 items-center gap-1 rounded-xl bg-primary-500 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        @click="emit('close')"
      >
        <span>{{ quoteNavigation.label }}</span>
        <ArrowUpRight :size="18" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>
