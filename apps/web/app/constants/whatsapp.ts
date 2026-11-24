import type { ProductSource } from '../../shared/types/products'

const whatsappNumber = '6281323459722'
const consultationMessage = 'Halo, saya tertarik untuk import barang dari China, boleh tanya-tanya dulu? ETH-WB'

function whatsappUrl(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const whatsappConsultationUrl = whatsappUrl(consultationMessage)

interface ProductInquiry {
  title: string
  source: ProductSource
  priceIdr: number | null
  detailUrl: string
}

export function productWhatsappUrl({ title, source, priceIdr, detailUrl }: ProductInquiry): string {
  const price = priceIdr === null
    ? 'belum tersedia'
    : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(priceIdr)
  const message = [
    'Halo tim ETH Cargo, saya ingin konsultasi impor produk ini:',
    `Produk: ${title}`,
    `Marketplace: ${source === 'taobao' ? 'Taobao' : '1688'}`,
    `Harga referensi: ${price}`,
    `Link referensi: ${detailUrl}`,
    '',
    'Mohon bantu cek ketersediaan serta estimasi biaya total dan waktu pengiriman ke Indonesia. Terima kasih.',
    'ETH-WB',
  ].join('\n')

  return whatsappUrl(message)
}
