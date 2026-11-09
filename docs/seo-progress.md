# Progres SEO ETH Cargo

Terakhir diperbarui: 9 November 2026 (Asia/Jakarta).

Dokumen handoff untuk melanjutkan pekerjaan SEO di `apps/web`. Status di bawah
menggabungkan implementasi yang diperiksa di workspace dan hasil validasi yang
dikirim pengguna dalam percakapan. Ini bukan audit SEO produksi menyeluruh.

## Kesepakatan dengan pengguna

- Pertahankan styling, layout, interaksi, dan wording yang sudah sesuai Figma.
- Placeholder, termasuk lorem ipsum, jangan diganti tanpa permintaan pengguna.
- Kerjakan SEO bertahap per halaman. Schema glossary sengaja dilewati atas
  permintaan pengguna; jangan otomatis menambahkannya.
- Pengguna menyatakan cakupan schema saat ini cukup. Daftar tindak lanjut di bawah
  adalah catatan untuk pekerjaan berikutnya, bukan izin memperluas scope.
- Baca `AGENTS.md` dan pedoman frontend yang relevan sebelum mengedit frontend.
- Periksa staged dan unstaged changes; jangan menimpa pekerjaan lain.

## Semantik HTML

Fase sebelumnya berfokus pada elemen HTML yang sesuai fungsi, hierarki heading,
dan satu `h1` per halaman, dengan mempertahankan tampilan dan wording.

Halaman yang tercakup dalam rangkaian pemeriksaan/perapian sebelumnya:

- `/`
- `/china-cargo`, `/multinational-cargo`, `/sea-freight`, `/air-freight`
- `/transfer-rmb`, `/sourcing`
- `/calculator`, `/calculator-transfer-rmb`, `/live-tracking`
- `/about-us`, `/faq`, `/terms-and-conditions`, `/promo`
- `/blog` dan detail blog, termasuk `/blog/popular-supplier-payment`
- `/complete-guide`, `/glossary`

Daftar ini merupakan riwayat cakupan, bukan pernyataan bahwa setiap halaman
memerlukan perubahan atau telah diaudit ulang saat dokumen ini dibuat. Jika
komponen berubah, periksa kembali DOM hasil render dan heading-nya. Jangan
menganggap seluruh dynamic route otomatis sudah terverifikasi.

## Schema markup yang sudah diimplementasikan

Semua path file pada tabel relatif terhadap `apps/web/app/`.

| Halaman | Schema | Lokasi implementasi | Status validator dari pengguna |
| --- | --- | --- | --- |
| `/` | `Organization`, `WebSite` | `pages/(marketing)/index.vue` | 0 error, 0 warning |
| `/blog` | `CollectionPage`, `ItemList` | `pages/(marketing)/blog.vue`, `components/marketing/blog/AllArticles.vue` | 0 error, 0 warning |
| `/blog/[slug]` | `BlogPosting` | `pages/(marketing)/blog/[slug].vue` | Sampel `/blog/popular-import-guide`: 0 error, 0 warning |
| `/china-cargo` | `Service` | `pages/(marketing)/china-cargo.vue` | 0 error, 0 warning |
| `/multinational-cargo` | `Service` | `pages/(marketing)/multinational-cargo.vue` | 0 error, 0 warning |
| `/sea-freight` | `Service` | `pages/(marketing)/sea-freight.vue` | 0 error, 0 warning |
| `/air-freight` | `Service` | `pages/(marketing)/air-freight.vue` | 0 error, 0 warning |
| `/transfer-rmb` | `Service` | `pages/(marketing)/transfer-rmb.vue` | 0 error, 0 warning |
| `/sourcing` | `Service` | `pages/(marketing)/sourcing.vue` | 0 error, 0 warning |
| `/about-us` | `AboutPage` | `pages/(marketing)/about-us.vue` | 0 error, 0 warning |
| `/complete-guide` | `Article` | `pages/(marketing)/complete-guide.vue` | 0 error, 0 warning |
| `/faq` | `FAQPage`, `Question`, `Answer` | `pages/(marketing)/faq.vue` | 0 error, 0 warning |

### Keputusan implementasi

- JSON-LD dipasang menggunakan `useHead` dan `application/ld+json`; karakter `<`
  di hasil `JSON.stringify` di-escape menjadi `\\u003c`.
- ID organisasi konsisten: `<origin>/#organization`. ID website:
  `<origin>/#website`. Referensi tersebut mewakili entitas yang sama antarhalaman.
- `isPartOf` di blog, About Us, dan FAQ menyertakan `@type: WebSite`, nama, dan
  URL. Referensi yang sebelumnya hanya berisi ID terbaca sebagai `CreativeWork`
  pada validator; tipe eksplisit sudah ditambahkan.
- Schema daftar blog hanya aktif di root `/blog`, bukan di child route detail,
  pencarian, atau tag. `ItemList` mengikuti artikel yang tampil pada pagination
  dan filter di `AllArticles.vue`.
- `numberOfItems` pada daftar blog adalah total hasil filter; `itemListElement`
  hanya memuat halaman pagination aktif. Data saat ini berjumlah 120 artikel,
  dengan 12 item per halaman. Posisi item mengikuti offset pagination.
- Enam halaman layanan memakai `Service` dengan `provider` berupa organisasi
  ETH Cargo. Gambar berasal dari gambar layanan yang sudah dipakai; schema
  Transfer RMB tidak mencantumkan gambar.
- About Us memakai `mainEntity` organisasi ETH Cargo dan `isPartOf` website.
- Complete Guide memakai headline yang sesuai H1: "Panduan Lengkap Cara Import
  Barang dari China", gambar `article.png` yang ada di isi artikel, dan publisher
  ETH Cargo. Penulis serta tanggal tidak ditambahkan karena tidak tercantum pada
  artikel.
- Tanggal `datePublished` dan `dateModified` pada detail blog sengaja belum
  ditambahkan karena tanggal existing masih placeholder. Author existing:
  `ETH Cargo Team` bertipe `Organization`.
- FAQ mengambil pasangan pertanyaan/jawaban langsung dari `faqGroups` yang juga
  diteruskan ke komponen tampilan, tanpa menyalin wording. Hasil validasi terakhir
  memuat 16 pertanyaan. Schema memuat daftar lengkap FAQ; pencarian di komponen
  tampilan tidak mengubah daftar schema tersebut.

## Konfigurasi domain

`apps/web/nuxt.config.ts` mendefinisikan `runtimeConfig.public.siteUrl`.

- Set `NUXT_PUBLIC_SITE_URL` ke URL absolut domain publik final saat deploy.
- Development memakai origin request sebagai fallback, sehingga hasil pengujian
  pengguna berisi `http://localhost:3000/`.
- Pada production, schema di atas tidak dipasang jika konfigurasi site URL kosong.
- Domain publik final dan hasil validasi produksi belum dikonfirmasi dalam sesi
  ini. URL localhost pada hasil pengujian bukan konfigurasi final deployment.

## Verifikasi yang sudah dilakukan dan batasannya

- Build frontend berhasil setelah perubahan, termasuk build terakhir untuk
  Complete Guide dan FAQ: `pnpm --filter ./apps/web build`.
- `git diff --check` berhasil pada perubahan implementasi.
- Template halaman layanan, About Us, Complete Guide, dan FAQ dibandingkan
  dengan versi sebelum perubahan dan tetap identik. Ini pemeriksaan source,
  bukan klaim pengujian visual seluruh viewport.
- Logika daftar blog diperiksa untuk pagination, halaman terakhir, filter,
  hasil kosong, dan pembatasan CollectionPage ke root blog.
- Pengguna menyalin HTML hasil render lokal ke
  [Schema Markup Validator](https://validator.schema.org/) lalu mengirim hasilnya.
  Tabel di atas merekam hasil tersebut, bukan pengujian validator otomatis agent.
- Verifikasi HTML via server sementara pada tahap daftar blog tidak dilakukan
  karena izin menjalankan server ditolak. Jangan menganggap seluruh route sudah
  diuji SSR secara otomatis.
- Validitas schema tidak membuktikan indexing, peningkatan ranking, atau
  kemunculan rich result di Google.
- `FAQPage` tetap merupakan tipe Schema.org. Google menghentikan FAQ rich result
  sejak 7 Mei 2026; implementasi ini untuk mendeskripsikan isi FAQ, bukan janji
  tampilan FAQ khusus di pencarian.
  [Catatan Google](https://developers.google.com/search/updates#may-2026).

## Belum dikerjakan / sengaja ditunda dalam scope schema ini

- Glossary beserta detail istilah: dilewati sesuai keputusan pengguna.
- Kalkulator, kalkulator Transfer RMB, live tracking, promo, terms and conditions,
  legalities, serta hasil pencarian/tag blog: tidak ditambahkan schema khusus
  dalam pekerjaan ini. Evaluasi kebutuhan berdasarkan konten sebelum menambah.
- Tanggal artikel: tunggu data publikasi/perubahan yang nyata.
- Konten blog masih memakai data placeholder; validasi schema tidak memvalidasi
  kesiapan editorial atau kebenaran klaim bisnis.
- Canonical, sitemap, robots/indexability, Search Console, performa/Core Web Vitals,
  dan validasi pada domain produksi belum ditangani sebagai bagian pekerjaan ini.
  Periksa kondisi repository terbaru sebelum menyimpulkan fitur tersebut belum ada.

## Cara melanjutkan dan memperbarui catatan

1. Baca dokumen ini, instruksi repository, lalu periksa implementasi dan git diff.
2. Pastikan scope halaman bersama pengguna; pertahankan keputusan melewati glossary.
3. Ambil data schema dari konten halaman yang benar-benar tersedia. Jangan membuat
   tanggal, rating, harga, identitas penulis, atau detail perusahaan fiktif.
4. Jalankan pemeriksaan sesuai perubahan. Untuk validasi lokal, refresh halaman,
   salin HTML hasil render dan uji melalui input kode Schema Markup Validator.
5. Catat halaman, tipe schema, file terkait, metode verifikasi, hasil, dan batasan
   baru di dokumen ini. Bedakan implementasi, validasi lokal, dan validasi produksi.
6. Perbarui tanggal dokumen. Jangan tandai pekerjaan sebagai committed/deployed
   tanpa memeriksa bukti git/deployment; dokumen ini bukan bukti commit atau deploy.
