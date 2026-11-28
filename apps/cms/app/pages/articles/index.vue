<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Artikel | ETH Cargo CMS' })

const {
  articles,
  pagination,
  categories,
  page,
  search,
  category,
  applyFilters,
  refresh,
  isLoading,
  isFetching,
  error,
} = useArticles()

const searchInput = ref(search.value)
const categoryInput = ref(category.value)

function submitFilters() {
  applyFilters({ search: searchInput.value, category: categoryInput.value })
}

function clearFilters() {
  searchInput.value = ''
  categoryInput.value = ''
  applyFilters({ search: '', category: '' })
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value))
}

const firstItem = computed(() => pagination.value.total ? ((pagination.value.page - 1) * pagination.value.limit) + 1 : 0)
const lastItem = computed(() => Math.min(pagination.value.page * pagination.value.limit, pagination.value.total))
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-500">MANAJEMEN KONTEN</p>
        <h1 class="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-text-secondary sm:text-[32px]">Artikel</h1>
        <p class="mt-2 text-[13px] leading-6 text-text-tertiary">Tulis, kelola, dan publikasikan insight ETH Cargo dari satu tempat.</p>
      </div>
      <NuxtLink to="/articles/create" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
        <span aria-hidden="true" class="text-lg leading-none">+</span> Tulis artikel
      </NuxtLink>
    </header>

    <section class="grid grid-cols-1 overflow-hidden rounded-xl border border-border-200 bg-bg-0 sm:grid-cols-2" aria-label="Ringkasan artikel">
      <div class="border-b border-border-200 px-5 py-4 sm:border-r sm:border-b-0 sm:px-6">
        <p class="text-[11px] text-text-tertiary">Total artikel terbit</p>
        <p class="mt-1 text-[24px] font-semibold leading-none text-text-secondary">{{ pagination.total }}</p>
      </div>
      <div class="px-5 py-4 sm:px-6">
        <p class="text-[11px] text-text-tertiary">Kategori tersedia</p>
        <p class="mt-1 text-[24px] font-semibold leading-none text-primary-500">{{ categories.length }}</p>
      </div>
    </section>

    <section class="overflow-hidden rounded-xl border border-border-200 bg-bg-0" aria-labelledby="article-list-title">
      <div class="border-b border-border-200 px-5 py-5 sm:px-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="article-list-title" class="text-[16px] font-semibold text-text-secondary">Daftar artikel</h2>
            <p class="mt-1 text-[12px] text-text-tertiary">Diurutkan berdasarkan artikel terbaru.</p>
          </div>
          <span v-if="isFetching && !isLoading" class="text-[11px] font-medium text-primary-500">Memperbarui...</span>
        </div>

        <form class="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]" @submit.prevent="submitFilters">
          <label class="flex min-h-11 items-center gap-2 rounded-lg border border-border-200 px-3 focus-within:border-primary-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-4 shrink-0 text-text-disable" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path stroke-linecap="round" d="m16 16 4.5 4.5" /></svg>
            <input v-model="searchInput" type="search" maxlength="200" placeholder="Cari judul atau tag..." class="min-w-0 flex-1 bg-transparent text-[12px] text-text-secondary outline-none placeholder:text-text-disable">
          </label>
          <label>
            <span class="sr-only">Filter kategori</span>
            <select v-model="categoryInput" class="min-h-11 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[12px] text-text-secondary outline-none focus:border-primary-500">
              <option value="">Semua kategori</option>
              <option v-for="item in categories" :key="item.id" :value="item.slug">{{ item.name }}</option>
            </select>
          </label>
          <div class="flex gap-2">
            <button type="submit" class="min-h-11 flex-1 rounded-lg bg-primary-500 px-5 text-[12px] font-semibold text-white hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:flex-none">Terapkan</button>
            <button v-if="search || category" type="button" class="min-h-11 rounded-lg px-3 text-[12px] font-semibold text-text-tertiary hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="clearFilters">Reset</button>
          </div>
        </form>
      </div>

      <div v-if="isLoading" class="space-y-3 px-5 py-8 sm:px-6" aria-live="polite" aria-label="Memuat artikel">
        <div v-for="index in 5" :key="index" class="h-16 animate-pulse rounded-lg bg-bg-100" />
      </div>

      <div v-else-if="error" class="px-5 py-12 text-center sm:px-6">
        <h3 class="text-[16px] font-semibold text-text-secondary">Daftar artikel belum dapat dimuat</h3>
        <p class="mt-2 text-[12px] text-text-tertiary">Pastikan API berjalan, lalu coba kembali.</p>
        <button type="button" class="mt-5 min-h-11 rounded-lg border border-primary-500 px-5 text-[12px] font-semibold text-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" @click="refresh()">Coba lagi</button>
      </div>

      <div v-else-if="!articles.length" class="px-5 py-12 text-center sm:px-6">
        <h3 class="text-[16px] font-semibold text-text-secondary">Belum ada artikel yang ditemukan</h3>
        <p class="mt-2 text-[12px] text-text-tertiary">Ubah pencarian atau mulai tulis artikel baru.</p>
        <button v-if="search || category" type="button" class="mt-5 min-h-11 rounded-lg border border-primary-500 px-5 text-[12px] font-semibold text-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" @click="clearFilters">Hapus filter</button>
      </div>

      <template v-else>
        <ul class="divide-y divide-border-200 xl:hidden">
          <li v-for="article in articles" :key="article.id" class="p-5 sm:p-6">
            <div class="flex min-w-0 gap-3">
              <img :src="article.cover.url" :alt="article.coverImageAlt" width="88" height="56" class="h-14 w-[88px] shrink-0 rounded-lg object-cover">
              <div class="min-w-0">
                <h3 class="text-[13px] font-semibold leading-5 text-text-secondary">{{ article.title }}</h3>
                <p class="mt-1 truncate text-[11px] text-text-disable">/artikel/{{ article.slug }}</p>
              </div>
            </div>
            <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
              <div><dt class="text-text-disable">Kategori</dt><dd class="mt-1 font-medium text-text-secondary">{{ article.category.name }}</dd></div>
              <div><dt class="text-text-disable">Penulis</dt><dd class="mt-1 font-medium text-text-secondary">{{ article.author.name }}</dd></div>
              <div><dt class="text-text-disable">Diperbarui</dt><dd class="mt-1 text-text-tertiary">{{ formatDate(article.updatedAt) }}</dd></div>
              <div><dt class="text-text-disable">Status</dt><dd class="mt-1"><span class="rounded-full bg-[#edf8f2] px-2.5 py-1 font-medium text-[#25864d]">Terbit</span></dd></div>
            </dl>
          </li>
        </ul>

        <div class="hidden overflow-x-auto xl:block">
          <table class="w-full min-w-[860px] border-collapse text-left">
            <thead class="border-b border-border-200 bg-bg-100 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-disable">
              <tr>
                <th class="px-6 py-3">Artikel</th>
                <th class="px-5 py-3">Kategori</th>
                <th class="px-5 py-3">Penulis</th>
                <th class="px-5 py-3">Diperbarui</th>
                <th class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border-200">
              <tr v-for="article in articles" :key="article.id">
                <td class="px-6 py-3">
                  <div class="flex min-w-0 items-center gap-3">
                    <img :src="article.cover.url" :alt="article.coverImageAlt" width="88" height="56" class="h-14 w-[88px] shrink-0 rounded-lg object-cover">
                    <div class="min-w-0">
                      <p class="line-clamp-2 text-[12px] font-semibold leading-5 text-text-secondary">{{ article.title }}</p>
                      <p class="mt-0.5 truncate text-[10px] text-text-disable">/artikel/{{ article.slug }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3"><span class="rounded-full bg-bg-100 px-2.5 py-1 text-[10px] text-text-tertiary">{{ article.category.name }}</span></td>
                <td class="px-5 py-3 text-[11px] text-text-tertiary">{{ article.author.name }}</td>
                <td class="whitespace-nowrap px-5 py-3 text-[11px] text-text-tertiary">{{ formatDate(article.updatedAt) }}</td>
                <td class="px-6 py-3"><span class="rounded-full bg-[#edf8f2] px-2.5 py-1 text-[10px] font-medium text-[#25864d]">Terbit</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="flex flex-wrap items-center justify-between gap-3 border-t border-border-200 px-5 py-4 text-[11px] text-text-tertiary sm:px-6">
          <p>Menampilkan {{ firstItem }}–{{ lastItem }} dari {{ pagination.total }} artikel</p>
          <div class="flex items-center gap-2">
            <button type="button" :disabled="page <= 1 || isFetching" class="min-h-10 rounded-lg border border-border-200 px-3 font-semibold text-text-secondary hover:border-primary-500 disabled:cursor-not-allowed disabled:opacity-40" @click="page--">Sebelum</button>
            <span class="min-w-16 text-center">{{ pagination.page }} / {{ Math.max(pagination.totalPages, 1) }}</span>
            <button type="button" :disabled="page >= pagination.totalPages || isFetching" class="min-h-10 rounded-lg border border-border-200 px-3 font-semibold text-text-secondary hover:border-primary-500 disabled:cursor-not-allowed disabled:opacity-40" @click="page++">Berikutnya</button>
          </div>
        </footer>
      </template>
    </section>
  </div>
</template>
