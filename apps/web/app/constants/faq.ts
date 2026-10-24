export interface MarketingFaqItem {
  question: string
  answer: string
}

export interface MarketingFaqContent {
  subtitle: string
  description: string
  items: readonly MarketingFaqItem[]
  quoteTitle: string
  quoteDescription: string
  calculatorTo: string
}

export const homeFaqContent: MarketingFaqContent = {
  subtitle: 'Mengenal ETH Cargo',
  description:
    'Segala hal yang perlu Anda ketahui tentang ETH Cargo, komitmen layanan kami, dan bagaimana kami menjadi mitra terpercaya untuk ekosistem logistik bisnis Anda.',
  items: [
    {
      question: 'Apa itu ETH Cargo?',
      answer:
        'ETH Cargo adalah perusahaan jasa pengiriman barang internasional (freight forwarder) spesialis rute China–Indonesia. Kami berfokus memberikan solusi logistik All-In Door-to-Door yang aman, transparan, dan terintegrasi khusus untuk kebutuhan bisnis (B2B), manufaktur, distributor, dan pelaku usaha di Indonesia.',
    },
    {
      question: 'Mengapa harus memilih ETH Cargo dibandingkan forwarder lain?',
      answer:
        'ETH Cargo menghadirkan keunggulan utama berupa garansi biaya All-In yang transparan tanpa hidden fee, jaringan gudang penerimaan sendiri di titik strategis China, sistem tracking real-time, garansi perlindungan kargo 100%, serta Dedicated Account Manager yang siap mendampingi operasional bisnis Anda.',
    },
    {
      question: 'Apakah ETH Cargo melayani pengiriman resmi & legalitas penuh?',
      answer:
        'Ya. ETH Cargo mengelola seluruh proses kepabeanan (customs clearance) secara resmi dan profesional, lengkap dengan kepengurusan dokumen pajak dan izin impor yang sesuai dengan regulasi pemerintah Indonesia.',
    },
    {
      question: 'Di mana saja lokasi gudang operasional ETH Cargo?',
      answer:
        'Gudang konsolidasi utama kami di China terletak di Guangzhou dan Yiwu. Sementara untuk gudang penerimaan, penyortiran, dan distribusi di Indonesia berpusat di Jakarta untuk menjangkau pengiriman ke seluruh wilayah Indonesia.',
    },
    {
      question: 'Bagaimana komitmen ETH Cargo terhadap keamanan barang?',
      answer:
        'Keamanan kargo adalah prioritas utama kami. Setiap pengiriman yang terdaftar di ETH Cargo dilindungi oleh jaminan asuransi kargo dengan skema ganti rugi hingga 100% untuk memastikan risiko operasional bisnis Anda tetap terproteksi.',
    },
  ],
  quoteTitle: 'Siap Kirim Kargo Impor Anda?',
  quoteDescription:
    'Hitung estimasi pengiriman dengan kalkulator kargo kami, atau konsultasikan kebutuhan impor bisnis Anda langsung bersama tim ahli ETH Cargo.',
  calculatorTo: '#main-services',
}

export const faqContentByPath: Record<string, MarketingFaqContent> = {
  '/': homeFaqContent,
  '/china-cargo': {
    subtitle: 'Seputar Kargo China',
    description:
      'Temukan jawaban mengenai layanan impor China–Indonesia, pilihan jalur pengiriman, estimasi waktu, serta proses pengurusan kargo bersama ETH Cargo.',
    items: [
      {
        question: 'Layanan apa saja yang tersedia untuk pengiriman dari China?',
        answer:
          'ETH Cargo menyediakan pengiriman laut melalui FCL dan LCL, pengiriman udara untuk kebutuhan prioritas, serta layanan All-In Door-to-Door hingga alamat tujuan Anda.',
      },
      {
        question: 'Apa perbedaan pengiriman FCL, LCL, dan Air Cargo?',
        answer:
          'FCL menggunakan satu kontainer penuh untuk satu pengirim, LCL berbagi ruang kontainer sesuai volume barang, sedangkan Air Cargo menggunakan jalur udara untuk waktu transit yang lebih singkat.',
      },
      {
        question: 'Berapa lama estimasi pengiriman dari China ke Indonesia?',
        answer:
          'Estimasi Air Cargo berkisar 3–7 hari, sementara jalur laut FCL atau LCL berkisar 3–4 minggu. Durasi dapat menyesuaikan jadwal keberangkatan dan proses clearance.',
      },
      {
        question: 'Apakah biaya pengiriman sudah termasuk pajak dan clearance?',
        answer:
          'Ya. Penawaran All-In dari ETH Cargo mencakup komponen biaya yang telah disepakati, termasuk pengurusan customs clearance sesuai kategori barang dan ketentuan yang berlaku.',
      },
      {
        question: 'Bagaimana cara memantau posisi barang?',
        answer:
          'Setiap pengiriman dapat dipantau menggunakan Marking ID dan PIN melalui layanan tracking ETH Cargo, dengan dukungan tim customer service apabila Anda membutuhkan bantuan.',
      },
    ],
    quoteTitle: 'Siap Kirim Barang dari China?',
    quoteDescription:
      'Hitung estimasi biaya pengiriman atau konsultasikan pilihan jalur kargo China–Indonesia yang paling sesuai untuk kebutuhan bisnis Anda.',
    calculatorTo: '#rate-estimator',
  },
  '/sea-freight': {
    subtitle: 'Seputar Kargo Laut',
    description:
      'Pelajari pilihan FCL dan LCL, perhitungan volume, estimasi waktu, serta proses pengiriman kargo laut dari China ke Indonesia.',
    items: [
      {
        question: 'Apa perbedaan FCL dan LCL Cargo?',
        answer:
          'FCL menyewa satu kontainer utuh untuk kargo Anda, sedangkan LCL menggabungkan barang beberapa pengirim dalam satu kontainer dan biayanya dihitung berdasarkan volume yang digunakan.',
      },
      {
        question: 'Kapan sebaiknya memilih FCL?',
        answer:
          'FCL ideal untuk volume pengiriman besar, kebutuhan ruang khusus, atau kargo yang membutuhkan kontrol dan keamanan lebih tinggi tanpa bercampur dengan barang pengirim lain.',
      },
      {
        question: 'Berapa lama estimasi pengiriman kargo laut?',
        answer:
          'Estimasi pengiriman FCL maupun LCL umumnya sekitar 3–4 minggu, menyesuaikan jadwal kapal, proses konsolidasi, kondisi pelabuhan, dan customs clearance.',
      },
      {
        question: 'Bagaimana biaya LCL dihitung?',
        answer:
          'Biaya LCL terutama dihitung berdasarkan kubikasi atau CBM, jenis barang, rute pengiriman, serta kebutuhan penanganan dan dokumen khusus jika ada.',
      },
      {
        question: 'Apakah pengiriman laut sudah termasuk layanan door-to-door?',
        answer:
          'Ya. ETH Cargo dapat menangani proses dari gudang China, keberangkatan laut, customs clearance, hingga pengantaran akhir ke alamat tujuan Anda.',
      },
    ],
    quoteTitle: 'Siap Mengirim Kargo Laut Anda?',
    quoteDescription:
      'Hitung estimasi tarif atau konsultasikan pilihan FCL dan LCL yang paling efisien untuk volume pengiriman bisnis Anda.',
    calculatorTo: '#sea-freight-rate-estimator',
  },
  '/air-freight': {
    subtitle: 'Seputar Kargo Udara',
    description:
      'Temukan informasi penting tentang berat volume, jadwal penerbangan, estimasi transit, serta penanganan kargo udara prioritas.',
    items: [
      {
        question: 'Bagaimana tarif Air Cargo dihitung?',
        answer:
          'Tarif dihitung menggunakan nilai yang lebih besar antara berat aktual dan berat volume. Tim ETH Cargo akan membantu melakukan kalkulasi sesuai dimensi serta karakter barang Anda.',
      },
      {
        question: 'Berapa lama estimasi pengiriman kargo udara?',
        answer:
          'Estimasi pengiriman Air Cargo dari China ke Indonesia berkisar 3–7 hari, bergantung pada jadwal penerbangan, lokasi penerimaan, dan proses customs clearance.',
      },
      {
        question: 'Barang apa yang cocok dikirim melalui jalur udara?',
        answer:
          'Jalur udara ideal untuk sampel produk, barang bernilai tinggi, produk fast-moving, stok mendesak, atau pengiriman lain yang sensitif terhadap waktu.',
      },
      {
        question: 'Apakah ETH Cargo menangani dokumen dan clearance?',
        answer:
          'Ya. Tim kami menangani dokumen penerbangan, Air Waybill, proses customs clearance, serta pengantaran hingga alamat tujuan sesuai layanan yang dipilih.',
      },
      {
        question: 'Apakah status kargo udara dapat dilacak?',
        answer:
          'Ya. Status pengiriman dapat dipantau menggunakan sistem tracking ETH Cargo dan didukung pembaruan dari tim operasional kami.',
      },
    ],
    quoteTitle: 'Butuh Pengiriman Udara yang Lebih Cepat?',
    quoteDescription:
      'Hitung estimasi berdasarkan berat aktual atau berat volume, lalu konsultasikan jadwal pengiriman prioritas bersama tim ETH Cargo.',
    calculatorTo: '#air-freight-rate-estimator',
  },
  '/multinational-cargo': {
    subtitle: 'Seputar Kargo Multinasional',
    description:
      'Pelajari cakupan negara, pilihan jalur laut dan udara, serta proses pengiriman internasional untuk kebutuhan logistik lintas negara.',
    items: [
      {
        question: 'Negara mana saja yang dilayani ETH Cargo?',
        answer:
          'Layanan multinasional ETH Cargo mencakup rute ke berbagai pusat perdagangan, termasuk Taiwan, Korea Selatan, Singapura, Thailand, Malaysia, Amerika Serikat, dan Australia.',
      },
      {
        question: 'Apakah tersedia pilihan Sea Freight dan Air Freight?',
        answer:
          'Ya. Anda dapat memilih Sea Freight untuk efisiensi volume besar atau Air Freight untuk pengiriman yang membutuhkan waktu transit lebih singkat.',
      },
      {
        question: 'Bagaimana proses customs clearance internasional?',
        answer:
          'Tim ETH Cargo membantu koordinasi dokumen dan proses clearance berdasarkan regulasi negara asal serta negara tujuan yang berlaku untuk jenis barang Anda.',
      },
      {
        question: 'Bagaimana mendapatkan estimasi biaya pengiriman?',
        answer:
          'Sampaikan negara tujuan, jenis barang, dimensi, berat, dan jumlah koli. Tim kami akan menghitung pilihan layanan serta estimasi biaya yang sesuai.',
      },
      {
        question: 'Apakah pengiriman multinasional dapat dipantau?',
        answer:
          'Ya. Kami menyediakan pembaruan status pengiriman dan dukungan tim operasional selama kargo bergerak menuju negara tujuan.',
      },
    ],
    quoteTitle: 'Siap Mengirim Kargo ke Berbagai Negara?',
    quoteDescription:
      'Hitung estimasi biaya atau konsultasikan rute Sea Freight dan Air Freight yang tepat untuk kebutuhan logistik internasional Anda.',
    calculatorTo: '#rate-estimator',
  },
  '/calculator': homeFaqContent,
}
