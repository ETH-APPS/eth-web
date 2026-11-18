# Checklist metadata SEO Technical

Gunakan bersama [handoff implementasi](metadata-handoff.md) dan workbook
`SEO Technical (ETH Cargo).xlsx` yang diberikan pemilik proyek. Status per
18 November 2026: metadata teknis selesai di workspace lokal. Centang halaman
di bawah berarti title, description, dan keyword (jika ada) cocok dengan sheet
pada HTML awal localhost; ini belum menyatakan klaim konten sudah disetujui
atau situs publik sudah diperbarui.

## Persiapan

- [x] Baca `AGENTS.md` dan `docs/frontend-architecture.md` sampai selesai.
- [x] Baca workbook `Structure` baris 2–25; kolom `Keyword` dipasang
  sebagai meta keywords atas permintaan pemilik proyek. Tab `Keyword` adalah
  riset tanpa pemetaan tag per halaman.
- [x] Periksa `git status` serta staged dan unstaged diff; pertahankan pekerjaan
  pengguna yang tidak terkait.
- [x] Petakan setiap baris sheet ke route aktif; URL sheet berbeda dari route
  baru pada beberapa halaman. Catat halaman yang belum ada.
- [ ] Verifikasi klaim layanan dan angka dalam meta description serta kesesuaian
  isi halaman. Pemilik proyek meminta teks sheet dipasang sekarang saat situs
  masih slicing; peninjauan editorial dilakukan sebelum peluncuran SEO.

## Halaman target

Untuk setiap baris di bawah: status centang menunjukkan kecocokan title,
description, dan keyword pada HTML awal localhost. Open Graph title/description
selaras. Klaim layanan dan isi halaman masih menunggu peninjauan editorial.

- [x] 2 — Homepage → `/`
- [x] 3 — Jasa Titip Beli → `/sourcing`
- [x] 4 — Cargo China → `/china-cargo`
- [x] 5 — Kargo Laut → `/sea-freight`
- [x] 6 — Kargo Udara → `/air-freight`
- [x] 7 — Jasa Transfer RMB → `/transfer-rmb`
- [x] 8 — Cargo Thailand → `/multinational-cargo/thailand`
- [x] 9 — Cargo Singapura → `/multinational-cargo/singapura`
- [x] 10 — Cargo Korea Selatan → `/multinational-cargo/korea-selatan`
- [x] 11 — Cargo Malaysia → `/multinational-cargo/malaysia`
- [x] 12 — Cargo USA → `/multinational-cargo/amerika`
- [x] 13 — Cargo Taiwan → `/multinational-cargo/taiwan`
- [x] 14 — Cargo Australia → `/multinational-cargo/australia`
- [x] 15 — Kalkulator Import All-In → `/calculator`
- [x] 16 — Kalkulator Transfer RMB → `/calculator-transfer-rmb`
- [x] 17 — Live Tracking → `/live-tracking`
- [ ] 18 — Aplikasi (Coming Soon): keyword `aplikasi eth cargo` tersedia,
  tetapi title/description kosong dan route padanan belum ada. Tidak ada
  metadata yang dipasang sampai route dibuat.
- [x] 19 — Promosi → `/promo`
- [x] 20 — Blog → `/blog`; keyword di sheet berupa `-`.
- [x] 21 — Proses Impor → `/complete-guide` (padanan metadata; isi perlu ditinjau).
- [x] 22 — Glosarium → `/glossary`
- [x] 23 — FAQ → `/faq/pertanyaan-umum`; `/faq` redirect 301.
- [x] 24 — Tentang Kami → `/about-us`
- [x] 25 — Syarat & Ketentuan → `/terms-and-conditions`

## Verifikasi akhir

- [x] Pada 23 route yang ada, HTML awal localhost mempunyai satu `<title>`
  dan satu `<meta name="description">` sesuai workbook; 22 route mempunyai
  satu `<meta name="keywords">` sesuai kolom Keyword. Blog (`-`) tanpa tag.
- [x] Sampel navigasi browser antarrute untuk title/description/OG mengikuti
  halaman aktif (pemeriksaan implementasi sebelumnya).
- [ ] Ulangi navigasi antarrute untuk meta keywords dan pemeriksaan publik
  setelah deploy.
- [x] Canonical tetap benar, khususnya `/blog?page=3` → `/blog`, sesuai keputusan
  pemilik proyek sebelumnya. Tidak ada canonical ganda.
- [x] `robots` tetap sesuai kebijakan existing. Catat konflik `noindex, follow`
  pada halaman negara sebagai keputusan terpisah; jangan menyatakan halaman itu
  siap terindeks hanya karena metadata diperbarui.
- [x] `/faq` tetap redirect ke tujuan yang benar; metadata dipasang pada halaman
  tujuan, bukan hanya pada URL redirect.
- [x] Jalankan `pnpm --filter web build` dari root repository dan catat hasilnya.
- [x] Tinjau diff metadata dan `git diff --check`; tidak ada perubahan
  UI/URL/canonical/schema dalam penambahan meta keywords. Pekerjaan lokal
  sebelumnya tetap dipertahankan.
- [x] Catat 23 baris terpasang dan baris 18 belum memiliki route; hasil
  verifikasi masih lokal, belum dideploy.
- [ ] Verifikasi ulang di domain publik setelah deploy dan selesaikan peninjauan
  klaim/placeholder bersama pemilik konten.
