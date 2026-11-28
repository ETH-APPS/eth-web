<script setup lang="ts">
import { Eye, Plus, Search, X } from 'lucide-vue-next'
import type { ArticleBanner } from '#shared/types/article'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Banner | ETH Cargo CMS' })

const { banners, isLoading, loadError, reloadBanners } = useArticleBanners()
const search = ref('')
const previewBanner = shallowRef<ArticleBanner>()
const previewDialog = useTemplateRef<HTMLDialogElement>('previewDialog')

const searchTerm = computed(() => search.value.trim().toLocaleLowerCase('id'))
const visibleBanners = computed(() => (
  banners.value.filter(banner => banner.title.toLocaleLowerCase('id').includes(searchTerm.value))
))

function openPreview(banner: ArticleBanner) {
  previewBanner.value = banner
  previewDialog.value?.showModal()
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-[11px] font-semibold tracking-[0.16em] text-primary-500">MANAJEMEN KONTEN</p>
        <h1 class="mt-2 text-[28px] leading-tight font-semibold tracking-[-0.04em] text-text-secondary sm:text-[32px]">Banner</h1>
        <p class="mt-2 text-[13px] leading-6 text-text-tertiary">Kelola banner yang dapat digunakan di halaman artikel.</p>
      </div>
      <NuxtLink to="/articles/banners/create" class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-500 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
        <Plus :size="15" aria-hidden="true" /> Buat banner
      </NuxtLink>
    </header>

    <section class="min-w-0 overflow-hidden rounded-xl border border-border-200 bg-bg-0" aria-labelledby="banner-list-title">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border-200 px-4 py-4 sm:px-6">
        <div>
          <h2 id="banner-list-title" class="text-[15px] font-semibold text-text-secondary">Daftar banner</h2>
          <p v-if="!isLoading && (!loadError || banners.length)" class="mt-1 text-[12px] text-text-tertiary">
            {{ banners.length }} banner tersedia
          </p>
        </div>
        <label v-if="banners.length" class="flex min-h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-border-200 px-3 focus-within:border-primary-500 sm:w-60">
          <Search :size="15" class="shrink-0 text-text-tertiary" aria-hidden="true" />
          <span class="sr-only">Cari judul banner</span>
          <input v-model="search" type="search" maxlength="180" placeholder="Cari judul banner..." class="min-w-0 flex-1 bg-transparent text-[12px] text-text-secondary outline-none placeholder:text-text-tertiary">
        </label>
      </div>

      <div v-if="isLoading" role="status" class="px-5 py-10 text-center text-[13px] text-text-tertiary">Memuat banner...</div>
      <div v-else-if="loadError && !banners.length" class="px-5 py-10 text-center">
        <p class="text-[13px] text-text-secondary">Daftar banner belum dapat dimuat.</p>
        <button type="button" class="mt-2 min-h-11 rounded px-3 text-[13px] font-semibold text-primary-500 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-primary-500" @click="reloadBanners()">Coba lagi</button>
      </div>
      <p v-else-if="!banners.length" class="px-5 py-10 text-center text-[13px] text-text-tertiary">Belum ada banner. Pilih Buat banner untuk menambahkan banner pertama.</p>
      <p v-else-if="!visibleBanners.length" role="status" class="px-5 py-10 text-center text-[13px] text-text-tertiary">Tidak ada banner yang cocok dengan pencarian.</p>

      <table v-else class="w-full table-fixed border-collapse text-left">
        <thead class="border-b border-border-200 bg-bg-100 text-[10px] font-semibold tracking-[0.08em] text-text-tertiary uppercase">
          <tr>
            <th scope="col" class="px-4 py-3 sm:px-6">Banner</th>
            <th scope="col" class="w-16 px-2 py-3 text-right sm:w-36 sm:px-6"><span class="sr-only sm:not-sr-only">Pratinjau</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-200">
          <tr v-for="banner in visibleBanners" :key="banner.id">
            <td class="px-4 py-3 sm:px-6">
              <div class="flex min-w-0 items-center gap-3">
                <img :src="banner.image.url" alt="" width="80" height="56" loading="lazy" class="h-11 w-12 shrink-0 rounded-md bg-bg-100 object-contain sm:h-14 sm:w-20">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p class="wrap-anywhere text-[13px] font-semibold text-text-secondary">{{ banner.title }}</p>
                    <span v-if="banner.isDefault" class="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-800">Default</span>
                  </div>
                  <p class="mt-0.5 line-clamp-2 wrap-anywhere text-[11px] leading-relaxed text-text-tertiary">{{ banner.description }}</p>
                </div>
              </div>
            </td>
            <td class="px-2 py-2 text-right sm:px-6">
              <button type="button" :aria-label="'Pratinjau ' + banner.title" class="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg text-[12px] font-medium text-text-tertiary transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" @click="openPreview(banner)">
                <Eye :size="16" aria-hidden="true" /> <span class="hidden sm:inline">Pratinjau</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <dialog ref="previewDialog" aria-labelledby="saved-banner-dialog-title" class="m-auto max-h-[calc(100dvh-2rem)] w-[min(94vw,820px)] overflow-y-auto rounded-xl border border-border-200 bg-bg-0 p-0 shadow-xl backdrop:bg-black/40" @close="previewBanner = undefined">
      <div class="flex items-center justify-between gap-3 border-b border-border-200 px-4 py-2 sm:px-6">
        <h2 id="saved-banner-dialog-title" class="text-[16px] font-semibold text-text-secondary">Pratinjau banner</h2>
        <button type="button" aria-label="Tutup pratinjau" class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-primary-500" autofocus @click="previewDialog?.close()">
          <X :size="18" aria-hidden="true" />
        </button>
      </div>
      <div v-if="previewBanner" class="p-3 sm:p-6">
        <CmsBannerPreview :title="previewBanner.title" :description="previewBanner.description" :image="previewBanner.image" />
      </div>
    </dialog>
  </div>
</template>
