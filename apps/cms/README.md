# ETH Cargo CMS

Fondasi dashboard internal berbasis Nuxt. Fase saat ini hanya menyediakan shell,
navigasi, dan halaman placeholder. Belum ada login, request API, editor, maupun
data dummy.

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

Salin `.env.example` menjadi `.env` hanya ketika fase integrasi dimulai. Nilai
secret tidak boleh masuk repository.
