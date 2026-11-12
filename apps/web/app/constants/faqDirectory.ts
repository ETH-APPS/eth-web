import type { MarketingFaqItem } from '~/constants/faq'

export interface FaqDirectoryGroup {
  id: string
  title: string
  description: string
  items: readonly MarketingFaqItem[]
}

export const faqDirectoryGroups: readonly FaqDirectoryGroup[] = [
  {
    id: 'pertanyaan-umum',
    title: 'Pertanyaan Umum',
    description:
      'Temukan jawaban atas pertanyaan dasar mengenai identitas, legalitas, dan cakupan layanan logistik dari ETH Cargo.',
    items: [
      {
        question: 'Apa itu ETH Cargo?',
        answer:
          'ETH Cargo (di bawah naungan PT Express Trade Handling) adalah freight forwarder B2B berstatus importir resmi yang membantu korporasi dan pelaku usaha memindahkan barang dari luar negeri ke Indonesia. Kami menangani rantai impor secara end-to-end, mulai dari penerimaan barang di gudang asal, pengiriman (udara/laut), pengurusan izin impor, hingga pengantaran ke alamat tujuan.',
      },
      {
        question: 'Siapa saja yang dapat menggunakan layanan ETH Cargo?',
        answer:
          'Layanan kami dirancang khusus untuk memfasilitasi kebutuhan B2B (Business-to-Business). Kami merupakan mitra logistik yang tepat bagi korporasi, pabrik/manufaktur, importir distributor, tim procurement, hingga UMKM yang membutuhkan kepastian operasional dan transparansi biaya impor.',
      },
      {
        question: 'Apakah ada batas minimal atau maksimal untuk pengiriman/transaksi?',
        answer:
          'Tidak ada. ETH Cargo memberikan fleksibilitas penuh bagi klien bisnis kami. Kami melayani pengiriman tanpa batasan minimal maupun maksimal transaksi, mulai dari pengiriman sampel berukuran kecil hingga pengiriman bahan baku skala besar (grosir/kargo).',
      },
      {
        question: 'Apakah ETH Cargo hanya melayani pengiriman dari China?',
        answer:
          'Meskipun kami adalah spesialis untuk rute China-Indonesia (dengan fasilitas gudang di Guangzhou), ETH Cargo juga menyediakan layanan Kargo Luar Negeri dari berbagai negara lain. Rute internasional yang kami layani mencakup Hongkong, Singapura, Thailand, Korea, hingga Amerika Serikat.',
      },
    ],
  },
  {
    id: 'jasa-cargo-china',
    title: 'Jasa Cargo China',
    description:
      'Temukan jawaban lengkap mengenai operasional pengiriman kargo via laut dan udara, estimasi waktu transit, hingga pengurusan kepabeanan (customs clearance).',
    items: [
      {
        question: 'Apa saja pilihan moda pengiriman kargo dari China ke Indonesia?',
        answer:
          'Kami menyediakan dua layanan utama: Kargo Udara (Air Freight) untuk pengiriman kilat prioritas yang dihitung berdasarkan berat aktual (kg) atau berat volumetrik, dan Kargo Laut (Sea Freight) untuk pengiriman skala besar/grosir yang lebih ekonomis, dihitung berdasarkan kubikasi (CBM).',
      },
      {
        question: 'Berapa lama estimasi waktu pengiriman (transit time) dari gudang Guangzhou ke Jakarta?',
        answer:
          'Berdasarkan prosedur operasional standar, estimasi waktu untuk Kargo Udara adalah 7–12 hari kerja. Sementara itu, estimasi pengiriman Kargo Laut adalah 25–35 hari kerja. (Catatan: Waktu ini merupakan estimasi normal dan dapat beradaptasi mengikuti regulasi pemerintah dan kondisi lapangan).',
      },
      {
        question: 'Apakah harga kargo sudah mencakup pajak impor dan bea cukai?',
        answer:
          'Ya. Layanan kargo kami menerapkan sistem All-In Door-to-Door. Artinya, penawaran harga dari kami sudah mencakup ongkos kirim internasional, pengurusan dokumen impor (customs clearance), pajak, bea masuk, hingga pengantaran ke alamat Anda di wilayah Jakarta dan sekitarnya.',
      },
      {
        question: 'Apa itu kode marking dan mengapa wajib digunakan?',
        answer:
          'Kode marking adalah identitas unik pengiriman Anda (contoh format: ETH / [Nama/Kode Anda] / AIR atau SEA). Kode ini wajib ditempel atau ditulis oleh supplier di setiap resi paket agar kargo Anda dapat teridentifikasi secara akurat saat diterima di gudang transit kami di China. Tanpa kode marking, barang berisiko tidak terdata atau tertukar.',
      },
      {
        question: 'Bagaimana jika kargo mengalami kehilangan atau kecelakaan saat pengiriman?',
        answer:
          'Keamanan aset bisnis Anda adalah prioritas kami. Jika terjadi insiden tak terduga (kehilangan atau kecelakaan), ETH Cargo menyediakan perlindungan asuransi pengiriman. Klaim kompensasi akan dibayarkan secara proporsional sesuai dengan nilai yang tercantum pada faktur pembelian (Commercial Invoice), mengacu pada Syarat dan Ketentuan yang berlaku.',
      },
      {
        question: 'Apakah ETH Cargo menerima pengiriman semua jenis barang?',
        answer:
          'Sebagai importir resmi yang patuh pada aturan hukum, kami menerima sebagian besar komoditas umum. Namun, kami berhak menolak barang yang masuk kategori terlarang, berbahaya (mudah meledak/terbakar), atau barang Lartas (Larangan dan Pembatasan) yang memerlukan perizinan sangat khusus. Silakan konsultasikan rincian barang Anda terlebih dahulu kepada tim spesialis kami.',
      },
    ],
  },
  {
    id: 'jasa-transfer-rmb',
    title: 'Jasa Transfer RMB',
    description:
      'Pahami prosedur layanan perantara pembayaran (remittance) ke supplier China, rincian biaya transfer, serta batas tanggung jawab transaksi dari ETH Cargo.',
    items: [
      {
        question: 'Apa itu layanan Jasa Transfer RMB?',
        answer:
          'Jasa Transfer RMB adalah layanan perantara pembayaran yang membantu korporasi dan tim procurement mentransfer dana secara langsung ke rekening bank lokal, dompet digital Alipay, atau WeChat Pay milik supplier di China. Layanan ini sangat ideal bagi klien yang ingin melakukan pembayaran dalam mata uang Yuan (RMB) namun tidak memiliki rekening bank lokal di China.',
      },
      {
        question: 'Bagaimana cara menghitung total tagihan untuk layanan transfer ini?',
        answer:
          'Kami mengedepankan transparansi tanpa biaya tersembunyi. Total tagihan dihitung menggunakan rumus baku: (Nominal RMB yang ditransfer + Biaya Transfer RMB) × Kurs Harian. Nilai kurs mengikuti pembaruan harian dari bank nasional (BCA), sehingga Anda disarankan untuk menghubungi tim kami guna mengunci kurs (lock rate) hari ini.',
      },
      {
        question: 'Berapa besaran Biaya Admin (Fee Transfer) yang dikenakan?',
        answer:
          'Kami menerapkan sistem biaya transfer bertingkat (bersifat flat) yang sangat efisien untuk berbagai skala transaksi B2B:\n• Transfer di bawah ¥5.000 dikenakan biaya 20 RMB.\n• Transfer ¥5.001 – ¥35.000 dikenakan biaya 60 RMB.\n• Transfer di atas ¥35.000 dikenakan biaya 100 RMB.',
      },
      {
        question: 'Sejauh mana batas tanggung jawab ETH Cargo dalam pengiriman dana ini?',
        answer:
          'ETH Cargo menjamin keamanan proses pengiriman dana dari Indonesia hingga dana tersebut terkonfirmasi berhasil masuk ke rekening tujuan (supplier). Batas tanggung jawab operasional kami selesai pada titik dana diterima oleh sistem penerima. Apabila terjadi insiden lanjutan pasca-penerimaan—seperti pemblokiran (freeze) rekening pihak supplier atau sengketa transaksi dagang—hal tersebut sepenuhnya menjadi risiko dan tanggung jawab pelanggan serta supplier terkait.',
      },
      {
        question: 'Dokumen apa saja yang harus disiapkan untuk melakukan transaksi?',
        answer:
          'Anda hanya perlu melampirkan dokumen pendukung transaksi seperti Commercial Invoice, tautan tagihan, atau bukti pemesanan resmi dari supplier, beserta informasi lengkap rekening tujuan (nomor rekening bank, nama pemilik rekening, atau QR Code Alipay/WeChat Pay yang valid).',
      },
    ],
  },
  {
    id: 'jasa-sourcing-china',
    title: 'Jasa Sourcing China',
    description:
      'Pahami alur pengadaan barang dari ekosistem marketplace China, rincian perhitungan Pembayaran 1 (P1), batasan proses Quality Control (QC), hingga kebijakan pengembalian dana (refund).',
    items: [
      {
        question: 'Apa itu layanan Jasa Sourcing ETH Cargo?',
        answer:
          'Jasa sourcing (jasa beli barang) adalah solusi pengadaan (sourcing) bagi korporasi yang ingin berbelanja langsung dari platform grosir China seperti 1688, Taobao, Tmall, Alibaba, dan JD, namun terkendala bahasa atau tidak memiliki rekening pembayaran lokal. Tim kami akan mengeksekusi pembelian barang tersebut menggunakan rekening perusahaan di China, dan Anda cukup membayarnya dalam mata uang Rupiah.',
      },
      {
        question: 'Bagaimana alur pemesanan dalam layanan ini?',
        answer:
          'Alurnya sangat praktis. Anda cukup menyerahkan rekap pesanan (berupa tautan/link produk, keterangan, jumlah, dan harga) kepada tim kami. Kami akan menghitung estimasi tagihan Pembayaran 1 (P1). Setelah P1 dilunasi, tim kami akan langsung melakukan pembelian. Barang akan dikirim oleh supplier ke gudang kami di Guangzhou untuk selanjutnya diproses ke pengiriman kargo (laut/udara) ke Indonesia.',
      },
      {
        question: 'Bagaimana rumus perhitungan tagihan Pembayaran 1 (P1)?',
        answer:
          'Tagihan Pembayaran 1 (P1) dihitung dengan transparansi penuh menggunakan rumus: (Total belanja + Jasa transaksi (%) + Ongkos kirim lokal China + Biaya transfer) × Kurs. Nilai kurs mengacu pada kurs harian perbankan nasional (BCA). Ongkos kirim lokal China merupakan biaya ekspedisi domestik dari lokasi supplier ke gudang transit ETH di Guangzhou/Yiwu.',
      },
      {
        question: 'Berapa persentase Jasa Transaksi (Fee) yang dikenakan ETH Cargo?',
        answer:
          'Kami menerapkan persentase fee yang semakin efisien (turun) seiring dengan besarnya volume belanja B2B Anda:\n• Total belanja di bawah ¥5.000: Jasa transaksi 7%.\n• Total belanja ¥5.001 – ¥30.000: Jasa transaksi 5%.\n• Total belanja di atas ¥30.000: Jasa transaksi 3%.\n\n(Tersedia special fee hingga 1,5% khusus untuk klien yang telah mencapai level member tertinggi kami).',
      },
      {
        question: 'Apakah tim ETH Cargo menjamin kualitas produk dari supplier?',
        answer:
          'Sebagai mitra logistik, fokus kami adalah kelancaran rantai pasok. Proses Quality Control (QC) yang kami lakukan di gudang China terbatas pada pengecekan kuantitas (jumlah barang) dan kondisi fisik luar kemasan/barang. Kami tidak melakukan pengujian terhadap spesifikasi teknis atau kualitas fungsional produk. Selain itu, demi keamanan operasional, kami berhak menolak pesanan untuk barang terlarang, berbahaya, atau supplier yang terindikasi berisiko tinggi.',
      },
      {
        question: 'Bagaimana kebijakan refund jika stok supplier habis atau bermasalah?',
        answer:
          'Apabila transaksi gagal diproses karena stok barang supplier habis atau terdapat masalah lain sebelum pembelian tereksekusi, kami akan mengembalikan dana (refund) sesuai dengan nilai barang tersebut (tidak termasuk fee jasa transaksi yang mungkin sudah terproses). Namun, harap diperhatikan bahwa setelah transaksi pembelian berhasil dilakukan dan dibayarkan kepada pihak supplier, dana Anda tidak dapat dikembalikan.',
      },
    ],
  },
]