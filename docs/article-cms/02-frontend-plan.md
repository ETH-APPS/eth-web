# Plan frontend artikel dan CMS minimal

Ikuti [urutan fase](00-phases.md) dan kontrak dari [plan API](01-api-plan.md).
Dokumen ini adalah ruang kerja agent frontend. Sebelum mengubah `apps/web`,
baca `docs/frontend-architecture.md` dan `docs/responsive-guidelines.md`
sepenuhnya, periksa implementasi serta staged/unstaged diff. Bila ada Figma,
periksa frame 390px dan 1440px. Screenshot CMS yang diberikan baru menunjukkan
konsep daftar artikel desktop, bukan desain form create atau frame mobile.

## Batas rilis pertama

- Ada login CMS dan satu halaman untuk create/publish artikel. Belum ada
  dashboard daftar artikel lengkap, editor artikel lama, delete, draft,
  penjadwalan, pengelolaan akun, atau form profil.
- Akun dan profil penulis disiapkan langsung di database. Form tidak memilih
  penulis lain: API menentukan penulis dari akun login.
- Form dapat memilih kategori/tag/banner yang ada atau membuatnya baru tanpa
  berpindah ke halaman manajemen. Banner default terpilih awalnya.
- Media artikel dan ilustrasi banner diunggah lewat API ke DigitalOcean Spaces.
  Editor artikel baru hanya menawarkan paragraf, H2, H3, bold, italic, serta
  gambar. Tidak ada kontrol warna, font, ukuran, CSS, atau raw HTML untuk
  penulis. Tujuh artikel lama dengan H4, daftar, tautan, dan tabel tetap
  dirender benar setelah migrasi.
- Artikel publik baru langsung tersedia tanpa build ulang. SEO dan route lama
  tetap bekerja.

## Fase 0 — Inventaris dan kontrak

- [ ] Petakan semua pemakai `articleCatalog.ts` dan `articleSlugs.ts`: daftar
   `/artikel`, detail, pencarian, tag, halaman penulis Baariq, carousel,
   rekomendasi, sitemap, serta route indexable.
- [ ] Cocokkan field form dengan OpenAPI API. Gunakan satu tipe klien/adapter
   untuk respons artikel agar komponen tidak bergantung pada struktur HTTP
   mentah. Jangan menduplikasi konten antara versi desktop/mobile.
- [ ] Ukur dan simpan baseline publik 1440px sebelum mengubah komponen, terutama
   bila pekerjaan responsive hanya menyentuh mobile/tablet. Sumber visual CMS
   adalah screenshot konsep; jangan mengarang aturan visual yang bertentangan
   dengan komponen dan guideline existing.
- [ ] **Fase 0 frontend selesai:** seluruh pembaca katalog sudah dipetakan,
  field form cocok dengan OpenAPI, dan baseline publik tersimpan.

## Fase 3 — Login dan satu halaman create

- [ ] Buat route/login CMS minimal memakai auth API yang ada. Simpan sesi dengan
   pola yang aman untuk Nuxt, lindungi route create, dan tangani token kedaluwarsa
   serta 401/403. Jangan menganggap route guard frontend sebagai otorisasi;
   backend tetap menegakkan izin CMS.
- [ ] Buat form berisi judul; slug otomatis yang dapat diubah sebelum publish; meta
   description; cover + alt; editor isi; daftar key points dinamis; satu
   kategori; banyak tag; serta banner default/pilihan baru. Tampilkan penulis
   dari akun login sebagai informasi, bukan field yang bisa diubah.
- [ ] Untuk kategori/tag/banner, tampilkan pilihan yang sudah ada dan aksi
   “buat baru” dalam form. Banner baru hanya meminta title, description,
   ilustrasi; WhatsApp dan email tidak menjadi field. Satu banner yang dibuat
   dapat dipakai lagi pada artikel berikutnya.
- [ ] Upload gambar sampul, gambar isi, dan ilustrasi banner melalui API media.
   Tampilkan progress/error yang berguna; gunakan URL/ID yang dikembalikan API,
   bukan URL yang diketik manual. Batasi file sesuai kontrak API, termasuk
   penanganan aman untuk SVG bila didukung.
- [ ] Pastikan editor mengeluarkan HTML semantik sesuai daftar kontrol yang disetujui.
   Preview memakai renderer/CSS artikel publik yang sama agar penulis melihat
   hasil mendekati publikasi. Buat daftar isi dari H2/H3 seperti sekarang;
   nomor/ID heading dihasilkan konsisten.
- [ ] Saat publish, validasi semua field, cegah pengiriman ganda, tampilkan error
   konflik slug, dan setelah berhasil tampilkan tautan artikel publik.
   Rilis awal langsung menerbitkan; jangan tampilkan tombol simpan draft.

- [ ] **Fase 3 frontend selesai:** akun CMS hasil provisioning manual dapat login,
  membuat kategori/tag/banner baru dari form, upload media, lalu menerbitkan satu
  artikel yang dibaca oleh API. Akun biasa tidak dapat mengakses alur create.

## Fase 4 — Pembaca publik dari API

- [ ] Setelah tujuh artikel dimigrasi dan diverifikasi di database lokal, ubah
   halaman `/artikel`, `/artikel/[slug]`, pencarian, tag, carousel,
   rekomendasi, dan halaman penulis Baariq agar membaca API. Pertahankan
   urutan/tampilan yang sudah ada bila tidak ada permintaan desain baru.
- [ ] Ambil data utama di server melalui `useAsyncData`/`useFetch`, sehingga HTML
   awal memuat konten dan metadata artikel. Tangani loading/error dan 404
   dengan benar. Jangan menyimpan katalog hasil API sebagai data statis baru.
- [ ] Pertahankan daftar isi dari H2/H3 dan dukungan renderer artikel lama untuk H4,
   daftar, tautan, dan tabel; API harus mengirim HTML yang sudah dibersihkan.
   Pastikan body tidak memperkenalkan overflow pada layar sempit.
- [ ] Ganti gambar CTA statis dengan komponen berbasis data banner: title,
   description, dan ilustrasi dari API. Hanya kontrol WhatsApp yang menjadi
   tautan; nomor/URL WhatsApp dan teks email tetap dari konfigurasi statis
   frontend. Perubahan banner bersama langsung tercermin di artikel pemakainya.
- [ ] Tampilkan nama, jabatan, bio, dan LinkedIn milik author dari API pada kartu
  penulis. Pertahankan halaman Baariq yang ada. Untuk penulis baru, jangan
  arahkan “Lihat Profil” ke halaman Baariq; profil dinamis menyusul setelah
  rilis create.
- [ ] Ganti sitemap dan route indexable statis dengan daftar slug dari API saat
   request, dengan cache singkat/invalidation yang membuat artikel baru segera
   terlihat. Pertahankan canonical, title, meta description, OG image,
   `BlogPosting`/`CollectionPage` JSON-LD, pagination, dan 404. Gambar OG
   memakai cover; URL absolut dibentuk dari origin production yang benar.
- [ ] Hapus ketergantungan runtime pada `articleCatalog.ts` hanya setelah semua
   pembaca dan tujuh URL lama lolos perbandingan. Jangan menghapus aset lokal
   yang masih dipakai route lain.

- [ ] **Fase 4 frontend selesai:** tujuh artikel lama tetap punya URL, isi, tanggal,
  cover, dan metadata yang benar. Satu artikel baru muncul di daftar, pencarian,
  tag, detail, rekomendasi yang relevan, dan sitemap tanpa deploy ulang. SSR
  berisi artikel dan metadata; slug tidak ada menghasilkan 404.

## Responsive dan verifikasi UI

- [ ] Ikuti `docs/responsive-guidelines.md`: mobile-first, breakpoint Tailwind 4,
  target sentuh, focus, tidak ada overflow, dan desktop existing 1440px tetap
  identik untuk perubahan yang hanya menyasar mobile/tablet.
- [ ] Uji viewport 320, 390, 768, 1023, 1024, 1280, dan 1440px; sertakan layar
  laptop pendek. Periksa halaman login, form, preview, daftar, detail, dan
  navigasi. Ambil screenshot 390px serta 1440px. Catat keterbatasan karena
  referensi form mobile/desktop Figma belum tersedia.
- [ ] Jalankan type-check/build frontend yang tersedia dan `git diff --check`.
  Verifikasi SSR dan sitemap pada runtime lokal, bukan hanya navigasi klien.

## Fase 5 — Staging dan production web

- [ ] Arahkan web staging ke API dan subdomain staging.
- [ ] Batasi staging untuk tim internal dan pasang `noindex`.
- [ ] Pastikan canonical staging tidak diterbitkan sebagai URL production.
- [ ] Siapkan jalur deploy web dari branch `staging` yang terpisah dari workflow
  production `main`.
- [ ] Uji alur login → upload → create → read di staging.
- [ ] Setelah data production dimigrasi dan API production sehat, alihkan web
  production dari katalog lokal ke API.
- [ ] Jalankan smoke test domain production dan catat commit SHA serta hasilnya.
- [ ] **Fase 5 frontend selesai:** staging dan production membaca API lingkungan
  masing-masing, alur create → read lulus, dan metadata publik terverifikasi.

Editor artikel lama, dashboard daftar seperti mockup, dan halaman profil penulis
dinamis adalah fase lanjutan.

