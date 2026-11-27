# Rencana bertahap artikel berbasis database

Dokumen ini menyimpan roadmap dan progres backend artikel. Untuk pengembangan
dashboard, urutan eksekusi terbaru ada di [fase CMS](../cms/00-phases.md), dengan
[plan frontend CMS](../cms/01-frontend-plan.md) dan
[deployment CMS/API/database](../cms/02-deployment-plan.md).
Kontrak backend tetap ada di [plan API](01-api-plan.md); integrasi website publik
ada di [plan frontend artikel](02-frontend-plan.md).

Keputusan 27 November 2026: rilis CMS login/create lebih dahulu, setelah staging
lulus promosikan ke `main` dan production. Migrasi serta konsumsi API oleh web
publik baru dimulai sesudah itu. Nomor fase historis di bawah tidak menggantikan
urutan pada rencana CMS terbaru.

## Status keseluruhan

Centang task setelah implementasi dan verifikasinya selesai. Centang status fase
hanya ketika seluruh task dan kriteria selesai pada fase tersebut sudah terpenuhi.

- [ ] Fase 0 — Kontrak API siap; pemetaan frontend belum dikerjakan
- [x] Fase 1 — Fondasi API dan data pendukung siap
- [x] Fase 2A — Create artikel CMS API siap
- [ ] Fase 2B — API artikel/kategori/tag publik selesai; migrasi tujuh artikel belum dikerjakan
- [ ] Fase 3 — CMS minimal siap
- [ ] Fase 4 — Pembaca publik dan migrasi siap
- [ ] Fase 5 — Staging dan production selesai

## Sasaran rilis pertama

Tim SEO login ke CMS, membuat kategori/tag/banner bila perlu, mengunggah media,
menulis artikel, lalu menerbitkannya. Rilis CMS pertama memverifikasi hasil lewat
public read API; halaman website masih memakai katalog lokal. Pada rilis web
berikutnya, tujuh artikel lama dipindahkan manual dengan URL dan tanggal aslinya,
lalu daftar/detail/pencarian/sitemap membaca API tanpa build ulang. Belum ada
edit, hapus, draft, penjadwalan, pengaturan akun, atau pengaturan profil melalui CMS.

## Aturan branch dan rilis

- Kerjakan fitur di branch pengembangan terpisah dari `main`. Branch plan saat ini:
  `codex/article-cms-plan`; buat branch implementasi dari basis yang sudah
  ditinjau saat mulai coding. Jangan membawa perubahan lain ke rilis artikel.
- `staging` menjadi branch yang dideploy ke lingkungan staging di VM yang sama.
  `main` tetap branch production. Promosikan perubahan yang sudah diuji dari
  branch fitur ke `staging`, lalu perubahan yang sama ke `main` setelah lulus
  pemeriksaan staging. Catat commit SHA yang diuji dan yang dirilis.
- Workflow yang ada hanya mendeploy web dari `main`; ia belum mendeploy API atau
  staging. Jangan menganggap push ke `staging` atau perubahan `apps/api` sudah
  terpasang di VM.
- Setiap lingkungan memakai proses API, konfigurasi, dan database sendiri.
  Staging memakai subdomain baru dan hanya dapat diakses tim internal. Untuk
  sementara staging dan production boleh memakai bucket DigitalOcean Spaces
  `cargoindo` yang sama, tetapi key objek harus memakai prefix berbeda dan unik.
  File staging di bucket publik tetap bisa dibuka lewat URL langsung; hanya
  konten uji yang tidak rahasia boleh diunggah. Pisahkan bucket dan kredensial
  staging pada pengembangan berikutnya.

## Fase 0 — Kunci kontrak dan lingkungan lokal

**Hasil:** agent API dan frontend memakai nama field, respons, serta aturan
publikasi yang sama sebelum membuat UI.

- [x] Agent API menuliskan kontrak OpenAPI untuk create artikel CMS, kategori,
   tag, banner, upload media, autentikasi CMS, serta daftar/detail artikel publik
   sesuai [plan API](01-api-plan.md).
- [ ] Agent frontend memetakan field form dan semua pembaca `articleCatalog.ts`
   terhadap kontrak tersebut sesuai [plan frontend](02-frontend-plan.md).
- [x] Siapkan database lokal terpisah dari production serta konfigurasi Spaces
   lokal tanpa menaruh credential di repo. Simpan aset lokal di prefix khusus
   development. Tes memakai database berakhiran `_test` dan object storage fake;
   koneksi bucket development asli tetap memerlukan credential lokal.

   Verifikasi schema lokal 26 November 2026: migration
   `20261126000000_article_cms_create_flow` sudah diterapkan ke
   `localhost:5432/eth_apps`, schema `public`; seluruh 4 migration berstatus
   terpasang. Tabel artikel, taksonomi, banner, media, profil penulis, serta izin
   tersedia. Sebelumnya migration CMS hanya terpasang di `eth_apps_test`.
   Pada pemeriksaan 26 November tabel `Article` lokal masih kosong. Pada
   27 November pengguna berhasil membuat satu artikel Airwaybill melalui API
   dengan upload Spaces; ini tes create baru, bukan migrasi tujuh artikel dengan
   tanggal asli. Profil/izin user disimpan di tabel relasi, bukan kolom baru `User`.
- [ ] Catat baseline halaman artikel publik sebelum mengubah UI. Screenshot CMS
   yang diberikan hanya referensi konsep desktop; belum ada frame Figma mobile
   390px dan desktop 1440px untuk halaman create.

- [ ] **Fase 0 selesai:** kontrak contoh request/response disepakati, konfigurasi lokal
  berfungsi, dan tidak ada kebutuhan form yang bergantung pada field API yang
  belum ditentukan.

## Fase 1 — Fondasi API dan data pendukung

**Hasil:** akun CMS yang diisi manual bisa login; kategori, tag, banner, serta
media bisa dibuat dan dibaca tanpa artikel.

- [x] Tambah izin CMS yang terpisah dari role operasional saat ini sehingga satu
   akun kelak dapat mempunyai akses CMS dan CRM sekaligus. Akun dan profil
   penulis diisi langsung ke database untuk sekarang; tidak ada UI manajemen
   akun/profil.
- [x] Tambah tabel kategori, tag, banner CTA, media, dan profil penulis yang
   dibutuhkan tampilan publik. Banner berisi judul, deskripsi, dan ilustrasi;
   WhatsApp serta email tetap berasal dari konfigurasi frontend.
- [x] Tambah endpoint CMS terproteksi untuk upload dan create/list data pendukung.
   Gunakan Spaces untuk berkas, database untuk referensi dan metadata.
- [x] Siapkan dukungan banner bawaan dan fallback-nya. Record banner default
   awal tetap diprovisi manual di database seperti akun/profil; belum ada
   endpoint edit, hapus, atau pengaturan default.

- [x] **Fase 1 selesai:** tes API membuktikan akun CMS bisa membuat data pendukung,
  akun tanpa izin ditolak, file tidak valid ditolak, dan objek media dapat
  dibaca melalui URL yang dikembalikan.

## Fase 2A — Create artikel CMS API

**Hasil:** artikel dapat dibuat dan langsung berstatus terbit melalui API CMS.
Endpoint pembaca publik dikerjakan pada fase berikutnya.

- [x] Tambah model artikel dengan satu kategori, banyak tag, key points berjumlah
   bebas, satu banner bawaan/pilihan, penulis dari akun login, dan tanggal
   publikasi. Slug unik; isi HTML semantik disaring oleh API.
- [x] Tambah endpoint CMS untuk create sekali jalan, termasuk validasi cover,
   gambar isi, kategori, tag, banner, profil penulis, dan transaksi relasi tag.
- [x] Tambah pengujian publish, slug duplikat, referensi salah, permission,
   default banner, pembersihan file gagal, dan sanitasi HTML.

- [x] **Fase 2A selesai:** seluruh tes fokus create flow CMS lulus.

## Fase 2B — Read artikel publik dan migrasi

**Hasil:** artikel terbit tersedia pada endpoint publik tanpa deploy ulang.

- [x] Tambah endpoint publik untuk daftar, detail slug, pencarian, filter, dan
   data yang diperlukan sitemap.
- [x] Buat respons daftar yang ringan dan respons detail yang lengkap. Hanya
   artikel terbit yang keluar dari endpoint publik.
- [x] Tambah kategori/tag publik untuk pilihan filter. Sumber slug dan tanggal
   sitemap tersedia melalui pagination `GET /articles`.
- [ ] Siapkan cara migrasi manual tujuh artikel lama ke database, termasuk tanggal,
   slug, cover, isi, tag, dan key points; jangan mengubah sumber publik dahulu.
- [x] Tambah tes daftar/filter/detail, pagination, pencarian, dan 404.

API Fase 2B selesai: daftar/detail artikel serta kategori/tag publik tersedia
melalui satu `ArticleController`, bersama route CMS yang tetap dilindungi per
method. Verifikasi: 57 tes API pada 6 suite lulus dengan eksekusi berurutan;
lint, build, type-check, dan `git diff --check` lulus. Tujuh artikel lama belum
dimigrasikan; pembaca frontend dan sitemap belum dialihkan ke API.

- [ ] **Fase 2B selesai:** tujuh artikel lama tersedia di endpoint publik dengan
  URL lama dan artikel baru dapat dibaca tanpa build frontend.

## Fase 3 — CMS minimal

Rincian fase ini sekarang mengikuti [rencana CMS](../cms/00-phases.md): fondasi
dan placeholder → UI oleh pemilik proyek → login → create → deployment.
Dashboard/list/manajemen masih placeholder pada rilis CMS awal.

**Hasil:** tim SEO dapat login dan menerbitkan artikel melalui satu halaman
create, termasuk membuat kategori, tag, atau banner dari form yang sama.

- [ ] Buat halaman login CMS dan penjagaan route.
- [ ] Buat form create dengan judul, slug yang dapat dikoreksi sebelum terbit,
   meta description, cover/alt, isi, key points dinamis, kategori, tag, dan
   banner. Pilihan editor hanya paragraf, H2, H3, bold, italic, dan gambar;
   styling berasal dari frontend.
- [ ] Form menampilkan pilihan data yang ada dan aksi membuat kategori/tag/banner
   baru tanpa halaman manajemen terpisah. Upload cover, gambar isi, dan
   ilustrasi banner memakai API media.
- [ ] Tangani validasi, konflik slug, kegagalan upload/publish, serta cegah klik
   publish ganda. Setelah sukses, tampilkan ID/slug dan verifikasi detail API;
   tautan website publik baru menjadi bukti setelah integrasi web selesai.

- [ ] **Fase 3 selesai:** editor CMS dapat menerbitkan artikel lengkap dari browser
  lokal dengan akun hasil provisioning manual, tanpa menyentuh database untuk
  setiap artikel baru.

## Fase 4 — Alihkan pembaca publik dan migrasi

Dilaksanakan setelah rilis CMS pada Fase 5 historis di bawah; pada rencana
baru pekerjaan ini adalah [Fase 6 CMS](../cms/00-phases.md#fase-6--website-publik-mengonsumsi-api).

**Hasil:** frontend publik sepenuhnya membaca database; tujuh URL lama dan
konten baru sama-sama berfungsi.

- [ ] Migrasikan tujuh artikel lama secara manual, verifikasi setiap slug, konten,
   tanggal asli, cover, penulis, tag, dan key points terhadap versi saat ini.
- [ ] Ganti pembacaan `articleCatalog.ts` pada daftar, detail, pencarian, tag,
   rekomendasi, dan sitemap dengan API. Jangan menonaktifkan sumber lokal
   sebelum hasil migrasi diverifikasi.
- [ ] Render banner CTA dari data artikel. Hanya WhatsApp yang menjadi tautan;
   informasi WhatsApp dan email tetap statis. Render kartu penulis dari akun
   artikel. Halaman Baariq yang ada tetap berfungsi.
- [ ] Pertahankan SSR, canonical, metadata, structured data, status 404, dan URL
   publik. Artikel baru harus muncul tanpa build ulang; sitemap harus ikut
   berubah tanpa daftar slug statis.

- [ ] **Fase 4 selesai:** semua tujuh URL lama dan satu artikel baru lolos pemeriksaan
  konten/SEO; daftar, pencarian, tag, dan sitemap menampilkan artikel baru tanpa
  deploy ulang. Jalankan matriks viewport wajib di `docs/responsive-guidelines.md`
  dan periksa overflow.

## Fase 5 — Staging lalu production

**Hasil:** CMS login/create dan read API teruji di staging, lalu perubahan
dipromosikan ke `main` dan production. Checklist operasional terbaru ada di
[deployment CMS](../cms/02-deployment-plan.md).

- [ ] Siapkan API dan PostgreSQL staging di VM yang sama tetapi dengan service,
   volume/database, environment, dan subdomain terpisah. Pasang migrasi schema,
   healthcheck, backup, dan credential khusus lingkungan. Siapkan deploy
   `staging` yang tidak memanggil helper production dari `main`.
- [ ] Siapkan CMS staging di `cms-staging.ethcargoindo.com` yang memakai API
   staging internal. Batasi akses ke tim internal dan beri `noindex`. Media
   staging memakai prefix sendiri pada bucket sementara.
- [ ] Uji login, upload, create, read API, rollback, serta jalur kegagalan. Jangan
   gunakan data atau secret production untuk pengujian. SSR web, tujuh artikel
   lama, dan sitemap diuji pada fase integrasi publik berikutnya.
- [ ] Setelah staging lulus, siapkan deployment API dan PostgreSQL production
   (belum ada saat ini), backup serta migration schema, dan CMS production di
   `cms.ethcargoindo.com`. Catat SHA/artifact staging yang dipromosikan melalui
   `main`; lakukan smoke test CMS/API. Cutover web dan migrasi tujuh artikel
   dilakukan terpisah setelah rilis CMS ini.

- [ ] **Fase 5 selesai:** CMS/API staging dan production menjalankan release teruji;
  artikel baru terbaca melalui API; layanan web lama tetap sehat; tersedia
  langkah pemulihan jika migrasi atau cutover gagal.

## Fase lanjutan setelah rilis pertama

- [ ] Edit/hapus dan prosedur koreksi tanpa suntik database.
- [ ] Draft serta jadwal terbit.
- [ ] API dan halaman profil penulis dinamis.
- [ ] Manajemen akun/profil CMS.
- [ ] Hak akses CRM dan CMS pada satu akun.
- [ ] Dashboard daftar artikel seperti mockup.
- [ ] Bucket dan kredensial Spaces staging terpisah.

Koreksi mendesak sebelum fitur edit tersedia dilakukan langsung di database
dengan backup dan catatan perubahan.

