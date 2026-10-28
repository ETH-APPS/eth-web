<script setup lang="ts">
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  FileText,
  Search,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'marketing',
  validate: route => {
    const letter = String(route.params.letter ?? '').toLowerCase()
    const slug = String(route.params.slug ?? '').toLowerCase()
    return Boolean(getGlossaryTerm(letter, slug))
  },
})

const route = useRoute()
const searchQuery = ref('')
const letterSlug = computed(() => String(route.params.letter ?? '').toLowerCase())
const termSlug = computed(() => String(route.params.slug ?? '').toLowerCase())
const activeGroup = computed(() => getGlossaryGroup(letterSlug.value))
const activeTerm = computed(() => getGlossaryTerm(letterSlug.value, termSlug.value))

if (!activeTerm.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Glossary term not found',
  })
}

const title = computed(() => activeTerm.value?.title ?? 'Istilah Pengiriman Kargo')
const relatedArticles = computed(() => (
  activeGroup.value?.terms
    .filter(term => term.id !== activeTerm.value?.id)
    .slice(0, 3) ?? []
))

const filteredRelatedArticles = computed(() => {
  const keyword = searchQuery.value.trim().toLocaleLowerCase('id-ID')

  if (!keyword)
    return relatedArticles.value

  return relatedArticles.value.filter(article => article.title.toLocaleLowerCase('id-ID').includes(keyword))
})

useSeoMeta({
  title: () => `${title.value} | Glossary ETH Cargo`,
  description: () => `Pelajari ${title.value} dan istilah pengiriman internasional lainnya bersama ETH Cargo.`,
})
</script>

<template>
  <section class="bg-bg-0 pb-20 pt-12">
    <UiContainer>
      <nav aria-label="Breadcrumb" class="mx-auto max-w-[1080px]">
        <ol class="flex items-center gap-2 text-[10px] font-normal text-text-tertiary">
          <li>
            <NuxtLink to="/" class="transition-colors hover:text-primary-500">
              Home
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="12" :stroke-width="1.7" />
          </li>
          <li>
            <NuxtLink to="/glossary" class="transition-colors hover:text-primary-500">
              Glossary
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="12" :stroke-width="1.7" />
          </li>
          <li class="line-clamp-1 max-w-[260px] font-medium text-primary-500" aria-current="page">
            {{ title }}
          </li>
        </ol>
      </nav>

      <div class="mx-auto mt-10 grid max-w-[1080px] grid-cols-[300px_minmax(0,1fr)] items-start gap-6">
        <aside>
          <h2 class="text-[20px] font-medium text-primary-500">
            Search Article
          </h2>

          <label class="relative mt-3 block">
            <span class="sr-only">Cari artikel glossary</span>
            <Search
              :size="16"
              :stroke-width="1.7"
              aria-hidden="true"
              class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Cari artikel"
              class="h-10 w-full rounded-full border border-border-300 bg-bg-0 pl-10 pr-4 text-[14px] font-normal text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:shadow-[0_0_0_3px_var(--color-primary-50)]"
            >
          </label>

          <div class="mt-4 rounded-xl border border-border-200 bg-bg-0 p-4 shadow-md">
            <h2 class="text-[20px] font-medium text-text-secondary">
              Related Article
            </h2>

            <ul v-if="filteredRelatedArticles.length" class="mt-3 space-y-2">
              <li v-for="article in filteredRelatedArticles" :key="article.id">
                <NuxtLink
                  :to="glossaryTermPath(article)"
                  class="group flex items-start gap-3 rounded-lg px-2 py-2.5 text-[16px] font-normal leading-[1.45] text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-500"
                >
                  <FileText
                    :size="14"
                    :stroke-width="1.7"
                    aria-hidden="true"
                    class="mt-0.5 shrink-0 text-text-tertiary group-hover:text-primary-500"
                  />
                  <span class="min-w-0 flex-1">{{ article.title }}</span>
                  <ArrowUpRight
                    :size="14"
                    :stroke-width="2"
                    aria-hidden="true"
                    class="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </NuxtLink>
              </li>
            </ul>
            <p v-else class="mt-4 text-[14px] font-normal text-text-tertiary">
              Artikel tidak ditemukan.
            </p>
          </div>

          <NuxtLink
            to="/glossary"
            class="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-primary-500"
          >
            <ArrowLeft :size="15" :stroke-width="1.8" aria-hidden="true" />
            <span>Back to Glossary</span>
          </NuxtLink>
        </aside>

        <article class="min-w-0 text-[14px] font-normal leading-[1.65] text-text-secondary">
          <h1 class="text-[38px] font-semibold leading-tight text-primary-500">
            {{ title }}
          </h1>

          <div class="mt-6 space-y-5">
            <p>
              {{ title }} adalah istilah yang digunakan dalam proses pengiriman dan pengelolaan logistik internasional. Pemahaman istilah ini membantu bisnis menentukan layanan, dokumen, serta estimasi biaya pengiriman yang sesuai.
            </p>
            <p>
              Setiap pengiriman memiliki kebutuhan berbeda berdasarkan jenis barang, ukuran, berat, tingkat urgensi, serta lokasi tujuan. Informasi yang lengkap sejak awal akan membantu proses pengiriman berjalan lebih aman dan transparan.
            </p>
          </div>

          <section class="mt-6">
            <h2 class="text-[14px] font-medium text-text-secondary">
              Hal penting yang perlu diperhatikan:
            </h2>
            <ol class="mt-3 list-decimal space-y-1 pl-6">
              <li>Kenali karakter dan kebutuhan penanganan barang.</li>
              <li>Hitung berat aktual dan volume barang.</li>
              <li>Pastikan dokumen pengiriman telah lengkap.</li>
              <li>Bandingkan biaya serta estimasi waktu pengiriman.</li>
            </ol>
          </section>

          <div class="mt-6 space-y-5">
            <p>
              Perencanaan yang tepat dapat mengurangi risiko keterlambatan dan biaya tambahan. Kejelasan rute, proses kepabeanan, dan cakupan layanan juga memudahkan bisnis mengendalikan operasional pengiriman.
            </p>
            <p>
              ETH Cargo menyediakan solusi All-In Door-to-Door dari China ke Indonesia, mulai dari penerimaan barang di gudang, pengurusan kepabeanan, hingga pengantaran ke alamat tujuan.
            </p>
          </div>

          <div class="mt-8 flex items-center gap-2 border-b border-border-200 pb-5">
            <span class="mr-1 text-[14px] font-normal text-text-tertiary">Tag</span>
            <span class="h-px w-5 bg-border-200" aria-hidden="true" />
            <span class="rounded-md bg-primary-500 px-2.5 py-1 text-[14px] font-normal text-bg-0">FCL Cargo</span>
            <span class="rounded-md bg-primary-500 px-2.5 py-1 text-[14px] font-normal text-bg-0">Sea Freight</span>
          </div>
        </article>
      </div>

      <footer class="mx-auto mt-8 grid max-w-[1080px] grid-cols-[300px_minmax(0,1fr)] gap-6">
        <div class="col-start-2 text-center">
          <p class="text-[16px] font-medium text-text-secondary">
            Temukan solusi pengiriman yang sesuai untuk kebutuhan bisnis Anda.
          </p>
          <NuxtLink
            to="/calculator"
            class="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 text-center text-[16px] font-medium text-bg-0 transition-colors hover:bg-primary-600"
          >
            <span>Get a Quote</span>
            <ArrowUpRight :size="15" :stroke-width="2" aria-hidden="true" />
          </NuxtLink>
        </div>
      </footer>
    </UiContainer>
  </section>
</template>
