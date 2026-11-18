# Handoff implementasi metadata dari SEO Technical

Audit awal: 18 November 2026 (Asia/Jakarta). **Status 18 November 2026:**
implementasi title dan description untuk 23 route yang memiliki nilai di sheet
`Structure` selesai di workspace lokal. Meta keywords terpasang pada 22 route;
Blog mempunyai nilai `-`, sedangkan Aplikasi belum memiliki route dan kolom
title/description kosong. HTML awal localhost 23 route cocok persis dengan
workbook untuk ketiga metadata; build web berhasil. **Belum di-commit atau
dideploy**. Gunakan [checklist](metadata-checklist.md) untuk hasil verifikasi
dan pekerjaan yang masih terbuka.

Sheet `Keyword` berisi riset kata kunci tanpa pemetaan per halaman; implementasi
meta keywords memakai kolom `Keyword` pada sheet `Structure`.

## Keputusan pemilik proyek

Teks title dan description dipasang dari sheet `Structure` sesuai pemetaan
route di bawah, termasuk pada halaman yang kontennya masih placeholder selama
tahap slicing. Open Graph title dan description diselaraskan. Atas permintaan
eksplisit pemilik proyek, nilai kolom `Keyword` yang terisi juga dipasang sebagai
`<meta name="keywords">`. Tidak ada metadata rekaan untuk Aplikasi atau keyword
Blog yang bernilai `-`.

Google Search [tidak menggunakan meta keywords untuk pengindeksan atau
peringkat](https://developers.google.com/search/docs/crawling-indexing/special-tags).
Peninjauan akurasi klaim layanan dan kesesuaian isi halaman masih diperlukan
sebelum peluncuran SEO. Metadata teknis yang benar tidak otomatis menyetujui
klaim atau membuat halaman placeholder siap diindeks.

## Kondisi sebelum implementasi (riwayat)

- Halaman marketing sudah memakai `useSeoMeta` untuk title dan description,
  tetapi saat audit awal teksnya belum sama dengan usulan di file SEO.
  [Beranda](<../../apps/web/app/pages/(marketing)/index.vue>) saat itu memakai
  `ETH Cargo | Express to Home`; [blog](<../../apps/web/app/pages/(marketing)/blog.vue>)
  memakai `Blog | ETH Cargo`. Temuan ini sudah ditangani.
- Saat audit awal belum ada `meta keywords` pada kode web. Tag tersebut
  sekarang sudah terpasang sesuai keputusan pemilik proyek.
- [Canonical global](../../apps/web/app/app.vue) dan canonical blog sudah ada.
  Sesuai keputusan pemilik proyek sebelumnya, `/blog?page=n` mengarah ke
  canonical `/blog`. Kebijakan ini tidak diubah dalam tugas metadata.
- [Halaman kargo multinasional](<../../apps/web/app/pages/(marketing)/multinational-cargo/[country].vue>)
  saat ini memasang `robots: 'noindex, follow'`. Karena sheet SEO mengusulkan
  metadata untuk tujuh negara, keputusan `noindex` dan sitemap perlu ditinjau
  secara terpisah.
- `/faq` sekarang me-redirect 301 ke `/faq/pertanyaan-umum` melalui
  [route FAQ](<../../apps/web/app/pages/(marketing)/faq/index.vue>). Metadata
  untuk URL redirect tidak akan menjadi metadata halaman tujuan.
- Ada perubahan lokal yang belum di-commit saat audit, termasuk `blog.vue`,
  `calculator-transfer-rmb.vue`, `docs/seo/next-plan.md`, dan
  `docs/seo/progress.md`. Pekerjaan tersebut dipertahankan selama implementasi.

## Pemetaan sheet ke route web

Pemetaan ini dipakai untuk implementasi metadata lokal; URL dan redirect situs
tidak diubah mengikuti URL lama di spreadsheet. Catatan ketidaksesuaian isi
tetap menjadi bahan peninjauan editorial.

| Baris `Structure` | Halaman pada sheet | Route web kandidat | Catatan |
| --- | --- | --- | --- |
| 2 | Homepage | `/` | Ada |
| 3 | Jasa Titip Beli | `/sourcing` | Sheet memakai `/service/jasa-sourcing-1688`; cocokkan cakupan layanan |
| 4 | Cargo China | `/china-cargo` | Sheet mengandung `//` pada path |
| 5 | Kargo Laut | `/sea-freight` | Sheet mengandung `//` pada path |
| 6 | Kargo Udara | `/air-freight` | Sheet mengandung `//` pada path |
| 7 | Jasa Transfer RMB | `/transfer-rmb` | URL sheet berbeda |
| 8 | Cargo Thailand | `/multinational-cargo/thailand` | Saat ini `noindex, follow` |
| 9 | Cargo Singapura | `/multinational-cargo/singapura` | Saat ini `noindex, follow` |
| 10 | Cargo Korea Selatan | `/multinational-cargo/korea-selatan` | Saat ini `noindex, follow` |
| 11 | Cargo Malaysia | `/multinational-cargo/malaysia` | Saat ini `noindex, follow` |
| 12 | Cargo USA | `/multinational-cargo/amerika` | Saat ini `noindex, follow` |
| 13 | Cargo Taiwan | `/multinational-cargo/taiwan` | Saat ini `noindex, follow` |
| 14 | Cargo Australia | `/multinational-cargo/australia` | Saat ini `noindex, follow` |
| 15 | Kalkulator Import All-In | `/calculator` | URL sheet mengandung typo `imprort-calculator`; cek kesesuaian fungsi |
| 16 | Kalkulator Transfer RMB | `/calculator-transfer-rmb` | Ada perubahan lokal saat audit |
| 17 | Live Tracking | `/live-tracking` | Cek klaim akses akun dengan fungsi aktual |
| 18 | Aplikasi (Coming Soon) | Belum ada route padanan | Title/description kosong; keyword ada, tetapi belum dipasang tanpa route |
| 19 | Promosi | `/promo` | URL sheet `/promosi` |
| 20 | Blog | `/blog` | URL sheet `/insight`; kolom Keyword berisi `-` |
| 21 | Proses Impor | `/complete-guide` | Metadata terpasang; isi perlu ditinjau |
| 22 | Glosarium | `/glossary` | Cek cakupan istilah yang benar-benar tersedia |
| 23 | FAQ | `/faq/pertanyaan-umum` | Metadata terpasang pada tujuan redirect; varian FAQ lain tetap dinamis |
| 24 | Tentang Kami | `/about-us` | Ada |
| 25 | Syarat & Ketentuan | `/terms-and-conditions` | URL sheet berbeda |

## Hasil verifikasi dan langkah berikutnya

- Kecocokan HTML awal localhost dengan sheet `Structure`: 23/23 route untuk
  title/description, 22/22 nilai keyword yang punya route, dan tidak ada
  meta keywords pada Blog (`-`). Sampel navigasi browser untuk title,
  description, dan OG juga telah diperiksa.
- `pnpm --filter web build` dan `git diff --check` lulus. Redirect `/faq`,
  canonical `/blog?page=3` ke `/blog`, dan robots halaman negara tetap sesuai
  kebijakan kode existing. Implementasi ini masih lokal.
- Periksa klaim estimasi, gudang/kantor, cakupan marketplace/negara, refund,
  kode promo, serta fitur akun bersama pemilik konten. Ulangi pemeriksaan
  metadata dan navigasi di domain final setelah deploy.

## Batas pekerjaan dan keputusan terbuka

- Slug, redirect, canonical, schema, sitemap, robots, dan teks tampilan tidak
  diubah dalam implementasi metadata ini.
- Keputusan `noindex` pada halaman negara harus ditinjau bersama pemilik proyek
  bila tujuan akhirnya adalah pengindeksan negara tersebut. Mengganti title saja
  tidak mengatasi `noindex`.
- Baris 18 tidak menyediakan judul/deskripsi dan belum mempunyai route;
  baris 20 tidak menyediakan keyword yang bermakna. Keduanya tidak diisi
  dengan nilai rekaan.
- Quick Tunnel sebelumnya dilaporkan mengirim `X-Robots-Tag: none`; lihat
  [progres SEO](progress.md). Hasil pada tunnel tidak sama dengan bukti domain
  produksi sudah dapat diindeks.
