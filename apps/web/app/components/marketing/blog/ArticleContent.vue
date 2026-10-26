<script setup lang="ts">
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Facebook,
  Instagram,
  Link2,
  Music2,
} from 'lucide-vue-next'

interface RelatedArticle {
  id: string
  title: string
  releaseDate: string
  image: string
  imageAlt: string
  to?: string
}

const props = defineProps<{
  title: string
  tags: readonly string[]
  sidebarImage: string
  relatedArticles: readonly RelatedArticle[]
}>()

const tableOfContents = [
  {
    id: 'memahami-kebutuhan',
    number: '1',
    title: 'Memahami kebutuhan pengiriman',
    children: [
      { id: 'mengenali-karakter-barang', number: '1.1', title: 'Mengenali karakter dan kebutuhan barang' },
      { id: 'menentukan-target-pengiriman', number: '1.2', title: 'Menentukan target waktu pengiriman' },
    ],
  },
  {
    id: 'memilih-layanan',
    number: '2',
    title: 'Memilih layanan yang tepat',
    children: [
      { id: 'membandingkan-opsi', number: '2.1', title: 'Membandingkan opsi pengiriman' },
    ],
  },
  {
    id: 'kesimpulan',
    number: '3',
    title: 'Kesimpulan',
    children: [],
  },
] as const

const expandedSections = ref<string[]>(['memahami-kebutuhan', 'memilih-layanan'])
const activeSection = ref('memahami-kebutuhan')
const shareUrl = ref('')
const copied = ref(false)
let headingObserver: IntersectionObserver | undefined

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

async function copyArticleLink() {
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

  const headings = tableOfContents.flatMap(section => [
    document.getElementById(section.id),
    ...section.children.map(child => document.getElementById(child.id)),
  ]).filter((heading): heading is HTMLElement => Boolean(heading))

  headingObserver = new IntersectionObserver((entries) => {
    const visibleHeading = entries
      .filter(entry => entry.isIntersecting)
      .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0]

    if (visibleHeading?.target.id)
      activeSection.value = visibleHeading.target.id
  }, {
    rootMargin: '-90px 0px -62% 0px',
    threshold: [0, 1],
  })

  headings.forEach(heading => headingObserver?.observe(heading))
})

onBeforeUnmount(() => {
  headingObserver?.disconnect()
})
</script>

<template>
  <section class="bg-bg-0 py-10 sm:py-12 lg:py-16">
    <UiContainer>
      <nav aria-label="Breadcrumb" class="mx-auto max-w-[1080px]">
        <ol class="flex flex-wrap items-center gap-2 text-[11px] text-text-tertiary">
          <li>
            <NuxtLink to="/" class="transition-colors hover:text-primary-500">
              Home
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="13" :stroke-width="1.7" />
          </li>
          <li>
            <NuxtLink to="/blog" class="transition-colors hover:text-primary-500">
              Blog
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="13" :stroke-width="1.7" />
          </li>
          <li class="line-clamp-1 max-w-[260px] font-medium text-primary-500" aria-current="page">
            {{ props.title }}
          </li>
        </ol>
      </nav>

      <div class="mx-auto mt-8 grid max-w-[1080px] items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-6">
        <aside class="lg:sticky lg:top-[90px]">
          <div class="rounded-2xl border border-border-200 bg-white p-4 shadow-[0_3px_12px_rgba(15,23,42,0.04)]">
            <h2 class="text-[18px] font-medium text-primary-500">
              Daftar isi
            </h2>

            <ol class="mt-4 space-y-3">
              <li v-for="section in tableOfContents" :key="section.id">
                <div class="flex items-start gap-2">
                  <button
                    type="button"
                    class="grid min-w-0 flex-1 grid-cols-[22px_1fr] gap-2 text-left text-[12px] font-medium leading-[1.4] text-text-secondary transition-colors hover:text-primary-500"
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
                        class="grid w-full grid-cols-[26px_1fr] gap-2 rounded-lg px-2 py-2 text-left text-[11px] leading-[1.4] transition-colors"
                        :class="activeSection === child.id
                          ? 'bg-primary-50 text-primary-500'
                          : 'text-text-tertiary hover:bg-bg-100 hover:text-text-secondary'"
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
          </div>

          <div class="mt-4 hidden aspect-[4/5] overflow-hidden rounded-2xl bg-bg-200 lg:block">
            <img
              :src="props.sidebarImage"
              alt="Layanan pengiriman ETH Cargo"
              class="size-full object-cover"
            >
          </div>
        </aside>

        <article class="min-w-0 text-[13px] leading-[1.65] text-text-secondary sm:text-[14px]">
          <section class="overflow-hidden rounded-xl border border-border-200">
            <h2 class="bg-border-200 px-4 py-3 text-[14px] font-medium text-primary-500">
              Key Points
            </h2>
            <ul class="divide-y divide-border-200">
              <li class="flex gap-3 px-4 py-3">
                <span class="text-primary-500" aria-hidden="true">–</span>
                <span>Pahami karakter, volume, dan tingkat urgensi barang sebelum menentukan metode pengiriman.</span>
              </li>
              <li class="flex gap-3 bg-bg-100 px-4 py-3">
                <span class="text-primary-500" aria-hidden="true">–</span>
                <span>Bandingkan estimasi waktu, biaya, serta kebutuhan dokumen dari setiap pilihan layanan.</span>
              </li>
              <li class="flex gap-3 px-4 py-3">
                <span class="text-primary-500" aria-hidden="true">–</span>
                <span>Gunakan penyedia logistik yang transparan dan mampu menangani proses secara Door-to-Door.</span>
              </li>
            </ul>
          </section>

          <div class="mt-6 space-y-5">
            <p>
              Proses pengiriman internasional membutuhkan perencanaan yang matang agar barang tiba dengan aman, tepat waktu, dan sesuai anggaran. Setiap bisnis memiliki kebutuhan berbeda sehingga metode pengiriman perlu disesuaikan dengan karakter barang, volume, serta target waktu penerimaan.
            </p>
            <p>
              Melalui perencanaan yang tepat, pelaku usaha dapat mengurangi risiko keterlambatan, biaya tidak terduga, dan kendala kepabeanan. Transparansi informasi sejak awal juga membantu bisnis membuat keputusan yang lebih akurat sebelum barang diberangkatkan.
            </p>
          </div>

          <section class="mt-7 scroll-mt-28" id="memahami-kebutuhan">
            <h2 class="text-[20px] font-semibold text-text-secondary">
              1. Memahami kebutuhan pengiriman
            </h2>
            <p class="mt-3">
              Langkah pertama adalah memahami kebutuhan operasional bisnis secara menyeluruh. Catat jenis komoditas, jumlah koli, berat aktual, volume, nilai barang, serta jadwal barang tersebut harus tersedia di lokasi tujuan.
            </p>

            <section class="mt-6 scroll-mt-28" id="mengenali-karakter-barang">
              <h3 class="text-[16px] font-semibold text-text-secondary">
                1.1 Mengenali karakter dan kebutuhan barang
              </h3>
              <p class="mt-3">
                Barang umum, produk sensitif, cairan, baterai, dan mesin industri memerlukan perlakuan yang berbeda. Informasi yang lengkap membantu tim logistik menentukan jenis kemasan, dokumen, serta moda pengiriman yang paling aman.
              </p>
            </section>

            <section class="mt-6 scroll-mt-28" id="menentukan-target-pengiriman">
              <h3 class="text-[16px] font-semibold text-text-secondary">
                1.2 Menentukan target waktu pengiriman
              </h3>
              <p class="mt-3">
                Tentukan tenggat penerimaan barang sejak awal. Kargo udara cocok untuk kebutuhan mendesak, sedangkan jalur laut lebih ekonomis untuk muatan besar dengan perencanaan waktu yang lebih longgar.
              </p>
            </section>
          </section>

          <section class="mt-8 scroll-mt-28" id="memilih-layanan">
            <h2 class="text-[20px] font-semibold text-text-secondary">
              2. Memilih layanan yang tepat
            </h2>
            <p class="mt-3">
              Pemilihan layanan tidak hanya ditentukan oleh harga terendah. Pertimbangkan pula kepastian jadwal, keamanan penanganan, proses customs clearance, serta kejelasan biaya hingga barang diterima di alamat tujuan.
            </p>

            <section class="mt-6 scroll-mt-28" id="membandingkan-opsi">
              <h3 class="text-[16px] font-semibold text-text-secondary">
                2.1 Membandingkan opsi pengiriman
              </h3>
              <p class="mt-3">
                FCL memberikan kapasitas satu kontainer penuh, sementara LCL memungkinkan barang berbagi ruang dengan muatan lain. Untuk produk ringan atau mendesak, air cargo dapat menjadi pilihan yang lebih efektif meskipun struktur biayanya berbeda.
              </p>
              <ol class="mt-4 list-decimal space-y-1 pl-6">
                <li>Periksa estimasi waktu pengiriman setiap layanan.</li>
                <li>Bandingkan perhitungan berat aktual dan volume.</li>
                <li>Pastikan cakupan biaya dan proses kepabeanan jelas.</li>
                <li>Konfirmasi perlindungan barang selama perjalanan.</li>
              </ol>
            </section>
          </section>

          <section class="mt-8 scroll-mt-28" id="kesimpulan">
            <h2 class="text-[20px] font-semibold text-text-secondary">
              3. Kesimpulan
            </h2>
            <p class="mt-3">
              Keputusan pengiriman yang tepat berawal dari data barang yang lengkap dan tujuan bisnis yang jelas. Dengan pendampingan tim profesional, seluruh proses pengiriman dapat berjalan lebih transparan, aman, dan mudah dipantau.
            </p>
            <p class="mt-5">
              ETH Cargo menyediakan solusi pengiriman All-In Door-to-Door untuk membantu bisnis mengelola kebutuhan impor dan ekspor secara lebih efisien, mulai dari penjemputan, kepabeanan, hingga pengantaran akhir.
            </p>
          </section>

          <div class="mt-10 border-y border-border-200 py-4">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="mr-1 text-[12px] text-text-tertiary">Tag</span>
              <span class="h-px w-5 bg-border-200" aria-hidden="true" />
              <span
                v-for="tag in props.tags"
                :key="tag"
                class="rounded-md bg-primary-500 px-2.5 py-1 text-[11px] text-white"
              >
                {{ tag }}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
              <span class="mr-1 text-[12px] text-text-tertiary">Share</span>
              <span class="h-px w-5 bg-border-200" aria-hidden="true" />
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Facebook"
                class="text-text-secondary transition-colors hover:text-primary-500"
              >
                <Facebook :size="20" :stroke-width="1.8" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka Instagram"
                class="text-text-secondary transition-colors hover:text-primary-500"
              >
                <Instagram :size="20" :stroke-width="1.8" aria-hidden="true" />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka TikTok"
                class="text-text-secondary transition-colors hover:text-primary-500"
              >
                <Music2 :size="20" :stroke-width="1.8" aria-hidden="true" />
              </a>
              <a
                :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(props.title)}`"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke X"
                class="flex size-5 items-center justify-center text-[17px] font-medium text-text-secondary transition-colors hover:text-primary-500"
              >
                X
              </a>
              <button
                type="button"
                :aria-label="copied ? 'Tautan tersalin' : 'Salin tautan artikel'"
                class="relative text-text-secondary transition-colors hover:text-primary-500"
                @click="copyArticleLink"
              >
                <Link2 :size="20" :stroke-width="1.8" aria-hidden="true" />
                <span
                  v-if="copied"
                  class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white"
                >
                  Tersalin
                </span>
              </button>
            </div>
          </div>

          <section class="mt-6" aria-labelledby="related-articles-title">
            <h2 id="related-articles-title" class="text-[15px] font-medium text-primary-500">
              Related Article
            </h2>

            <div class="mt-4 grid gap-4 sm:grid-cols-3">
              <NuxtLink
                v-for="relatedArticle in props.relatedArticles"
                :key="relatedArticle.id"
                :to="relatedArticle.to || `/blog/${relatedArticle.id}`"
                class="group overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <div class="aspect-[16/9] overflow-hidden bg-bg-200">
                  <img
                    :src="relatedArticle.image"
                    :alt="relatedArticle.imageAlt"
                    class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  >
                </div>
                <div class="px-3 pb-3 pt-2.5">
                  <h3 class="line-clamp-1 text-[12px] text-text-secondary transition-colors group-hover:text-primary-500">
                    {{ relatedArticle.title }}
                  </h3>
                  <div class="mt-3 flex items-end justify-between gap-2">
                    <time class="text-[9px] text-text-tertiary">
                      {{ relatedArticle.releaseDate }}
                    </time>
                    <ArrowUpRight :size="15" class="text-primary-500" aria-hidden="true" />
                  </div>
                </div>
              </NuxtLink>
            </div>
          </section>
        </article>
      </div>
    </UiContainer>
  </section>
</template>
