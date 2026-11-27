# Frontend CMS: struktur, handoff UI, dan integrasi

Disepakati 27 November 2026. Kerjakan menurut [urutan fase](00-phases.md).
Baca `AGENTS.md`, [arsitektur frontend](../frontend-architecture.md),
[responsive](../responsive-guidelines.md), serta backend guidelines bila menyentuh
`apps/api`. Periksa staged/unstaged diff. Jangan mendesain ulang UI yang telah
diserahkan pemilik proyek saat menghubungkan API.

## Struktur yang dituju

```text
apps/
  web/                         website publik existing
  api/                         API NestJS existing
  cms/
    app/
      app.vue
      layouts/auth.vue
      layouts/dashboard.vue
      pages/                   lihat tabel route
      components/              shell dan komponen khusus CMS
      assets/css/main.css      import fondasi shared + style khusus CMS
      plugins/                 Axios dan Vue Query, saat fase integrasi
      middleware/              penjagaan halaman, saat fase login
      services/api/            HTTP client dan fungsi endpoint, saat dibutuhkan
      composables/             query/mutation dan state lintas komponen
    server/                    sesi auth dan forwarding ke NestJS
    shared/                    tipe sesi yang dipakai server dan client
    nuxt.config.ts
    package.json
    README.md
packages/
  ui/
    nuxt.config.ts             Nuxt Layer @eth/ui
    app/assets/css/main.css    satu sumber token warna/font/Tailwind
    app/components/ui/         primitive bersama saat benar-benar dibutuhkan
```

Tree menunjukkan lokasi kepemilikan, bukan instruksi membuat semua folder kosong.
Pada Fase 1 cukup file yang diperlukan placeholder dan CSS bersama; server/auth,
HTTP client, composable integrasi, serta editor dibuat pada fasenya.
`apps/crm` belum dibuat. Hindari factory client, base composable, repository
frontend, atau wrapper per fungsi tanpa tanggung jawab nyata.

CMS memakai Nuxt 4 dan Tailwind 4 yang kompatibel dengan workspace. Default CMS
adalah halaman client-rendered (`ssr: false`) dengan runtime Nitro/Node tetap
berjalan untuk sesi dan forwarding API; bukan deployment static-only. Website
publik tetap memakai SSR. Port lokal: web 3000, API 3001, CMS 3002.

## Peta halaman untuk pemilik desain

Root `app.vue` merender `NuxtLayout` dan `NuxtPage`. Layout `auth` khusus login;
layout `dashboard` memuat sidebar/header CMS. Navigasi berasal dari satu daftar.

| URL | Lokasi relatif terhadap apps/cms/app | Layout | Fungsi rilis awal |
| --- | --- | --- | --- |
| `/` | `pages/index.vue` | — | Redirect ke `/dashboard`; guard menangani sesi |
| `/login` | `pages/login.vue` | auth | Login email/password |
| `/dashboard` | `pages/dashboard.vue` | dashboard | Placeholder |
| `/articles` | `pages/articles/index.vue` | dashboard | Placeholder daftar |
| `/articles/create` | `pages/articles/create.vue` | dashboard | Create/publish |
| `/articles/categories` | `pages/articles/categories.vue` | dashboard | Placeholder manajemen |
| `/articles/tags` | `pages/articles/tags.vue` | dashboard | Placeholder manajemen |
| `/articles/banners` | `pages/articles/banners.vue` | dashboard | Placeholder manajemen |
| `/media` | `pages/media.vue` | dashboard | Placeholder |
| `/settings` | `pages/settings.vue` | dashboard | Placeholder |

Tidak perlu parent `pages/articles.vue` tanpa kebutuhan nested wrapper. Sidebar
memiliki Dashboard, Artikel (Daftar, Tulis, Kategori, Tag, Banner), Media, serta
Pengaturan. Placeholder Fase 1 hanya judul, keterangan, dan link; tidak meniru
login berhasil atau memanggil API. Semua route dapat dibuka lokal untuk desain.
Saat Fase 3 selesai, seluruh halaman dashboard dilindungi, termasuk placeholder.

## Fondasi shared dan batas desain

- [ ] `packages/ui` mengekspor Nuxt Layer; web dan CMS mengonsumsinya melalui
  workspace dependency `@eth/ui`, bukan mengimpor source internal satu sama lain.
- [ ] Jadikan token dan font dari `apps/web/app/assets/css/main.css` satu sumber
  di layer. Pertahankan nama/nilai primary, teks, background, border, error,
  warning, dan Poppins 400/500/600/700. Jangan menambah dark mode pada fase ini.
- [ ] Pastikan Tailwind memindai komponen aplikasi dan layer, termasuk source di
  package workspace. Uji build agar class pada komponen shared benar-benar keluar.
- [ ] CSS khusus CMS tetap di CMS. Sidebar dashboard bukan komponen marketing.
  `AnimatedArrowButton` tidak otomatis menjadi bentuk semua tombol dashboard;
  Button/Input umum dibentuk bersama pemilik desain saat fase UI.
- [ ] Bila primitive dipindahkan ke layer, pertahankan nama pemakaian seperti
  `UiInput`, hapus definisi ganda hanya setelah seluruh consumer diperiksa,
  dan jaga hasil render web tetap identik. Jangan memindahkan aset khusus marketing.
- [ ] Setelah ekstraksi CSS, verifikasi baseline web 1440px, viewport wajib, dan
  overflow sesuai pedoman. Perubahan `packages/ui` menjadi input build/test web
  maupun CMS, termasuk Docker dan CI.

## Batas HTTP, state, dan sesi — Fase 3

```text
Komponen CMS → Axios + Vue Query → /api pada origin CMS
             → server Nuxt (sesi/token) → API NestJS → PostgreSQL / Spaces
```

Axios digunakan untuk HTTP CMS, termasuk adapter server ke NestJS. Client frontend
hanya mengenal base URL `/api`; upstream memakai runtime config privat
`NUXT_API_BASE_URL` (lokal `http://localhost:3001`). Jangan meneruskan URL/host
upstream dari input pengguna. Tidak perlu membuka CORS NestJS bagi browser CMS
ketika seluruh request menggunakan origin CMS yang sama.

- [ ] Pakai satu instance Axios di masing-masing boundary yang memerlukan
  konfigurasi. Vue Query mengelola list pilihan dan mutations; `ref`/`reactive`
  menyimpan form, `File`, dan preview. `useState` hanya untuk UI bersama yang
  dibutuhkan; tidak menduplikasi hasil query atau menyimpan bearer token.
- [ ] Pin versi `nuxt-auth-utils` yang mendukung Nuxt 4 di lockfile. Ikuti API
  konfigurasi versi terpasang; validasi secret sesi wajib pada production.
  Jangan meng-upgrade major Nuxt atau menyalin konfigurasi versi lain diam-diam.
- [ ] Simpan token akses/refresh dan waktu kedaluwarsa dalam bagian sesi
  `secure` yang hanya dapat dibaca server. State `useUserSession()` hanya berisi
  identitas ringkas yang dibutuhkan UI. Jangan memasukkan bio panjang ke cookie;
  data profil lengkap dibaca lewat `/auth/me`. Hormati batas cookie 4 KiB.
- [ ] Cookie host-only, HttpOnly, `SameSite=Lax`, path `/`, dan Secure pada HTTPS.
  Nama cookie `eth-cms-session`; secret berbeda tiap environment. Tidak mengatur
  Domain `.ethcargoindo.com`. Pengecualian Secure hanya untuk development HTTP.
- [ ] Login meneruskan email/password ke `/auth/login`, memastikan `CMS_ACCESS`,
  lalu membentuk sesi. Akun tanpa izin mendapat 403 dan tidak diberi sesi CMS;
  revoke refresh token yang sempat diterbitkan pada login yang ditolak itu.
- [ ] `/api/auth/me` memeriksa user melalui NestJS; jangan mengandalkan permission
  yang tersimpan lama di cookie. Halaman butuh status pemuatan sesi sebelum guard
  memutuskan redirect; login sukses menuju `/dashboard`.
- [ ] Refresh mengikuti kontrak existing (akses 15 menit, refresh 30 hari).
  Jalankan refresh sebelum request terlindungi ketika akses mendekati habis;
  cegah refresh paralel memakai token rotasi yang sama. Jangan memperpanjang sesi
  melewati masa refresh token backend. Uji beberapa request serentak.
- [ ] Guard halaman mengarahkan pengguna tanpa sesi ke `/login`; user tanpa izin
  melihat 403. Backend tetap memeriksa permission pada setiap request CMS.
- [ ] Logout mencabut refresh session backend dan selalu membersihkan cookie serta
  cache query browser. Bila upstream gagal, cookie lokal tetap dibersihkan dan
  kegagalan revoke dilaporkan tanpa menampilkan token.
- [ ] Mutation same-origin memeriksa Origin terhadap origin CMS yang dikonfigurasi
  (`NUXT_CMS_ORIGIN`); jangan mengandalkan cookie saja untuk pencegahan CSRF.
  Request lintas-origin ditolak. Auth/session respons tidak boleh di-cache publik.

Route Nuxt yang diperlukan: POST `/api/auth/login`, GET `/api/auth/me`, POST
`/api/auth/logout`, serta forwarding `/api/cms/*` ke route CMS NestJS. Refresh
merupakan helper server; bukan token yang perlu ditangani toolbar/form.
Forwarding hanya mengizinkan pasangan method/path existing: upload assets,
create artikel, dan GET/POST kategori/tag/banner. Jangan membuat open proxy atau
meneruskan cookie/Authorization dari browser ke host bebas.

Untuk multipart, teruskan stream dan Content-Type/boundary secara konsisten;
jangan mengubah file menjadi JSON/base64. Jangan mengulang request mutation secara
otomatis melalui interceptor atau Vue Query. Error NestJS (status, `request_id`,
`error.code`, dan `fields`) dipertahankan agar form bisa menampilkan field error.
Gangguan jaringan/upstream ditampilkan sebagai kegagalan, bukan sukses palsu.

## Create artikel — Fase 4

Kontrak request/response tetap mengikuti [plan API](../article-cms/01-api-plan.md)
dan OpenAPI. Server Nuxt tidak menyalin validasi bisnis artikel ke lapisan baru.

| Form/aksi | Endpoint NestJS |
| --- | --- |
| User dan profil penulis | GET `/auth/me` |
| Pilihan atau create kategori | GET/POST `/cms/categories` |
| Pilihan atau create tag | GET/POST `/cms/tags` |
| Pilihan atau create banner dengan ilustrasi | GET/POST `/cms/banners` |
| Upload cover/gambar isi | POST `/cms/articles/assets` |
| Publish | POST `/cms/articles` |

- [ ] Form menyimpan title, slug otomatis yang masih dapat diubah sebelum publish,
  metaDescription, cover dan alt, body editor, keyPoints dinamis, categoryId,
  tagIds, dan bannerId. Penulis berasal dari sesi; bukan pilihan user lain.
- [ ] Validasi mengikuti DTO backend: title/slug 180, metaDescription 320, cover alt
  300, body HTML 500.000 karakter; minimal satu key point, masing-masing maksimal
  500 karakter; tag boleh kosong. Tidak mengunci key points menjadi tiga.
- [ ] Tiptap menghasilkan hanya `p`, `h2`, `h3`, `strong`, `em`, `br`, dan `img`.
  Nonaktifkan heading lain, link, list, code, tabel, style, dan mark lain yang
  tidak diterima API, termasuk hasil paste. Undo/redo boleh bekerja secara lokal.
  Ekstensi gambar mempertahankan ID sementara/media dan alt yang wajib diisi.
- [ ] Pilih banner default bila tersedia, tetapi boleh memilih banner lain.
  Bila tidak ada default, wajib pilih/buat banner. Banner baru hanya meminta
  title, description, dan satu gambar; WhatsApp/email tetap di frontend publik.
- [ ] File hanya JPEG/PNG/WebP maksimal 5 MiB. Pemilihan file menampilkan preview
  lokal; tidak langsung upload. Bebaskan object URL saat file diganti/dihapus.
- [ ] Saat Terbitkan: validasi form; siapkan kategori/tag/banner baru yang dipilih;
  upload cover (`ARTICLE_COVER`) dan gambar isi (`ARTICLE_BODY`); susun body dengan
  `<img data-media-id="..." alt="...">`; terakhir kirim create artikel.
- [ ] Simpan hasil tiap langkah. Jika langkah berikutnya gagal, form dan ID yang
  sudah valid tetap tersedia untuk retry tanpa mengulang create/upload sebelumnya.
  Jangan kirim URL blob/base64 atau tanggal/author dari browser ke create artikel.
- [ ] Cegah klik ganda. Pertahankan form untuk konflik slug, file gagal, referensi
  tidak valid, dan profil/default belum disiapkan. Beri peringatan saat meninggalkan
  form berisi perubahan; tidak ada autosave/draft pada MVP.
- [ ] Jika koneksi putus saat publish sehingga hasil belum diketahui, jangan retry
  otomatis. Periksa slug melalui public read API dari server terlebih dahulu;
  hanya beri status sukses bila dapat dicocokkan dengan artikel user/payload itu.
- [ ] Setelah 201 tampilkan ID, slug, judul, dan tanggal dari server. Verifikasi
  detail API mengandung body dan URL gambar. Jangan mengarahkan ke placeholder
  daftar sebagai bukti publish atau menjanjikan website publik sudah berubah.
- [ ] Catat bahwa file yang berhasil diupload tetapi publish dibatalkan belum
  memiliki API delete/garbage collection. Sertakan prosedur audit/pembersihan
  manual yang terkontrol pada handoff; jangan menyisipkan fitur media library.

## Verifikasi dan serah-terima

- [ ] Fase fondasi: semua route direct-load, navigasi, dev port, build/type-check,
  Tailwind shared, dan regresi visual web.
- [ ] Fase auth: benar/salah password, tanpa CMS permission, sesi setelah reload,
  expiry/refresh, request serentak, logout, dan akses langsung route/proxy.
- [ ] Pastikan token tidak keluar di endpoint session, HTML, localStorage, log,
  atau cache query; cookie staging/production tidak saling mengautentikasi.
- [ ] Fase create: uji browser dengan API + database test dan storage fake, termasuk
  multipart, field error `file`/`image`, slug duplikat, retry upload parsial,
  HTML/alt media, missing profile/default, dan submit ganda.
- [ ] Saat integrasi, tambah tes browser untuk login–create memakai Playwright,
  dengan data terisolasi. Jangan memanggil Spaces production dari tes otomatis.
  Backend yang berubah tetap menjalani verifikasi menurut backend guidelines.
- [ ] Jalankan lint/type-check/build CMS dan `git diff --check`; perubahan shared
  UI juga memerlukan build dan verifikasi consumer web. Ikuti matriks viewport
  320, 390, 768, 1023, 1024, 1280, 1440px serta layar pendek.
- [ ] README CMS mencatat lokasi edit halaman/layout/shared UI, perintah lokal,
  env example, cara provisioning akun, dan status placeholder vs fitur nyata.

Referensi: [Nuxt Layers](https://nuxt.com/docs/4.x/guide/going-further/layers),
[state Nuxt](https://nuxt.com/docs/4.x/getting-started/state-management),
[sesi Nuxt](https://nuxt.com/docs/4.x/guide/recipes/sessions-and-authentication),
[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils),
[Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview),
[Tiptap Vue](https://tiptap.dev/docs/editor/getting-started/install/vue3).
