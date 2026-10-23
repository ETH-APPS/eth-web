<script setup lang="ts">
import { ChevronDown, Clock3 } from 'lucide-vue-next'
import logoUrl from '~/assets/images/brand/logo-white.png'
import logo1688 from '~/assets/images/brand/1688.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoTmall from '~/assets/images/brand/tmall.png'
import logoBca from '~/assets/images/brand/bca.png'
import logoMandiri from '~/assets/images/brand/mandiri.png'
import logoPermata from '~/assets/images/brand/permata.png'
import iconFacebook from '~/assets/images/marketing/facebook.png'
import iconInstagram from '~/assets/images/marketing/instagram.png'
import iconTiktok from '~/assets/images/marketing/tiktok.png'
import iconYoutube from '~/assets/images/marketing/youtube.png'

const currentYear = new Date().getFullYear()

const socials = [
  { label: 'Facebook ETH Cargo', icon: iconFacebook },
  { label: 'Instagram ETH Cargo', icon: iconInstagram },
  { label: 'TikTok ETH Cargo', icon: iconTiktok },
  { label: 'YouTube ETH Cargo', icon: iconYoutube },
]

const marketplaceLogos = [
  { name: '1688', src: logo1688, class: 'h-6' },
  { name: 'Taobao', src: logoTaobao, class: 'h-5' },
  { name: 'Alibaba.com', src: logoAlibaba, class: 'h-[18px]' },
  { name: 'Tmall', src: logoTmall, class: 'h-[18px]' },
]

const bankLogos = [
  { name: 'BCA', src: logoBca, class: 'h-8' },
  { name: 'Mandiri', src: logoMandiri, class: 'h-7' },
  { name: 'Permata Bank', src: logoPermata, class: 'h-6' },
]

const serviceLinks = [
  { label: 'Kargo Laut', to: '#layanan' },
  { label: 'Kargo Udara', to: '#layanan' },
  { label: 'Jasa Kargo China', to: '#sourcing' },
  { label: 'Transfer RMB', to: '#layanan' },
  { label: 'Titip Beli', to: '#sourcing' },
]

const featureLinks = [
  { label: 'Tentang Kami', to: '#why-us' },
  { label: 'Simulasi Kargo', to: '#main-services' },
  { label: 'Apps (Soon)', to: '#footer' },
]

const guideLinks = [
  { label: 'Proses Impor Barang', to: '#alur-pengiriman' },
  { label: 'Insights', to: '#footer' },
]

const promoLinks = [
  { label: 'This Months Promo', to: '#footer' },
  { label: 'All Promo', to: '#footer' },
]

const informationLinks = [
  { label: 'Tentang Kami', to: '#why-us' },
  { label: 'FAQ', to: '#faq' },
]

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
    <UiContainer class="py-12">
      <div class="grid grid-cols-[1fr_auto] gap-16">
        <div>
          <NuxtLink
            to="/"
            aria-label="ETH Cargo home"
            class="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
          >
            <img
              :src="logoUrl"
              width="220"
              height="66"
              alt="ETH Cargo"
              class="h-[66px] w-[220px] object-contain object-left"
            >
          </NuxtLink>

          <p class="mt-2 text-[14px] font-normal text-text-secondary">
            Jasa pengiriman impor dari China ke mancanegara.
          </p>

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
                class="size-4 object-contain"
              >
            </a>
          </div>

          <div class="mt-6">
            <p :class="headingClass">
              Operasional
            </p>
            <p class="mt-2 flex items-center gap-2.5 text-[15px] text-text-secondary">
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

          <ul
            class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3"
            aria-label="Marketplace"
          >
            <li
              v-for="logo in marketplaceLogos"
              :key="logo.name"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                loading="lazy"
                class="w-auto object-contain"
                :class="logo.class"
              >
            </li>
          </ul>

          <ul
            class="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4"
            aria-label="Bank pembayaran"
          >
            <li
              v-for="logo in bankLogos"
              :key="logo.name"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                loading="lazy"
                class="w-auto object-contain"
                :class="logo.class"
              >
            </li>
          </ul>
        </div>

        <nav
          aria-label="Navigasi footer"
          class="grid grid-cols-[auto_1fr_1fr] content-start gap-x-10 gap-y-4 pl-28 pt-3"
        >
          <div class="row-span-2">
            <p :class="navHeadingClass">
              Services
            </p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="link in serviceLinks"
                :key="link.label"
              >
                <NuxtLink
                  :to="link.to"
                  :class="linkClass"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <p :class="navHeadingClass">
              Fitur
            </p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="link in featureLinks"
                :key="link.label"
              >
                <NuxtLink
                  :to="link.to"
                  :class="linkClass"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <p :class="navHeadingClass">
              Promo
            </p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="link in promoLinks"
                :key="link.label"
              >
                <NuxtLink
                  :to="link.to"
                  :class="linkClass"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <p :class="navHeadingClass">
              Panduan
            </p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="link in guideLinks"
                :key="link.label"
              >
                <NuxtLink
                  :to="link.to"
                  :class="linkClass"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <p :class="navHeadingClass">
              Informasi
            </p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="link in informationLinks"
                :key="link.label"
              >
                <NuxtLink
                  :to="link.to"
                  :class="linkClass"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="mt-10 text-center text-[12px] font-normal text-text-disable">
        <p>
          <a
            href="#footer"
            class="underline underline-offset-2 transition-colors hover:text-primary-500"
          >Syarat &amp; Ketentuan</a>
          <span aria-hidden="true"> · </span>
          <a
            href="#footer"
            class="underline underline-offset-2 transition-colors hover:text-primary-500"
          >Kebijakan Privasi</a>
        </p>
        <p class="mt-2">
          © {{ currentYear }} ETH Cargo. All rights reserved.
        </p>
      </div>

      <details class="group mt-6 border-y border-border-200">
        <summary class="flex cursor-pointer list-none items-center justify-between py-3 text-[14px] text-text-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
          <span>SEO BOX</span>
          <ChevronDown
            :size="18"
            :stroke-width="1.8"
            aria-hidden="true"
            class="transition-transform duration-300 group-open:rotate-180"
          />
        </summary>
        <p class="max-w-[900px] pb-4 text-[12px] leading-relaxed text-text-tertiary">
          Informasi tambahan mengenai layanan forwarder China–Indonesia, pengiriman kargo laut dan
          udara, jasa sourcing, serta solusi impor B2B ETH Cargo.
        </p>
      </details>
    </UiContainer>
  </footer>
</template>