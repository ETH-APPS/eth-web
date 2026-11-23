<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { blogAuthor } from '~/constants/blogAuthor'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

const guideBanner = illustratedCtaBanners.completeGuide
</script>

<template>
  <div class="mt-6 space-y-8 leading-[1.65] text-text-secondary">
    <div class="space-y-4">
      <p>
        Banyak bisnis tertarik mengimpor dari China karena pilihan produk dan pemasoknya sangat luas, tetapi begitu masuk, pertanyaan praktis langsung bermunculan. Bagaimana cara memilih supplier? Bagaimana membayarnya jika tidak punya rekening di China? Barang dikirim lewat udara atau laut? Dokumen apa yang harus ada? Dan berapa total biayanya?
      </p>
      <p>
        Panduan ini membahas seluruh alurnya dari sudut pandang bisnis: mulai dari persiapan, tujuh langkah proses, pertimbangan biaya udara dan laut, komponen biaya, kesalahan yang sering terjadi, sampai cara memilih forwarder. Anda bisa membacanya berurutan atau langsung melompat ke bagian yang dibutuhkan.
      </p>
    </div>

    <section id="persiapan-impor" class="scroll-mt-28 space-y-4">
      <h2 class="text-[20px] font-semibold text-primary-500">Apa yang Perlu Disiapkan Sebelum Import dari China?</h2>
      <p>Sebelum memesan, siapkan tiga hal berikut ini:</p>
      <ol class="list-decimal space-y-1 pl-6">
        <li>Kejelasan produk yang akan diimpor.</li>
        <li>Anggaran total, bukan hanya harga barang dari supplier.</li>
        <li>Kepastian bahwa barang tersebut boleh diimpor.</li>
      </ol>
      <p>Sebagian barang termasuk larangan atau pembatasan (lartas) yang memerlukan izin khusus dan aturannya bisa berubah.</p>

      <section id="barang-boleh-diimpor" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">Pastikan Barang Boleh Diimpor</h3>
        <p>
          Lartas adalah barang yang dilarang atau dibatasi masuk ke Indonesia dan memerlukan izin tertentu. Kategori yang biasa perlu perhatian ekstra antara lain kosmetik, makanan, obat, dan elektronik yang membutuhkan izin. Karena ketentuannya dapat berubah, cek ke sumber resmi seperti Bea Cukai dan Kementerian Perdagangan, lalu konsultasikan dengan tim forwarder sebelum barang dipesan. Pembahasan lengkapnya ada di artikel tentang barang lartas.
        </p>
      </section>

      <section id="data-pesanan" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">Siapkan Data Dasar Pesanan</h3>
        <p>
          Catat jenis barang, perkiraan jumlah, berat, tanggal tiba, dan alamat tujuan di Indonesia. Data ini membantu forwarder mengarahkan moda kirim yang masuk akal dan menghindari kejutan di tengah proses. Bila bisnis Anda berbadan usaha (PT/CV), siapkan juga informasi perusahaan karena dokumen impor selalu terkait dengan identitas pihak yang mengimpor.
        </p>
      </section>

      <section id="peran-tiap-pihak" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">Pahami Peran Tiap Pihak</h3>
        <p>Dalam satu pengiriman biasanya ada:</p>
        <ul class="list-disc space-y-1 pl-6">
          <li>Supplier di China.</li>
          <li>Penyedia jasa pembayaran, jika Anda tidak punya rekening RMB.</li>
          <li>Gudang transit.</li>
          <li>Perusahaan angkutan.</li>
          <li>Pengurus dokumen impor di Indonesia.</li>
        </ul>
        <p>
          Forwarder biasanya membantu mengoordinasikan sebagian atau seluruh peran ini. Namun, konfirmasi bagian pekerjaan dan biaya yang termasuk dalam layanannya agar tidak ada tanggung jawab yang terlewat.
        </p>
      </section>
    </section>

    <section id="langkah-impor" class="scroll-mt-28 space-y-4">
      <h2 class="text-[20px] font-semibold text-primary-500">7 Langkah Cara Import Barang dari China</h2>
      <p>
        Secara umum, impor dari China berjalan dalam tujuh langkah berurutan: tentukan produk, cari supplier, negosiasi harga, bayar, kirim ke gudang transit, pilih moda kargo, lalu urus dokumen dan terima barang di Indonesia. Melewatkan satu langkah biasanya menimbulkan biaya atau keterlambatan di langkah berikutnya.
      </p>

      <section id="tentukan-produk" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">1. Tentukan Produk dan Cek Ketentuannya</h3>
        <p>
          Tentukan jenis barang secara spesifik, lalu cari klasifikasinya dalam HS Code. Kode ini dipakai untuk menentukan aturan impor dan bea masuk yang berlaku, sehingga kesalahan klasifikasi bisa berdampak pada biaya maupun proses di kepabeanan. Jika barang Anda masuk kategori yang dibatasi, konsultasikan ke tim ETH Cargo sebelum pesanan dibuat. Pastikan juga produk tidak melanggar merek dagang atau hak kekayaan intelektual pihak lain.
        </p>
      </section>

      <section id="nilai-supplier" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">2. Cari dan Nilai Supplier</h3>
        <p>
          Supplier bisa ditemukan di platform perdagangan China seperti 1688, Alibaba, atau Taobao, atau melalui pameran dagang dan rekomendasi rekan bisnis. Jangan memilih hanya dari harga terendah; bandingkan kualitas penawaran, pastikan alamat dan ukuran toko, minta foto atau video barang, dan pesan sampel sebelum membeli dalam jumlah besar.
        </p>
        <p>
          Waspadai tanda bahaya yang umum, misalnya supplier yang menolak memberi detail produk, mendesak Anda untuk segera membayar, atau meminta pembayaran ke rekening yang tidak sesuai identitas nama usahanya. Perhatikan juga biaya di luar harga barang, terutama biaya kirim dan retur, agar transaksi lebih aman.
        </p>
      </section>

      <section id="sepakat-supplier" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">3. Sepakati Harga, MOQ, dan Syarat dengan Supplier</h3>
        <p>
          Catat dengan jelas harga satuan, jumlah minimum order (MOQ), waktu produksi, spesifikasi barang, dan aturan pengemasan. Kesepakatan tertulis, misalnya lewat chat atau pesanan di platform, menjadi pegangan bila ada selisih di kemudian hari.
        </p>
        <p>
          Tanyakan juga siapa yang menyerahkan barang. Istilah dagang (Incoterms) seperti EXW atau FOB menentukan siapa yang menanggung biaya dan risiko di tiap tahap, dari pabrik sampai pelabuhan. Minta supplier menyiapkan commercial invoice dan packing list yang sesuai isi barang, karena keduanya dibutuhkan saat pengurusan dokumen.
        </p>
      </section>

      <section id="bayar-supplier" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">4. Bayar Supplier dalam RMB</h3>
        <p>
          Supplier China umumnya meminta pembayaran dalam RMB (yuan). Bagi bisnis yang tidak punya rekening di China, jasa transfer RMB menjadi jalan keluar. Anda mengirim dana rupiah, lalu penyedia jasa meneruskan dana ke rekening supplier. Ada dua hal yang perlu diperhatikan. Pertama, kurs memengaruhi total biaya, jadi tanyakan kurs yang berlaku ke tim sebelum membayar. Kedua, tanggung jawab penyedia jasa berhenti saat dana masuk ke rekening penerima, sehingga risiko sengketa pembelian tetap perlu diantisipasi sejak awal.
        </p>
        <p>Pembayaran hanya dilakukan ke rekening yang tertera di invoice resmi penyedia jasa. Detail alurnya ada di panduan bayar supplier China tanpa rekening RMB.</p>
      </section>

      <section id="gudang-china" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">5. Kirim Barang ke Gudang Transit di China</h3>
        <p>
          Minta supplier mengirim barang ke gudang transit, misalnya gudang ETH Cargo di Guangzhou. Setiap paket wajib diberi kode marking agar barang dikenali dan tidak tertukar dengan milik pelanggan lain. Format kode unik harus sesuai instruksi dari forwarder, jadi pastikan Anda memberikan format yang benar kepada supplier.
        </p>
        <p>
          Di gudang, barang diterima dan dicek kuantitas serta kondisi luarnya. Perlu dipahami bahwa pengecekan ini tidak sama dengan pengujian kualitas atau fungsi produk. Jika barang dari banyak supplier perlu digabung, gudang transit memungkinkan konsolidasi sebelum dikirim ke Indonesia.
        </p>
      </section>

      <section id="pilih-moda" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">6. Pilih Moda: Udara atau Laut</h3>
        <p>
          Pilihan moda memengaruhi biaya, waktu tiba, dan cara penghitungan tagihan. Barang mendesak dan berukuran kecil biasanya lebih cocok lewat udara, sedangkan barang besar atau dalam jumlah banyak lebih ekonomis lewat laut. Perbandingannya dibahas di bagian berikutnya. Untuk gambaran tarif terbaru, konsultasikan dengan tim ETH Cargo.
        </p>
      </section>

      <section id="dokumen-dan-terima" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">7. Urus Dokumen Impor dan Terima Barang</h3>
        <p>
          Dokumen yang umumnya terlibat adalah commercial invoice, packing list, dokumen pengangkutan (bill of lading untuk laut atau airway bill untuk udara), dan PIB (Pemberitahuan Impor Barang) yang diajukan ke Bea Cukai. Forwarder dapat membantu mengurus dokumen impor sesuai nama perusahaannya, tetapi cakupan layanan tersebut sebaiknya dikonfirmasi per pengiriman.
        </p>
        <p>
          Setelah dokumen selesai, barang tiba di gudang di Jakarta dan diantar ke alamat tujuan. Untuk kargo air door-to-door, pengiriman bisa dilanjutkan melalui ekspedisi pilihan pelanggan. Alamat, dokumen, pajak, dan biaya lain sebaiknya dicek kembali ke sumber resmi. Ringkasannya ada di dokumen impor dan HS Code.
        </p>
      </section>
    </section>

    <section id="pilih-kargo" class="scroll-mt-28 space-y-4">
      <h2 class="text-[20px] font-semibold text-primary-500">Kargo Udara atau Kargo Laut: Mana yang Cocok?</h2>
      <p>
        Kargo udara cocok untuk barang yang dibutuhkan cepat atau berukuran kecil, sedangkan kargo laut lebih sesuai untuk volume besar yang tidak mendesak. Pilihan terbaik bergantung pada urgensi, ukuran barang, dan anggaran Anda. Keduanya sama-sama bisa dipakai bergantian sesuai kebutuhan tiap pesanan.
      </p>
      <div class="max-w-full overflow-x-auto rounded-xl border border-border-200">
        <table class="w-full min-w-[560px] border-collapse text-left text-[13px]">
          <thead class="bg-border-200 text-text-secondary">
            <tr><th class="px-3 py-2 font-medium" scope="col">Keterangan</th><th class="px-3 py-2 font-medium" scope="col">Kargo Udara</th><th class="px-3 py-2 font-medium" scope="col">Kargo Laut</th></tr>
          </thead>
          <tbody class="divide-y divide-border-200">
            <tr><th class="px-3 py-2 font-medium" scope="row">Dasar hitung</th><td class="px-3 py-2">Berat (kg) × tarif per kg</td><td class="px-3 py-2">CBM × tarif per CBM</td></tr>
            <tr><th class="px-3 py-2 font-medium" scope="row">Estimasi Guangzhou–Jakarta</th><td class="px-3 py-2">7–12 hari kerja</td><td class="px-3 py-2">35–55 hari kerja</td></tr>
            <tr><th class="px-3 py-2 font-medium" scope="row">Cocok untuk</th><td class="px-3 py-2">Barang mendesak atau volume kecil</td><td class="px-3 py-2">Volume besar, tidak mendesak</td></tr>
            <tr><th class="px-3 py-2 font-medium" scope="row">Kode marking</th><td class="px-3 py-2">Format udara (AIR)</td><td class="px-3 py-2">Format laut (SEA)</td></tr>
          </tbody>
        </table>
      </div>
      <p>Estimasi di atas dapat berubah mengikuti kebijakan pemerintah dan kondisi pengiriman. Untuk tarif terbaru, hubungi tim marketing ETH Cargo karena tarif tidak tetap.</p>

      <section id="kargo-laut" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">Kargo Laut: Untuk Volume Besar dan Tidak Mendesak</h3>
        <p>
          Kargo laut dihitung berdasarkan volume dalam CBM, sehingga efisien untuk barang yang banyak atau besar dan tidak harus tiba cepat. Bila banyak paket atau pesanan Anda cukup panjang, jalur ini sering menjadi pilihan masuk akal. Lihat layanan kargo laut China ke Jakarta untuk ketentuan lengkapnya.
        </p>
      </section>

      <section id="kargo-udara" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">Kargo Udara: Untuk Barang Mendesak atau Volume Kecil</h3>
        <p>
          Kargo udara dihitung berdasarkan berat dan lebih cepat tiba. Jalur ini cocok untuk sampel, barang pengecekan yang mendesak, atau stok yang hampir habis. Jika volume barang besar tetapi ringan, berat volumetrik dapat dipakai sebagai dasar tagihan bila nilainya lebih besar dari berat aktual. Lihat layanan kargo udara China ke Jakarta untuk ketentuan lengkapnya.
        </p>
      </section>
    </section>

    <section id="biaya-impor" class="scroll-mt-28 space-y-4">
      <h2 class="text-[20px] font-semibold text-primary-500">Komponen Biaya Import dari China yang Perlu Dihitung</h2>
      <p>
        Biaya impor tidak hanya angka kirim. Komponen utamanya adalah harga barang, ongkir lokal di China, biaya transfer atau fee jasa, ongkos kirim udara atau laut, serta pajak dan bea yang perlu diverifikasi ke sumber resmi. Menghitung semuanya sejak awal mencegah selisih antara anggaran dan tagihan akhir. Komponen yang umumnya muncul:
      </p>
      <ol class="list-decimal space-y-1 pl-6">
        <li>Harga barang dari supplier, dalam kurs lalu dikonversi ke rupiah.</li>
        <li>Ongkir lokal China, yaitu biaya kirim dari supplier ke gudang transit.</li>
        <li>Biaya transfer atau fee jasa, bila memakai jasa transfer RMB atau jasa beli.</li>
        <li>Ongkos kirim internasional, dihitung per kg (udara) atau per CBM (laut).</li>
        <li>Pajak dan bea masuk, yang besarannya bergantung pada kategori barang dan ketentuan yang berlaku. Jangan berasumsi nilainya; verifikasi ke sumber resmi atau tim forwarder.</li>
        <li>Biaya tambahan, misalnya sewa gudang jika barang menginap melewati batas waktu, atau packing kayu untuk elektronik atau barang pecah belah.</li>
      </ol>
      <section id="hitung-cbm" class="scroll-mt-28 space-y-4">
        <h3 class="text-[18px] font-semibold text-primary-500">Cara Menghitung Volume (CBM)</h3>
        <p>
          CBM diperoleh dari panjang × lebar × tinggi (dalam cm) dibagi 1.000.000. Sebagai contoh ilustrasi: satu karton berukuran 50 × 40 × 30 cm memiliki volume 60.000 cm³, atau 0,06 CBM. Jika Anda mengirim 20 karton yang sama, total volumenya 1,2 CBM. Angka ini kemudian dikalikan tarif per CBM yang berlaku saat pengiriman.
        </p>
        <p>
          Ukuran kemasan sangat memengaruhi tagihan, jadi minta supplier mencantumkan dimensi per karton di packing list. Langkah perhitungan yang lebih rinci ada di cara hitung CBM. Kalkulator di situs tersedia untuk membantu estimasi, bukan harga final.
        </p>
      </section>
    </section>

    <section id="kesalahan-impor" class="scroll-mt-28 space-y-4">
      <h2 class="text-[20px] font-semibold text-primary-500">Kesalahan Umum Saat Import dari China</h2>
      <p>
        Kesalahan yang paling sering terjadi adalah tidak mengecek status barang sebelum memesan, memilih supplier hanya dari harga, lupa memberi kode marking, dan hanya menghitung ongkos kirim tanpa komponen biaya lain. Semuanya bisa dicegah dengan persiapan di awal.
      </p>
      <ul class="list-disc space-y-1 pl-6">
        <li>Tidak mengecek barang lebih dulu. Barang bisa tertahan atau ditolak jika ternyata memerlukan izin khusus.</li>
        <li>Memilih supplier tanpa verifikasi. Harga murah tidak berarti aman; risiko supplier bermasalah tidak dijamin oleh forwarder.</li>
        <li>Kode marking tidak terpasang. Paket tanpa kode sulit dikenali di gudang dan bisa memperlambat proses.</li>
        <li>Dimensi kemasan tidak dicatat. Tagihan laut bergantung pada volume, jadi kemasan yang besar namun ringan menambah biaya.</li>
        <li>Anggaran hanya mencakup harga barang. Ongkir lokal, kurs, pajak, dan biaya tambahan sering terlupa.</li>
        <li>Membayar ke rekening yang tidak resmi. Pastikan pembayaran hanya ke rekening di invoice resmi dan kepada pihak yang mengatasnamakan penyedia jasa.</li>
      </ul>
    </section>

    <section id="jasa-forwarder" class="scroll-mt-28 space-y-4">
      <h2 class="text-[20px] font-semibold text-primary-500">Kapan Sebaiknya Memakai Jasa Forwarder?</h2>
      <p>
        Forwarder sebaiknya dipertimbangkan bila bisnis Anda mengimpor secara rutin, tidak punya rekening RMB, belum berpengalaman dengan dokumen impor, atau ingin satu pihak yang mengoordinasikan pengiriman dari gudang China sampai alamat tujuan. Untuk impor sesekali dalam jumlah sangat kecil, proses mandiri mungkin masih memungkinkan.
      </p>
      <p>
        Saat memilih forwarder, bandingkan hal-hal yang bisa diverifikasi: kejelasan rumus biaya, syarat dan batas tanggung jawab yang tertulis, ketersediaan gudang transit di China, serta kejelasan cakupan layanan dokumen. Tanyakan juga apakah harga yang ditawarkan sudah mencakup pajak dan bea, karena di situlah sering muncul perbedaan antara perkiraan dan tagihan akhir.
      </p>
    </section>

    <section id="impor-satu-pintu" class="scroll-mt-28 space-y-4">
      <h2 class="text-[20px] font-semibold text-primary-500">Impor dari China Lebih Terkendali dengan Satu Pintu di ETH Cargo</h2>
      <p>Cara import barang dari China sebenarnya bisa dipetakan menjadi langkah yang jelas, asalkan setiap tahap ada yang mengurus.</p>
      <p>
        ETH Cargo adalah forwarder China–Indonesia yang menerima barang di gudang Guangzhou, mengurus pengiriman udara atau laut beserta dokumen impornya, dan mengirimkannya ke Jakarta. Bila diperlukan, kami juga membantu pembelian barang dan pembayaran supplier dalam RMB.
      </p>
      <p>Konsultasi gratis kebutuhan impor bisnis Anda dengan tim CS ETH Cargo sekarang juga!</p>
      <p class="font-medium text-primary-500">Tarif, estimasi waktu, dan ketentuan dapat berubah. Verifikasi ke tim ETH Cargo dan sumber resmi sebelum mengambil keputusan.</p>
    </section>

    <MarketingIllustratedCtaBanner v-bind="guideBanner" variant="compact" :image-top-offset="0" />

    <section aria-labelledby="complete-guide-author" class="hidden rounded-[20px] border border-border-200 bg-bg-0 p-6 shadow-[0_2px_5px_rgba(15,23,42,0.08)] lg:block">
      <div class="grid grid-cols-[76px_minmax(0,1fr)] gap-6">
        <div class="size-[76px] rounded-full bg-[#d9d9d9]" role="img" :aria-label="`Foto profil ${blogAuthor.name}`" />
        <div class="min-w-0">
          <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div class="min-w-0">
              <h2 id="complete-guide-author" class="text-[24px] font-semibold leading-tight text-text-secondary">{{ blogAuthor.name }}</h2>
              <p class="mt-1 text-[16px] font-medium text-text-tertiary">{{ blogAuthor.jobTitle }}</p>
            </div>
            <NuxtLink :to="blogAuthor.to" class="inline-flex min-h-11 shrink-0 items-center gap-2 text-[14px] font-medium text-primary-500 hover:text-primary-600 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
              Lihat Profil <ArrowUpRight :size="16" :stroke-width="2" aria-hidden="true" />
            </NuxtLink>
          </div>
          <p class="mt-5 text-[16px] leading-[1.4] text-text-secondary">{{ blogAuthor.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
