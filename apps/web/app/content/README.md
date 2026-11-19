# Artikel lokal

Metadata tujuh artikel berada di `articleCatalog.ts`. Isi masing-masing artikel
berada di `articles/<slug>.html`; gambar berada di
`public/images/articles/<slug>/`. Slug publik berada di `articleSlugs.ts` dan
dipakai juga oleh sitemap.

- Isi HTML hanya memuat konten artikel. Jangan memasukkan navigasi, daftar isi
  lama, script, event handler, atau style inline.
- Gunakan `h2` untuk bagian utama dan `h3` untuk subbagian. Kedua tingkat ini
  otomatis menjadi daftar isi desktop dan mobile. `h4` tetap tampil di isi,
  tetapi tidak masuk daftar isi.
- Tiga `keyPoints` diisi manual pada metadata artikel.
- Tanggal terbit asli dipertahankan. Ubah `updatedAt` hanya setelah isi artikel
  benar-benar direvisi.
- Periksa ulang klaim, data, regulasi, tautan, dan gambar sebelum publikasi.

Sumber migrasi: `https://ethcargoindo.com/artikel/<slug>` untuk setiap slug di
`articleSlugs.ts`. Konten artikel lama dipindahkan tanpa peninjauan fakta atau
penyuntingan redaksional pada tahap ini.
