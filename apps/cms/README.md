# ETH Cargo CMS

Dashboard internal berbasis Nuxt. Layout dashboard, UI login, dan form create
artikel sudah tersedia. Autentikasi, data kategori/tag/banner, upload media,
editor Tiptap, dan penerbitan ke API masih tahap integrasi berikutnya.

## Menjalankan lokal

Dari root repository:

```bash
pnpm dev:cms
```

CMS tersedia di `http://localhost:3002`. Aplikasi lain dapat dijalankan sendiri:

```bash
pnpm dev:web
pnpm dev:api
```

`pnpm dev` menjalankan seluruh package yang memiliki script `dev`.

## Lokasi kerja UI

- `app/layouts/auth.vue`: shell login.
- `app/layouts/dashboard.vue`: shell dashboard dan sidebar.
- `app/pages/login.vue`: UI login.
- `app/pages/articles/create.vue`: UI create artikel.
- `app/pages/**`: halaman placeholder lain sesuai route.
- `app/components/CmsNavigation.vue`: navigasi dari satu data source.
- `app/constants/navigation.ts`: label dan route navigasi.
- `app/assets/css/main.css`: style khusus CMS dan import fondasi `@eth/ui`.
- `../../packages/ui`: token warna dan font bersama web/CMS.

## Status UI create artikel

`/articles/create` menyediakan input judul, slug otomatis yang dapat dikoreksi,
ringkasan, pratinjau sampul lokal, teks alternatif, isi artikel, poin utama,
pengelompokan lokal, dan pratinjau artikel. Toolbar isi hanya memakai format yang
direncanakan oleh API; Tiptap dan upload gambar isi dipasang saat integrasi.
Tombol draft belum aktif karena API draft belum tersedia. Tombol terbitkan
memvalidasi form lalu menampilkan status kesiapan, tanpa menyimpan artikel.
Halaman dashboard dan manajemen lain masih placeholder. Sidebar dan header
berasal dari `app/layouts/dashboard.vue` untuk seluruh halaman dashboard.

Salin `.env.example` menjadi `.env` hanya ketika fase integrasi dimulai. Nilai
secret tidak boleh masuk repository.
