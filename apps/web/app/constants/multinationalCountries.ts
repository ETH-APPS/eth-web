import type { MarketingFaqContent } from '~/constants/faq'
import heroPlaceholderUrl from '~/assets/images/marketing/multinational-cargo-hero.png'
import heroCargoAmerica from '~/assets/images/marketing/cargo-amerika.png'
import heroCargoThailand from '~/assets/images/marketing/cargo-thailand.png'
import heroCargoTaiwan from '~/assets/images/marketing/cargo-taiwan.png'
import heroCargoKorea from '~/assets/images/marketing/cargo-korea.png'
import heroCargoSingapura from '~/assets/images/marketing/cargo-singapura.png'
import heroCargoMalaysia from '~/assets/images/marketing/cargo-malaysia.png'
import heroCargoAustralia from '~/assets/images/marketing/cargo-australia.png'
import taiwanFlagUrl from '~/assets/images/flag/taiwan.png'
import koreaFlagUrl from '~/assets/images/flag/korea.png'
import singaporeFlagUrl from '~/assets/images/flag/singapore.png'
import malaysiaFlagUrl from '~/assets/images/flag/malaysia.png'
import australiaFlagUrl from '~/assets/images/flag/australia.png'
import usaFlagUrl from '~/assets/images/flag/USA.png'
import thailandFlagUrl from '~/assets/images/flag/thailand.png'

export interface MultinationalCountry {
  slug: string
  name: string
  navigationName: string
  routeLabel: string
  flag: string
  hero: {
    eyebrow: string
    title: string
    description: string
    image: string
    imageAlt: string
  }
  faq: MarketingFaqContent
}


export const multinationalCountries: readonly MultinationalCountry[] = [
  {
    slug: 'amerika',
    name: 'Amerika',
    navigationName: 'Amerika Serikat',
    routeLabel: 'USA',
    flag: usaFlagUrl,
    hero: {
      eyebrow: 'Forwarder Amerika - Indonesia',
      title: 'Jasa Cargo Amerika ke Indonesia',
      description: 'Solusi logistik dari Amerika ke Indonesia untuk kebutuhan bisnis Anda. Detail layanan dan proses pengiriman akan diperbarui sesuai informasi rute yang tersedia.',
      image: heroCargoAmerica,
      imageAlt: 'Jasa Cargo Amerika ke Indonesia',
    },
    faq: {
      subtitle: 'Pertanyaan Seputar Kargo Amerika Serikat',
      description: 'Temukan jawaban lengkap mengenai prosedur pengiriman logistik dari AS ke Indonesia, estimasi waktu transit via laut dan udara, penanganan bea cukai, serta jaminan keamanan layanan All-In Door-to-Door kami.',
      items: [
        {
          question: 'Berapa estimasi waktu pengiriman kargo dari Amerika Serikat ke Indonesia?',
          answer: 'Waktu transit bervariasi tergantung moda transportasi yang Anda pilih. Pengiriman via Kargo Laut (Sea Freight) memakan waktu sekitar 4–8 minggu, sedangkan pengiriman via Kargo Udara (Air Freight) jauh lebih cepat yaitu sekitar 3–7 hari.',
        },
        {
          question: 'Dokumen apa saja yang diperlukan untuk mengimpor barang dari AS?',
          answer: 'Untuk layanan All-In Door-to-Door ETH Cargo, Anda tidak perlu mengurus izin impor yang rumit. Cukup sediakan informasi detail produk (nama barang, tautan/foto, dimensi, dan jumlah) serta alamat tujuan pengiriman di Indonesia.',
        },
        {
          question: 'Apakah biaya pengiriman sudah termasuk bea masuk dan pajak?',
          answer: 'Ya, benar! Layanan kami menggunakan sistem All-In Door-to-Door, di mana biaya pengiriman internasional, pengurusan bea cukai (customs clearance), pajak impor, hingga biaya pengantaran lokal ke alamat Anda sudah tercakup dalam satu harga transparan.',
        },
        {
          question: 'Bagaimana cara melacak status pengiriman kargo saya?',
          answer: 'Anda dapat memantau posisi kargo secara real-time melalui fitur Live Tracking 24/7 yang tersedia di website ETH Cargo dengan memasukkan nomor resi atau tracking code pengiriman Anda.',
        },
        {
          question: 'Apakah barang kiriman dijamin aman selama perjalanan lintas benua?',
          answer: 'Tentu saja. Setiap kargo ditangani secara profesional dengan standar pengemasan yang kuat dan aman. Kami juga menyediakan opsi perlindungan asuransi pengiriman untuk memberikan ketenangan penuh bagi aset bisnis Anda.',
        },
      ],
      quoteTitle: 'Judul ajakan konsultasi (dummy)',
      quoteDescription: 'Deskripsi ajakan konsultasi sementara.',
      calculatorTo: '#rate-estimator',
    },
  },
  {
    slug: 'thailand',
    name: 'Thailand',
    navigationName: 'Thailand',
    routeLabel: 'THAILAND',
    flag: thailandFlagUrl,
    hero: {
      eyebrow: 'Forwarder Thailand - Indonesia',
      title: 'Jasa Cargo Thailand ke Indonesia',
      description: 'Solusi logistik lintas negara yang efisien dan aman dari Thailand ke Indonesia. Percepat rantai pasok B2B Anda dengan sistem All-In Door-to-Door, di mana pengurusan bea cukai hingga pengiriman akhir sepenuhnya kami tangani tanpa biaya tersembunyi.',
      image: heroCargoThailand,
      imageAlt: 'Jasa Cargo Thailand ke Indonesia',
    },
    faq: {
      subtitle: 'Pertanyaan Seputar Kargo Thailand',
      description: 'Temukan jawaban lengkap mengenai prosedur pengiriman logistik dari Thailand ke Indonesia, estimasi waktu transit via laut dan udara, penanganan bea cukai, serta jaminan keamanan layanan All-In Door-to-Door kami.',
      items: [
        {
          question: 'Berapa estimasi waktu pengiriman kargo dari Thailand ke Indonesia?',
          answer: 'Waktu transit bervariasi tergantung moda transportasi yang Anda pilih. Pengiriman via Kargo Laut (Sea Freight) dari Thailand umumnya memakan waktu sekitar 2–4 minggu, sedangkan pengiriman via Kargo Udara (Air Freight) jauh lebih cepat yaitu sekitar 1–5 hari.',
        },
        {
          question: 'Dokumen apa saja yang diperlukan untuk mengimpor barang dari Thailand?',
          answer: 'Untuk layanan All-In Door-to-Door ETH Cargo, Anda tidak perlu mengurus izin impor yang rumit. Cukup sediakan informasi detail produk (nama barang, tautan/foto, dimensi, dan jumlah) serta alamat tujuan pengiriman di Indonesia.',
        },
        {
          question: 'Apakah biaya pengiriman sudah termasuk bea masuk dan pajak?',
          answer: 'Ya, benar! Layanan kami menggunakan sistem All-In Door-to-Door, di mana biaya pengiriman internasional, pengurusan bea cukai (customs clearance), pajak impor, hingga biaya pengantaran lokal ke alamat Anda sudah tercakup dalam satu harga transparan.',
        },
        {
          question: 'Bagaimana cara melacak status pengiriman kargo saya?',
          answer: 'Anda dapat memantau posisi kargo secara real-time melalui fitur Live Tracking 24/7 yang tersedia di website ETH Cargo dengan memasukkan nomor resi atau tracking code pengiriman Anda.',
        },
        {
          question: 'Apakah barang kiriman dijamin aman selama perjalanan dari Thailand?',
          answer: 'Tentu saja. Setiap kargo ditangani secara profesional dengan standar pengemasan yang kuat dan aman. Kami juga menyediakan opsi perlindungan asuransi pengiriman untuk memberikan ketenangan penuh bagi aset bisnis Anda.',
        },
      ],
      quoteTitle: 'Judul ajakan konsultasi (dummy)',
      quoteDescription: 'Deskripsi ajakan konsultasi sementara.',
      calculatorTo: '#rate-estimator',
    },
  },
  {
    slug: 'taiwan',
    name: 'Taiwan',
    navigationName: 'Taiwan',
    routeLabel: 'TAIWAN',
    flag: taiwanFlagUrl,
    hero: {
      eyebrow: 'Forwarder Taiwan - Indonesia',
      title: 'Jasa Cargo Taiwan ke Indonesia',
      description: 'Solusi logistik lintas benua yang efisien dan aman dari Taiwan ke Indonesia. Percepat rantai pasok B2B Anda dengan sistem All-In Door-to-Door, di mana pengurusan bea cukai hingga pengiriman akhir sepenuhnya kami tangani tanpa biaya tersembunyi.',
      image: heroCargoTaiwan,
      imageAlt: 'Jasa Cargo Taiwan ke Indonesia',
    },
    faq: {
      subtitle: 'Pertanyaan Seputar Kargo Taiwan',
      description: 'Temukan jawaban lengkap mengenai prosedur pengiriman logistik dari Taiwan ke Indonesia, estimasi waktu transit via laut dan udara, penanganan bea cukai, serta jaminan keamanan layanan All-In Door-to-Door kami.',
      items: [
        {
          question: 'Berapa estimasi waktu pengiriman kargo dari Taiwan ke Indonesia?',
          answer: 'Waktu transit bervariasi tergantung moda transportasi yang Anda pilih. Pengiriman via Kargo Laut (Sea Freight) memakan waktu sekitar 4–8 minggu, sedangkan pengiriman via Kargo Udara (Air Freight) jauh lebih cepat yaitu sekitar 3–7 hari.',
        },
        {
          question: 'Dokumen apa saja yang diperlukan untuk mengimpor barang dari Taiwan?',
          answer: 'Untuk layanan All-In Door-to-Door ETH Cargo, Anda tidak perlu mengurus izin impor yang rumit. Cukup sediakan informasi detail produk (nama barang, tautan/foto, dimensi, dan jumlah) serta alamat tujuan pengiriman di Indonesia.',
        },
        {
          question: 'Apakah biaya pengiriman sudah termasuk bea masuk dan pajak?',
          answer: 'Ya, benar! Layanan kami menggunakan sistem All-In Door-to-Door, di mana biaya pengiriman internasional, pengurusan bea cukai (customs clearance), pajak impor, hingga biaya pengantaran lokal ke alamat Anda sudah tercakup dalam satu harga transparan.',
        },
        {
          question: 'Bagaimana cara melacak status pengiriman kargo saya?',
          answer: 'Anda dapat memantau posisi kargo secara real-time melalui fitur Live Tracking 24/7 yang tersedia di website ETH Cargo dengan memasukkan nomor resi atau tracking code pengiriman Anda.',
        },
        {
          question: 'Apakah barang kiriman dijamin aman selama perjalanan dari Taiwan?',
          answer: 'Tentu saja. Setiap kargo ditangani secara profesional dengan standar pengemasan yang kuat dan aman. Kami juga menyediakan opsi perlindungan asuransi pengiriman untuk memberikan ketenangan penuh bagi aset bisnis Anda.',
        },
      ],
      quoteTitle: 'Judul ajakan konsultasi (dummy)',
      quoteDescription: 'Deskripsi ajakan konsultasi sementara.',
      calculatorTo: '#rate-estimator',
    },
  },
  {
    slug: 'korea-selatan',
    name: 'Korea Selatan',
    navigationName: 'Korea Selatan',
    routeLabel: 'S. KOREA',
    flag: koreaFlagUrl,
    hero: {
      eyebrow: 'Forwarder Korea Selatan - Indonesia',
      title: 'Jasa Cargo Korea Selatan ke Indonesia',
      description: 'Solusi logistik dari Korea Selatan ke Indonesia untuk kebutuhan bisnis Anda. Detail layanan dan proses pengiriman akan diperbarui sesuai informasi rute yang tersedia.',
      image: heroCargoKorea,
      imageAlt: 'Ilustrasi sementara layanan kargo Korea Selatan ke Indonesia',
    },
    faq: {
      subtitle: 'Pertanyaan Seputar Kargo Korea Selatan',
      description: 'Temukan jawaban lengkap mengenai prosedur pengiriman logistik dari Korea Selatan ke Indonesia, estimasi waktu transit via laut dan udara, penanganan bea cukai, serta jaminan keamanan layanan All-In Door-to-Door kami.',
      items: [
        {
          question: 'Berapa estimasi waktu pengiriman kargo dari Korea Selatan ke Indonesia?',
          answer: 'Waktu transit bervariasi tergantung moda transportasi yang Anda pilih. Pengiriman via Kargo Laut (Sea Freight) memakan waktu sekitar 4–8 minggu, sedangkan pengiriman via Kargo Udara (Air Freight) jauh lebih cepat yaitu sekitar 3–7 hari.',
        },
        {
          question: 'Dokumen apa saja yang diperlukan untuk mengimpor barang dari Korea Selatan?',
          answer: 'Untuk layanan All-In Door-to-Door ETH Cargo, Anda tidak perlu mengurus izin impor yang rumit. Cukup sediakan informasi detail produk (nama barang, tautan/foto, dimensi, dan jumlah) serta alamat tujuan pengiriman di Indonesia.',
        },
        {
          question: 'Apakah biaya pengiriman sudah termasuk bea masuk dan pajak?',
          answer: 'Ya, benar! Layanan kami menggunakan sistem All-In Door-to-Door, di mana biaya pengiriman internasional, pengurusan bea cukai (customs clearance), pajak impor, hingga biaya pengantaran lokal ke alamat Anda sudah tercakup dalam satu harga transparan.',
        },
        {
          question: 'Bagaimana cara melacak status pengiriman kargo saya?',
          answer: 'Anda dapat memantau posisi kargo secara real-time melalui fitur Live Tracking 24/7 yang tersedia di website ETH Cargo dengan memasukkan nomor resi atau tracking code pengiriman Anda.',
        },
        {
          question: 'Apakah barang kiriman dijamin aman selama perjalanan dari Korea Selatan?',
          answer: 'Tentu saja. Setiap kargo ditangani secara profesional dengan standar pengemasan yang kuat dan aman. Kami juga menyediakan opsi perlindungan asuransi pengiriman untuk memberikan ketenangan penuh bagi aset bisnis Anda.',
        },
      ],
      quoteTitle: 'Judul ajakan konsultasi (dummy)',
      quoteDescription: 'Deskripsi ajakan konsultasi sementara.',
      calculatorTo: '#rate-estimator',
    },
  },
  {
    slug: 'singapura',
    name: 'Singapura',
    navigationName: 'Singapura',
    routeLabel: 'SINGAPORE',
    flag: singaporeFlagUrl,
    hero: {
      eyebrow: 'Forwarder Singapura - Indonesia',
      title: 'Jasa Cargo Singapura ke Indonesia',
      description: 'Solusi logistik lintas benua yang efisien dan aman dari Singapura ke Indonesia. Percepat rantai pasok B2B Anda dengan sistem All-In Door-to-Door, di mana pengurusan bea cukai hingga pengiriman akhir sepenuhnya kami tangani tanpa biaya tersembunyi.',
      image: heroCargoSingapura,
      imageAlt: 'Jasa Cargo Singapura ke Indonesia',
    },
    faq: {
      subtitle: 'Pertanyaan Seputar Kargo Singapura',
      description: 'Temukan jawaban lengkap mengenai prosedur pengiriman logistik dari Singapura ke Indonesia, estimasi waktu transit via laut dan udara, penanganan bea cukai, serta jaminan keamanan layanan All-In Door-to-Door kami.',
      items: [
        {
          question: 'Berapa estimasi waktu pengiriman kargo dari Singapura ke Indonesia?',
          answer: 'Waktu transit bervariasi tergantung moda transportasi yang Anda pilih. Pengiriman via Kargo Laut (Sea Freight) memakan waktu sekitar 4–8 minggu, sedangkan pengiriman via Kargo Udara (Air Freight) jauh lebih cepat yaitu sekitar 3–7 hari.',
        },
        {
          question: 'Dokumen apa saja yang diperlukan untuk mengimpor barang dari Singapura?',
          answer: 'Untuk layanan All-In Door-to-Door ETH Cargo, Anda tidak perlu mengurus izin impor yang rumit. Cukup sediakan informasi detail produk (nama barang, tautan/foto, dimensi, dan jumlah) serta alamat tujuan pengiriman di Indonesia.',
        },
        {
          question: 'Apakah biaya pengiriman sudah termasuk bea masuk dan pajak?',
          answer: 'Ya, benar! Layanan kami menggunakan sistem All-In Door-to-Door, di mana biaya pengiriman internasional, pengurusan bea cukai (customs clearance), pajak impor, hingga biaya pengantaran lokal ke alamat Anda sudah tercakup dalam satu harga transparan.',
        },
        {
          question: 'Bagaimana cara melacak status pengiriman kargo saya?',
          answer: 'Anda dapat memantau posisi kargo secara real-time melalui fitur Live Tracking 24/7 yang tersedia di website ETH Cargo dengan memasukkan nomor resi atau tracking code pengiriman Anda.',
        },
        {
          question: 'Apakah barang kiriman dijamin aman selama perjalanan dari Singapura?',
          answer: 'Tentu saja. Setiap kargo ditangani secara profesional dengan standar pengemasan yang kuat dan aman. Kami juga menyediakan opsi perlindungan asuransi pengiriman untuk memberikan ketenangan penuh bagi aset bisnis Anda.',
        },
      ],
      quoteTitle: 'Judul ajakan konsultasi (dummy)',
      quoteDescription: 'Deskripsi ajakan konsultasi sementara.',
      calculatorTo: '#rate-estimator',
    },
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    navigationName: 'Malaysia',
    routeLabel: 'MALAYSIA',
    flag: malaysiaFlagUrl,
    hero: {
      eyebrow: 'Forwarder Malaysia - Indonesia',
      title: 'Jasa Cargo Malaysia ke Indonesia',
      description: 'Solusi logistik lintas benua yang efisien dan aman dari Malaysia ke Indonesia. Percepat rantai pasok B2B Anda dengan sistem All-In Door-to-Door, di mana pengurusan bea cukai hingga pengiriman akhir sepenuhnya kami tangani tanpa biaya tersembunyi.',
      image: heroCargoMalaysia,
      imageAlt: 'Jasa Cargo Malaysia ke Indonesia',
    },
    faq: {
      subtitle: 'Pertanyaan Seputar Kargo Malaysia',
      description: 'Temukan jawaban lengkap mengenai prosedur pengiriman logistik dari Malaysia ke Indonesia, estimasi waktu transit via laut dan udara, penanganan bea cukai, serta jaminan keamanan layanan All-In Door-to-Door kami.',
      items: [
        {
          question: 'Berapa estimasi waktu pengiriman kargo dari Malaysia ke Indonesia?',
          answer: 'Waktu transit bervariasi tergantung moda transportasi yang Anda pilih. Pengiriman via Kargo Laut (Sea Freight) memakan waktu sekitar 4–8 minggu, sedangkan pengiriman via Kargo Udara (Air Freight) jauh lebih cepat yaitu sekitar 3–7 hari.',
        },
        {
          question: 'Dokumen apa saja yang diperlukan untuk mengimpor barang dari Malaysia?',
          answer: 'Untuk layanan All-In Door-to-Door ETH Cargo, Anda tidak perlu mengurus izin impor yang rumit. Cukup sediakan informasi detail produk (nama barang, tautan/foto, dimensi, dan jumlah) serta alamat tujuan pengiriman di Indonesia.',
        },
        {
          question: 'Apakah biaya pengiriman sudah termasuk bea masuk dan pajak?',
          answer: 'Ya, benar! Layanan kami menggunakan sistem All-In Door-to-Door, di mana biaya pengiriman internasional, pengurusan bea cukai (customs clearance), pajak impor, hingga biaya pengantaran lokal ke alamat Anda sudah tercakup dalam satu harga transparan.',
        },
        {
          question: 'Bagaimana cara melacak status pengiriman kargo saya?',
          answer: 'Anda dapat memantau posisi kargo secara real-time melalui fitur Live Tracking 24/7 yang tersedia di website ETH Cargo dengan memasukkan nomor resi atau tracking code pengiriman Anda.',
        },
        {
          question: 'Apakah barang kiriman dijamin aman selama perjalanan dari Malaysia?',
          answer: 'Tentu saja. Setiap kargo ditangani secara profesional dengan standar pengemasan yang kuat dan aman. Kami juga menyediakan opsi perlindungan asuransi pengiriman untuk memberikan ketenangan penuh bagi aset bisnis Anda.',
        },
      ],
      quoteTitle: 'Judul ajakan konsultasi (dummy)',
      quoteDescription: 'Deskripsi ajakan konsultasi sementara.',
      calculatorTo: '#rate-estimator',
    },
  },
  {
    slug: 'australia',
    name: 'Australia',
    navigationName: 'Australia',
    routeLabel: 'AUSTRALIA',
    flag: australiaFlagUrl,
    hero: {
      eyebrow: 'Forwarder Australia - Indonesia',
      title: 'Jasa Cargo Australia ke Indonesia',
      description: 'Solusi logistik lintas benua yang efisien dan aman dari Australia ke Indonesia. Percepat rantai pasok B2B Anda dengan sistem All-In Door-to-Door, di mana pengurusan bea cukai hingga pengiriman akhir sepenuhnya kami tangani tanpa biaya tersembunyi.',
      image: heroCargoAustralia,
      imageAlt: 'Jasa Cargo Australia ke Indonesia',
    },
    faq: {
      subtitle: 'Pertanyaan Seputar Kargo Australia',
      description: 'Temukan jawaban lengkap mengenai prosedur pengiriman logistik dari Australia ke Indonesia, estimasi waktu transit via laut dan udara, penanganan bea cukai, serta jaminan keamanan layanan All-In Door-to-Door kami.',
      items: [
        {
          question: 'Berapa estimasi waktu pengiriman kargo dari Australia ke Indonesia?',
          answer: 'Waktu transit bervariasi tergantung moda transportasi yang Anda pilih. Pengiriman via Kargo Laut (Sea Freight) memakan waktu sekitar 4–8 minggu, sedangkan pengiriman via Kargo Udara (Air Freight) jauh lebih cepat yaitu sekitar 3–7 hari.',
        },
        {
          question: 'Dokumen apa saja yang diperlukan untuk mengimpor barang dari Australia?',
          answer: 'Untuk layanan All-In Door-to-Door ETH Cargo, Anda tidak perlu mengurus izin impor yang rumit. Cukup sediakan informasi detail produk (nama barang, tautan/foto, dimensi, dan jumlah) serta alamat tujuan pengiriman di Indonesia.',
        },
        {
          question: 'Apakah biaya pengiriman sudah termasuk bea masuk dan pajak?',
          answer: 'Ya, benar! Layanan kami menggunakan sistem All-In Door-to-Door, di mana biaya pengiriman internasional, pengurusan bea cukai (customs clearance), pajak impor, hingga biaya pengantaran lokal ke alamat Anda sudah tercakup dalam satu harga transparan.',
        },
        {
          question: 'Bagaimana cara melacak status pengiriman kargo saya?',
          answer: 'Anda dapat memantau posisi kargo secara real-time melalui fitur Live Tracking 24/7 yang tersedia di website ETH Cargo dengan memasukkan nomor resi atau tracking code pengiriman Anda.',
        },
        {
          question: 'Apakah barang kiriman dijamin aman selama perjalanan dari Australia?',
          answer: 'Tentu saja. Setiap kargo ditangani secara profesional dengan standar pengemasan yang kuat dan aman. Kami juga menyediakan opsi perlindungan asuransi pengiriman untuk memberikan ketenangan penuh bagi aset bisnis Anda.',
        },
      ],
      quoteTitle: 'Judul ajakan konsultasi (dummy)',
      quoteDescription: 'Deskripsi ajakan konsultasi sementara.',
      calculatorTo: '#rate-estimator',
    },
  },
]

export function multinationalCountryPath(slug: string) {
  return `/multinational-cargo/${slug}`
}
