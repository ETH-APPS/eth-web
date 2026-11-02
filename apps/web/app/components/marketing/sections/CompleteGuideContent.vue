<script setup lang="ts">
import {
  ChevronDown,
  ChevronUp,
} from 'lucide-vue-next'
import articleImage from '~/assets/images/marketing/article.png'
import cargoAirLandscapeImage from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoSeaLandscapeImage from '~/assets/images/marketing/cargo-sea-landscape.png'
import facebookDark from '~/assets/images/marketing/facebook-dark.png'
import heroImage from '~/assets/images/marketing/hero.png'
import instagramDark from '~/assets/images/marketing/Instagram-dark.png'
import linkDark from '~/assets/images/marketing/Link-dark.png'
import importHeroImage from '~/assets/images/marketing/multinational-cargo-hero.png'
import threadsDark from '~/assets/images/marketing/Threads-dark.png'
import tiktokDark from '~/assets/images/marketing/Tiktok-dark.png'
import whatsappImage from '~/assets/images/marketing/whatsapp.png'
import xDark from '~/assets/images/marketing/X-dark.png'

const tableOfContents = [
  {
    id: 'persiapan-impor',
    number: '1',
    title: 'Persiapan proses impor',
    children: [
      {
        id: 'data-dan-spesifikasi',
        number: '1.1',
        title: 'Menyiapkan data dan spesifikasi barang',
      },
      {
        id: 'dokumen-pengiriman',
        number: '1.2',
        title: 'Memahami dokumen pengiriman',
      },
    ],
  },
  {
    id: 'metode-pengiriman',
    number: '2',
    title: 'Memilih metode pengiriman',
    children: [
      {
        id: 'laut-atau-udara',
        number: '2.1',
        title: 'Menentukan jalur laut atau udara',
      },
    ],
  },
  {
    id: 'pengiriman-dan-pemantauan',
    number: '3',
    title: 'Pengiriman dan pemantauan',
    children: [],
  },
] as const

const expandedSections = ref<string[]>(['persiapan-impor', 'metode-pengiriman'])
const activeSection = ref('persiapan-impor')
const isMobileTocOpen = ref(false)
const shareUrl = ref('')
const copied = ref(false)
const ACTIVE_OFFSET = 130
let headingElements: HTMLElement[] = []
let isScrollQueued = false

const socials = computed(() => [
  {
    label: 'Bagikan ke Facebook',
    icon: facebookDark,
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`,
  },
  {
    label: 'Lihat Instagram ETH Cargo',
    icon: instagramDark,
    href: 'https://www.instagram.com/',
  },
  {
    label: 'Bagikan ke Threads',
    icon: threadsDark,
    href: `https://www.threads.net/intent/post?text=${encodeURIComponent(shareUrl.value)}`,
  },
  {
    label: 'Lihat TikTok ETH Cargo',
    icon: tiktokDark,
    href: 'https://www.tiktok.com/',
  },
  {
    label: 'Bagikan ke X',
    icon: xDark,
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}`,
  },
])

function isExpanded(id: string) {
  return expandedSections.value.includes(id)
}

function toggleSection(id: string) {
  expandedSections.value = isExpanded(id)
    ? expandedSections.value.filter(sectionId => sectionId !== id)
    : [...expandedSections.value, id]
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

function selectMobileSection(id: string) {
  isMobileTocOpen.value = false
  scrollToSection(id)
}

function updateActiveSection() {
  let currentId = headingElements[0]?.id ?? ''

  for (const heading of headingElements) {
    if (heading.getBoundingClientRect().top <= ACTIVE_OFFSET)
      currentId = heading.id
  }

  activeSection.value = currentId
}

function handleScroll() {
  if (isScrollQueued)
    return

  isScrollQueued = true
  requestAnimationFrame(() => {
    updateActiveSection()
    isScrollQueued = false
  })
}

async function copyGuideLink() {
  if (!shareUrl.value || !navigator.clipboard)
    return

  await navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}

onMounted(() => {
  shareUrl.value = window.location.href
  headingElements = tableOfContents.flatMap(section => [
    document.getElementById(section.id),
    ...section.children.map(child => document.getElementById(child.id)),
  ]).filter((heading): heading is HTMLElement => Boolean(heading))

  updateActiveSection()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="bg-bg-0 pb-20 pt-5 lg:pt-14">
    <UiContainer>
      <header class="lg:hidden">
        <p class="text-[16px] font-normal text-primary-700">
          Insight
        </p>
        <h1 class="mt-1 text-[32px] font-semibold leading-tight text-primary-500">
          Proses Impor
        </h1>
        <p class="mt-5 text-[16px] font-normal leading-[1.55] text-text-secondary">
          Solusi pengiriman kargo laut dan udara B2B yang aman, transparan, dan tepat waktu. Bebas urus bea cukai dengan skema All-In Door-to-Door langsung sampai ke gudang Anda.
        </p>
        <p class="mt-6 text-center text-[16px] font-normal leading-[1.5] text-text-secondary">
          In id cursus mi pretium tellus duis convallis.
        </p>
        <div class="mt-4 flex justify-center">
          <NuxtLink
            to="/#quote"
            class="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-500 px-5 text-[14px] font-medium text-bg-0 transition-colors hover:bg-[#16a34a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            <span>Konsultasi</span>
            <img :src="whatsappImage" alt="" aria-hidden="true" width="20" height="20" class="size-5 object-contain">
          </NuxtLink>
        </div>
        <img
          :src="importHeroImage"
          alt="Pelabuhan, kontainer, truk, dan pesawat dalam proses impor ETH Cargo"
          width="520"
          height="390"
          class="mt-6 aspect-[7/5] w-full rounded-xl object-cover"
        >
      </header>

      <header class="hidden text-center lg:block">
        <p class="text-[20px] font-normal uppercase text-primary-700">
          Documentation
        </p>
        <h1 class="mt-2 text-[48px] font-semibold leading-tight text-primary-500">
          OUR COMPLETE GUIDE
        </h1>
      </header>

      <div class="mt-8 grid grid-cols-1 items-start gap-6 lg:mt-14 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside class="hidden lg:sticky lg:top-[90px] lg:block">
          <nav
            aria-label="Table of Content"
            class="rounded-2xl border border-border-200 bg-bg-0 p-4 shadow-md"
          >
            <h2 class="text-[20px] font-medium text-primary-500">
              Table of Content
            </h2>

            <ol class="mt-4 space-y-3">
              <li v-for="section in tableOfContents" :key="section.id">
                <div class="flex items-start gap-2">
                  <button
                    type="button"
                    class="grid min-w-0 flex-1 grid-cols-[20px_1fr] gap-x-1.5 text-left text-[16px] font-medium leading-[1.4] text-text-secondary transition-colors hover:text-primary-500"
                    :class="activeSection === section.id ? 'text-primary-500' : ''"
                    @click="scrollToSection(section.id)"
                  >
                    <span>{{ section.number }}</span>
                    <span>{{ section.title }}</span>
                  </button>

                  <button
                    v-if="section.children.length"
                    type="button"
                    :aria-label="`${isExpanded(section.id) ? 'Tutup' : 'Buka'} subbagian ${section.title}`"
                    :aria-expanded="isExpanded(section.id)"
                    class="flex size-5 shrink-0 items-center justify-center rounded text-primary-500 hover:bg-primary-50"
                    @click="toggleSection(section.id)"
                  >
                    <ChevronUp v-if="isExpanded(section.id)" :size="15" aria-hidden="true" />
                    <ChevronDown v-else :size="15" aria-hidden="true" />
                  </button>
                </div>

                <div
                  v-if="section.children.length"
                  class="grid transition-[grid-template-rows,opacity] duration-200"
                  :class="isExpanded(section.id) ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                >
                  <ol class="min-h-0 space-y-1 overflow-hidden pl-5">
                    <li v-for="child in section.children" :key="child.id">
                      <button
                        type="button"
                        class="grid w-full grid-cols-[24px_1fr] gap-x-1.5 rounded-lg px-2 py-2 text-left text-[14px] font-normal leading-[1.4] transition-colors"
                        :class="activeSection === child.id
                          ? 'bg-primary-50 text-primary-500'
                          : 'text-text-tertiary hover:bg-primary-50 hover:text-primary-500'"
                        @click="scrollToSection(child.id)"
                      >
                        <span>{{ child.number }}</span>
                        <span>{{ child.title }}</span>
                      </button>
                    </li>
                  </ol>
                </div>
              </li>
            </ol>
          </nav>

          <img
            :src="heroImage"
            alt="Kapal kargo membawa kontainer dalam perjalanan pengiriman internasional"
            class="mt-4 aspect-[4/5] w-full rounded-2xl object-cover"
          >
        </aside>

        <article class="min-w-0 text-[14px] font-normal leading-[1.65] text-text-secondary">
          <Transition
            enter-active-class="transition-opacity duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <button
              v-if="isMobileTocOpen"
              type="button"
              aria-label="Tutup Table of Content"
              class="fixed inset-x-0 bottom-0 top-16 z-10 bg-white/30 backdrop-blur-[6px] lg:hidden"
              @click="isMobileTocOpen = false"
            />
          </Transition>

          <div class="sticky top-16 z-20 -mx-4 bg-bg-0 lg:hidden" @keydown.esc="isMobileTocOpen = false">
            <div
              class="border-b-2 transition-colors duration-200"
              :class="isMobileTocOpen ? 'border-border-200' : 'border-primary-500'"
            >
              <button
                type="button"
                class="flex min-h-12 w-full items-center justify-between gap-4 px-4 text-left text-[14px] font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
                aria-controls="mobile-import-toc"
                :aria-expanded="isMobileTocOpen"
                @click="isMobileTocOpen = !isMobileTocOpen"
              >
                <span>Table of Content</span>
                <ChevronDown :size="20" class="shrink-0 transition-transform duration-200" :class="isMobileTocOpen ? 'rotate-180' : ''" aria-hidden="true" />
              </button>
            </div>

            <Transition
              enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
              enter-from-class="-translate-y-2 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="-translate-y-2 opacity-0"
            >
              <nav
                v-show="isMobileTocOpen"
                id="mobile-import-toc"
                aria-label="Table of Content"
                class="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto bg-bg-0 px-4 pb-4 pt-3 shadow-[0_14px_28px_rgba(15,23,42,0.14)]"
              >
                <ol class="space-y-1">
                  <li v-for="section in tableOfContents" :key="section.id">
                    <button
                      type="button"
                      class="flex min-h-11 w-full items-center gap-3 rounded-lg px-1 text-left text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
                      :class="activeSection === section.id ? 'font-medium text-primary-500' : 'text-text-secondary hover:text-primary-500'"
                      :aria-current="activeSection === section.id ? 'location' : undefined"
                      @click="selectMobileSection(section.id)"
                    >
                      <span class="w-7 shrink-0">{{ section.number }}</span>
                      <span>{{ section.title }}</span>
                    </button>
                    <ol class="pl-6">
                      <li v-for="child in section.children" :key="child.id">
                        <button
                          type="button"
                          class="flex min-h-11 w-full items-center gap-3 rounded-lg px-1 text-left text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
                          :class="activeSection === child.id ? 'font-medium text-primary-500' : 'text-text-tertiary hover:text-primary-500'"
                          :aria-current="activeSection === child.id ? 'location' : undefined"
                          @click="selectMobileSection(child.id)"
                        >
                          <span class="w-7 shrink-0">{{ child.number }}</span>
                          <span>{{ child.title }}</span>
                        </button>
                      </li>
                    </ol>
                    <div class="my-2 h-px w-24 bg-border-200" aria-hidden="true" />
                  </li>
                </ol>
              </nav>
            </Transition>
          </div>

          <section class="hidden overflow-hidden rounded-xl border border-border-200 lg:block">
            <h2 class="bg-border-200 px-4 py-3 text-[14px] font-semibold text-primary-500">
              Key Points
            </h2>
            <ul class="divide-y divide-border-200 text-[14px] font-normal">
              <li class="flex gap-3 px-4 py-3">
                <span class="text-primary-500" aria-hidden="true">–</span>
                <span>Siapkan spesifikasi barang dan dokumen pendukung sebelum memulai proses pengiriman.</span>
              </li>
              <li class="flex gap-3 bg-bg-100 px-4 py-3">
                <span class="text-primary-500" aria-hidden="true">–</span>
                <span>Pilih metode pengiriman berdasarkan volume, karakter barang, anggaran, dan target waktu.</span>
              </li>
              <li class="flex gap-3 px-4 py-3">
                <span class="text-primary-500" aria-hidden="true">–</span>
                <span>Pantau proses customs clearance hingga pengantaran akhir melalui layanan terintegrasi.</span>
              </li>
            </ul>
          </section>

          <section id="persiapan-impor" class="mt-6 scroll-mt-28">
            <h2 class="text-[20px] font-medium text-primary-500">
              1. Persiapan proses impor
            </h2>
            <p class="mt-4">
              Proses impor yang lancar dimulai dari informasi barang yang lengkap. Tentukan jenis komoditas, jumlah, ukuran, berat, nilai barang, negara asal, serta lokasi tujuan sebelum meminta estimasi layanan.
            </p>
            <p class="mt-4">
              Data yang akurat membantu tim logistik mengidentifikasi kebutuhan izin, memilih jalur pengiriman, dan menghitung estimasi biaya secara transparan sejak awal.
            </p>

            <img
              :src="articleImage"
              alt="Tumpukan kontainer sebagai bagian dari persiapan proses impor"
              loading="lazy"
              class="mx-auto my-7 aspect-[16/8] w-[78%] rounded-xl object-cover"
            >

            <section id="data-dan-spesifikasi" class="scroll-mt-28">
              <h3 class="text-[14px] font-semibold text-primary-500">
                1.1 Menyiapkan data dan spesifikasi barang
              </h3>
              <p class="mt-4">
                Sertakan foto produk, material, fungsi, merek, dimensi kemasan, berat per koli, dan jumlah pesanan. Untuk barang sensitif seperti baterai, cairan, kosmetik, atau bahan kimia, siapkan pula dokumen SDS/MSDS dan izin terkait.
              </p>
              <ol class="mt-4 list-decimal space-y-1 pl-6">
                <li>Foto dan deskripsi produk.</li>
                <li>Ukuran, berat, serta jumlah koli.</li>
                <li>Invoice dan packing list sementara.</li>
                <li>Target waktu penerimaan barang.</li>
              </ol>
            </section>

            <section id="dokumen-pengiriman" class="mt-7 scroll-mt-28">
              <h3 class="text-[14px] font-semibold text-primary-500">
                1.2 Memahami dokumen pengiriman
              </h3>
              <p class="mt-4">
                Dokumen dasar biasanya mencakup commercial invoice, packing list, identitas importir, serta dokumen teknis sesuai kategori barang. Kelengkapan dokumen mempercepat verifikasi dan mengurangi risiko hambatan saat customs clearance.
              </p>
            </section>
          </section>

          <section id="metode-pengiriman" class="mt-9 scroll-mt-28">
            <h2 class="text-[20px] font-medium text-primary-500">
              2. Memilih metode pengiriman
            </h2>
            <p class="mt-4">
              Setiap moda pengiriman memiliki struktur biaya dan estimasi waktu yang berbeda. Pemilihan yang tepat harus mempertimbangkan skala bisnis, urgensi, volume muatan, dan karakter produk.
            </p>

            <img
              :src="cargoAirLandscapeImage"
              alt="Pesawat kargo untuk metode pengiriman melalui jalur udara"
              loading="lazy"
              class="mx-auto my-7 aspect-[16/8] w-[78%] rounded-xl object-cover"
            >

            <section id="laut-atau-udara" class="scroll-mt-28">
              <h3 class="text-[14px] font-semibold text-primary-500">
                2.1 Menentukan jalur laut atau udara
              </h3>
              <p class="mt-4">
                FCL cocok untuk muatan besar yang membutuhkan satu kontainer penuh. LCL lebih fleksibel untuk volume menengah karena biaya dihitung berdasarkan kubikasi, sedangkan Air Cargo ideal untuk sampel, barang bernilai tinggi, dan kebutuhan restok mendesak.
              </p>
              <p class="mt-4">
                Bandingkan estimasi waktu, perhitungan berat aktual atau volume, jadwal keberangkatan, serta cakupan layanan Door-to-Door sebelum menentukan pilihan akhir.
              </p>
            </section>
          </section>

          <section id="pengiriman-dan-pemantauan" class="mt-9 scroll-mt-28">
            <h2 class="text-[20px] font-medium text-primary-500">
              3. Pengiriman dan pemantauan
            </h2>
            <p class="mt-4">
              Setelah dokumen dan metode pengiriman dikonfirmasi, barang diterima di gudang asal untuk proses verifikasi, pengukuran, konsolidasi, dan persiapan keberangkatan. Status kargo kemudian diperbarui selama perjalanan hingga tiba di Indonesia.
            </p>

            <img
              :src="cargoSeaLandscapeImage"
              alt="Kapal kontainer di pelabuhan dalam proses pengiriman kargo"
              loading="lazy"
              class="my-7 aspect-[16/9] w-full rounded-xl object-cover"
            >

            <p>
              Tim operasional membantu proses kepabeanan, pembongkaran, dan pengiriman akhir menuju lokasi tujuan. Simpan seluruh bukti transaksi serta dokumen pengiriman sebagai arsip operasional bisnis Anda.
            </p>
          </section>

          <div class="mt-10 border-y border-border-200 py-5">
            <div class="flex items-center gap-3">
              <span class="text-[14px] font-normal text-text-tertiary">Tag</span>
              <span aria-hidden="true" class="h-px w-6 bg-border-200" />
              <NuxtLink to="/blog/tags?tag=FCL%20Cargo" class="rounded-md bg-primary-500 px-2.5 py-1 text-[14px] font-normal text-white hover:bg-primary-600">
                FCL Cargo
              </NuxtLink>
              <NuxtLink to="/blog/tags?tag=Sea%20Freight" class="rounded-md bg-primary-500 px-2.5 py-1 text-[14px] font-normal text-white hover:bg-primary-600">
                Sea Freight
              </NuxtLink>
            </div>

            <div class="mt-4 flex items-center gap-3">
              <span class="text-[14px] font-normal text-text-tertiary">Share</span>
              <span aria-hidden="true" class="h-px w-6 bg-border-200" />
              <a
                v-for="social in socials"
                :key="social.label"
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="social.label"
                class="rounded transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <img :src="social.icon" alt="" aria-hidden="true" class="size-6 object-contain">
              </a>
              <button
                type="button"
                :aria-label="copied ? 'Tautan telah disalin' : 'Salin tautan panduan'"
                class="rounded transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                @click="copyGuideLink"
              >
                <img :src="linkDark" alt="" aria-hidden="true" class="size-6 object-contain">
              </button>
              <span v-if="copied" role="status" class="text-[14px] font-normal text-primary-500">Tersalin</span>
            </div>
          </div>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
