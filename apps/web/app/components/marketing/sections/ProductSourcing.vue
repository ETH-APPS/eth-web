<script setup lang="ts">
import { ChevronDown, ChevronRight, ChevronsDown, Mail, Search } from 'lucide-vue-next'
import logo1688 from '~/assets/images/brand/1688.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoTmall from '~/assets/images/brand/tmall.png'
import logoAliexpress from '~/assets/images/brand/aliexpress.png'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'
import { productCategories } from '~/constants/productCategories'
import type { Product, ProductSearchResult, ProductSource } from '../../../../shared/types/products'

const marketplaces = [
  { name: '1688', logo: logo1688 },
  { name: 'Taobao', logo: logoTaobao },
  { name: 'Alibaba', logo: logoAlibaba },
  { name: 'Tmall', logo: logoTmall },
  { name: 'AliExpress', logo: logoAliexpress },
]
const productSourcingBanner = illustratedCtaBanners.productSourcing
const MAX_PRODUCTS = 6
const searchQuery = ref('')
const selectedSource = ref<ProductSource>('1688')
const selectedCategory = ref<string | null>(null)
const activeCategory = computed(() => productCategories.find(category => category.name === selectedCategory.value))
const displayedKeyword = ref('')
const showAdditionalProducts = ref(false)

const { data: initialData, error: initialError, pending: initialPending } = await useFetch<ProductSearchResult>('/api/products/search', {
  query: { source: '1688', page_no: 1, page_size: MAX_PRODUCTS },
  key: 'home-products-default-1688-six',
})

const products = ref<Product[]>(initialData.value?.products.slice(0, MAX_PRODUCTS) ?? [])
const hasSearched = ref(false)
const loading = ref(false)
const errorMessage = ref(initialError.value ? 'Produk belum dapat dimuat. Coba lagi.' : '')
let requestSequence = 0
let activeController: AbortController | null = null

function showCategoryOnHover(name: string, event: PointerEvent) {
  if (event.pointerType !== 'touch') selectedCategory.value = name
}

function selectCategory(name: string, event: MouseEvent) {
  const pointerType = (event as PointerEvent).pointerType
  selectedCategory.value = pointerType === 'mouse'
    ? name
    : selectedCategory.value === name ? null : name
}

function closeCategoryOnPointerLeave(event: PointerEvent) {
  if (event.pointerType !== 'touch') selectedCategory.value = null
}

function closeCategoryOnBlur(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null))
    selectedCategory.value = null
}

function selectKeyword(keyword: string) {
  selectedCategory.value = null
  void runSearch(keyword)
}

async function runSearch(keyword = searchQuery.value) {
  const term = keyword.trim()

  activeController?.abort()
  const controller = new AbortController()
  activeController = controller
  const sequence = ++requestSequence
  searchQuery.value = term
  displayedKeyword.value = term
  hasSearched.value = Boolean(term)
  products.value = []
  showAdditionalProducts.value = false
  errorMessage.value = ''
  loading.value = true

  try {
    const result = await $fetch<ProductSearchResult>('/api/products/search', {
      query: { source: selectedSource.value, ...(term ? { keyword: term } : {}), page_no: 1, page_size: MAX_PRODUCTS },
      signal: controller.signal,
    })
    if (sequence !== requestSequence) return
    products.value = result.products.slice(0, MAX_PRODUCTS)
  }
  catch {
    if (sequence === requestSequence)
      errorMessage.value = 'Produk belum dapat dimuat. Coba lagi.'
  }
  finally {
    if (sequence === requestSequence) loading.value = false
  }
}

onBeforeUnmount(() => activeController?.abort())
</script>

<template>
  <section id="sourcing" aria-labelledby="product-sourcing-title" class="bg-white py-12 lg:py-16">
    <UiContainer>
      <div class="text-center">
        <h2 id="product-sourcing-title" class="text-[28px] font-semibold leading-tight text-primary-500 lg:text-[32px]">
          Temukan Produk Supplier China Langsung di Sini
        </h2>
        <p class="mx-auto mt-4 max-w-[850px] text-[14px] leading-relaxed text-text-secondary md:text-[18px] lg:mt-6 lg:text-[20px]">
          Sourcing produk langsung dari pabrik dan supplier tangan pertama di China. Cukup tempel link barang untuk hitung estimasi biaya sampai ke gudang Anda.
        </p>
      </div>

      <div class="mx-auto mt-8 grid max-w-[1120px] grid-cols-1 items-start gap-6 lg:mt-12 lg:grid-cols-[200px_minmax(0,1fr)_150px] xl:grid-cols-[220px_minmax(0,1fr)_170px] lg:gap-5" @pointerleave="closeCategoryOnPointerLeave" @focusout="closeCategoryOnBlur" @keydown.esc="selectedCategory = null">
        <aside aria-labelledby="product-category-title" class="min-w-0 rounded-2xl border bg-white px-4 py-4 lg:shadow-none" :class="activeCategory ? 'border-primary-500' : 'border-border-200'">
          <h3 id="product-category-title" class="text-[16px] font-semibold text-text-secondary lg:text-[17px]">Kategori Produk</h3>
          <ul class="mt-3 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] lg:block lg:space-y-1 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            <li v-for="category in productCategories" :key="category.name" class="shrink-0 lg:w-full">
              <button
                type="button"
                :aria-expanded="selectedCategory === category.name"
                aria-controls="category-keywords"
                class="flex min-h-11 w-full items-center justify-between gap-2 whitespace-nowrap text-left text-[12px] leading-5 text-text-secondary hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:min-h-8 lg:whitespace-normal lg:text-[14px]"
                :class="selectedCategory === category.name ? 'text-primary-500' : ''"
                @pointerenter="showCategoryOnHover(category.name, $event)"
                @click="selectCategory(category.name, $event)"
              >
                <span>{{ category.name }}</span>
                <ChevronRight v-if="selectedCategory === category.name" :size="16" class="hidden shrink-0 lg:block" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </aside>

        <div class="relative min-w-0">
          <div v-if="activeCategory" id="category-keywords" class="absolute inset-x-0 top-0 z-20 max-h-[420px] min-w-0 overflow-y-auto rounded-2xl border border-primary-500 bg-white p-4 shadow-lg lg:max-h-none lg:overflow-visible lg:px-5 lg:py-4">
            <h3 class="text-[16px] font-semibold uppercase text-text-secondary">{{ activeCategory.name }}</h3>
            <ul class="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-flow-col lg:grid-rows-10 lg:gap-x-12">
              <li v-for="keyword in activeCategory.keywords" :key="keyword" class="min-w-0">
                <button type="button" class="min-h-11 w-full rounded-md px-1 text-left text-[13px] text-text-secondary hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:min-h-9 lg:text-[14px]" @click="selectKeyword(keyword)">
                  {{ keyword }}
                </button>
              </li>
            </ul>
          </div>

          <form class="grid grid-cols-[auto_minmax(0,1fr)_44px] items-center gap-2" @submit.prevent="runSearch()">
            <label for="product-marketplace" class="sr-only">Pilih marketplace</label>
            <div class="relative flex min-h-11 items-center text-primary-500">
              <select id="product-marketplace" v-model="selectedSource" name="marketplace" class="h-11 max-w-[84px] cursor-pointer appearance-none bg-transparent pr-4 text-[14px] font-medium outline-none focus-visible:outline-2 focus-visible:outline-primary-500 md:max-w-none md:text-[16px]" @change="runSearch()">
                <option value="1688">1688</option>
                <option value="taobao">Taobao</option>
              </select>
              <ChevronDown :size="15" class="pointer-events-none absolute right-0" aria-hidden="true" />
            </div>
            <label for="product-search" class="sr-only">Cari nama produk</label>
            <input
              id="product-search"
              v-model="searchQuery"
              name="product-search"
              type="search"
              maxlength="100"
              placeholder="Tempel link produk atau ketik nama barang..."
              class="h-11 min-w-0 rounded-xl border border-border-200 bg-white px-3 text-[14px] text-text-secondary outline-none placeholder:text-text-tertiary focus:border-primary-300 focus:ring-2 focus:ring-primary-50 md:text-[16px]"
            >
            <button type="submit" aria-label="Cari produk" class="grid size-11 place-items-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
              <Search :size="20" aria-hidden="true" />
            </button>
          </form>

          <p class="mt-3 text-[12px] leading-5 text-text-secondary">
            *Anda bisa menempelkan link produk dari <span class="font-semibold text-[#ff4b14]">1688</span>, <span class="font-semibold text-[#ff4b14]">TaoBao</span>, <span class="font-semibold text-black">Aliexpress</span>, <span class="font-semibold text-[#ff4b14]">Alibaba</span> dan <span class="font-semibold text-primary-500">Tmall</span>.
          </p>
          <p v-if="hasSearched" class="mt-2 text-[12px] text-text-secondary" aria-live="polite">Pencarian Anda: <strong>“{{ displayedKeyword }}”</strong> di {{ selectedSource === '1688' ? '1688' : 'Taobao' }}</p>

          <div v-if="loading || initialPending" class="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3" aria-live="polite" aria-label="Sedang memuat produk">
            <div v-for="index in 3" :key="index" class="animate-pulse" :class="index === 3 ? 'hidden lg:block' : ''">
              <div class="aspect-square rounded-2xl bg-primary-50" />
              <div class="mt-3 h-4 rounded bg-primary-50" />
              <div class="mt-2 h-4 w-2/3 rounded bg-primary-50" />
            </div>
          </div>
          <div v-else-if="errorMessage" class="mt-5 rounded-2xl border border-border-200 p-5 text-center">
            <p class="text-[14px] text-text-secondary" role="alert">{{ errorMessage }}</p>
            <button type="button" class="mt-3 min-h-11 rounded-xl px-4 font-medium text-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500" @click="runSearch()">Coba lagi</button>
          </div>
          <p v-else-if="hasSearched && products.length === 0" class="mt-5 rounded-2xl border border-border-200 p-6 text-center text-[14px] text-text-secondary">Belum ada produk untuk pencarian ini. Coba kata lain.</p>
          <template v-else-if="products.length > 0">
            <div id="sourcing-products" class="mt-5 grid grid-cols-2 gap-x-3 gap-y-7 md:gap-x-4 lg:grid-cols-3">
              <MarketingProductCard
                v-for="(product, index) in products.slice(0, 3)"
                :key="`${selectedSource}-${product.id}`"
                :title="product.title"
                :price-idr="product.priceIdr"
                :image="product.image"
                :detail-url="product.detailUrl"
                :class="index === 2 ? 'hidden lg:block' : ''"
              />
            </div>
            <div
              id="additional-sourcing-products"
              class="grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none"
              :class="showAdditionalProducts ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
              :aria-hidden="!showAdditionalProducts"
              :inert="!showAdditionalProducts"
            >
              <div class="min-h-0 overflow-hidden">
                <div class="mt-7 grid grid-cols-2 gap-x-3 gap-y-7 md:gap-x-4 lg:grid-cols-3">
                  <MarketingProductCard
                    v-for="(product, index) in products.slice(2, MAX_PRODUCTS)"
                    :key="`${selectedSource}-more-${product.id}`"
                    :title="product.title"
                    :price-idr="product.priceIdr"
                    :image="product.image"
                    :detail-url="product.detailUrl"
                    :class="index === 0 ? 'lg:hidden' : ''"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>

        <aside aria-labelledby="marketplace-title" class="min-w-0">
          <h3 id="marketplace-title" class="text-center text-[16px] font-semibold text-text-tertiary">Marketplace</h3>
          <ul class="mt-4 flex gap-5 overflow-x-auto pb-2 lg:block lg:space-y-4 lg:overflow-visible lg:pb-0">
            <li v-for="marketplace in marketplaces" :key="marketplace.name" class="flex h-14 w-28 shrink-0 items-center justify-center lg:w-auto">
              <img :src="marketplace.logo" :alt="marketplace.name" loading="lazy" class="max-h-12 max-w-full object-contain lg:max-w-[140px]">
            </li>
          </ul>
        </aside>
      </div>

      <div
        v-if="products.length > 2"
        class="grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none"
        :class="showAdditionalProducts ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'"
        :aria-hidden="showAdditionalProducts"
        :inert="showAdditionalProducts"
      >
        <div class="min-h-0 overflow-hidden">
          <button
            type="button"
            aria-controls="additional-sourcing-products"
            :aria-expanded="showAdditionalProducts"
            class="mx-auto mt-6 flex min-h-11 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:hidden"
            @click="showAdditionalProducts = true"
          >
            Lebih Banyak <ChevronsDown :size="18" aria-hidden="true" />
          </button>
          <button
            v-if="products.length > 3"
            type="button"
            aria-controls="additional-sourcing-products"
            :aria-expanded="showAdditionalProducts"
            class="mx-auto mt-6 hidden min-h-11 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:flex"
            @click="showAdditionalProducts = true"
          >
            Lebih Banyak <ChevronsDown :size="18" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        class="grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none"
        :class="showAdditionalProducts ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        :aria-hidden="!showAdditionalProducts"
        :inert="!showAdditionalProducts"
      >
        <div class="min-h-0 overflow-hidden">
          <MarketingIllustratedCtaBanner
            v-bind="productSourcingBanner"
            class="mt-10"
            variant="background"
            image-alt="Ilustrasi layanan impor dan sourcing produk dari China"
          />
          <div class="mt-8 overflow-hidden rounded-3xl bg-linear-to-r from-[#a52832] to-[#8d2930] p-6 text-white lg:hidden">
            <h3 class="text-[20px] font-bold leading-tight">{{ productSourcingBanner.title }}</h3>
            <p class="mt-3 text-[13px] font-medium leading-relaxed">{{ productSourcingBanner.description }}</p>
            <p class="mt-5 text-[12px] font-semibold">Atau hubungi kami via email:</p>
            <a :href="`mailto:${productSourcingBanner.email}`" class="mt-1 inline-flex items-center gap-2 text-[12px] break-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Mail :size="14" class="shrink-0" aria-hidden="true" />
              {{ productSourcingBanner.email }}
            </a>
            <a :href="productSourcingBanner.ctaTo" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-green-500 px-4 text-[13px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              {{ productSourcingBanner.ctaLabel }}
              <UiWhatsappIcon class="size-5" />
            </a>
            <img :src="productSourcingBanner.image" alt="Ilustrasi layanan impor dan sourcing produk dari China" :width="productSourcingBanner.imageWidth" :height="productSourcingBanner.imageHeight" loading="lazy" class="mx-auto mt-5 h-auto w-full max-w-[280px] object-contain">
          </div>
          <button
            type="button"
            aria-controls="additional-sourcing-products"
            :aria-expanded="showAdditionalProducts"
            class="mx-auto mt-5 flex min-h-11 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            @click="showAdditionalProducts = false"
          >
            Lebih Sedikit <ChevronsDown :size="18" class="rotate-180" aria-hidden="true" />
          </button>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
