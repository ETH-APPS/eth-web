# Rencana lanjutan SEO ETH Cargo

Terakhir diperbarui: 10 November 2026 (Asia/Jakarta).
Status: **Tahap 1.1 selesai; implementasi Tahap 1.2, audit SSR Tahap 1.4, dan
verifikasi hydration/navigasi SPA sampel selesai di workspace lokal**. Tahap 1.3
ditunda sampai integrasi API blog. Persiapan repository Tahap 2 serta implementasi
lokal Tahap 3 sudah selesai. Konfigurasi VM dan schema/canonical homepage pada
Quick Tunnel sudah diverifikasi; domain final, pemeriksaan publik yang lebih luas,
dan Search Console belum dilakukan. Dokumen ini tidak merupakan izin melakukan
commit atau push.

## Tujuan dan konteks

Perbaiki semantik, ketepatan respons halaman, dan kesiapan SEO produksi tanpa
mengubah styling, layout, interaksi yang valid, atau wording existing.

Baca [progres SEO](progress.md), [instruksi repository](../../AGENTS.md),
[arsitektur frontend](../frontend-architecture.md), dan
[pedoman responsive](../responsive-guidelines.md) sebelum implementasi. Periksa git
status serta staged/unstaged diff dan pertahankan pekerjaan pengguna.

Temuan yang mendasari rencana:

- SSR sudah aktif. Audit 25 URL lokal menemukan konten pada HTML respons awal.
  Tidak diperlukan konversi ke SSR atau penambahan `ssr: true` untuk mengaktifkannya.
- Audit awal menemukan `/blog/search` dan `/blog/tags` belum memiliki H1; temuan
  tersebut sudah ditangani pada Tahap 1.1 dan `noindex, follow` tetap dipertahankan.
- Audit awal menemukan `lang="id"` baru dipasang khusus homepage; Tahap 1.2 sudah
  memindahkannya ke konfigurasi head global Nuxt.
- Detail blog membentuk judul dari slug yang tidak dikenal, sehingga URL yang
  tidak mewakili artikel dapat tetap dirender sebagai artikel.
- Audit awal menemukan spec deployment belum meneruskan
  `NUXT_PUBLIC_SITE_URL`; persiapan repository Tahap 2 sekarang sudah
  meneruskannya. Pada 10 November, konfigurasi tersebut dipasang di VM dan
  schema homepage terlihat pada HTML Quick Tunnel.
- Audit awal belum menemukan canonical dan sitemap; implementasi lokal Tahap 3
  sekarang sudah menambah keduanya serta mengganti `robots.txt` statis dengan
  route dinamis. Canonical homepage sudah terlihat pada Quick Tunnel; sitemap
  dan robots belum diperiksa ulang setelah deploy.

Temuan merupakan snapshot repository dan audit lokal, bukan bukti kondisi container
Cloudflare yang aktif. Schema glossary tetap dilewati sesuai permintaan pengguna.

## Tahap 1 — Perbaikan teknis lokal

### 1. H1 untuk halaman pencarian dan tag blog

- [x] Di `apps/web/app/components/marketing/blog/AllArticles.vue`, gunakan heading
  dinamis: `h2` untuk varian `directory`, `h1` untuk `search-results` dan `tag-results`.
- [x] Pertahankan teks `All Article`, `Search Result`, dan `Tags`, beserta ID,
  class, dan atribut heading existing. Jangan menambahkan heading duplikat.
- [x] Pastikan `/blog` tetap memiliki tepat satu H1 dan heading section-nya H2.

### 2. Bahasa dokumen global

- [x] Pasang `htmlAttrs: { lang: 'id' }` pada konfigurasi head global Nuxt.
- [x] Hapus deklarasi khusus homepage yang menjadi redundant; jangan mengubah
  metadata atau schema homepage lainnya.
- [x] Periksa HTML direct-request pada 25 URL audit; semuanya memuat tepat satu
  `lang="id"` dan menghasilkan HTTP 200.
- [x] Periksa kembali setelah navigasi SPA di browser. Audit Chrome headless pada
  10 November 2026 memastikan head metadata route sampel tetap benar setelah
  hydration; `lang="id"` tetap berasal dari konfigurasi global dan Safari masih
  belum diuji.

### 3. Validasi artikel dan HTTP 404

Ditunda sampai integrasi API blog agar validasi memakai sumber data artikel yang
sebenarnya, bukan membuat daftar slug statis sementara. Jika versi placeholder
akan dibuka untuk indexing sebelum API siap, keputusan ini perlu ditinjau ulang.

- [ ] Buat sumber validasi slug bersama dari daftar slug artikel yang dikenal
  serta ID aktual pada daftar artikel existing. Periksa seluruh tautan featured,
  popular, kategori, daftar, dan related articles agar tautan valid tetap bekerja.
- [ ] Jangan membuat whitelist terpisah yang dapat menyimpang dari sumber artikel.
  Pertahankan judul, tanggal placeholder, gambar, dan isi artikel valid.
- [ ] Validasi route `/blog/[slug]` sebelum memasang schema. Artikel yang tidak ada
  menghasilkan HTTP 404 melalui mekanisme Nuxt, bukan halaman artikel HTTP 200.
- [ ] Hapus fallback pembentukan judul untuk sembarang slug. Jangan menerima
  angka artikel di luar daftar yang tersedia atau alias seperti `article-01`
  apabila ID tersebut tidak terdaftar.
- [ ] Pastikan halaman error tidak mengandung `BlogPosting` artikel sebelumnya.
  Tidak perlu membuat desain error baru dalam scope ini.

### 4. Metadata saat navigasi

- [x] Pertahankan `noindex, follow` pada pencarian/tag blog. Direct-request SSR
  juga memastikan search/tag tidak memuat schema artikel atau daftar blog.
- [x] Uji perpindahan search/tag, detail blog, dan daftar blog. Metadata robots,
  title, `lang`, canonical, dan JSON-LD mengikuti halaman aktif serta tidak
  tertinggal pada audit Chrome headless. Safari masih belum diuji.

## Tahap 2 — Konfigurasi dan validasi deployment

Persiapan repository dan pemasangan di VM sudah dilakukan. Pengujian domain final
tetap menjadi langkah operasional terpisah.

**Audit awal 9 November 2026:** Quick Tunnel
`https://runtime-keith-plaza-naval.trycloudflare.com` masih aktif dan boleh dipakai
untuk pengujian sementara. Direct-request ke `/` dan `/blog` menghasilkan HTTP
200, tetapi runtime `siteUrl` masih kosong dan schema tidak muncul. Homepage masih
memiliki `lang="id"`, sedangkan `/blog` belum, sehingga deployment juga belum
memuat perubahan lokal Tahap 1.2. Audit ini hanya memeriksa kondisi publik; belum
ada konfigurasi repository, VM, container, atau tunnel yang diubah pada saat
audit. Persiapan repository kemudian diselesaikan. Pada 10 November konfigurasi
VM dipasang dan schema/canonical homepage diverifikasi melalui Quick Tunnel.

- [x] Tambahkan mekanisme runtime environment untuk `NUXT_PUBLIC_SITE_URL` pada
  Compose bootstrap dan spec web-only. Simpan nilai environment aktual di VM,
  jangan hardcode domain sementara atau memasukkan secret ke repository.
- [x] Cocokkan mekanisme tersebut dengan helper deployment: helper memakai
  environment bersih dan `--env-file /dev/null`, sehingga `.env` lokal tidak
  otomatis diteruskan. Jangan hanya menambahkan variabel ke laptop.
- [x] Dokumentasikan lokasi konfigurasi runtime, cara pemasangan, dan validasi
  spec di `deploy/README.md`. Salinan Compose/helper root-owned di VM tidak
  otomatis diperbarui oleh push frontend.
- [x] Uji build production dengan site URL terisi dan kosong: nilai terisi memberi
  schema ber-origin benar; nilai kosong tetap mengikuti behavior existing.
- [x] Gunakan URL Cloudflare aktif untuk pengujian sementara dan ganti hanya
  container web; gateway/tunnel tetap berjalan.
- [ ] Saat domain final tersedia, ganti nilai site URL dan jalankan ulang deploy
  web secara terencana.
- [ ] Verifikasi HTML publik: H1, konten utama, metadata, schema, dan URL gambar
  tersedia dengan origin yang benar pada halaman prioritas. Schema dan canonical
  homepage pada Quick Tunnel sudah lolos; cakupan lain masih menunggu.

**Prasyarat operasional berikutnya:** konfirmasi domain final dan akses operator
sebelum mengganti konfigurasi. Jangan menganggap URL Quick Tunnel tetap berlaku.

## Tahap 3 — Canonical dan sitemap sebelum peluncuran SEO

**Prasyarat operasional:** domain final dan daftar konten yang siap diindeks harus
dikonfirmasi sebelum aktivasi publik/Search Console. Implementasi lokal memakai
runtime site URL dan sitemap konservatif agar tidak mempublikasikan detail blog
atau glossary placeholder.

- [x] Tambahkan canonical absolut dengan domain yang konsisten dengan schema.
  Buang fragment dan parameter pelacakan. Tentukan kebijakan untuk parameter
  pengubah konten sebelum implementasi; jangan membuang semua query tanpa audit.
- [x] Buat `/sitemap.xml` berisi URL canonical yang valid, HTTP 200, dan siap
  diindeks. Kecualikan pencarian/tag `noindex`, halaman error, serta placeholder
  yang belum disetujui untuk publikasi. Jangan mengarang `lastmod`.
- [x] Tambahkan URL sitemap pada `robots.txt`. Jangan memblokir crawling halaman
  yang perlu dibaca crawler untuk menemukan instruksi `noindex`.
- [x] Perlakukan Quick Tunnel sebagai lingkungan validasi sementara, bukan target
  indexing atau Search Console. `robots.txt` tetap mengizinkan crawling agar
  instruksi `noindex` dapat dibaca. Sitemap ada pada image yang di-deploy,
  tetapi respons publiknya belum diverifikasi setelah deploy. Respons Quick
  Tunnel juga mengirim `X-Robots-Tag: none`; periksa kebijakan header pada domain
  final sebelum indexing.
- [ ] Konfirmasi apakah lingkungan domain final merupakan staging atau target
  indexing sebelum mengubah kebijakan indexing. `robots.txt` mengatur crawling;
  pencegahan indexing menggunakan `noindex` atau pembatasan akses yang sesuai.
- [ ] Setelah domain final aktif, verifikasi kepemilikan di Search Console dan
  kirim sitemap melalui akun yang diotorisasi.

Canonical merupakan sinyal pilihan URL utama, bukan jaminan pilihan Google.
[Panduan canonical Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
Perbedaan crawling dan indexing dijelaskan dalam
[panduan robots.txt Google](https://developers.google.com/search/docs/crawling-indexing/robots/intro).

## Verifikasi dan kriteria selesai

- [x] Jalankan `pnpm --filter ./apps/web build`, pemeriksaan tipe yang tersedia
  sesuai repository, dan `git diff --check`.
- [x] Ulangi pemeriksaan 25 URL di [arsip audit](audit-history.md): HTTP 200 untuk URL valid,
  konten utama dalam HTML awal, satu H1, `lang="id"`, dan schema sesuai halaman.
- [ ] Uji slug valid serta `artikel-tidak-ada`, `article-0`, `article-01`, dan
  `article-99999`: yang tidak terdaftar harus HTTP 404 tanpa `BlogPosting`.
  Uji lewat direct request dan navigasi aplikasi.
- [x] Uji hydration browser, navigasi SPA, pagination blog, dan accordion FAQ;
  tidak ditemukan metadata tertinggal atau hydration mismatch pada sampel audit.
- [ ] Untuk perubahan heading, ambil baseline visual lalu cek viewport 320, 390,
  768, 1023, 1024, 1280, dan 1440px sesuai pedoman responsive. Tampilan, wrapping,
  focus state, dan overflow tidak boleh mengalami regresi; bandingkan screenshot
  390px dan 1440px. Laporkan bila referensi Figma tidak dapat diakses.
- [ ] Untuk tahap domain final, periksa canonical/sitemap/schema memakai origin
  yang sama, URL `noindex` tidak masuk sitemap, serta seluruh URL sitemap valid.
  Canonical dan schema homepage sudah terlihat pada Quick Tunnel.
- [x] Perbarui `progress.md` per tahap: perubahan, bukti verifikasi, batasan,
  dan status lokal versus deployment. Jangan centang pekerjaan yang belum diuji.

## Pekerjaan lanjutan di luar implementasi ini

- Audit performa dan Core Web Vitals berdasarkan pengukuran, baru tentukan
  optimasi gambar, font, JavaScript, atau caching yang diperlukan.
- Audit metadata berbagi (Open Graph/Twitter) dan preview gambar secara terpisah.
- Finalisasi konten dan tanggal artikel bersama pemilik konten. Jangan mengganti
  lorem ipsum atau wording tanpa permintaan pengguna.
- Tidak menambah schema glossary, mengubah desain, atau mengerjakan backend.

Urutan: **Tahap 1 → konfigurasi dan verifikasi deployment → canonical dan sitemap
setelah domain serta konten siap**. Bagian 1.1, implementasi 1.2, dan audit SSR
1.4 telah dijalankan. Tahap 1.3 ditunda sampai API blog; hydration dan navigasi
SPA sampel untuk 1.2/1.4 sudah diverifikasi dengan Chrome headless. Persiapan
repository Tahap 2 sudah selesai;
pemasangan VM dan verifikasi schema/canonical homepage Quick Tunnel sudah
dilakukan. Implementasi lokal Tahap 3 sudah selesai; pemeriksaan halaman dan
endpoint publik lain, aktivasi domain final, dan Search Console tetap menunggu.
