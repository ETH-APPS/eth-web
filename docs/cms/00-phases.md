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

- [x] **Fase 4A:** buat proxy allowlist dan hooks Vue Query untuk membaca
  kategori, tag, serta banner; create kategori/tag langsung tersimpan ke API.
  Form menyimpan ID pilihan, bukan nama. Create banner belum termasuk tahap ini.
- [x] Hubungkan pilihan/create kategori, tag, dan banner di form artikel.
- [x] Pasang Tiptap dan kontrol yang disetujui; simpan file preview lokal sampai
  publish, lalu jalankan upload dan create sesuai plan frontend.
- [x] Validasi field, tampilkan field error API, cegah submit ganda, pertahankan
  form serta ID upload yang sudah berhasil saat langkah berikutnya gagal.
- [x] Setelah 201, tampilkan bukti tersimpan berupa judul, ID, dan slug; verifikasi
  lewat public read API. Jangan menganggap halaman web publik sudah memakai API.
- [x] Hubungkan daftar CMS ke GET `/articles` dengan pencarian, filter kategori,
  loading/error/empty state, dan pagination artikel terbit.
- [x] Uji kasus berhasil, konflik slug, file gagal, banner/default tidak tersedia,
  profil penulis belum ada, dan sesi habis di tengah proses.
- [x] **Fase 4 selesai:** akun CMS menerbitkan satu artikel lengkap melalui browser;
  daftar artikel sudah aktif; dashboard/manajemen lain tetap boleh placeholder.

**Bukti Fase 4A, 28 November 2026:** GET kategori/tag/banner dan POST
kategori/tag lulus melalui secure session Nuxt. Resource di luar allowlist
mendapat 404 dan mutation dari origin asing mendapat 403. Data hasil create
langsung muncul pada cache form. Build/type-check lulus; pilihan API tampil pada
form di 320, 390, 768, 1023, 1024, 1280, serta 1440 px tanpa overflow horizontal.

**Bukti Fase 4 lengkap, 28 November 2026:** browser test menjalankan login →
create banner multipart → pilih kategori/tag → Tiptap dengan gambar body → upload
cover/body → create artikel → public-read verification. Payload akhir hanya berisi
`data-media-id`, tanpa blob URL atau local image ID. Konflik slug menampilkan pesan
yang sesuai; retry dengan file yang sama tidak mengulang upload cover. CSRF asing
ditolak 403, content type salah 415, dan payload di atas batas BFF ditolak 413.
Backend e2e existing mencakup profil penulis yang hilang dan konflik slug; UI
memetakan error profil/default/session. Type-check, production build, diff check,
dan matriks viewport wajib lulus. Pengujian memakai API/storage fake sehingga
database serta Spaces development/production tidak berubah.

**Tambahan daftar artikel, 28 November 2026:** BFF GET `/articles` meneruskan
pagination, pencarian, dan kategori ke public API. Route GET banner dibuat
eksplisit agar tidak berbenturan dengan POST multipart; request tanpa sesi kini
mendapat 401 yang benar, bukan 404 route.

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

**Progress persiapan staging, 28 November 2026:**

- [x] Audit VM selesai: disk menyisakan 68 GB (28% terpakai), build cache sudah
  dibersihkan, runner GitHub Actions aktif, gateway healthy, Named Tunnel running,
  dan network web existing tetap berisi tiga container.
- [x] Direktori `/etc/eth-cms/staging` dibuat `root:root` mode `0700`. File
  `postgres.env`, `api.env`, dan `cms.env` lengkap serta `root:root` mode `0600`;
  nilai rahasia tidak dicatat di repository atau output verifikasi.
- [x] Dockerfile CMS/API, health endpoint, dan Compose staging tersedia. Perbaikan
  OpenSSL API serta type-check banner berada pada commit `64a649c` di branch
  `codex/article-cms-plan` dan sudah didorong ke remote.
- [x] Verifikasi lokal terakhir lulus: CMS type-check/build, API lint/build/
  type-check, 58 tes E2E, pemeriksaan Dockerfile, dan `git diff --check`.
- [x] Selama persiapan, container web, gateway, Named Tunnel, konfigurasi Caddy,
  volume, dan domain production tidak diubah atau dibuat ulang.
- [x] Workflow, helper no-argument, dan sudoers khusus staging tersedia di
  repository. Helper menolak SHA yang berbeda dari head `origin/staging` dan
  memeriksa container production tidak berubah. Sintaks Bash, workflow YAML,
  sudoers, Compose, serta build/type-check CMS terbaru sudah divalidasi lokal.
- [ ] Buat branch release `staging`, lalu pasang dan validasi salinan helper,
  Compose, serta sudoers root-owned di VM sebelum menjalankan workflow.
- [ ] Build image dari exact commit SHA, jalankan database/migration/API/CMS dengan
  project `eth-cms-staging`, lalu pasang route dan uji hostname staging.

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
