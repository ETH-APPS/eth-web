import type { ProductSource } from '../../shared/types/products'

const whatsappNumber = '6281323459722'
const consultationMessage = 'Halo, saya tertarik untuk import barang dari China, boleh tanya-tanya dulu? ETH-WB'

function whatsappUrl(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const whatsappConsultationUrl = whatsappUrl(consultationMessage)

export function shippingPriceWhatsappUrl(service?: string): string {
  const message = [
    'Halo Customer Service ETH Cargo, saya ingin bertanya tentang harga pengiriman kargo dari China ke Indonesia.',
    ...(service ? [`Jenis layanan: ${service}`] : []),
    'Mohon bantu informasikan tarif pengirimannya. Terima kasih.',
    'ETH-WB',
  ].join('\n')

  return whatsappUrl(message)
}

interface ProductInquiry {
  title: string
  source: ProductSource
  priceIdr: number | null
  soldCount?: number | null
  detailUrl: string
}

export function productWhatsappUrl({ title, source, priceIdr, soldCount, detailUrl }: ProductInquiry): string {
  const price = priceIdr === null
    ? 'belum tersedia'
    : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(priceIdr)
  const productInfo = soldCount === undefined
    ? `Harga referensi: ${price}`
    : soldCount === null ? 'Jumlah terjual: belum tersedia' : `Terjual: ${new Intl.NumberFormat('id-ID').format(soldCount)}`
  const message = [
    'Halo tim ETH Cargo, saya ingin konsultasi impor produk ini:',
    `Produk: ${title}`,
    `Marketplace: ${source === 'taobao' ? 'Taobao' : '1688'}`,
    productInfo,
    `Link referensi: ${detailUrl}`,
    '',
    'Mohon bantu cek ketersediaan serta estimasi biaya total dan waktu pengiriman ke Indonesia. Terima kasih.',
    'ETH-WB',
  ].join('\n')

  return whatsappUrl(message)
}
