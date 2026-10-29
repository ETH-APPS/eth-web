<script setup lang="ts">
import { ChevronDown, ChevronsDown, Layers3, Search } from 'lucide-vue-next'
import shoesUrl from '~/assets/images/marketing/shoes.png'
import logo1688 from '~/assets/images/brand/1688.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoTmall from '~/assets/images/brand/tmall.png'
import logoAliexpress from '~/assets/images/brand/aliexpress.png'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'

const searchQuery = ref('')
const selectedMarketplace = ref('Taobao')
const showAdditionalProducts = ref(false)

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

const categoryIconColors = [
  'text-blue-500',
  'text-teal-500',
  'text-green-500',
  'text-fuchsia-500',
]

const products = [
  {
    id: 'product-placeholder-1',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar sepatu hijau',
  },
  {
    id: 'product-placeholder-2',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar sepatu hijau',
  },
  {
    id: 'product-placeholder-3',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar sepatu hijau',
  },
  {
    id: 'product-placeholder-4',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar sepatu hijau',
  },
  {
    id: 'product-placeholder-5',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar sepatu hijau',
  },
  {
    id: 'product-placeholder-6',
    title: 'Explore product in each category. Try it.',
    price: '¥ 160.20',
    image: shoesUrl,
    imageAlt: 'Placeholder produk menggunakan gambar sepatu hijau',
  },
]

const initialProducts = products.slice(0, 3)
const additionalProducts = products.slice(3)
const mobileAdditionalProducts = products.slice(2, 3)
const mobileProductPlaceholder = 'Lorem ipsum dolor sit amet consectetur adipiscing elit.'

const marketplaces = [
  { name: '1688', logo: logo1688, mobileWidthClass: 'w-[95px]' },
  { name: 'Taobao', logo: logoTaobao, mobileWidthClass: 'w-[130px]' },
  { name: 'Alibaba', logo: logoAlibaba, mobileWidthClass: 'w-[160px]' },
  { name: 'Tmall', logo: logoTmall, mobileWidthClass: 'w-[130px]' },
  { name: 'AliExpress', logo: logoAliexpress, mobileWidthClass: 'w-[160px]' },
]

const categoryListRef = ref<HTMLElement | null>(null)
const categoryProgress = ref(0)
let categoryFrame: number | undefined

function updateCategoryProgress() {
  const list = categoryListRef.value

  if (!list)
    return

  const maxScroll = list.scrollWidth - list.clientWidth
  categoryProgress.value = maxScroll > 0 ? Math.min(Math.max(list.scrollLeft / maxScroll, 0), 1) : 0
}

function handleCategoryScroll() {
  if (categoryFrame !== undefined)
    cancelAnimationFrame(categoryFrame)

  categoryFrame = requestAnimationFrame(updateCategoryProgress)
}

onMounted(() => {
  updateCategoryProgress()
})

onBeforeUnmount(() => {
  if (categoryFrame !== undefined)
    cancelAnimationFrame(categoryFrame)
})
</script>

<template>
  <section
    id="sourcing"
    aria-labelledby="product-sourcing-title"
    class="bg-white py-12 lg:py-16"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="product-sourcing-title"
          class="text-[28px] font-semibold leading-tight text-primary-500 lg:text-[32px]"
        >
          Temukan Produk Supplier China Langsung di Sini
        </h2>
        <p class="mx-auto mt-4 hidden max-w-[920px] text-[16px] leading-[1.55] text-text-secondary md:block lg:mt-6 lg:text-[20px] lg:leading-[1.45]">
          Sourcing produk langsung dari pabrik dan supplier tangan pertama di China. Cukup tempel
          link barang untuk hitung estimasi biaya sampai ke gudang Anda.
        </p>
      </div>

      <div class="mx-auto mt-8 grid max-w-[1120px] grid-cols-1 items-start gap-6 lg:mt-14 lg:grid-cols-[220px_minmax(0,1fr)_170px] lg:gap-5">
        <aside
          aria-labelledby="product-category-title"
          class="min-w-0 rounded-2xl border border-border-200 bg-white p-4 shadow-md lg:shadow-none"
        >
          <h3
            id="product-category-title"
            class="sr-only text-[19px] font-semibold leading-tight text-text-tertiary lg:not-sr-only"
          >
            Kategori Produk
          </h3>
          <ul
            ref="categoryListRef"
            class="flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] lg:mt-4 lg:block lg:space-y-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
            @scroll.passive="handleCategoryScroll"
          >
            <li
              v-for="(category, index) in categories"
              :key="category"
              class="flex w-[92px] shrink-0 snap-start flex-col items-center gap-2 text-center text-[13px] leading-tight text-text-secondary lg:block lg:w-auto lg:text-start"
            >
              <Layers3
                :size="36"
                :stroke-width="1.6"
                aria-hidden="true"
                class="lg:hidden"
                :class="categoryIconColors[index % categoryIconColors.length]"
              />
              <span>{{ category }}</span>
            </li>
          </ul>

          <div class="mt-4 flex justify-center lg:hidden" aria-hidden="true">
            <div class="h-1.5 w-14 overflow-hidden rounded-full bg-primary-50">
              <div
                class="h-full w-1/2 rounded-full bg-primary-500"
                :style="{ transform: `translateX(${categoryProgress * 100}%)` }"
              />
            </div>
          </div>
        </aside>

        <div class="min-w-0">
          <form
            class="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 md:grid-cols-[120px_minmax(0,1fr)_48px]"
            @submit.prevent
          >
            <label class="flex h-12 items-center justify-start gap-1.5 px-1 text-primary-500 md:justify-center md:px-0">
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

            <label class="flex h-12 min-w-0 items-center gap-2 rounded-2xl border border-border-200 bg-white px-4 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-50 md:gap-0">
              <span class="sr-only">Cari atau tempel link produk</span>
              <Search
                :size="20"
                :stroke-width="1.8"
                aria-hidden="true"
                class="shrink-0 text-text-tertiary md:hidden"
              />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Cari barang"
                class="min-w-0 flex-1 bg-transparent text-[16px] text-text-secondary outline-none placeholder:text-text-tertiary lg:hidden"
              >
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Tempel link produk atau ketik nama barang..."
                class="hidden min-w-0 flex-1 bg-transparent text-[16px] text-text-secondary outline-none placeholder:italic placeholder:text-text-disable placeholder:font-extralight lg:block"
              >
            </label>

            <button
              type="submit"
              aria-label="Cari produk"
              class="hidden size-12 place-items-center rounded-2xl bg-primary-500 text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:grid"
            >
              <Search
                :size="22"
                :stroke-width="2"
                aria-hidden="true"
              />
            </button>
          </form>

          <p class="mt-3 hidden text-[13px] text-text-tertiary md:block">
            *Anda bisa menempelkan link produk dari
            <span class="font-semibold text-[#f04e1f]">1688</span>,
            <span class="font-semibold text-[#ff5000]">TaoBao</span>,
            <span class="font-semibold text-black">Aliexpress</span>,
            <span class="font-semibold text-[#ff6a00]">Alibaba</span> dan
            <span class="font-semibold text-primary-500">Tmall</span>.
          </p>

          <div
            id="sourcing-products"
            class="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-9 lg:grid-cols-3"
          >
            <MarketingProductCard
              v-for="product in initialProducts"
              :key="product.id"
              :title="product.title"
              :price="product.price"
              :image="product.image"
              :image-alt="product.imageAlt"
              :mobile-placeholder-title="mobileProductPlaceholder"
              :class="{ 'hidden lg:block': product.id === 'product-placeholder-3' }"
            />
          </div>

          <div
            id="additional-sourcing-products"
            class="grid transition-[grid-template-rows,opacity,margin-top] duration-500 ease-out motion-reduce:transition-none"
            :aria-hidden="!showAdditionalProducts"
            :inert="!showAdditionalProducts"
            :class="showAdditionalProducts
              ? 'mt-8 grid-rows-[1fr] opacity-100'
              : 'mt-0 grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
                <MarketingProductCard
                  v-for="product in mobileAdditionalProducts"
                  :key="product.id"
                  :title="product.title"
                  :price="product.price"
                  :image="product.image"
                  :image-alt="product.imageAlt"
                  :mobile-placeholder-title="mobileProductPlaceholder"
                  class="lg:hidden"
                />
                <MarketingProductCard
                  v-for="product in additionalProducts"
                  :key="product.id"
                  :title="product.title"
                  :price="product.price"
                  :image="product.image"
                  :image-alt="product.imageAlt"
                  :mobile-placeholder-title="mobileProductPlaceholder"
                />
              </div>

              <div class="mt-10 overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#bd302d_0%,#8d3433_48%,#272727_100%)] px-5 py-6 text-white sm:px-7 sm:py-7">
                <div class="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                  <div class="min-w-0">
                    <p class="text-[26px] font-semibold leading-tight text-[#ffc400] sm:text-[30px]">
                      Belanja Produk China Jadi Lebih Mudah
                    </p>
                    <p class="mt-2 text-[16px] font-semibold text-[#ffc400] sm:text-[18px]">
                      JASA TITIP BELI
                    </p>

                    <dl class="mt-5 grid grid-cols-3 gap-3 text-center sm:max-w-[360px] sm:text-left">
                      <div>
                        <dt class="text-[18px] font-semibold leading-none sm:text-[20px]">+10.000</dt>
                        <dd class="mt-1 text-[11px] leading-snug text-white/80">Pengiriman<br class="hidden sm:block"> selesai</dd>
                      </div>
                      <div>
                        <dt class="text-[18px] font-semibold leading-none sm:text-[20px]">98%</dt>
                        <dd class="mt-1 text-[11px] leading-snug text-white/80">Tingkat<br class="hidden sm:block"> ketepatan</dd>
                      </div>
                      <div>
                        <dt class="text-[18px] font-semibold leading-none sm:text-[20px]">+10</dt>
                        <dd class="mt-1 text-[11px] leading-snug text-white/80">Tahun<br class="hidden sm:block"> pengalaman</dd>
                      </div>
                    </dl>
                  </div>

                  <div class="shrink-0 sm:text-right">
                    <p class="mb-4 text-[11px] font-medium leading-snug text-white/70">
                      Promo Sourcing
                    </p>
                    <NuxtLink
                      to="#quote"
                      class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-5 text-[15px] font-medium text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
                    >
                      <span>Konsultasi via WhatsApp</span>
                      <img
                        :src="whatsappUrl"
                        alt=""
                        aria-hidden="true"
                        width="22"
                        height="22"
                        class="size-[22px] shrink-0 object-contain"
                      >
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-controls="additional-sourcing-products"
            :aria-expanded="showAdditionalProducts"
            class="mx-auto mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-[16px] font-medium text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            @click="showAdditionalProducts = !showAdditionalProducts"
          >
            <span class="lg:hidden">{{ showAdditionalProducts ? 'View Less' : 'View More' }}</span>
            <span class="hidden lg:inline">{{ showAdditionalProducts ? 'Lebih Sedikit' : 'Lebih Banyak' }}</span>
            <ChevronsDown
              :size="18"
              :stroke-width="1.8"
              aria-hidden="true"
              class="transition-transform duration-500 ease-out motion-reduce:transition-none"
              :class="showAdditionalProducts ? 'rotate-180' : ''"
            />
          </button>
        </div>

        <aside
          aria-labelledby="marketplace-title"
          class="min-w-0"
        >
          <h3
            id="marketplace-title"
            class="text-center text-[16px] font-semibold text-text-tertiary"
          >
            Marketplace
          </h3>
          <div class="marketplace-marquee mt-5 overflow-hidden lg:hidden">
            <div class="marketplace-track">
              <ul class="marketplace-group">
                <li
                  v-for="marketplace in marketplaces"
                  :key="marketplace.name"
                  class="flex h-14 w-40 shrink-0 items-center justify-center"
                >
                  <img
                    :src="marketplace.logo"
                    :alt="marketplace.name"
                    loading="lazy"
                    class="h-auto max-w-full object-contain"
                    :class="marketplace.mobileWidthClass"
                  >
                </li>
              </ul>
              <ul class="marketplace-group" aria-hidden="true">
                <li
                  v-for="marketplace in marketplaces"
                  :key="`copy-${marketplace.name}`"
                  class="flex h-14 w-40 shrink-0 items-center justify-center"
                >
                  <img
                    :src="marketplace.logo"
                    alt=""
                    loading="lazy"
                    class="h-auto max-w-full object-contain"
                    :class="marketplace.mobileWidthClass"
                  >
                </li>
              </ul>
            </div>
          </div>
          <ul class="mt-5 hidden space-y-3 lg:block">
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

<style scoped>
.marketplace-track {
  display: flex;
  width: max-content;
  animation: marketplace-scroll 28s linear infinite;
}

.marketplace-group {
  display: flex;
  flex: none;
  gap: 1.5rem;
  padding-right: 1.5rem;
}

.marketplace-marquee:hover .marketplace-track {
  animation-play-state: paused;
}

@keyframes marketplace-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marketplace-track {
    animation-play-state: paused;
  }
}
</style>
