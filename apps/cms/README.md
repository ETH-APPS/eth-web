# ETH Cargo CMS

Dashboard internal berbasis Nuxt. Layout dashboard, UI login, dan form create
artikel sudah tersedia. Login, session HttpOnly, refresh token, logout, dan
penjagaan route sudah terhubung ke API. Data kategori/tag/banner, upload media,
editor Tiptap, dan penerbitan artikel dikerjakan pada fase berikutnya.

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

Salin `.env.example` menjadi `.env`, lalu isi:

- `NUXT_API_BASE_URL`: URL privat API NestJS, lokalnya `http://localhost:3001`.
- `NUXT_CMS_ORIGIN`: origin CMS persis, lokalnya `http://localhost:3002`.
- `NUXT_APP_SECRET`: secret session yang berbeda per environment, minimal 32
  karakter di staging/production. Development lokal dapat membangkitkannya.

Browser hanya memanggil `/api` pada origin CMS. Access dan refresh token disimpan
di bagian secure session server, bukan localStorage atau state Vue. Cookie bernama
`eth-cms-session`, host-only, HttpOnly, SameSite Lax, dan Secure pada HTTPS.

## Lokasi kerja UI

- `app/layouts/auth.vue`: shell login.
- `app/layouts/dashboard.vue`: shell dashboard dan sidebar.
- `app/pages/login.vue`: UI login.
- `app/pages/articles/create.vue`: UI create artikel.
- `app/composables/useAuth.ts`: satu pintu aksi login, verifikasi sesi, dan logout.
- `app/plugins/api.ts`: instance Axios browser dengan base URL `/api`.
- `app/plugins/vue-query.ts`: konfigurasi TanStack Vue Query.
- `app/middleware/auth.global.ts`: guard seluruh route dashboard.
- `server/api/auth`: endpoint server Nuxt untuk login, user aktif, dan logout.
- `server/utils/auth.ts`: secure session serta rotasi refresh token.
- `app/pages/**`: halaman placeholder lain sesuai route.
- `app/components/CmsNavigation.vue`: navigasi dari satu data source.
- `app/constants/navigation.ts`: label dan route navigasi.
- `app/assets/css/main.css`: style khusus CMS dan import fondasi `@eth/ui`.
- `../../packages/ui`: token warna dan font bersama web/CMS.

## Status UI create artikel

`/articles/create` menyediakan input judul, slug otomatis yang dapat dikoreksi,
ringkasan, pratinjau sampul lokal, teks alternatif, isi artikel, poin utama,
pengelompokan dari API, dan pratinjau artikel. Kategori/tag baru langsung disimpan
melalui API; banner existing dapat dipilih atau banner baru dibuat bersama
gambarnya. Isi artikel memakai Tiptap terbatas pada paragraf, H2, H3, bold,
italic, line break, dan gambar dengan alt text.
Tombol draft belum aktif karena API draft belum tersedia. Tombol terbitkan
memvalidasi form, mengunggah cover/body, mengganti gambar lokal dengan media ID,
menerbitkan artikel, lalu memverifikasi hasil melalui public read API. Upload yang
sudah berhasil disimpan selama halaman tetap terbuka agar retry tidak mengulang
file yang sama.
Halaman dashboard dan manajemen lain masih placeholder. Sidebar dan header
berasal dari `app/layouts/dashboard.vue` untuk seluruh halaman dashboard.

Belum ada delete asset atau garbage collector pada MVP. Jika publish dibatalkan
setelah upload, audit `MediaAsset` yang tidak direferensikan artikel/banner pada
database environment terkait, cocokkan `objectKey`, lalu hapus record dan object
Spaces melalui prosedur operator yang terkontrol. Jangan menghapus prefix/folder
secara massal atau memakai media dari environment lain.

Provision user dilakukan di API/database, bukan dari CMS. User harus memiliki
permission `CMS_ACCESS`. Nilai secret tidak boleh masuk repository atau log.
