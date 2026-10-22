<script setup lang="ts">
import { ChevronDown, Search } from 'lucide-vue-next'
import shoesUrl from '~/assets/images/marketing/shoes.png'
import logo1688 from '~/assets/images/brand/1688.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoTmall from '~/assets/images/brand/tmall.png'
import logoAliexpress from '~/assets/images/brand/aliexpress.png'

const searchQuery = ref('')
const selectedMarketplace = ref('Taobao')

const categories = [
  'Electronics',
  'Fashion & Apparels',
  'Home & Appliances',
  'Beauty & Skincare',
  'Toys & Hobbies',
  'Home Decorations',
  'Fitness Equipments',
  'Office',
  'Camping Gear',
  'Automotive Accessories',
]

const products = [
  {
    id: 'product-placeholder-1',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar kapal kargo',
  },
  {
    id: 'product-placeholder-2',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar pesawat kargo',
  },
  {
    id: 'product-placeholder-3',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar kapal kargo',
  },
]

const marketplaces = [
  { name: '1688', logo: logo1688 },
  { name: 'Taobao', logo: logoTaobao },
  { name: 'Alibaba', logo: logoAlibaba },
  { name: 'Tmall', logo: logoTmall },
  { name: 'AliExpress', logo: logoAliexpress },
]
</script>

<template>
  <section
    id="sourcing"
    aria-labelledby="product-sourcing-title"
    class="bg-white py-16"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="product-sourcing-title"
          class="text-[32px] font-semibold leading-tight text-primary-500"
        >
          Temukan Produk Supplier China Langsung di Sini
        </h2>
        <p class="mx-auto mt-6 max-w-[920px] text-[20px] leading-[1.45] text-text-secondary">
          Sourcing produk langsung dari pabrik dan supplier tangan pertama di China. Cukup tempel
          link barang untuk hitung estimasi biaya sampai ke gudang Anda.
        </p>
      </div>

      <div class="mx-auto mt-14 grid max-w-[1120px] grid-cols-[220px_minmax(0,1fr)_170px] items-start gap-5">
        <aside
          aria-labelledby="product-category-title"
          class="rounded-2xl border border-border-200 bg-white p-4"
        >
          <h3
            id="product-category-title"
            class="text-[19px] font-semibold leading-tight text-text-tertiary"
          >
            Kategori Produk
          </h3>
          <ul class="mt-4 space-y-4">
            <li
              v-for="category in categories"
              :key="category"
              class="text-[13px] leading-tight text-text-secondary"
            >
              {{ category }}
            </li>
          </ul>
        </aside>

        <div>
          <form
            class="grid grid-cols-[120px_minmax(0,1fr)_48px] items-center gap-3"
            @submit.prevent
          >
            <label class="flex h-12 items-center justify-center gap-1.5 text-primary-500">
              <span class="sr-only">Pilih marketplace</span>
              <select
                v-model="selectedMarketplace"
                class="field-sizing-content cursor-pointer appearance-none bg-transparent text-[16px] font-medium outline-none"
              >
                <option>Taobao</option>
                <option>1688</option>
                <option>Alibaba</option>
                <option>Tmall</option>
                <option>AliExpress</option>
              </select>
              <ChevronDown
                :size="18"
                :stroke-width="1.8"
                aria-hidden="true"
                class="pointer-events-none shrink-0"
              />
            </label>

            <label class="flex h-12 items-center rounded-2xl border border-border-200 bg-white px-4  focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-50">
              <span class="sr-only">Cari atau tempel link produk</span>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Tempel link produk atau ketik nama barang..."
                class="min-w-0 flex-1 bg-transparent text-[16px] text-text-secondary outline-none placeholder:italic placeholder:text-text-disable placeholder:font-extralight"
              >
            </label>

            <button
              type="submit"
              aria-label="Cari produk"
              class="grid size-12 place-items-center rounded-2xl bg-primary-500 text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <Search
                :size="22"
                :stroke-width="2"
                aria-hidden="true"
              />
            </button>
          </form>

          <p class="mt-3 text-[13px] text-text-tertiary">
            *Anda bisa menempelkan link produk dari
            <span class="font-semibold text-[#f04e1f]">1688</span>,
            <span class="font-semibold text-[#ff5000]">TaoBao</span>,
            <span class="font-semibold text-black">Aliexpress</span>,
            <span class="font-semibold text-[#ff6a00]">Alibaba</span> dan
            <span class="font-semibold text-primary-500">Tmall</span>.
          </p>

          <div class="mt-9 grid grid-cols-3 gap-4">
            <MarketingProductCard
              v-for="product in products"
              :key="product.id"
              :title="product.title"
              :price="product.price"
              :image="product.image"
              :image-alt="product.imageAlt"
            />
          </div>
        </div>

        <aside aria-labelledby="marketplace-title">
          <h3
            id="marketplace-title"
            class="text-center text-[16px] font-semibold text-text-tertiary"
          >
            Marketplace
          </h3>
          <ul class="mt-5 space-y-3">
            <li
              v-for="marketplace in marketplaces"
              :key="marketplace.name"
              class="flex h-14 items-center justify-center"
            >
              <img
                :src="marketplace.logo"
                :alt="marketplace.name"
                loading="lazy"
                class="max-h-full w-auto max-w-[140px] object-contain"
              >
            </li>
          </ul>
        </aside>
      </div>
    </UiContainer>
  </section>
</template>