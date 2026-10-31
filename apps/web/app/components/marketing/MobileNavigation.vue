<script setup lang="ts">
import {
  ArrowUpRight,
  BadgeInfo,
  Banknote,
  BookOpenText,
  Calculator,
  ChevronDown,
  Gift,
  Newspaper,
  PackageSearch,
  Plane,
  Route,
  Search,
  ScrollText,
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

const activeSection = ref<MobileSection | null>(null)
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

const insightSections = [
  {
    id: 'mobile-articles-news-title',
    title: 'Articles & News',
    items: [
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
    ],
  },
  {
    id: 'mobile-guides-title',
    title: 'Guides',
    items: [
      {
        to: '/glossary',
        label: 'Glossary',
        description: 'Pelajari istilah penting dalam pengiriman dan logistik.',
        icon: BookOpenText,
      },
      {
        to: '/complete-guide',
        label: 'Cara Impor',
        description: 'Pahami tahapan pengiriman dan proses impor barang bersama ETH Cargo.',
        icon: Route,
      },
    ],
  },
] as const

const informationSections = [
  {
    id: 'mobile-about-eth-cargo-title',
    title: 'About ETH Cargo',
    items: [
      {
        to: '/about-us',
        label: 'About Us',
        description: 'Kenali ETH Cargo dan komitmen kami dalam mendukung kebutuhan logistik bisnis Anda.',
        icon: BadgeInfo,
      },
      {
        to: '/faq',
        label: 'FAQ',
        description: 'Temukan jawaban atas pertanyaan umum seputar layanan dan proses pengiriman.',
        icon: BookOpenText,
      },
    ],
  },
  {
    id: 'mobile-legalities-title',
    title: 'Legalities',
    items: [
      {
        to: '/terms-and-conditions',
        label: 'Syarat & Ketentuan',
        description: 'Pelajari ketentuan penggunaan layanan dan informasi legal ETH Cargo.',
        icon: ScrollText,
      },
    ],
  },
] as const

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
                    class="group/item flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="block size-10 shrink-0 rounded-full bg-bg-0 p-0.5 shadow-md">
                      <img :src="chinaFlagUrl" alt="" class="size-full rounded-full object-cover">
                    </span>
                    <span class="min-w-0">
                      <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                        Cargo China
                        <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                      </span>
                      <span class="mt-1 block text-xs leading-5 text-text-tertiary">
                        Pengiriman cargo China–Indonesia yang aman dan terintegrasi.
                      </span>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/sea-freight"
                    class="group/item flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition duration-200 ease-out motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-hover/item:shadow-md group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-focus-visible/item:shadow-md group-active/item:bg-primary-500 group-active/item:text-white group-active/item:shadow-md">
                      <Ship :size="17" aria-hidden="true" />
                    </span>
                    <span>
                      <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                        Kargo Laut
                        <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                      </span>
                      <span class="mt-1 flex gap-2 text-xs font-medium text-primary-500">
                        <span class="rounded bg-bg-100 px-2 py-0.5">FCL</span>
                        <span class="rounded bg-bg-100 px-2 py-0.5">LCL</span>
                      </span>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/air-freight"
                    class="group/item flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition duration-200 ease-out motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-hover/item:shadow-md group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-focus-visible/item:shadow-md group-active/item:bg-primary-500 group-active/item:text-white group-active/item:shadow-md">
                      <Plane :size="17" aria-hidden="true" />
                    </span>
                    <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                      Kargo Udara
                      <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                    </span>
                  </NuxtLink>
                </div>

                <p class="mb-3 mt-7 text-xs font-medium text-text-tertiary">
                  Additional Services
                </p>

                <div class="space-y-5">
                  <NuxtLink
                    to="/transfer-rmb"
                    class="group/item flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition duration-200 ease-out motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-hover/item:shadow-md group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-focus-visible/item:shadow-md group-active/item:bg-primary-500 group-active/item:text-white group-active/item:shadow-md">
                      <Banknote :size="17" aria-hidden="true" />
                    </span>
                    <span class="min-w-0">
                      <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                        Jasa Transfer RMB
                        <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                      </span>
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
                    class="group/item flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition duration-200 ease-out motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-hover/item:shadow-md group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-focus-visible/item:shadow-md group-active/item:bg-primary-500 group-active/item:text-white group-active/item:shadow-md">
                      <ShoppingBag :size="17" aria-hidden="true" />
                    </span>
                    <span>
                      <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                        Jasa Sourcing
                        <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                      </span>
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
                    class="mb-3 text-xs font-medium text-text-tertiary"
                  >
                    Quotation Service
                  </p>

                  <NuxtLink
                    to="/calculator"
                    class="group/item flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-active/item:bg-primary-500 group-active/item:text-white">
                      <Calculator :size="18" aria-hidden="true" />
                    </span>
                    <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                      Kalkulator
                      <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                    </span>
                  </NuxtLink>

                  <p class="mt-3 text-xs leading-5 text-text-tertiary">
                    Hitung estimasi biaya pengiriman sesuai jenis dan kebutuhan kargo Anda.
                  </p>

                  <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2 text-xs text-text-tertiary">
                      <span>Cargo</span>
                      <span class="rounded bg-bg-100 px-2 py-1 font-medium text-primary-500">Sea</span>
                      <span class="rounded bg-bg-100 px-2 py-1 font-medium text-primary-500">Air</span>
                    </div>

                    <NuxtLink
                      to="/calculator"
                      class="ml-auto inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-primary-500 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
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
                    class="mb-3 text-xs font-medium text-text-tertiary"
                  >
                    Tracking Service
                  </p>

                  <NuxtLink
                    to="/live-tracking"
                    class="group/item flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    @click="emit('close')"
                  >
                    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-active/item:bg-primary-500 group-active/item:text-white">
                      <PackageSearch :size="18" aria-hidden="true" />
                    </span>
                    <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                      Live Tracking Order
                      <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                    </span>
                  </NuxtLink>

                  <p class="mt-3 text-xs leading-5 text-text-tertiary">
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
                      class="ml-auto flex h-12 items-center gap-2 rounded-2xl bg-primary-500 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
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

        <section>
          <button
            type="button"
            class="flex w-full items-center justify-between py-3 text-left text-2xl font-semibold transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500"
            :class="activeSection === 'Informasi' ? 'text-primary-500' : 'text-text-secondary'"
            :aria-expanded="activeSection === 'Informasi'"
            aria-controls="mobile-information-menu"
            @click="toggleSection('Informasi')"
          >
            <span>Information</span>
            <ChevronDown
              :size="20"
              aria-hidden="true"
              class="transition-transform duration-200"
              :class="activeSection === 'Informasi' ? 'rotate-180' : ''"
            />
          </button>

          <div
            id="mobile-information-menu"
            class="grid transition-[grid-template-rows,opacity] duration-300"
            :class="activeSection === 'Informasi' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="space-y-8 border-l-[3px] border-primary-500 pb-8 pl-6 pt-1">
                <section
                  v-for="informationSection in informationSections"
                  :key="informationSection.id"
                  :aria-labelledby="informationSection.id"
                >
                  <p
                    :id="informationSection.id"
                    class="mb-4 text-xs font-medium text-text-tertiary"
                  >
                    {{ informationSection.title }}
                  </p>

                  <div class="space-y-6">
                    <NuxtLink
                      v-for="item in informationSection.items"
                      :key="item.to"
                      :to="item.to"
                      class="group/item flex items-start gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      @click="emit('close')"
                    >
                      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-active/item:bg-primary-500 group-active/item:text-white">
                        <component :is="item.icon" :size="20" aria-hidden="true" />
                      </span>
                      <span class="min-w-0 pt-1">
                        <span class="flex items-center gap-2 text-base font-medium text-black transition-colors group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                          {{ item.label }}
                          <ArrowUpRight :size="18" class="-translate-x-1 translate-y-1 text-primary-500 opacity-0 transition duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 group-active/item:translate-x-0 group-active/item:translate-y-0 group-active/item:opacity-100" aria-hidden="true" />
                        </span>
                        <span class="mt-3 block text-xs leading-6 text-text-tertiary">
                          {{ item.description }}
                        </span>
                      </span>
                    </NuxtLink>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section>
          <button
            type="button"
            class="flex w-full items-center justify-between py-3 text-left text-[25px] font-semibold text-text-secondary transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500"
            :aria-expanded="activeSection === 'Insights'"
            aria-controls="mobile-insights-menu"
            @click="toggleSection('Insights')"
          >
            <span>Insights</span>
            <ChevronDown
              :size="20"
              aria-hidden="true"
              class="transition-transform duration-200"
              :class="activeSection === 'Insights' ? 'rotate-180' : ''"
            />
          </button>

          <div
            id="mobile-insights-menu"
            class="grid transition-[grid-template-rows,opacity] duration-300"
            :class="activeSection === 'Insights' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="space-y-8 border-l-[3px] border-primary-500 pb-4 pl-4 pt-1">
                <section
                  v-for="insightSection in insightSections"
                  :key="insightSection.id"
                  :aria-labelledby="insightSection.id"
                >
                  <p
                    :id="insightSection.id"
                    class="mb-4 text-xs font-medium text-text-tertiary"
                  >
                    {{ insightSection.title }}
                  </p>

                  <div class="space-y-5">
                    <NuxtLink
                      v-for="item in insightSection.items"
                      :key="item.to"
                      :to="item.to"
                      class="group/item flex items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      @click="emit('close')"
                    >
                      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors duration-200 motion-reduce:transition-none group-hover/item:bg-primary-500 group-hover/item:text-white group-focus-visible/item:bg-primary-500 group-focus-visible/item:text-white group-active/item:bg-primary-500 group-active/item:text-white">
                        <component :is="item.icon" :size="19" aria-hidden="true" />
                      </span>
                      <span class="min-w-0 pt-1">
                        <span class="flex items-center gap-2 text-base font-medium text-black transition-colors duration-200 motion-reduce:transition-none group-hover/item:text-primary-500 group-focus-visible/item:text-primary-500 group-active/item:text-primary-500">
                          {{ item.label }}
                          <ArrowUpRight
                            :size="18"
                            class="text-primary-500 opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover/item:opacity-100 group-focus-visible/item:opacity-100 group-active/item:opacity-100"
                            aria-hidden="true"
                          />
                        </span>
                        <span class="mt-2 block text-xs leading-5 text-text-tertiary">{{ item.description }}</span>
                      </span>
                    </NuxtLink>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </nav>

    <div class="px-6 py-9 text-center">
      <p class="mx-auto max-w-72 text-sm font-medium leading-5 text-text-tertiary">
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
