# Plan API artikel dan CMS

Ikuti urutan di [rencana fase](00-phases.md). Dokumen ini adalah ruang kerja agent
backend. Kontrak yang sudah diimplementasikan di OpenAPI menjadi sumber untuk
[agent frontend](02-frontend-plan.md). Sebelum mengubah `apps/api`, baca
`docs/backend-guidelines.md`, implementasi relevan, serta staged dan unstaged
diff. Ikuti pola NestJS, Prisma, autentikasi, respons, dan tes API yang ada.

## Keputusan produk yang harus dipertahankan

- Rilis awal hanya membuat dan membaca artikel terbit. Tidak ada edit, hapus,
  draft, jadwal terbit, atau panel manajemen akun.
- Satu artikel memiliki tepat satu kategori, nol atau lebih tag, key points
  berjumlah bebas, satu banner (default bila tidak memilih), dan penulis dari
  akun CMS yang login. `publishedAt` diisi saat create; migrasi tujuh artikel
  mempertahankan tanggal asli.
- Isi artikel disimpan sebagai HTML semantik tanpa style inline, script, atau
  event handler. Untuk artikel baru, editor hanya menghasilkan paragraf, H2,
  H3, bold, italic, dan gambar. Import artikel lama harus tetap bisa menyimpan
  H4, daftar, tautan, dan tabel yang sudah ada. HTML harus dibersihkan dan
  divalidasi di batas API/import; renderer frontend menentukan semua styling.
- Banner CTA yang dapat dipakai ulang menyimpan title, description, dan media
  ilustrasi. Satu banner bisa dipakai banyak artikel; perubahan banner pada
  fase berikutnya akan memengaruhi semua pemakainya. WhatsApp dan email bukan
  field banner. Hanya WhatsApp yang menjadi tautan di frontend.
- Nama, jabatan, bio, dan LinkedIn penulis berasal dari profil akun. Akun,
  profil, dan izin CMS untuk sekarang diprovisi langsung di database; tidak ada
  endpoint publik untuk memberi izin CMS. LinkedIn wajib tersedia sebelum akun
  tersebut menerbitkan artikel.
- Staging dan production sementara berbagi bucket Spaces `cargoindo` di `sgp1`
  dengan prefix objek berbeda. Credential tidak ditulis di source, log,
  respons API, atau plan. Pemisahan bucket/credential adalah fase lanjutan.

## Fase 0 — Kontrak dan konfigurasi lokal

- [ ] Dokumentasikan contoh request/response OpenAPI untuk endpoint di bawah,
   termasuk pagination, error, dan jenis media. Jangan menambahkan global
   response envelope baru; ikuti kontrak backend saat ini.
- [ ] Tentukan batas ukuran, MIME yang diterima, serta validasi isi file. Terima
   format gambar raster yang dipakai web; SVG hanya jika sudah diproses aman
   untuk menolak script, event handler, dan referensi eksternal. `vector` di
   UI adalah ilustrasi, bukan kewajiban file berekstensi SVG.
- [ ] Konfigurasi koneksi Spaces melalui environment privat: endpoint `sgp1`,
   bucket, prefix environment, dan URL publik/CDN. Gunakan key objek acak/unik
   agar upload tidak menimpa aset lama. Gunakan database dan prefix lokal
   terpisah dari production.
- [ ] **Fase 0 API selesai:** kontrak OpenAPI dapat dipakai agent frontend dan
  konfigurasi lokal berhasil tanpa secret masuk repository.

## Fase 1 — Izin CMS, taksonomi, banner, media

- [ ] Pertahankan `UserRole` CUSTOMER/STAFF yang sudah dipakai alur kargo.
   Tambahkan pemberian izin CMS yang terpisah dari role tunggal tersebut,
   sehingga satu akun nantinya dapat memiliki akses CMS dan CRM sekaligus.
   Pemeriksaan izin harus dilakukan backend pada setiap endpoint tulis CMS.
- [ ] Simpan data profil penulis pada akun: nama tampil, jabatan, bio singkat,
   dan URL LinkedIn yang valid. Siapkan prosedur provisioning manual dengan
   password yang di-hash dan izin CMS; jangan mengandalkan SQL password polos.
   Gunakan endpoint login yang ada. Sediakan pembacaan profil akun login yang
   cukup untuk shell CMS.
- [ ] Tambah model kategori dan tag dengan nama/slug unik. Tambah banner dengan
   title, description, media ilustrasi, serta penanda default yang konsisten.
   Tambah metadata media: key objek (nullable untuk aset lama yang tetap
   memakai URL publiknya), URL, MIME, ukuran, alt/jenis pemakaian bila relevan,
   dan pembuat. Jangan simpan binary file di PostgreSQL.
- [ ] Tambah endpoint CMS terproteksi untuk create/list kategori, tag, banner,
   dan upload/list media. Konflik slug/nama dan ID referensi tidak valid
   menghasilkan error terarah. Upload yang berhasil harus dapat dipakai pada
   create artikel/banner; upload yang gagal tidak menghasilkan record media
   yang tampak siap pakai.
- [ ] Tambah pembacaan kategori/tag yang diperlukan pembaca publik. Banner tidak
   perlu endpoint publik tersendiri jika sudah disertakan di detail artikel.
- [ ] Tambah tes API untuk login/izin CMS, create/list data pendukung, serta
  upload valid dan invalid.
- [ ] **Fase 1 API selesai:** semua tes fase lulus dan objek media yang dibuat
  dapat dibaca melalui URL yang dikembalikan.

## Fase 2 — Artikel create dan public read

### Model dan validasi

- [ ] Implementasikan `Article`: ID, slug unik, title, meta description, cover
  media + alt,
  body HTML, key points berurutan, author ID, category ID, banner ID,
  publishedAt, updatedAt, dan relasi banyak tag. Tidak perlu status draft
  palsu pada MVP. Tambahkan field status ketika alur draft/jadwal benar-benar
  dikerjakan.
- [ ] Validasi slug yang dibuat dari judul di form dan bisa diubah sebelum
  publish, lalu pastikan nilainya unik di API. Setelah terbit, slug tetap.
  Simpan slug dan tanggal tujuh
  artikel lama apa adanya saat migrasi.
- [ ] Validasi field wajib, panjang input, URL LinkedIn, relasi media/kategori/
  tag/banner, duplikasi tag, dan isi HTML. Tolak elemen/atribut berbahaya;
  jangan menerima CSS dari editor. Setiap gambar isi memiliki referensi media
  yang sah dan alt text.
- [ ] Buat artikel beserta relasi tag secara atomik. `authorId` selalu dari token,
  bukan dari body request. Kembalikan konflik slug sebagai 409, input salah
  sebagai 400, tanpa kredensial sebagai 401, tanpa izin CMS sebagai 403,
  dan slug tidak ada sebagai 404.

### Endpoint awal yang diusulkan

Nama final ditetapkan di OpenAPI Fase 0; jangan membuat dua pola nama untuk
resource yang sama.

| Kebutuhan | Endpoint | Akses |
| --- | --- | --- |
| Profil login CMS | `GET /cms/me` | Akun berizin CMS |
| Upload/list media | `POST /cms/media`, `GET /cms/media` | Akun berizin CMS |
| Buat/list kategori | `POST /cms/categories`, `GET /cms/categories` | Akun berizin CMS |
| Buat/list tag | `POST /cms/tags`, `GET /cms/tags` | Akun berizin CMS |
| Buat/list banner | `POST /cms/banners`, `GET /cms/banners` | Akun berizin CMS |
| Terbitkan artikel | `POST /cms/articles` | Akun berizin CMS |
| Daftar artikel publik | `GET /articles` | Publik |
| Detail berdasarkan slug | `GET /articles/:slug` | Publik |
| Kategori/tag publik | `GET /categories`, `GET /tags` | Publik |

`GET /articles` harus mendukung pagination stabil, pencarian judul/tag seperti
halaman yang ada, serta filter kategori, tag, dan penulis. Respons
daftar berisi data kartu tanpa HTML penuh; detail berisi HTML, daftar isi H2/H3
atau data untuk membangunnya, key points, kategori/tag, banner, media, dan profil
penulis. Daftar untuk sitemap bisa memakai pagination endpoint publik yang
sama; jangan membatasi sitemap pada slug yang dikompilasi saat build.

- [ ] Implementasikan seluruh endpoint CMS dan publik pada tabel di atas.
- [ ] Tambah tes publish artikel, duplicate slug, referensi hilang, HTML
  berbahaya, pagination, filter, pencarian, detail, dan 404.
- [ ] **Fase 2 API selesai:** artikel yang diterbitkan tersedia di endpoint
  daftar/detail publik dan seluruh tes fase lulus.

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

- [ ] Tes API/integrasi di `apps/api/test/*.e2e-spec.ts`: login/izin CMS, create
  kategori/tag/banner, upload valid/invalid, publish artikel, duplicate slug,
  referensi hilang, HTML berbahaya, pagination/filter/search, dan 404.
- [ ] Jalankan `pnpm --filter api test:e2e`, `pnpm --filter api lint`,
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

