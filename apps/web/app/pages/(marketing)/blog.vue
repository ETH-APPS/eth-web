<script setup lang="ts">
import airCargoImage from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoHeroImage from '~/assets/images/marketing/multinational-cargo-hero.png'
import seaCargoImage from '~/assets/images/marketing/cargo-sea-landscape.png'
import transferImage from '~/assets/images/marketing/transfer.png'

definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Blog | ETH Cargo',
  description: 'Artikel, kabar, dan insight terbaru seputar logistik, impor, serta pengiriman internasional dari ETH Cargo.',
  ogTitle: 'Blog | ETH Cargo',
  ogDescription: 'Artikel, kabar, dan insight terbaru seputar logistik, impor, serta pengiriman internasional dari ETH Cargo.',
  ogType: 'website',
})

const featuredPosts = [
  {
    id: 'fcl-cargo-guide',
    title: 'Lorem Ipsum Title',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
    author: 'Lorem Ipsum',
    releaseDate: '24 September 2026',
    tags: ['FCL Cargo', 'Sea Freight', 'Import', 'Export'],
    image: seaCargoImage,
    imageAlt: 'Pengiriman kargo laut ETH Cargo',
    to: '#featured-blog',
  },
  {
    id: 'air-cargo-guide',
    title: 'Pengiriman Air Cargo untuk Bisnis',
    description:
      'Pelajari cara memilih pengiriman udara yang cepat dan aman untuk produk bernilai tinggi, barang sensitif, maupun kebutuhan restok bisnis yang mendesak.',
    author: 'ETH Cargo Team',
    releaseDate: '18 September 2026',
    tags: ['Air Cargo', 'Air Freight', 'Business', 'Import'],
    image: airCargoImage,
    imageAlt: 'Pesawat pengiriman kargo udara ETH Cargo',
    to: '#featured-blog',
  },
  {
    id: 'supplier-payment-guide',
    title: 'Transaksi Supplier China Lebih Aman',
    description:
      'Kenali proses pembayaran supplier China yang aman, transparan, dan legal agar transaksi pengadaan barang bisnis Anda berjalan lebih efisien.',
    author: 'ETH Cargo Team',
    releaseDate: '10 September 2026',
    tags: ['Transfer RMB', 'Supplier', 'China', 'Sourcing'],
    image: transferImage,
    imageAlt: 'Layanan transaksi supplier China ETH Cargo',
    to: '#featured-blog',
  },
] as const

const popularPosts = [
  {
    id: 'popular-sea-freight',
    title: 'Panduan memilih layanan sea freight untuk kebutuhan bisnis Anda',
    releaseDate: '12 Desember 2026',
    image: seaCargoImage,
    imageAlt: 'Kapal pengiriman kargo laut',
    to: '#featured-blog',
  },
  {
    id: 'popular-import-guide',
    title: 'Cara membuat proses impor dari China lebih aman dan efisien',
    releaseDate: '12 Desember 2026',
    image: cargoHeroImage,
    imageAlt: 'Aktivitas pengiriman kargo internasional',
    to: '#featured-blog',
  },
  {
    id: 'popular-fcl-lcl',
    title: 'Kenali perbedaan FCL dan LCL sebelum mengirim barang',
    releaseDate: '12 Desember 2026',
    image: seaCargoImage,
    imageAlt: 'Kapal kargo untuk pengiriman FCL dan LCL',
    to: '#featured-blog',
  },
  {
    id: 'popular-air-cargo',
    title: 'Kapan bisnis Anda sebaiknya menggunakan air cargo?',
    releaseDate: '12 Desember 2026',
    image: airCargoImage,
    imageAlt: 'Pesawat untuk layanan air cargo',
    to: '#featured-blog',
  },
  {
    id: 'popular-supplier-payment',
    title: 'Tips transaksi dan pembayaran supplier China yang lebih aman',
    releaseDate: '8 Desember 2026',
    image: transferImage,
    imageAlt: 'Layanan pembayaran supplier China',
    to: '#featured-blog',
  },
] as const

const exportPosts = [
  {
    id: 'export-market-guide',
    title: 'Peluang ekspor Indonesia dan cara memilih pasar tujuan yang tepat',
    releaseDate: '12 Desember 2026',
    tags: ['Export', 'Business'],
    image: seaCargoImage,
    imageAlt: 'Kapal kargo untuk kegiatan ekspor',
    to: '#featured-blog',
  },
  {
    id: 'export-document-guide',
    title: 'Dokumen penting yang perlu disiapkan sebelum melakukan ekspor',
    releaseDate: '12 Desember 2026',
    tags: ['Export', 'Documentation'],
    image: cargoHeroImage,
    imageAlt: 'Aktivitas logistik untuk proses ekspor',
    to: '#featured-blog',
  },
  {
    id: 'export-sea-freight',
    title: 'Strategi pengiriman ekspor melalui sea freight yang lebih efisien',
    releaseDate: '12 Desember 2026',
    tags: ['FCL Cargo', 'Sea Freight'],
    image: seaCargoImage,
    imageAlt: 'Pengiriman ekspor melalui jalur laut',
    to: '#featured-blog',
  },
  {
    id: 'export-air-freight',
    title: 'Kapan produk ekspor sebaiknya dikirim menggunakan air freight?',
    releaseDate: '12 Desember 2026',
    tags: ['Air Cargo', 'Export'],
    image: airCargoImage,
    imageAlt: 'Pengiriman produk ekspor melalui udara',
    to: '#featured-blog',
  },
  {
    id: 'export-cost-guide',
    title: 'Memahami komponen biaya ekspor agar perhitungan lebih akurat',
    releaseDate: '8 Desember 2026',
    tags: ['Export', 'Cost'],
    image: transferImage,
    imageAlt: 'Perhitungan biaya kegiatan ekspor',
    to: '#featured-blog',
  },
] as const

const importPosts = [
  {
    id: 'import-china-guide',
    title: 'Panduan awal impor barang dari China untuk kebutuhan bisnis',
    releaseDate: '12 Desember 2026',
    tags: ['Import', 'China'],
    image: cargoHeroImage,
    imageAlt: 'Pengiriman barang impor dari China',
    to: '#featured-blog',
  },
  {
    id: 'import-supplier-guide',
    title: 'Cara memilih supplier China yang terpercaya sebelum transaksi',
    releaseDate: '12 Desember 2026',
    tags: ['Import', 'Supplier'],
    image: transferImage,
    imageAlt: 'Proses transaksi dengan supplier China',
    to: '#featured-blog',
  },
  {
    id: 'import-fcl-lcl',
    title: 'Memilih FCL atau LCL untuk menekan biaya pengiriman impor',
    releaseDate: '12 Desember 2026',
    tags: ['FCL Cargo', 'Sea Freight'],
    image: seaCargoImage,
    imageAlt: 'Kapal kargo untuk pengiriman impor FCL dan LCL',
    to: '#featured-blog',
  },
  {
    id: 'import-customs-guide',
    title: 'Mengenal proses customs clearance pada barang impor',
    releaseDate: '12 Desember 2026',
    tags: ['Import', 'Customs'],
    image: cargoHeroImage,
    imageAlt: 'Proses kepabeanan barang impor',
    to: '#featured-blog',
  },
  {
    id: 'import-air-cargo',
    title: 'Solusi air cargo untuk kebutuhan impor yang mendesak',
    releaseDate: '8 Desember 2026',
    tags: ['Air Cargo', 'Import'],
    image: airCargoImage,
    imageAlt: 'Pesawat untuk pengiriman impor melalui udara',
    to: '#featured-blog',
  },
] as const

const articleTemplates = [
  {
    title: 'Panduan lengkap pengiriman kargo laut untuk kebutuhan bisnis',
    tags: ['FCL Cargo', 'Sea Freight'],
    image: seaCargoImage,
    imageAlt: 'Kapal pengiriman kargo laut',
  },
  {
    title: 'Cara memulai impor barang dari China dengan aman dan transparan',
    tags: ['Import', 'China'],
    image: cargoHeroImage,
    imageAlt: 'Aktivitas pengiriman impor internasional',
  },
  {
    title: 'Solusi air cargo untuk pengiriman cepat dan barang sensitif',
    tags: ['Air Cargo', 'Air Freight'],
    image: airCargoImage,
    imageAlt: 'Pesawat untuk layanan kargo udara',
  },
  {
    title: 'Tips memilih supplier China terpercaya untuk bisnis Anda',
    tags: ['Supplier', 'Sourcing'],
    image: transferImage,
    imageAlt: 'Layanan transaksi dan sourcing supplier China',
  },
  {
    title: 'Mengenal dokumen dan proses kepabeanan untuk kegiatan ekspor',
    tags: ['Export', 'Customs'],
    image: seaCargoImage,
    imageAlt: 'Kapal kargo untuk kegiatan ekspor',
  },
  {
    title: 'Perbedaan FCL dan LCL serta cara memilih layanan yang tepat',
    tags: ['FCL Cargo', 'LCL Cargo'],
    image: cargoHeroImage,
    imageAlt: 'Kontainer untuk layanan FCL dan LCL',
  },
] as const

const articleMonths = ['Oktober', 'September', 'Agustus', 'Juli'] as const

const allArticles = Array.from({ length: 120 }, (_, index) => {
  const template = articleTemplates[index % articleTemplates.length]!

  return {
    id: `article-${index + 1}`,
    title: template.title,
    releaseDate: `${28 - (index % 28)} ${articleMonths[Math.floor(index / 28) % articleMonths.length]} 2026`,
    tags: template.tags,
    image: template.image,
    imageAlt: template.imageAlt,
    to: '#featured-blog',
  }
})
</script>

<template>
  <div>
    <MarketingBlogHeroCarousel
      :posts="featuredPosts"
      :autoplay-delay="5000"
    />

    <MarketingBlogPopularPostsCarousel
      :posts="popularPosts"
      :autoplay-delay="4500"
    />

    <MarketingBlogCategoryPostsCarousel
      section-id="export-articles"
      title="Ekspor"
      :posts="exportPosts"
      view-all-to="#export-articles"
      tone="plain"
      :autoplay-delay="5000"
    />

    <MarketingBlogCategoryPostsCarousel
      section-id="import-articles"
      title="Impor"
      :posts="importPosts"
      view-all-to="#import-articles"
      tone="soft"
      :autoplay-delay="5500"
    />

    <MarketingBlogAllArticles
      :articles="allArticles"
      :per-page="12"
    />
  </div>
</template>
