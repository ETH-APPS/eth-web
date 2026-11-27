# Fase pengembangan dashboard CMS

Keputusan disepakati 27 November 2026. Mulai dari dokumen ini. Rincian ada di
[frontend CMS](01-frontend-plan.md) dan [deployment](02-deployment-plan.md).
Dokumen ini merencanakan pekerjaan; checkbox implementasi bukan bukti sudah
dikerjakan. Centang setelah hasil fase diverifikasi dan catat buktinya.

## Keputusan yang sudah dikunci

- [x] CMS menjadi aplikasi Nuxt/Vue terpisah di `apps/cms`, dalam monorepo ini.
  `apps/web` tetap website publik; `apps/api` tetap backend NestJS bersama.
  CRM kelak menjadi `apps/crm`; folder dan aplikasinya belum dibuat sekarang.
- [x] Komponen dasar, token warna, dan font dibagikan melalui Nuxt Layer
  `packages/ui`. Nilai serta nama token mengikuti CSS web existing, termasuk
  Poppins. Komponen bersama dibuat saat memang dibutuhkan oleh UI.
- [x] Axios untuk HTTP; TanStack Vue Query untuk server state. State UI sederhana
  memakai `ref`/`reactive` dan `useState` bila perlu dibagikan. Belum perlu Pinia.
- [x] Sesi memakai `nuxt-auth-utils`, cookie HttpOnly, dan server Nuxt sebagai
  penghubung ke API NestJS. Sesi CMS dan CRM terpisah; belum ada SSO.
- [x] Pemilik proyek/agent desain mengedit Vue langsung setelah placeholder siap.
  Fase fondasi menyediakan lokasi kerja; bukan mengimplementasikan desain final.
- [x] Rilis pertama mengaktifkan login, logout, dan create artikel, termasuk
  kategori/tag/banner yang diperlukan form. Halaman lainnya tetap placeholder.
- [x] Tiptap dipasang pada fase integrasi form. Kontrol sesuai API existing:
  paragraf, H2, H3, bold, italic, line break, serta gambar.
- [x] Rilis mencakup CMS, API NestJS, dan PostgreSQL di VM. Staging memakai
  `cms-staging.ethcargoindo.com`; production `cms.ethcargoindo.com`.
- [x] CMS dirilis dahulu. Setelah perubahan ada di `main` dan API production
  berfungsi, barulah website publik dihubungkan ke API artikel pada fase terpisah.

## Kondisi awal

Backend create dan public read sudah ada; kontraknya berada di
[plan API artikel](../article-cms/01-api-plan.md). Pengguna telah membuktikan
alur lokal register, provisioning CMS, upload banner/cover/body ke Spaces,
create artikel Airwaybill, serta read daftar/detail pada 27 November 2026.
Itu smoke test lokal yang dilaporkan pengguna, bukan pengujian deployment.

Frontend publik masih membaca `articleCatalog.ts`. Deployment existing hanya
menangani `apps/web`; CMS, API/database di VM, serta staging belum disiapkan
dalam alur deployment repository tersebut. Akun development tidak otomatis
tersedia di staging/production.

## Urutan pengerjaan

### Fase 1 — Fondasi dan placeholder lokal

**Penanggung jawab:** agent fondasi. **Hasil:** pemilik proyek tahu lokasi menulis UI.

- [x] Periksa branch dan diff; gunakan branch fitur `codex/` dari basis backend
  artikel yang sudah ditinjau. Jangan mencampur perubahan marketing yang tidak
  terkait. Jangan merge/push hanya karena fase lokal selesai.
- [x] Siapkan `apps/cms` dengan versi Nuxt/Vue/Tailwind yang kompatibel dengan
  workspace; package bernama `cms`, development port 3002.
- [x] Siapkan `packages/ui` sebagai Nuxt Layer, package `@eth/ui`. Pindahkan
  token/font existing ke satu sumber dan hubungkan web serta CMS tanpa mengubah
  nilai token atau tampilan web.
- [x] Buat root shell, layout `auth` dan `dashboard`, navigasi minimal, serta
  semua halaman pada peta route di plan frontend.
- [x] Halaman cukup judul, keterangan placeholder, dan navigasi dasar. Belum
  memasang login palsu, statistik dummy, editor, atau request API.
- [x] Tambahkan perintah `pnpm dev:cms`; pastikan `pnpm dev:api`, `dev:web`, dan
  `dev:cms` bisa dipakai sendiri-sendiri. Periksa juga `pnpm dev` root.
- [x] Dokumentasikan folder dan perintah dalam README CMS. Sediakan env example
  tanpa secret; konfigurasi integrasi tetap belum aktif pada fase ini.
- [x] Jalankan build/type-check CMS, build web, dan pemeriksaan visual web setelah
  ekstraksi CSS. Terapkan guideline responsive; catat baseline web 1440px dan
  pemeriksaan overflow untuk halaman yang terpengaruh.
- [x] **Fase 1 selesai:** semua placeholder dapat dibuka langsung di lokal,
  tautan antarrute berfungsi, dan pemilik proyek menerima peta lokasi edit UI.

**Bukti 27 November 2026:** fondasi berada pada commit `fbf689d`; UI login,
dashboard, daftar, dan create yang menyusul berada pada commit `429bd9c`. Seluruh
10 route merespons HTTP 200 di port 3002. Build dan type-check CMS serta build web
lulus. Pemeriksaan browser pada 320, 390, 768, 1023, 1024, 1280, dan 1440 px
untuk login, dashboard, serta create tidak menemukan horizontal overflow. Web
artikel pada 1440 px tetap sama secara visual setelah ekstraksi token/font.
`pnpm dev:cms` berjalan; dry-run Turborepo mengonfirmasi root `pnpm dev` memuat
API, web, dan CMS. UI yang ditambahkan setelah fondasi tidak memanggil API;
integrasi login/publish tetap mengikuti fase berikutnya.

### Fase 2 — UI dikerjakan pemilik proyek

**Penanggung jawab:** pemilik proyek/agent desain. **Prasyarat:** Fase 1 selesai.

- [x] Kerjakan UI login, shell dashboard, dan form create pada lokasi yang sudah
  disiapkan. Bentuk Button/Input bersama di layer saat dibutuhkan, sesuai desain.
- [x] Biarkan halaman dashboard/list/manajemen sebagai placeholder bila belum
  didesain. Jangan menambah API manajemen untuk melengkapi placeholder.
- [x] Siapkan state visual loading, error, disabled, validasi, dan sukses pada UI
  login/create. Slot editor cukup disiapkan untuk Tiptap fase berikutnya.
- [x] Serahkan UI yang disepakati beserta komponen/shared styles yang berubah;
  verifikasi responsive dan akses keyboard. Agent integrasi mempertahankan desain.
- [x] **Fase 2 selesai:** UI login/create disetujui dan siap dihubungkan ke API.

**Bukti 27 November 2026:** pemilik proyek menyatakan UI `/login` dan
`/articles/create` siap diintegrasikan. Implementasi UI berada pada commit
`429bd9c`; halaman dashboard/list/manajemen tetap placeholder sesuai scope.

### Fase 3 — Login, sesi, dan akses CMS

**Penanggung jawab:** agent integrasi. **Prasyarat:** UI Fase 2 tersedia.

- [x] Pasang Axios, TanStack Vue Query, dan `nuxt-auth-utils` yang kompatibel.
  Verifikasi CI lint/type-check/test tetap bagian gerbang rilis Fase 5 karena
  workflow CMS belum dideploy pada fase lokal ini.
- [x] Hubungkan login, pemeriksaan user, refresh, dan logout ke auth existing.
  Implementasikan sesi, guard halaman, serta aturan server pada plan frontend.
- [x] Akun berizin `CMS_ACCESS` masuk dashboard; tanpa izin ditolak. Tidak ada
  register, reset password, atau pengelolaan akun/profil pada CMS awal.
- [x] Uji login salah/benar, refresh halaman, token kedaluwarsa, permission dicabut,
  logout, dan akses URL langsung. Periksa token tidak keluar ke state browser.
- [x] **Fase 3 selesai:** sesi dan penjagaan akses bekerja menggunakan API lokal.

**Bukti 27 November 2026:** type-check dan production build CMS lulus. Smoke test
dengan backend auth terisolasi membuktikan login benar 200, password salah 401,
tanpa permission 403, cookie dapat dipulihkan setelah reload, dan dua request
serentak setelah access token kedaluwarsa hanya memicu satu rotasi refresh token.
Logout mengembalikan 204 serta menghapus cookie; pencabutan permission membuat
request berikutnya 403 dan menghapus session. Origin asing ditolak 403. Endpoint
session browser hanya memuat ringkasan user—tidak ada access/refresh token—dan
direct-load `/articles/create` tanpa session diarahkan ke `/login`.

### Fase 4 — Create artikel dari UI

- [ ] Hubungkan pilihan/create kategori, tag, dan banner di form artikel.
- [ ] Pasang Tiptap dan kontrol yang disetujui; simpan file preview lokal sampai
  publish, lalu jalankan upload dan create sesuai plan frontend.
- [ ] Validasi field, tampilkan field error API, cegah submit ganda, pertahankan
  form serta ID upload yang sudah berhasil saat langkah berikutnya gagal.
- [ ] Setelah 201, tampilkan bukti tersimpan berupa judul, ID, dan slug; verifikasi
  lewat public read API. Jangan menganggap halaman web publik sudah memakai API.
- [ ] Uji kasus berhasil, konflik slug, file gagal, banner/default tidak tersedia,
  profil penulis belum ada, dan sesi habis di tengah proses.
- [ ] **Fase 4 selesai:** akun CMS menerbitkan satu artikel lengkap melalui browser;
  dashboard/list/manajemen tetap boleh placeholder.

### Fase 5 — Staging, merge, dan rilis CMS production

- [ ] Kerjakan checklist [deployment CMS/API/database](02-deployment-plan.md),
  termasuk CI, bootstrap VM, isolasi environment, backup, serta rollback.
- [ ] Deploy kandidat ke staging; uji login → upload → create → read API dengan
  database dan prefix Spaces staging. Jangan mengirim data test ke production.
- [ ] Setelah staging lulus, merge/promosikan perubahan teruji ke `main`, lalu
  deploy release CMS/API production. Catat SHA/artifact yang diuji dan dirilis.
- [ ] Provision akun penulis/permission/profile dan banner production secara
  terkontrol; jangan menyalin password dummy atau record sesi development.
- [ ] **Fase 5 selesai:** CMS production bisa login dan create melalui API
  production; website publik existing tetap sehat. Integrasi web belum diaktifkan.

### Fase 6 — Website publik mengonsumsi API

**Prasyarat:** Fase 5 selesai, perubahan berada di `main`, API production siap.

- [ ] Ikuti [plan frontend artikel publik](../article-cms/02-frontend-plan.md).
  Migrasikan tujuh artikel dengan slug/tanggal asli dan HTML yang sesuai.
- [ ] Alihkan daftar/detail, pencarian/filter, penulis, rekomendasi, serta sitemap
  dari katalog lokal ke API dengan SSR/SEO yang tetap benar.
- [ ] Uji artikel lama dan artikel baru dari CMS, lalu rilis frontend secara
  terpisah. Jangan cutover web ketika hanya satu artikel contoh ada di database.
- [ ] **Fase 6 selesai:** artikel baru dari CMS tampil di website dan sitemap
  tanpa build ulang, serta URL lama tetap berfungsi.

## Cara memakai checklist

Kerjakan satu fase sesuai prasyaratnya. Catat hasil verifikasi dan keterbatasan
pada handoff fase, bukan hanya mengubah checkbox. Desain final, implementasi CMS,
instalasi dependency, serta perubahan VM bukan bagian dari penulisan rencana ini.
Edit/hapus/draft/schedule, dashboard data nyata, media library, CRM, dan SSO
merupakan pekerjaan lanjutan yang dibahas tersendiri.
