import airCargoImage from '~/assets/images/marketing/cargo-air-landscape.png'
import cargoHeroImage from '~/assets/images/marketing/multinational-cargo-hero.png'
import seaCargoImage from '~/assets/images/marketing/cargo-sea-landscape.png'
import transferImage from '~/assets/images/marketing/transfer.png'

export interface BlogArticleListItem {
  id: string
  title: string
  releaseDate: string
  tags: readonly string[]
  image: string
  imageAlt: string
  to: string
}

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

export function useAllBlogArticles() {
  const allArticles: BlogArticleListItem[] = Array.from({ length: 120 }, (_, index) => {
    const template = articleTemplates[index % articleTemplates.length]!

    return {
      id: `article-${index + 1}`,
      title: template.title,
      releaseDate: `${28 - (index % 28)} ${articleMonths[Math.floor(index / 28) % articleMonths.length]} 2026`,
      tags: template.tags,
      image: template.image,
      imageAlt: template.imageAlt,
      to: `/blog/article-${index + 1}`,
    }
  })

  return { allArticles }
}
