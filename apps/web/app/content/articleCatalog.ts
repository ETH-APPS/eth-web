import airwaybillHtml from './articles/airwaybill-adalah.html?raw'
import waybillHtml from './articles/apa-itu-waybill.html?raw'
import packingListHtml from './articles/packing-list-adalah.html?raw'
import stowagePlanHtml from './articles/stowage-plan-adalah.html?raw'
import cargoManifestHtml from './articles/cargo-manifest-adalah.html?raw'
import shippedHtml from './articles/arti-shipped-dalam-pengiriman.html?raw'
import shipPartsHtml from './articles/nama-bagian-bagian-kapal.html?raw'
import { articleSlugs } from './articleSlugs'

export interface ArticleTocSection {
  id: string
  number: string
  title: string
  children: { id: string, number: string, title: string }[]
}

export interface Article {
  slug: string
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt: string
  image: string
  imageAlt: string
  tags: readonly string[]
  keyPoints: readonly [string, string, string]
  bodyHtml: string
  toc: ArticleTocSection[]
}

type ArticleSource = Omit<Article, 'bodyHtml' | 'toc'> & { sourceHtml: string }

const sources: ArticleSource[] = [
  {
    slug: articleSlugs.cargoManifest,
    title: 'Mengenal Cargo Manifest dalam Dunia Ekspor Impor',
    description: 'Pelajari pengertian cargo manifest, perbedaannya dari dokumen pengiriman lain, jenis, dan alur pembuatannya.',
    author: 'Baariq Ayumi',
    publishedAt: '2025-03-18',
    updatedAt: '2025-03-18',
    image: '/images/articles/cargo-manifest-adalah/cover.webp',
    imageAlt: 'Ilustrasi artikel cargo manifest',
    tags: ['Dokumen Pengiriman', 'Ekspor', 'Impor'],
    keyPoints: [
      'Cargo manifest memuat daftar muatan dalam satu pengiriman beserta rincian pengirim, penerima, dan rute.',
      'Manifest berbeda dari Bill of Lading dan packing list karena fungsi dan cakupan informasinya tidak sama.',
      'Data muatan perlu diperiksa sebelum manifest diajukan agar sesuai dengan dokumen pengiriman lainnya.',
    ],
    sourceHtml: cargoManifestHtml,
  },
  {
    slug: articleSlugs.airwaybill,
    title: 'Apa Itu Airway Bill? Berikut Pengertian, Jenis, dan Fungsinya dalam Logistik',
    description: 'Kenali fungsi Airway Bill dalam pengiriman udara, jenis MAWB dan HAWB, serta informasi yang perlu diisi.',
    author: 'Baariq Ayumi',
    publishedAt: '2025-03-07',
    updatedAt: '2025-03-07',
    image: '/images/articles/airwaybill-adalah/cover.webp',
    imageAlt: 'Ilustrasi dokumen Airway Bill',
    tags: ['Air Cargo', 'Dokumen Pengiriman', 'Ekspor', 'Impor'],
    keyPoints: [
      'Airway Bill menjadi bukti penerimaan dan dokumen pengangkutan untuk barang yang dikirim lewat udara.',
      'Kenali perbedaan Master Airway Bill, House Airway Bill, dan jenis lainnya sebelum mengurus pengiriman.',
      'Periksa data pengirim, penerima, barang, dan instruksi khusus agar dokumen sesuai dengan kiriman.',
    ],
    sourceHtml: airwaybillHtml,
  },
  {
    slug: articleSlugs.waybill,
    title: 'Apa Itu Waybill? Berikut Pengertian, Jenis, dan Fungsinya dalam Logistik',
    description: 'Pahami apa itu waybill, fungsi dan jenisnya, cara mengisi, serta risiko bila informasi pengiriman keliru.',
    author: 'Baariq Ayumi',
    publishedAt: '2025-03-06',
    updatedAt: '2025-03-06',
    image: '/images/articles/apa-itu-waybill/cover.webp',
    imageAlt: 'Ilustrasi dokumen waybill',
    tags: ['Dokumen Pengiriman', 'Impor'],
    keyPoints: [
      'Waybill mencatat identitas pengirim, penerima, rute, dan rincian barang untuk proses distribusi.',
      'Dokumen ini membantu pelacakan serta pemeriksaan operasional selama pengiriman.',
      'Kesalahan data pada waybill sebaiknya diperbaiki sebelum barang bergerak lebih jauh.',
    ],
    sourceHtml: waybillHtml,
  },
  {
    slug: articleSlugs.packingList,
    title: 'Packing List: Pengertian, Fungsi, dan Contohnya dalam Dunia Logistik',
    description: 'Panduan komponen packing list, fungsi, contoh pengisian, dan kesalahan yang perlu dihindari saat pengiriman.',
    author: 'Baariq Ayumi',
    publishedAt: '2025-03-05',
    updatedAt: '2025-03-05',
    image: '/images/articles/packing-list-adalah/cover.webp',
    imageAlt: 'Ilustrasi packing list untuk pengiriman barang',
    tags: ['Dokumen Pengiriman', 'Ekspor', 'Impor'],
    keyPoints: [
      'Packing list merinci isi kemasan, jumlah, berat, dan informasi barang dalam suatu pengiriman.',
      'Data packing list perlu konsisten dengan invoice dan dokumen pengiriman terkait.',
      'Deskripsi barang yang jelas membantu pemeriksaan dan penanganan muatan.',
    ],
    sourceHtml: packingListHtml,
  },
  {
    slug: articleSlugs.stowagePlan,
    title: 'Stowage Plan: Pengertian, Regulasi, dan Komponen Utama di Dunia Logistik',
    description: 'Pelajari fungsi stowage plan dalam penempatan muatan kapal, komponen, proses penyusunan, dan tantangannya.',
    author: 'Baariq Ayumi',
    publishedAt: '2025-03-03',
    updatedAt: '2025-03-03',
    image: '/images/articles/stowage-plan-adalah/cover.webp',
    imageAlt: 'Ilustrasi penataan muatan kapal',
    tags: ['Sea Freight', 'Ekspor', 'Impor'],
    keyPoints: [
      'Stowage plan menunjukkan penempatan muatan pada kapal untuk membantu menjaga keselamatan dan keseimbangan.',
      'Rencana muatan mempertimbangkan spesifikasi kapal serta karakter setiap jenis barang.',
      'Penyusunannya memerlukan data muatan yang akurat dan pemeriksaan sebelum kapal berangkat.',
    ],
    sourceHtml: stowagePlanHtml,
  },
  {
    slug: articleSlugs.shipParts,
    title: 'Daftar Lengkap Nama Bagian Bagian Kapal dan Fungsinya',
    description: 'Mengenal bagian kapal dari haluan hingga buritan, sistem propulsi dan navigasi, serta perlengkapan keselamatan.',
    author: 'Baariq Ayumi',
    publishedAt: '2025-02-17',
    updatedAt: '2025-02-17',
    image: '/images/articles/nama-bagian-bagian-kapal/cover.webp',
    imageAlt: 'Ilustrasi bagian-bagian kapal',
    tags: ['Sea Freight', 'Logistik'],
    keyPoints: [
      'Bagian kapal dapat dikenali menurut area depan, tengah, dan belakang beserta fungsi masing-masing.',
      'Sistem propulsi, navigasi, dan penyeimbang mendukung operasi kapal selama pelayaran.',
      'Fasilitas kargo dan perlengkapan keselamatan memiliki peran berbeda dalam pengangkutan.',
    ],
    sourceHtml: shipPartsHtml,
  },
  {
    slug: articleSlugs.shipped,
    title: 'Arti Shipped dalam Pengiriman Ekspor dan Impor',
    description: 'Penjelasan status shipped, faktor yang memengaruhi waktu pengiriman, dan langkah saat pelacakan tidak berubah.',
    author: 'Baariq Ayumi',
    publishedAt: '2025-02-12',
    updatedAt: '2025-02-12',
    image: '/images/articles/arti-shipped-dalam-pengiriman/cover.webp',
    imageAlt: 'Ilustrasi status shipped dalam pengiriman',
    tags: ['Pengiriman', 'Ekspor', 'Impor'],
    keyPoints: [
      'Status shipped menandakan barang sudah diserahkan untuk proses pengiriman, bukan sudah diterima pembeli.',
      'Waktu sampai dipengaruhi layanan, jarak, karakter barang, dan kemungkinan penundaan.',
      'Gunakan nomor pelacakan dan hubungi penyedia layanan bila status tidak bergerak sesuai perkiraan.',
    ],
    sourceHtml: shippedHtml,
  },
]

function headingId(title: string) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('id-ID')
    .replace(/&amp;/g, 'dan')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'bagian'
}

function prepareContent(sourceHtml: string) {
  const toc: ArticleTocSection[] = []
  const usedIds = new Set<string>()
  let sectionNumber = 0
  let childNumber = 0

  const bodyHtml = sourceHtml.replace(/<h([23])>([^<]*)<\/h\1>/g, (_, level: string, encodedTitle: string) => {
    const title = encodedTitle
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
    const baseId = headingId(title)
    let id = baseId
    let duplicate = 2
    while (usedIds.has(id))
      id = `${baseId}-${duplicate++}`
    usedIds.add(id)

    if (level === '2') {
      sectionNumber++
      childNumber = 0
      toc.push({ id, number: String(sectionNumber), title, children: [] })
      return `<h2 id="${id}">${sectionNumber}. ${encodedTitle}</h2>`
    }

    if (!toc.length)
      return `<h3 id="${id}">${encodedTitle}</h3>`

    childNumber++
    const number = `${sectionNumber}.${childNumber}`
    toc[toc.length - 1]!.children.push({ id, number, title })
    return `<h3 id="${id}">${number} ${encodedTitle}</h3>`
  })

  return { bodyHtml, toc }
}

export const articles: Article[] = sources.map(({ sourceHtml, ...source }) => ({
  ...source,
  ...prepareContent(sourceHtml),
}))

export const articleBySlug = new Map(articles.map(article => [article.slug, article]))

export function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}
