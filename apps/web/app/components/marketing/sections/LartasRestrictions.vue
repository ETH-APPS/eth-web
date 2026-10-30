<script setup lang="ts">
import {
  ArrowUpRight,
  TriangleAlert,
  X,
} from 'lucide-vue-next'

const prohibitedGroups = [
  {
    title: 'Narkotika & Bahan Berbahaya',
    items: [
      'Narkotika, psikotropika, & obat terlarang',
      'Bahan kimia beracun & berbahaya',
      'Prekursor & zat adiktif',
      'Limbah B3 (Bahan Berbahaya Beracun)',
    ],
  },
  {
    title: 'Senjata & Bahan Peledak',
    items: [
      'Senjata api, replika, & amunisi',
      'Bahan peledak & kembang api',
      'Senjata tajam militer & alat pertahanan',
      'Gas bertekanan tanpa izin',
    ],
  },
  {
    title: 'Barang Ilegal & Media Melanggar Hukum',
    items: [
      'Mata uang, uang kertas palsu, & surat berharga',
      'Barang bajakan, tiruan, & pelanggaran hak cipta',
      'Materi pornografi & media terlarang',
      'Satwa liar dilindungi & produk olahannya',
    ],
  },
] as const

const restrictedGroups = [
  {
    title: 'Kosmetik & Skincare',
    items: [
      'Produk perawatan kulit & tubuh',
      'Krim, losion, & cairan kosmetik',
      'Suplemen kesehatan & obat bebas',
    ],
    note: 'Wajib memiliki izin edar/notifikasi BPOM',
  },
  {
    title: 'Makanan & Minuman Olahan',
    items: [
      'Produk makanan kemasan & snack',
      'Minuman botol & serbuk instan',
      'Bahan pangan segar/beku',
    ],
    note: 'Wajib melampirkan dokumen BPOM / PIRT',
  },
  {
    title: 'Elektronik & Perangkat Wireless',
    items: [
      'Smartphone, tablet, & gawai',
      'Perangkat komunikasi jaringan',
      'Baterai lithium & powerbank',
    ],
    note: 'Wajib sertifikasi SDPPI / Postel',
  },
] as const
</script>

<template>
  <section
    id="restricted-cargo-categories"
    aria-labelledby="restricted-cargo-categories-title"
    class="bg-bg-0 py-16 sm:py-20"
  >
    <UiContainer>
      <header class="text-center">
        <h2
          id="restricted-cargo-categories-title"
          class="text-[24px] font-semibold leading-tight text-primary-500"
        >
          Ketentuan Barang Dilarang & Pembatasan (Lartas)
        </h2>
        <p class="mx-auto mt-6 max-w-[850px] text-[20px] leading-[1.45] text-text-tertiary">
          Demi menjamin keamanan, kepatuhan hukum, dan kelancaran proses customs<br class="hidden lg:inline">
          clearance di pelabuhan/bandara, ETH Cargo memberlakukan regulasi ketat terkait jenis<br class="hidden lg:inline">
          komoditas yang dapat dikirimkan. Pastikan barang Anda tidak termasuk dalam kategori<br class="hidden lg:inline">
          di bawah ini sebelum menghitung estimasi biaya.
        </p>
      </header>

      <div class="mx-auto mt-10 grid max-w-[760px] grid-cols-1 items-start gap-8 md:grid-cols-[1.2fr_0.9fr]">
        <article class="overflow-hidden rounded-2xl border border-error-600 bg-bg-0">
          <header class="flex h-12 items-center gap-2 bg-error-600 px-4 text-bg-0">
            <X :size="22" :stroke-width="2.2" aria-hidden="true" />
            <h3 class="text-[20px] font-semibold">
              Barang yang Dilarang
            </h3>
          </header>

          <div class="space-y-12 px-6 pb-5 pt-4">
            <section v-for="group in prohibitedGroups" :key="group.title">
              <h4 class="text-[16px] font-semibold text-error-700">
                {{ group.title }}
              </h4>
              <ul class="mt-2 list-disc space-y-2 pl-5 text-[14px] leading-[1.45] text-text-secondary">
                <li v-for="item in group.items" :key="item">
                  {{ item }}
                </li>
              </ul>
            </section>

            <p class="text-center text-[12px] leading-[1.5] text-text-tertiary">
              Mutlak tidak dapat diproses melalui jalur pengiriman logistik
              ETH Cargo.
            </p>
          </div>
        </article>

        <article class="overflow-hidden rounded-2xl border border-warning-400 bg-bg-0">
          <header class="flex h-12 items-center gap-2 bg-warning-400 px-4 text-text-secondary">
            <TriangleAlert :size="21" :stroke-width="2" aria-hidden="true" />
            <h3 class="text-[20px] font-semibold lg:text-[16px]">
              Barang yang Dibatasi
            </h3>
          </header>

          <div class="space-y-14 px-4 pb-7 pt-4">
            <section v-for="group in restrictedGroups" :key="group.title">
              <h4 class="text-[16px] font-semibold text-amber-700">
                {{ group.title }}
              </h4>
              <ul class="mt-2 list-disc space-y-2 pl-5 text-[14px] leading-[1.45] text-text-secondary">
                <li v-for="item in group.items" :key="item">
                  {{ item }}
                </li>
              </ul>
              <p class="mt-8 text-center text-[12px] leading-[1.5] text-text-tertiary">
                {{ group.note }}
              </p>
            </section>
          </div>
        </article>
      </div>

      <footer class="mt-12 text-center">
        <p class="text-[16px] text-text-tertiary">
          Butuh Daftar Lengkap Komoditas Lartas? Unduh Dokumen Di Sini!
        </p>
        <button
          type="button"
          class="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-primary-500 px-5 text-[14px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        >
          <span>Download Full Document</span>
          <ArrowUpRight :size="16" :stroke-width="2" aria-hidden="true" />
        </button>
      </footer>
    </UiContainer>
  </section>
</template>
