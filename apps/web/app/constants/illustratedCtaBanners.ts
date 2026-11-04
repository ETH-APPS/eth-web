import transferVector from '~/assets/images/marketing/vector-transfer.png'
import handPackageVector from '~/assets/images/marketing/vector-hand-package.png'
import aboutUsVector from '~/assets/images/marketing/vector-about-us.png'
import completeGuideVector from '~/assets/images/marketing/complete-guide.png'
import importVector from '~/assets/images/marketing/vector-impor.png'

export const illustratedCtaBanners = {
  transfer: {
    title: 'Siap untuk Transfer RMB?',
    description: 'Proses pembayaran ke supplier China kini lebih praktis, aman, dan tanpa kendala. Konsultasikan nominal serta tujuan transfer bisnis Anda langsung bersama tim spesialis kami.',
    email: 'testing-mail@gmail.co.id',
    ctaLabel: 'Konsultasi Gratis',
    ctaTo: '/#quote',
    image: transferVector,
    imageWidth: 2288,
    imageHeight: 1776,
    imageMaxWidth: 480,
    imageTopOffset: 72,
    imageRightOffset: 0,
  },
  sourcing: {
    title: 'Siap Temukan Supplier Tangan Pertama di China?',
    description: 'Dapatkan penawaran harga modal grosir terbaik, jaminan kualitas produk, serta pengiriman kargo terintegrasi tanpa kendala bahasa. Konsultasikan kebutuhan barang bisnis Anda sekarang!',
    email: 'testing-mail@gmail.co.id',
    ctaLabel: 'Konsultasi Gratis',
    ctaTo: '/#quote',
    image: handPackageVector,
    imageAlign: 'center',
    imageWidth: 404,
    imageHeight: 420,
    imageMaxWidth: 440,
    imageTopOffset: 40,
    imageRightOffset: 0,
  },
  about: {
    title: 'Siap Mengoptimalkan Rantai Pasok Impor Anda?',
    description: 'Percayakan kebutuhan logistik, pengadaan produk, dan pembayaran supplier China Anda kepada ETH Cargo. Tim profesional kami siap memberikan solusi All-In Door-to-Door yang efisien dan terpercaya.',
    email: 'testing-mail@gmail.co.id',
    ctaLabel: 'Konsultasi Gratis',
    ctaTo: '/#quote',
    image: aboutUsVector,
    imageAlign: 'center',
    imageWidth: 547,
    imageHeight: 398,
    imageMaxWidth: 600,
    imageTopOffset: 48,
    imageRightOffset: 0,
  },
  completeGuide: {
    title: 'Kuasai Strategi Import B2B dari China untuk Skala Bisnis Anda!',
    description: 'Kuasai alur pengiriman All-In Door-to-Door dari awal hingga akhir. Kami pandu setiap langkah secara transparan tanpa khawatir kendala bea cukai.',
    email: 'testing-mail@gmail.co.id',
    ctaLabel: 'Konsultasi Gratis',
    ctaTo: '/#quote',
    image: completeGuideVector,
    imageAlign: 'center',
    imageWidth: 537,
    imageHeight: 420,
    imageMaxWidth: 560,
    imageTopOffset: 40,
    imageRightOffset: 0,
  },
  productSourcing: {
    title: 'Ingin Import Produk dari China Tanpa Repot? Biar ETH Cargo yang Urus!',
    description: 'Nikmati layanan sourcing terpercaya dari pabrik tangan pertama di China. Transparan, aman, dan langsung sampai ke gudang Anda.',
    email: 'testing-mail@gmail.co.id',
    ctaLabel: 'Konsultasi Gratis',
    ctaTo: '/#quote',
    image: importVector,
    imageAlign: 'center',
    imageWidth: 1144,
    imageHeight: 1008,
    imageMaxWidth: 360,
    imageTopOffset: 28,
    imageRightOffset: 0,
  },
} as const

export type IllustratedCtaBannerKey = keyof typeof illustratedCtaBanners
