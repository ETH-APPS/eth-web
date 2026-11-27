<script setup lang="ts">
import { ChevronDown, Clock3 } from 'lucide-vue-next'
import logoUrl from '~/assets/images/brand/logo-white.png'
import logo1688 from '~/assets/images/brand/1688.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoAliexpress from '~/assets/images/brand/aliexpress.webp'
import logoTmall from '~/assets/images/brand/tmall.png'
import logoBca from '~/assets/images/brand/bca.png'
import logoMandiri from '~/assets/images/brand/mandiri.png'
import logoPermata from '~/assets/images/brand/permata.png'
import iconFacebook from '~/assets/images/marketing/facebook.png'
import iconInstagram from '~/assets/images/marketing/instagram.png'
import iconTiktok from '~/assets/images/marketing/tiktok.png'
import iconYoutube from '~/assets/images/marketing/youtube.png'

const currentYear = new Date().getFullYear()
const route = useRoute()
const isHomePage = computed(() => route.path === '/')

const socials = [
  { label: 'Facebook ETH Cargo', icon: iconFacebook },
  { label: 'Instagram ETH Cargo', icon: iconInstagram },
  { label: 'TikTok ETH Cargo', icon: iconTiktok },
  { label: 'YouTube ETH Cargo', icon: iconYoutube },
]

const marketplaceLogos = [
  { name: '1688', src: logo1688, width: 300, height: 105, class: 'h-6', mobileClass: 'h-5' },
  { name: 'Taobao', src: logoTaobao, width: 360, height: 108, class: 'h-5', mobileClass: 'h-[18px]' },
  { name: 'Alibaba.com', src: logoAlibaba, width: 360, height: 84, class: 'h-[18px]', mobileClass: 'h-[18px]' },
  { name: 'AliExpress', src: logoAliexpress, width: 360, height: 93, class: 'h-[18px]', mobileClass: 'h-[18px]' },
  { name: 'Tmall', src: logoTmall, width: 360, height: 90, class: 'h-[18px]', mobileClass: 'h-[18px]' },
]

const bankLogos = [
  { name: 'BCA', src: logoBca, width: 258, height: 81, class: 'h-8' },
  { name: 'Mandiri', src: logoMandiri, width: 344, height: 100, class: 'h-7' },
  { name: 'Permata Bank', src: logoPermata, width: 344, height: 84, class: 'h-6' },
]

const navigationGroups = [
  {
    id: 'layanan',
    label: 'Layanan',
    links: [
      { label: 'Jasa Cargo China', to: '/china-cargo' },
      { label: 'Jasa Transfer RMB', to: '/transfer-rmb' },
      { label: 'Jasa Sourcing', to: '/sourcing' },
    ],
  },
  {
    id: 'fitur',
    label: 'Fitur',
    links: [
      { label: 'Kalkulator Impor', to: '/calculator' },
      { label: 'Kalkulator RMB', to: '/calculator-transfer-rmb' },
      { label: 'Live Tracking', to: '/live-tracking' },
    ],
  },
  {
    id: 'insight',
    label: 'Insight',
    links: [
      { label: 'Promosi', to: '/promo' },
      { label: 'Blog', to: '/artikel' },
      { label: 'Cara Import Barang dari China', to: '/cara-import-barang-dari-china', narrow: true },
    ],
  },
  {
    id: 'information',
    label: 'Information',
    links: [
      { label: 'Tentang Kami', to: '/about-us' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Syarat & Ketentuan', to: '/terms-and-conditions' },
    ],
  },
] as const

const activeMobileSection = ref<string | null>(null)

const seoTitle = 'Tentang ETH Cargo | Jasa Forwarder China Indonesia #1'
const seoParagraphs = [
  'ETH Cargo (PT Express Trade Handling) adalah penyedia layanan forwarder China Indonesia terpercaya sejak 2013. Kami berdedikasi membantu korporasi, manufaktur, dan pelaku usaha di Indonesia memindahkan barang dari supplier China dengan proses operasional yang terkelola.',
  'Sebagai importir resmi yang fokus pada pasar B2B, ETH Cargo menghadirkan solusi logistik end-to-end. Mulai dari penerimaan di gudang Guangzhou, pengiriman via udara/laut, hingga pengurusan izin impor (All-In) untuk memastikan rantai pasok Anda berjalan transparan, aman, dan dapat diprediksi.',
]
const seoServicesTitle = 'Layanan Utama Kami:'
const seoServices = [
  'Jasa cargo China: Pengiriman kargo yang efisien dari Guangzhou & Yiwu ke Jakarta (Kargo Udara & Kargo Laut) dengan tarif transparan dan sistem pelacakan terpadu.',
  'Jasa Transfer RMB: Solusi perantara pembayaran aman ke supplier atau dompet digital di China bagi bisnis tanpa rekening lokal.',
  'Jasa Sourcing China: Kemudahan pengadaan barang dari marketplace China tanpa kendala bahasa dan pembayaran.',
]

function toggleMobileSection(id: string) {
  activeMobileSection.value = activeMobileSection.value === id ? null : id
}

const linkClass =
  'text-[14px] font-normal text-text-secondary transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
const headingClass = 'text-[17px] font-medium text-text-disable'
const navHeadingClass = 'text-[16px] font-medium text-text-disable'
</script>

<template>
  <footer
    id="footer"
    class="bg-bg-100 text-text-secondary"
  >
    <UiContainer class="py-6 lg:py-12">
      <!-- MOBILE -->
      <div class="lg:hidden">
        <div class="text-center">
          <NuxtLink
            to="/"
            aria-label="ETH Cargo home"
            class="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
          >
            <img
              :src="logoUrl"
              width="220"
              height="66"
              loading="lazy"
              alt="ETH Cargo"
              class="h-[66px] w-[220px] object-contain"
            >
          </NuxtLink>

          <div class="mt-5 flex items-center justify-center gap-8" aria-label="Media sosial ETH Cargo">
            <a
              v-for="social in socials"
              :key="social.label"
              href="#footer"
              :aria-label="social.label"
              class="flex size-8 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <img :src="social.icon" alt="" aria-hidden="true" width="20" height="20" loading="lazy" class="size-5 object-contain">
            </a>
          </div>
        </div>

        <nav aria-label="Navigasi footer" class="mt-7">
          <section v-for="group in navigationGroups" :key="group.id">
            <h2>
              <button
                type="button"
                class="flex min-h-[53px] w-full items-center justify-between text-left text-[18px] font-medium text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                :aria-expanded="activeMobileSection === group.id"
                :aria-controls="`footer-mobile-${group.id}`"
                @click="toggleMobileSection(group.id)"
              >
                <span>{{ group.label }}</span>
                <ChevronDown
                  :size="20"
                  :stroke-width="1.8"
                  aria-hidden="true"
                  class="shrink-0 transition-transform duration-200 motion-reduce:transition-none"
                  :class="activeMobileSection === group.id ? 'rotate-180' : ''"
                />
              </button>
            </h2>
            <div
              :id="`footer-mobile-${group.id}`"
              class="grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none"
              :class="activeMobileSection === group.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
              :aria-hidden="activeMobileSection !== group.id"
              :inert="activeMobileSection !== group.id"
            >
              <div class="min-h-0 overflow-hidden">
                <ul class="space-y-2 pb-4 pl-3">
                  <li v-for="link in group.links" :key="`${group.id}-${link.label}`">
                    <NuxtLink
                      :to="link.to"
                      class="inline-block py-1 text-[16px] text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      @click="activeMobileSection = null"
                    >
                      {{ link.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </nav>

        <div class="mt-7 text-center">
          <p class="text-[18px] font-medium text-text-disable">Operasional</p>
          <p class="mt-1 flex flex-wrap items-center justify-center gap-x-2 text-[16px] text-text-secondary">
            <Clock3 :size="24" :stroke-width="1.8" aria-hidden="true" class="text-primary-500" />
            <span>09.00 - 17.00</span>
            <span class="text-text-tertiary">(Senin–Jumat)</span>
          </p>
        </div>

        <div class="mt-8 text-center">
          <p class="text-[18px] font-medium text-text-disable">E-Commerce</p>
          <ul class="mt-3 flex flex-wrap items-center justify-between gap-y-2" aria-label="Marketplace">
            <li v-for="logo in marketplaceLogos" :key="logo.name">
              <img
                :src="logo.src"
                :alt="logo.name"
                :width="logo.width"
                :height="logo.height"
                loading="lazy"
                class="w-auto max-w-full object-contain"
                :class="logo.mobileClass"
              >
            </li>
          </ul>
        </div>

        <div class="mt-8 text-center">
          <p class="text-[18px] font-medium text-text-disable">Pembayaran</p>
          <ul class="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" aria-label="Bank pembayaran">
            <li v-for="logo in bankLogos" :key="logo.name">
              <img
                :src="logo.src"
                :alt="logo.name"
                :width="logo.width"
                :height="logo.height"
                loading="lazy"
                class="w-auto object-contain"
                :class="logo.class"
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- DESKTOP -->
      <div class="hidden gap-10 lg:flex lg:justify-between xl:gap-16">
        <div class="shrink-0">
          <NuxtLink
            to="/"
            aria-label="ETH Cargo home"
            class="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
          >
            <img
              :src="logoUrl"
              width="220"
              height="66"
              loading="lazy"
              alt="ETH Cargo"
              class="h-[66px] w-[220px] object-contain object-left"
            >
          </NuxtLink>

          <div
            class="mt-4 flex items-center gap-6"
            aria-label="Media sosial ETH Cargo"
          >
            <a
              v-for="social in socials"
              :key="social.label"
              href="#footer"
              :aria-label="social.label"
              class="rounded-md transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <img
                :src="social.icon"
                alt=""
                aria-hidden="true"
                width="16"
                height="16"
                loading="lazy"
                class="size-4 object-contain"
              >
            </a>
          </div>

          <div class="mt-6">
            <p :class="headingClass">
              Operasional
            </p>
            <p class="mt-2 flex items-center gap-2.5 whitespace-nowrap text-[15px] text-text-secondary">
              <Clock3
                :size="24"
                :stroke-width="1.8"
                aria-hidden="true"
                class="text-primary-500"
              />
              <span>09.00 - 17.00</span>
              <span class="text-text-tertiary">(Senin–Jumat)</span>
            </p>
          </div>

          <div class="mt-6">
            <p :class="headingClass">
              E-Commerce
            </p>
            <ul
              class="mt-3 flex flex-nowrap items-center gap-x-4"
              aria-label="Marketplace"
            >
              <li
                v-for="logo in marketplaceLogos"
                :key="logo.name"
              >
                <img
                  :src="logo.src"
                  :alt="logo.name"
                  :width="logo.width"
                  :height="logo.height"
                  loading="lazy"
                  class="w-auto object-contain"
                  :class="logo.class"
                >
              </li>
            </ul>
          </div>

          <div class="mt-6">
            <p :class="headingClass">
              Pembayaran
            </p>
            <ul
              class="mt-3 flex flex-nowrap items-center gap-x-7"
              aria-label="Bank pembayaran"
            >
              <li
                v-for="logo in bankLogos"
                :key="logo.name"
              >
                <img
                  :src="logo.src"
                  :alt="logo.name"
                  :width="logo.width"
                  :height="logo.height"
                  loading="lazy"
                  class="w-auto object-contain"
                  :class="logo.class"
                >
              </li>
            </ul>
          </div>
        </div>

        <nav
          aria-label="Navigasi footer"
          class="ml-auto flex w-full min-w-0 max-w-[640px] items-start justify-between gap-x-2 pt-3 xl:gap-x-6"
        >
          <div
            v-for="group in navigationGroups"
            :key="group.id"
            class="shrink-0"
          >
            <p :class="navHeadingClass">
              {{ group.label }}
            </p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="link in group.links"
                :key="`${group.id}-${link.label}`"
              >
                <NuxtLink
                  :to="link.to"
                  :class="[linkClass, 'narrow' in link && link.narrow ? 'inline-block max-w-[130px]' : '']"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <section
        v-if="isHomePage"
        aria-labelledby="footer-seo-title"
        class="mt-10 rounded-xl border border-border-200 px-4 pt-4 pb-8"
      >
        <h2
          id="footer-seo-title"
          class="border-b border-border-200 pb-3 text-[16px] font-normal text-text-tertiary"
        >
          {{ seoTitle }}
        </h2>

        <div class="mt-3 grid grid-cols-1 gap-y-4 lg:mt-2 lg:grid-cols-2 lg:gap-x-16">
          <div class="space-y-4 text-[12px] leading-relaxed text-text-tertiary">
            <p v-for="paragraph in seoParagraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>

          <div>
            <h3 class="text-[14px] font-normal text-text-tertiary">
              {{ seoServicesTitle }}
            </h3>
            <ul class="mt-3 list-disc space-y-1 pl-[18px] text-[12px] leading-relaxed text-text-tertiary">
              <li v-for="service in seoServices" :key="service">
                {{ service }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div class="mt-10 text-center text-[10px] font-normal text-text-disable lg:mt-16 lg:text-[12px]">
        <p>
          © {{ currentYear }} ETH Cargo. All rights reserved.
        </p>
      </div>
    </UiContainer>
  </footer>
</template>
