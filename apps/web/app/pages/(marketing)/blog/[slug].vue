<script setup lang="ts">
import airCargoImage from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoHeroImage from '~/assets/images/marketing/multinational-cargo-hero.png'
import seaCargoImage from '~/assets/images/marketing/cargo-sea-landscape.png'
import transferImage from '~/assets/images/marketing/transfer.png'

definePageMeta({
  layout: 'marketing',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || 'article'))

const knownArticleTitles: Record<string, string> = {
  'fcl-cargo-guide': 'Panduan FCL Cargo untuk Pengiriman Bisnis',
  'air-cargo-guide': 'Pengiriman Air Cargo untuk Bisnis',
  'supplier-payment-guide': 'Transaksi Supplier China Lebih Aman',
  'popular-sea-freight': 'Panduan Memilih Layanan Sea Freight untuk Kebutuhan Bisnis Anda',
  'popular-import-guide': 'Cara Membuat Proses Impor dari China Lebih Aman dan Efisien',
  'popular-fcl-lcl': 'Kenali Perbedaan FCL dan LCL Sebelum Mengirim Barang',
  'popular-air-cargo': 'Kapan Bisnis Anda Sebaiknya Menggunakan Air Cargo?',
  'popular-supplier-payment': 'Tips Transaksi dan Pembayaran Supplier China yang Lebih Aman',
  'export-market-guide': 'Peluang Ekspor Indonesia dan Cara Memilih Pasar Tujuan yang Tepat',
  'export-document-guide': 'Dokumen Penting yang Perlu Disiapkan Sebelum Melakukan Ekspor',
  'export-sea-freight': 'Strategi Pengiriman Ekspor Melalui Sea Freight yang Lebih Efisien',
  'export-air-freight': 'Kapan Produk Ekspor Sebaiknya Dikirim Menggunakan Air Freight?',
  'export-cost-guide': 'Memahami Komponen Biaya Ekspor agar Perhitungan Lebih Akurat',
  'import-china-guide': 'Panduan Awal Impor Barang dari China untuk Kebutuhan Bisnis',
  'import-supplier-guide': 'Cara Memilih Supplier China yang Terpercaya Sebelum Transaksi',
  'import-fcl-lcl': 'Memilih FCL atau LCL untuk Menekan Biaya Pengiriman Impor',
  'import-customs-guide': 'Mengenal Proses Customs Clearance pada Barang Impor',
  'import-air-cargo': 'Solusi Air Cargo untuk Kebutuhan Impor yang Mendesak',
}

const articleTemplates = [
  'Panduan Lengkap Pengiriman Kargo Laut untuk Kebutuhan Bisnis',
  'Cara Memulai Impor Barang dari China dengan Aman dan Transparan',
  'Solusi Air Cargo untuk Pengiriman Cepat dan Barang Sensitif',
  'Tips Memilih Supplier China Terpercaya untuk Bisnis Anda',
  'Mengenal Dokumen dan Proses Kepabeanan untuk Kegiatan Ekspor',
  'Perbedaan FCL dan LCL serta Cara Memilih Layanan yang Tepat',
] as const

function titleFromSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const articleNumber = computed(() => {
  const match = slug.value.match(/^article-(\d+)$/)
  return match ? Number(match[1]) : null
})

const articleTitle = computed(() => {
  const knownTitle = knownArticleTitles[slug.value]

  if (knownTitle)
    return knownTitle

  if (articleNumber.value) {
    return articleTemplates[(articleNumber.value - 1) % articleTemplates.length]!
  }

  return titleFromSlug(slug.value)
})

const articleImage = computed(() => {
  const value = slug.value

  if (value.includes('air'))
    return airCargoImage

  if (value.includes('supplier') || value.includes('payment') || value.includes('cost'))
    return transferImage

  if (value.includes('import') || value.includes('customs'))
    return cargoHeroImage

  if (articleNumber.value) {
    const imageIndex = (articleNumber.value - 1) % 4
    return [seaCargoImage, cargoHeroImage, airCargoImage, transferImage][imageIndex]!
  }

  return seaCargoImage
})

const articleDate = computed(() => {
  if (!articleNumber.value)
    return '24 September 2026'

  const day = 28 - ((articleNumber.value - 1) % 28)
  return `${day} September 2026`
})

const articleTags = computed(() => {
  const value = slug.value

  if (value.includes('air'))
    return ['Air Cargo', 'Air Freight']

  if (value.includes('export'))
    return ['Export', 'Sea Freight']

  if (value.includes('import') || value.includes('supplier'))
    return ['Import', 'China']

  return ['FCL Cargo', 'Sea Freight']
})

const relatedArticles = computed(() => [
  {
    id: 'popular-sea-freight',
    title: 'Panduan Memilih Layanan Sea Freight untuk Bisnis',
    releaseDate: '12 Desember 2026',
    image: seaCargoImage,
    imageAlt: 'Kapal untuk pengiriman sea freight',
  },
  {
    id: 'import-china-guide',
    title: 'Panduan Awal Impor Barang dari China',
    releaseDate: '12 Desember 2026',
    image: cargoHeroImage,
    imageAlt: 'Aktivitas pengiriman barang impor',
  },
  {
    id: 'popular-air-cargo',
    title: 'Kapan Bisnis Sebaiknya Menggunakan Air Cargo?',
    releaseDate: '12 Desember 2026',
    image: airCargoImage,
    imageAlt: 'Pesawat untuk layanan air cargo',
  },
])

useSeoMeta({
  title: () => `${articleTitle.value} | ETH Cargo`,
  description: () => `Baca artikel ${articleTitle.value} dan temukan insight terbaru seputar logistik bersama ETH Cargo.`,
  ogTitle: () => `${articleTitle.value} | ETH Cargo`,
  ogDescription: () => `Baca artikel ${articleTitle.value} dan temukan insight terbaru seputar logistik bersama ETH Cargo.`,
  ogType: 'article',
})
</script>

<template>
  <div>
    <MarketingBlogArticleHero
      :title="articleTitle"
      author="ETH Cargo Team"
      :updated-at="articleDate"
      :released-at="articleDate"
      :image="articleImage"
      :image-alt="`Ilustrasi untuk artikel ${articleTitle}`"
    />

    <MarketingBlogArticleContent
      :title="articleTitle"
      :tags="articleTags"
      :sidebar-image="articleImage"
      :related-articles="relatedArticles"
    />
  </div>
</template>
