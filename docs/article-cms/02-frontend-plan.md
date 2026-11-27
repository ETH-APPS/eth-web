# Frontend artikel publik dari API

Pembaruan keputusan 27 November 2026. Dashboard CMS berada di `apps/cms`;
rencana dan checklist-nya sekarang ada di [fase CMS](../cms/00-phases.md) serta
[frontend CMS](../cms/01-frontend-plan.md). Dokumen ini berfokus pada integrasi
artikel di website `apps/web`, yang dikerjakan setelah rilis CMS/API ke production
dan merge perubahan teruji ke `main`.

Sebelum mengubah `apps/web`, baca `docs/frontend-architecture.md` dan
`docs/responsive-guidelines.md` sepenuhnya, periksa staged/unstaged diff, serta
pertahankan desain existing. Kontrak API tetap mengikuti [plan API](01-api-plan.md).

## Prasyarat dan handoff CMS

- [ ] CMS login/create sudah dirilis dan API production dapat membaca artikel baru.
- [ ] Perubahan backend/CMS tersedia pada `main`; integrasi web memakai branch
  fitur baru dari basis tersebut.
- [ ] Migrasi tujuh artikel mempertahankan slug, tanggal asli, isi, media, tag,
  key points, penulis, dan banner. Uji lokal/staging sebelum cutover production.
- [ ] Tetapkan prosedur import HTML lama: beberapa file memuat H4, list, link,
  atau tabel yang belum diterima create API. Jangan menghapus struktur tersebut
  diam-diam untuk menyatakan migrasi identik. Tes Airwaybill 27 November adalah
  contoh create baru dengan tanggal server dan HTML disederhanakan.
- [ ] Jangan menampilkan tautan CMS yang menjanjikan artikel sudah tampil di
  website sampai fase integrasi ini selesai. Hasil CMS awal diverifikasi via API.

## Inventaris frontend publik

- [ ] Petakan seluruh pemakai `articleCatalog.ts` dan `articleSlugs.ts`: daftar,
  detail, pencarian/tag/kategori, halaman penulis, carousel/rekomendasi, sitemap,
  serta route indexable. Tidak membuat sumber slug statis baru.
- [ ] Cocokkan kebutuhan komponen dengan respons public read API. Gunakan adapter
  kecil bila perlu; jangan mengimpor source backend atau menyalin aturan bisnis.
- [ ] Simpan baseline publik 1440px sebelum mengubah komponen; jalankan matriks
  responsive dan pemeriksaan overflow setelah integrasi.
- [ ] Konfigurasikan akses server web ke API production/staging secara privat.
  Pilihan network dan konfigurasi web dipasang sebagai bagian rilis integrasi ini,
  tanpa mengambil alih hostname API layanan lama.

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

## Rilis integrasi web — setelah CMS production

- [ ] Arahkan web staging ke API dan subdomain staging.
- [ ] Batasi staging untuk tim internal dan pasang `noindex`.
- [ ] Pastikan canonical staging tidak diterbitkan sebagai URL production.
- [ ] Siapkan jalur deploy web dari branch `staging` yang terpisah dari workflow
  production `main`.
- [ ] Uji artikel dari CMS muncul pada SSR web staging, daftar, detail, pencarian,
   filter, penulis, dan sitemap tanpa rebuild.
- [ ] Setelah data production dimigrasi dan API production sehat, alihkan web
  production dari katalog lokal ke API.
- [ ] Jalankan smoke test domain production dan catat commit SHA serta hasilnya.
- [ ] **Integrasi web selesai:** staging dan production membaca API lingkungan
  masing-masing, alur create → read lulus, dan metadata publik terverifikasi.

Pengembangan UI CMS, editor artikel lama, dan dashboard daftar data nyata berada
pada roadmap CMS tersendiri; halaman profil penulis dinamis tetap fase lanjutan.

