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
        question: 'Apa saja yang sudah termasuk dalam tarif pengiriman All-In ETH Cargo?',
        answer:
          'Tarif All-In kami sudah mencakup ongkos kirim internasional (laut/udara), biaya bongkar muat di gudang China & Indonesia, bea masuk clearance, pajak impor (PPN & PPh), serta pengantaran Door-to-Door langsung ke alamat gudang Anda tanpa ada biaya tersembunyi.',
      },
      {
        question: 'Bagaimana cara perhitungan biaya untuk pengiriman kargo laut (LCL & FCL)?',
        answer:
          'Untuk LCL (Less Container Load), biaya dihitung berdasarkan volume barang dalam kubikasi (CBM). Sedangkan untuk FCL (Full Container Load), biaya dihitung flat per unit kontainer (ukuran 20ft atau 40ft) tanpa mempedulikan berat kargo.',
      },
      {
        question: 'Berapa batas minimum pengiriman (MOQ) untuk kargo laut dan udara?',
        answer:
          'Minimum pengiriman Kargo Laut (LCL) adalah 0.1 CBM, sementara Kargo Udara (Air Freight) mulai dari 1 kg. Untuk skema FCL, minimum pengiriman adalah 1 kontainer utuh.',
      },
      {
        question: 'Berapa lama estimasi waktu pengiriman dari China ke Indonesia?',
        answer:
          'Estimasi pengiriman Kargo Laut (FCL/LCL) membutuhkan waktu sekitar 3 hingga 4 minggu sejak kapal berlayar. Untuk Kargo Udara Express, estimasi ketibaan adalah 3 hingga 7 hari kerja sejak kargo diberangkatkan.',
      },
      {
        question: 'Bagaimana prosedur penerimaan barang di gudang Guangzhou & Yiwu?',
        answer:
          'Setelah mendapatkan Kode Marking dari tim kami, instruksikan supplier untuk mengirim kargo ke alamat gudang kami di Guangzhou atau Yiwu dengan mencantumkan Kode Marking tersebut pada kemasan/koli. Tim kami di China akan melakukan verifikasi & penimbangan saat kargo tiba.',
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
        question: 'Apa perbedaan utama antara pengiriman FCL dan LCL?',
        answer:
          'FCL (Full Container Load) adalah sewa kontainer utuh khusus kargo Anda tanpa bercampur barang lain, sangat ideal untuk volume besar. Sedangkan LCL (Less Container Load) adalah pengiriman eceran di mana barang Anda berbagi ruang kontainer dengan pengirim lain dan biayanya dihitung berdasarkan kubikasi (CBM).',
      },
      {
        question: 'Bagaimana cara menghitung kubikasi (CBM) untuk pengiriman LCL?',
        answer:
          'CBM dihitung dengan rumus: Panjang (m) × Lebar (m) × Tinggi (m) × Jumlah Koli. Minimum pengiriman LCL di ETH Cargo adalah 0.1 CBM, sehingga sangat fleksibel untuk pengiriman skala kecil hingga menengah.',
      },
      {
        question: 'Berapa lama estimasi waktu pengiriman jalur laut dari China ke Indonesia?',
        answer:
          'Estimasi ketibaan kargo laut (FCL & LCL) dari China ke Indonesia adalah sekitar 3 hingga 4 minggu terhitung sejak kapal berlayar dari pelabuhan di China (Guangzhou/Yiwu) hingga tiba di gudang Jakarta.',
      },
      {
        question: 'Apakah harga kargo laut All-In sudah termasuk dokumen ekspor dan bea cukai?',
        answer:
          'Ya, tarif All-In kargo laut kami sudah mencakup ongkos pelayaran, pajak impor (PPN/PPh), biaya clearance bea cukai resmi, serta pengantaran akhir (Door-to-Door) sampai ke gudang Anda tanpa biaya tersembunyi.',
      },
      {
        question: 'Barang apa saja yang dilarang dikirim melalui kargo laut?',
        answer:
          'Kami tidak melayani pengiriman barang ilegal, bahan kimia berbahaya (HAZMAT) tanpa dokumen MSDS, senjata, narkotika, serta barang imitasi/KW tanpa lisensi resmi. Untuk kepastian jenis barang Anda, silakan konsultasikan dengan tim kami.',
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
        question: 'Berapa lama estimasi waktu pengiriman (ETA) untuk kargo udara?',
        answer:
          'Estimasi pengiriman Kargo Udara dari China ke Indonesia adalah 3 hingga 7 hari kerja terhitung sejak penerbangan kargo diberangkatkan dari bandara China (Guangzhou/Shenzhen) hingga kargo selesai diurus bea cukainya dan siap dikirim ke gudang Anda.',
      },
      {
        question: 'Bagaimana cara perhitungan berat kargo udara (Berat Volumetrik vs Berat Aktual)?',
        answer:
          'Biaya dihitung berdasarkan nilai terbesar antara Berat Aktual (timbangan) dan Berat Volumetrik. Rumus berat volumetrik udara adalah: [Panjang (cm) × Lebar (cm) × Tinggi (cm)] ÷ 6.000. Nilai tertinggi dari keduanya akan menjadi dasar tagihan (chargeable weight).',
      },
      {
        question: 'Berapa batas minimum pengiriman (MOQ) untuk layanan Air Cargo?',
        answer:
          'Batas minimum pengiriman kargo udara di ETH Cargo adalah 1 kg. Opsi ini sangat ideal bagi bisnis yang butuh mengirimkan sampel produk, kargo mendesak, atau komponen stok berukuran kecil.',
      },
      {
        question: 'Apakah kargo udara melayani pengiriman barang sensitif seperti cairan, baterai, atau kosmetik?',
        answer:
          'Ya, kami menyediakan penanganan khusus untuk barang sensitif (DG / Dangerous Goods & Sensitive Cargo) seperti kosmetik, elektronik berdosis baterai, dan cairan berizin. Namun, diperlukan sertifikat SDS/MSDS resmi dari supplier untuk persetujuan maskapai penerbangan.',
      },
      {
        question: 'Apakah tarif kargo udara All-In sudah termasuk pajak impor dan pengantaran ke alamat?',
        answer:
          'Ya, skema tarif All-In udara kami sudah mencakup freight cost, bea masuk, pajak impor (PPN/PPh), clearance resmi bandara, serta layanan Door-to-Door langsung ke alamat tujuan Anda.',
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
  '/calculator': {
    subtitle: 'Seputar Kalkulator Impor',
    description:
      'Pelajari cara kerja kalkulator, dasar perhitungan berat, cakupan tarif All-In, minimum pengiriman, dan status hasil estimasi biaya.',
    items: [
      {
        question: 'Bagaimana cara kerja kalkulator tarif impor ETH Cargo?',
        answer:
          'Kalkulator ini menghitung estimasi biaya awal berbasis ukuran dimensi (Panjang × Lebar × Tinggi) serta berat kotor (gross weight) paket Anda. Sistem akan otomatis membandingkan berat volume dan berat fisik untuk menentukan tarif pengiriman All-In Door-to-Door yang paling efisien.',
      },
      {
        question: 'Apa perbedaannya perhitungan berat aktual (kg) dan berat volume (CBM)?',
        answer:
          'Untuk pengiriman Kargo Laut (Sea Freight), tarif dihitung berdasarkan kubikasi/volume (CBM). Sedangkan untuk Kargo Udara (Air Freight), tarif menggunakan perbandingan antara berat timbangan aktual (kg) dan berat volume (P x L x T / 6000). Tagihan akan mengacu pada nilai terbesar di antara keduanya.',
      },
      {
        question: 'Apakah harga yang tertera di kalkulator ini sudah termasuk pajak & Bea Cukai (All-In)?',
        answer:
          'Ya, estimasi tarif layanan ETH Cargo sudah mencakup seluruh biaya pengiriman internasional, pengurusan customs clearance di pelabuhan/bandara, pajak impor, hingga pengantaran ke gudang/lokasi Anda di Indonesia (All-In Door-to-Door).',
      },
      {
        question: 'Berapa minimum pengiriman (minimum order) untuk Kargo Laut dan Udara?',
        answer:
          'Untuk Kargo Laut LCL, minimum pengiriman umumnya adalah 0,1 CBM atau 1 koli/dus. Sedangkan untuk Kargo Udara Express, minimum pengiriman mulai dari 1 kg atau 5 kg tergantung pada kategori barang yang dikirim.',
      },
      {
        question: 'Apakah hasil kalkulasi di web ini bersifat final?',
        answer:
          'Perhitungan ini bersifat estimasi transparan awal. Total biaya final yang presisi akan dikonfirmasi ulang oleh tim kami setelah barang ditimbang dan diukur secara akurat saat tiba di gudang transit China ETH Cargo.',
      },
    ],
    quoteTitle: 'Siap Menghitung Tarif Impor Anda?',
    quoteDescription:
      'Masukkan detail barang pada kalkulator atau konsultasikan kebutuhan pengiriman Anda bersama tim ETH Cargo.',
    calculatorTo: '#calculator-estimator',
  },
  '/transfer-rmb': {
    subtitle: 'Seputar Transfer RMB',
    description:
      'Temukan informasi mengenai waktu pemrosesan, bukti transfer resmi, nilai kurs, keamanan transaksi, serta batas nominal layanan Transfer RMB ETH Cargo.',
    items: [
      {
        question: 'Berapa lama waktu yang dibutuhkan sampai dana masuk ke rekening supplier di China?',
        answer:
          'Untuk transaksi via Alipay dan WeChat Pay, dana umumnya langsung masuk secara instan hingga maksimal 1–2 jam. Untuk transfer ke rekening bank lokal China (seperti Bank of China/UnionPay), estimasi pemrosesan adalah pada hari yang sama (Same-Day Transfer) jika konfirmasi pembayaran dilakukan sebelum batas waktu operasional.',
      },
      {
        question: 'Apakah saya mendapatkan bukti transfer resmi setelah transaksi selesai?',
        answer:
          'Ya. Setelah transaksi berhasil diproses oleh sistem kami, Anda akan langsung menerima bukti transfer digital resmi (bank receipt / payment voucher) yang berisi rincian tanggal, nama penerima, nominal RMB, dan nomor referensi transaksi sebagai dokumen pendukung pembukuan bisnis Anda.',
      },
      {
        question: 'Bagaimana menentukan nilai kurs RMB yang berlaku untuk transaksi saya?',
        answer:
          'Nilai kurs RMB menggunakan patokan harga real-time transparan yang diperbarui setiap hari sesuai fluktuasi pasar finansial. Kurs yang Anda dapatkan akan dikunci (rate lock) saat Anda mengonfirmasi pesanan transfer bersama Account Manager kami.',
      },
      {
        question: 'Apakah aman bayar ke supplier via 1688 / Taobao / Alipay tanpa risiko pembekuan akun?',
        answer:
          'Sangat aman. ETH Cargo menggunakan saluran transaksi resmi dan legal yang terverifikasi. Kami memastikan seluruh proses bantu bayar (Pay for Others) maupun transfer Alipay mematuhi regulasi perbankan sehingga terhindar dari risiko pembekuan akun (account freeze).',
      },
      {
        question: 'Berapa batas minimum dan maksimum transfer RMB di ETH Cargo?',
        answer:
          'Kami melayani transaksi mulai dari skala kecil hingga order B2B bernilai besar. Tidak ada batasan ketat untuk transaksi perusahaan; tim kami siap memproses pembayaran bernilai tinggi sesuai dengan invoice dan kebutuhan belanja supplier Anda.',
      },
    ],
    quoteTitle: 'Siap Membayar Supplier China Anda?',
    quoteDescription:
      'Hitung estimasi pembayaran atau konsultasikan kebutuhan transfer RMB bisnis Anda bersama tim ETH Cargo.',
    calculatorTo: '#rmb-calculator',
  },
  '/sourcing': {
    subtitle: 'Seputar Jasa Sourcing',
    description:
      'Temukan jawaban mengenai verifikasi supplier, pemesanan sampel, biaya layanan, integrasi pengiriman kargo, serta persiapan awal untuk memulai proses sourcing di China.',
    items: [
      {
        question: 'Bagaimana cara ETH Cargo memastikan supplier di China aman dan bukan penipu?',
        answer:
          'Tim kami verifikasi legalitas perusahaan (business license), mengecek rekam jejak transaksi di marketplace seperti 1688/Alibaba, serta dapat melakukan audit pabrik langsung untuk memastikan kredibilitas dan kapasitas produksi supplier sebelum Anda melakukan transaksi.',
      },
      {
        question: 'Apakah saya bisa meminta sampel produk (sample check) terlebih dahulu sebelum order skala besar?',
        answer:
          'Bisa. Kami akan memfasilitasi pembelian dan pengiriman sampel produk langsung dari supplier China ke alamat Anda di Indonesia via Air Cargo express, sehingga Anda dapat mengecek kualitas dan spesifikasi fisik barang sebelum menyetujui pemesanan massal (bulk order).',
      },
      {
        question: 'Bagaimana skema biaya atau komisi untuk layanan Jasa Sourcing ini?',
        answer:
          'Biaya layanan sourcing dihitung secara transparan berdasarkan kompleksitas pencarian dan nilai transaksi produk Anda. Seluruh rincian biaya komisi, estimasi pengiriman kargo All-In, serta pajak/bea cukai diinfokan secara jujur di awal tanpa biaya tersembunyi.',
      },
      {
        question: 'Apakah saya harus menggunakan pengiriman kargo ETH Cargo setelah proses sourcing selesai?',
        answer:
          'Ya, layanan sourcing kami terintegrasi langsung dengan ekosistem pengiriman kargo (Laut FCL/LCL & Udara) ETH Cargo. Hal ini memastikan proses konsolidasi barang di gudang China, inspeksi kualitas, hingga pengurusan bea cukai berjalan mulus satu pintu tanpa kendala pihak ketiga.',
      },
      {
        question: 'Informasi apa saja yang perlu saya siapkan untuk memulai permintaan sourcing?',
        answer:
          'Anda cukup menyiapkan foto/spesifikasi produk, link referensi (jika ada dari 1688/Taobao/Alibaba), target harga modal yang diinginkan, serta estimasi kuantitas yang ingin dipesan. Tim kami akan langsung memproses pencarian supplier terbaik sesuai kriteria Anda.',
      },
    ],
    quoteTitle: 'Siap Menemukan Supplier Terpercaya?',
    quoteDescription:
      'Konsultasikan kebutuhan produk Anda dan mulai proses sourcing bersama tim ETH Cargo.',
    calculatorTo: '#sourcing-workflow',
  },
  '/complete-guide': {
    subtitle: 'Frequently Asked Question',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
    items: [
      {
        question: 'Lorem Ipsum',
        answer:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
      },
      {
        question: 'Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.',
        answer:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
      },
      {
        question: 'Lorem Ipsum',
        answer:
          'Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.',
      },
      {
        question: 'Lorem Ipsum',
        answer:
          'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.',
      },
      {
        question: 'Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
        answer:
          'Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
      },
      {
        question: 'Lorem Ipsum',
        answer:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit. Tempus leo eu aenean sed diam urna tempor.',
      },
    ],
    quoteTitle: 'Lorem Ipsum',
    quoteDescription: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    calculatorTo: '/calculator',
  },
}
