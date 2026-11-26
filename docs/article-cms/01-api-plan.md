# Plan API artikel dan CMS

Ikuti urutan di [rencana fase](00-phases.md). Dokumen ini adalah ruang kerja agent
backend. Kontrak yang sudah diimplementasikan di OpenAPI menjadi sumber untuk
[agent frontend](02-frontend-plan.md). Sebelum mengubah `apps/api`, baca
`docs/backend-guidelines.md`, implementasi relevan, serta staged dan unstaged
diff. Ikuti pola NestJS, Prisma, autentikasi, respons, dan tes API yang ada.

## Standardisasi validasi dan error

Ikuti [konvensi validasi dan error backend](../backend-guidelines.md#validation-and-error-conventions).
DTO dan `ValidationPipe` menangani bentuk input; service tetap memeriksa referensi
database, kepemilikan media, dan aturan publikasi. Upload serta publish tetap
memakai kontrak endpoint yang ada.

- [x] Satukan pembentukan field validation exception dari adapter DTO global,
  `ArticleService`, dan `ArticleMediaService` ke `fieldValidationException()` di
  `src/http/validation-exception.ts`.
- [x] Pertahankan status dan kode error existing saat merapikan helper. Gunakan
  nama field request yang benar untuk error upload (`file` untuk asset artikel,
  `image` untuk ilustrasi banner), lalu verifikasi respons melalui tes API.
- [x] Pisahkan mapping respons artikel, taksonomi, banner, dan media ke satu
  `article-response.mapper.ts` karena mapping media dipakai oleh service artikel
  dan media, serta mapping respons artikel cukup besar. Ini mengikuti aturan
  penempatan mapping di pedoman backend; fitur lain tidak wajib membuat mapper.
  Hapus helper `displayName`, `normalizedName`, `slugify`, serta validasi URL
  profil dari service artikel. Judul cukup di-trim;
  normalisasi nama dan pembentukan slug tetap dilakukan di create taksonomi
  untuk menjaga perilaku unik kategori/tag.

Verifikasi standardisasi: seluruh 57 tes API pada 6 suite lulus, termasuk tes
regresi gambar banner, validasi DTO login, publikasi dengan profil tersimpan,
normalisasi taksonomi, serta field respons publik; lint, build, dan type-check
backend juga lulus. Tes memakai database khusus `_test` dan object storage fake.

## Keputusan produk yang harus dipertahankan

- Delivery API mencakup create flow CMS, daftar/detail artikel publik, serta
  kategori dan tag publik.
  Edit, hapus, draft, jadwal terbit, dan panel manajemen akun belum dibuat.
- Satu artikel memiliki tepat satu kategori, nol atau lebih tag, key points
  berjumlah bebas, satu banner (default bila tidak memilih), dan penulis dari
  akun CMS yang login. `publishedAt` diisi saat create; migrasi tujuh artikel
  mempertahankan tanggal asli.
- Isi artikel baru disimpan sebagai HTML semantik tanpa style inline, script,
  atau event handler. Elemen yang diterima saat ini hanya paragraf, H2, H3,
  bold, italic, line break, dan gambar yang mereferensikan media body milik
  penulis. Dukungan import artikel lama untuk H4, daftar, tautan, dan tabel
  ditentukan terpisah saat fase migrasi.
- Banner CTA yang dapat dipakai ulang menyimpan title, description, dan media
  ilustrasi. Satu banner bisa dipakai banyak artikel; perubahan banner pada
  fase berikutnya akan memengaruhi semua pemakainya. WhatsApp dan email bukan
  field banner. Hanya WhatsApp yang menjadi tautan di frontend.
- Nama, jabatan, bio, dan LinkedIn penulis berasal dari profil akun. Akun,
  profil, dan izin CMS untuk sekarang diprovisi langsung di database; tidak ada
  endpoint publik untuk memberi izin CMS. Validasi field profil, termasuk URL
  LinkedIn, menjadi tanggung jawab provisioning/proses simpan profil. Publish
  artikel hanya memastikan profil penulis sudah ada, tanpa memvalidasi ulang
  URL profil. Selama provisioning masih manual, pemeriksaan URL juga manual.
- Staging dan production sementara berbagi bucket Spaces `cargoindo` di `sgp1`
  dengan prefix objek berbeda. Credential tidak ditulis di source, log,
  respons API, atau plan. Pemisahan bucket/credential adalah fase lanjutan.
- Struktur backend memakai satu `ArticleModule` untuk artikel, kategori, tag,
  banner, dan media artikel, dengan satu `ArticleController` untuk route publik
  dan CMS. `@CmsAccess()` hanya dipasang pada method CMS. Prefix route `/cms`
  menandai akses CMS.

## Fase 0 — Kontrak dan konfigurasi lokal

- [x] Dokumentasikan request/response OpenAPI untuk seluruh endpoint CMS create
   flow, multipart upload, serta daftar/detail publik. Respons tetap memakai
   envelope API existing.
- [x] Tetapkan batas 5 MiB serta validasi MIME, format, dan dimensi dari isi
   file. JPEG, PNG, dan WebP diterima; SVG ditolak pada MVP. `vector` pada UI
   adalah ilustrasi yang diekspor menjadi PNG/WebP.
- [x] Konfigurasi koneksi Spaces melalui environment privat: endpoint `sgp1`,
   bucket, prefix environment, dan URL publik/CDN. Gunakan key objek acak/unik
   agar upload tidak menimpa aset lama. Gunakan database dan prefix lokal
   terpisah dari production.
- [x] **Fase 0 API selesai:** kontrak OpenAPI dapat dipakai agent frontend dan
  konfigurasi lokal berhasil tanpa secret masuk repository.

## Fase 1 — Izin CMS, taksonomi, banner, media

- [x] Pertahankan `UserRole` CUSTOMER/STAFF yang sudah dipakai alur kargo.
   Tambahkan pemberian izin CMS yang terpisah dari role tunggal tersebut,
   sehingga satu akun nantinya dapat memiliki akses CMS dan CRM sekaligus.
   Pemeriksaan izin harus dilakukan backend pada setiap endpoint tulis CMS.
- [x] Simpan data profil penulis pada akun: nama dari data user, jabatan, bio
   singkat,
   dan URL LinkedIn yang valid. Siapkan prosedur provisioning manual dengan
   password yang di-hash dan izin CMS; jangan mengandalkan SQL password polos.
   Gunakan endpoint login yang ada. Sediakan pembacaan profil akun login yang
   cukup untuk shell CMS.
- [x] Tambah model kategori dan tag dengan nama/slug unik. Tambah banner dengan
   title, description, media ilustrasi, serta penanda default yang konsisten.
   Tambah metadata media: object key, URL, MIME, ukuran, dimensi, jenis, dan
   pembuat. Binary file tidak disimpan di PostgreSQL.
- [x] Tambah endpoint CMS terproteksi untuk create/list kategori, tag, banner,
   dan upload media. Media library/list media belum termasuk MVP. Konflik
   slug/nama dan ID referensi tidak valid
   menghasilkan error terarah. Upload yang berhasil harus dapat dipakai pada
   create artikel/banner; upload yang gagal tidak menghasilkan record media
   yang tampak siap pakai.
- [x] Tambah list kategori/tag/banner untuk pilihan form CMS. Endpoint publik
   baru ditambahkan bersama read API artikel.
- [x] Tambah tes API untuk login/izin CMS, create/list data pendukung, serta
  upload valid dan invalid.
- [x] Kelompokkan implementasi dalam satu `ArticleModule`; pisahkan lifecycle
  media ke `ArticleMediaService` agar service artikel tetap fokus.
- [x] **Fase 1 API selesai:** semua tes fase lulus dan objek media yang dibuat
  dapat dibaca melalui URL yang dikembalikan.

## Fase 2A — Artikel create CMS

### Model dan validasi

- [x] Implementasikan `Article`: ID, slug unik, title, meta description, cover
  media + alt,
  body HTML, key points berurutan, author ID, category ID, banner ID,
  publishedAt, updatedAt, dan relasi banyak tag. Tidak perlu status draft
  palsu pada MVP. Tambahkan field status ketika alur draft/jadwal benar-benar
  dikerjakan.
- [x] Validasi slug yang dibuat dari judul di form dan bisa diubah sebelum
  publish, lalu pastikan nilainya unik di API. Setelah terbit, slug tetap.
  Simpan slug dan tanggal tujuh
  artikel lama apa adanya saat migrasi.
- [x] Validasi field wajib, panjang input, keberadaan profil penulis, relasi media/kategori/
  tag/banner, duplikasi tag, dan isi HTML. Tolak elemen/atribut berbahaya;
  jangan menerima CSS dari editor. Setiap gambar isi memiliki referensi media
  yang sah dan alt text.
- [x] Buat artikel beserta relasi tag secara atomik. `authorId` selalu dari token,
  bukan dari body request. Kembalikan konflik slug sebagai 409, input salah
  sebagai 400, tanpa kredensial sebagai 401, tanpa izin CMS sebagai 403,
  dan slug tidak ada sebagai 404.

### Endpoint CMS yang diimplementasikan

| Kebutuhan | Endpoint | Akses |
| --- | --- | --- |
| Login existing | `POST /auth/login` | Publik |
| Profil login, permission, profil penulis | `GET /auth/me` | Bearer token |
| Upload cover/body | `POST /cms/articles/assets` | Akun berizin CMS |
| Buat/list kategori | `POST /cms/categories`, `GET /cms/categories` | Akun berizin CMS |
| Buat/list tag | `POST /cms/tags`, `GET /cms/tags` | Akun berizin CMS |
| Buat/list banner | `POST /cms/banners`, `GET /cms/banners` | Akun berizin CMS |
| Terbitkan artikel | `POST /cms/articles` | Akun berizin CMS |

- [x] Implementasikan seluruh endpoint CMS pada tabel di atas.
- [x] Tambah tes publish artikel, duplicate slug, referensi salah, default
  banner, permission, sanitasi HTML, dan kompensasi object storage.
- [x] **Fase 2A API selesai:** artikel dibuat atomik dan langsung memiliki
  `publishedAt`; endpoint pembacanya dikerjakan di Fase 2B.

## Fase 2B — Public read API

- [x] Tambah `GET /articles` dengan pagination stabil, pencarian, serta filter
  kategori, tag, dan penulis. Respons daftar hanya membawa data kartu.
- [x] Tambah `GET /articles/:slug` dengan body HTML, key points, kategori/tag,
  banner, media, dan profil penulis. Slug tidak ada menghasilkan 404.
- [x] Tambah `GET /categories` dan `GET /tags` publik; sumber slug dinamis untuk
  sitemap memakai pagination `GET /articles`.
- [x] Tambah tes pagination, filter, pencarian, detail, 404, dan memastikan hanya
  artikel terbit yang keluar.
- [x] **Fase 2B API selesai:** artikel baru dapat dibaca frontend tanpa build
  ulang dan kontraknya tercatat di OpenAPI.

Endpoint daftar/detail, kategori, dan tag publik tersedia dalam satu
`ArticleController`, termasuk artikel baru yang langsung terbaca setelah create.
Migrasi tujuh artikel lama dan integrasi frontend/sitemap dikerjakan terpisah.

Verifikasi akhir Fase 2B API: 57 tes pada 6 suite lulus melalui
`pnpm --filter api exec vitest run --config ./vitest.config.e2e.ts --no-file-parallelism`;
lint, build, type-check, dan `git diff --check` juga lulus. Eksekusi paralel sempat
melewati batas waktu pada dua tes Auth; pengulangan suite berurutan lulus.

### Kontrak GET /articles dan GET /articles/:slug

Kedua endpoint publik tanpa Bearer token. Endpoint `/cms/*` tetap membutuhkan
login dan permission `CMS_ACCESS`, walaupun berada dalam controller yang sama.

| Query daftar | Aturan |
| --- | --- |
| `page` | Integer 1–1.000.000, default 1 |
| `limit` | Integer 1–100, default 12 |
| `q` | Maksimal 200 karakter; substring judul atau nama tag, tanpa membedakan kapital, spasi awal/akhir diabaikan; `%`, `_`, dan backslash dicari sebagai karakter biasa |
| `category` | Slug kategori, bukan ID atau nama tampilan |
| `tag` | Slug tag, bukan ID atau nama tampilan |
| `author` | Slug profil penulis, bukan user ID |

Filter slug menggunakan huruf kecil, angka, dan tanda hubung, maksimal 180
karakter. Filter yang diisi digabung dengan AND; pencarian judul/tag memakai OR
di dalam kondisi tersebut. Filter valid yang tidak cocok menghasilkan daftar
kosong. Query tidak valid atau field query tak dikenal menghasilkan 400 dengan
`error.code=VALIDATION_ERROR` dan rincian `fields`.

Daftar diurutkan `publishedAt DESC, id DESC`. ID memecahkan urutan ketika tanggal
sama. Pagination nomor halaman tidak menjamin posisi tetap bila ada artikel
baru/dihapus di antara request. Item dan total satu respons dibaca dengan snapshot
database yang sama.

Respons daftar memakai envelope existing:

```json
{
  "request_id": "example-request-id",
  "data": {
    "items": [],
    "pagination": { "page": 1, "limit": 12, "total": 0, "totalPages": 0 }
  }
}
```

Setiap item memuat `id`, `slug`, `title`, `metaDescription`, `publishedAt`,
`updatedAt`, `cover`, `coverImageAlt`, `category`, `tags`, dan ringkasan `author`
(`id`, `name`, `slug`). Tidak ada `bodyHtml`, `keyPoints`, banner, atau bio penulis
pada kartu. Detail memakai respons create artikel yang sama, ditambah `bodyHtml`
tersanitasi beserta referensi gambar isi dan `updatedAt`; profil penulis serta
banner/ilustrasinya lengkap. DTO OpenAPI menyatakan semua field tersebut.

Model belum mempunyai draft/status. Artikel publik adalah record dengan
`publishedAt <= waktu request`; tanggal masa depan tidak keluar dari daftar atau
detail. Slug yang tidak ada maupun belum terbit sama-sama menghasilkan 404
`NOT_FOUND`. Ini filter pembacaan, bukan implementasi penjadwalan penerbitan.

Untuk sumber slug dinamis sitemap, baca `GET /articles?page=1&limit=100` sampai
`pagination.totalPages`, lalu gunakan `slug`, `publishedAt`, dan `updatedAt` pada
kartu. Integrasi sitemap frontend serta migrasi tujuh artikel lama tetap
pekerjaan terpisah.

### Kontrak GET /categories dan GET /tags

Keduanya publik tanpa Bearer token dan berada dalam `ArticleController` yang sama.
Respons menggunakan envelope existing dengan array `data` berisi `id`, `name`,
dan `slug`. Semua kategori/tag dikembalikan, termasuk yang belum dipakai artikel,
dengan urutan `name ASC, id ASC`. Daftar tidak dipaginasi; bila belum ada data,
hasilnya `data: []`.

Endpoint ini memakai fungsi list service yang sama dengan CMS. Field internal
seperti `normalizedName` dan `createdAt` tidak dikirim. Slug hasil daftar langsung
dipakai pada filter `category`/`tag` di `GET /articles`. Pembuatan kategori/tag
tetap melalui `POST /cms/categories` atau `POST /cms/tags` dengan izin CMS.

### Migrasi manual tujuh artikel

- [ ] Petakan setiap entry `articleCatalog.ts`, HTML di `content/articles/`, dan
   media di `public/images/articles/` ke model baru. Catat count, slug, tanggal,
   dan checksum/hasil perbandingan isi sebelum alih sumber.
- [ ] Buat kategori awal yang sesuai, tag lama, banner default, profil Baariq,
   lalu import tujuh artikel melalui prosedur terkontrol dengan tanggal asli.
   Media lama boleh mempertahankan URL publik yang masih valid jika metadata
   media dapat merepresentasikannya; jangan memaksa upload ulang tanpa alasan.
- [ ] Jalankan import lokal dan staging lebih dahulu; production setelah backup.
   Prosedur harus aman dijalankan ulang tanpa duplikasi slug/relasi.
- [ ] Jangan menghapus data sumber lokal sampai frontend publik berbasis API dan
   seluruh URL lama diverifikasi.

## Verifikasi dan serah-terima ke agent frontend

- [x] Tes fokus create flow CMS di `apps/api/test/cms-articles.e2e-spec.ts`:
  login/izin, create/list kategori/tag/banner, upload valid/invalid, publish,
  duplicate slug, referensi salah, HTML berbahaya, dan cleanup object.
- [x] Jalankan `pnpm --filter api test:e2e`, `pnpm --filter api lint`,
  `pnpm --filter api build`, `pnpm --filter api exec tsc --noEmit -p tsconfig.json`,
  serta `git diff --check` dari root sesuai `docs/backend-guidelines.md`.
- [ ] Serahkan spesifikasi OpenAPI, contoh respons daftar/detail, daftar validasi,
  cara memperoleh akun CMS lokal, dan env yang dibutuhkan tanpa nilai secret.
  Agent frontend baru mengganti katalog publik setelah kontrak dan data
  migrasi lokal siap.

## Fase 5 — Deploy API yang belum ada

`apps/api` sekarang belum masuk deployment VM.

- [ ] Siapkan service dan healthcheck API serta PostgreSQL staging.
- [ ] Siapkan migrasi schema, backup/restore, environment privat, route
  subdomain, dan alur deploy branch `staging`.
- [ ] Gunakan database/volume/konfigurasi/prefix Spaces staging tersendiri meski
  VM dan bucket sama.
- [ ] Verifikasi migrasi dan data sebelum web diarahkan ke API baru.
- [ ] Siapkan rollback yang tidak menghapus artikel yang baru terbit.
- [ ] Siapkan deployment API dan PostgreSQL production dari `main`.
- [ ] **Fase 5 API selesai:** healthcheck, migrasi, backup, deploy, dan rollback
  staging serta production sudah diuji dan hasilnya dicatat.

Setelah rilis pertama, tambah API edit/hapus, draft/jadwal, dan profil penulis
dinamis sebagai pekerjaan terpisah. Jangan memakai helper web production untuk
staging.

