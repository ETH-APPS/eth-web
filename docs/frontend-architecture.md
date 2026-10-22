# Frontend Context and Architecture

Dokumen ini menjadi konteks awal untuk pengembangan frontend `apps/web`.
Keputusan di dalamnya dapat berkembang bersama kebutuhan produk, tetapi struktur
dasarnya sebaiknya tetap konsisten.

## Project Context

| Topik | Keputusan saat ini |
| --- | --- |
| Jenis aplikasi | Gabungan landing page, dashboard, admin, dan area aplikasi lain |
| Role pengguna | Akan memiliki banyak role; detail role belum ditentukan |
| Rendering | Banyak halaman memerlukan SEO; SSR/prerender menjadi kebutuhan penting |
| Routing | File-based routing standar Nuxt |
| Backend | REST API di `apps/api` |
| API contract | Direncanakan menggunakan OpenAPI/Swagger |
| Authentication | JWT dan OAuth; detail implementasi dikerjakan kemudian |
| Pengalaman state sebelumnya | Zustand dan React Query |
| UI | Komponen dibuat sendiri menggunakan Tailwind CSS, tanpa component library |
| Design system | Button, input, modal, typography, badge, table, dan form dibuat reusable |
| Validation | Zod |
| Internationalization | Belum diperlukan |
| Testing | Dikerjakan pada tahap berikutnya |
| Shared packages | Types, schema, API contract, dan constants dapat ditempatkan di `packages/` |
| Deployment | Docker, tetapi bukan fokus saat ini |
| Fokus terdekat | Landing page dengan SEO |

## Keputusan Arsitektur

Gunakan struktur hybrid:

1. Ikuti direktori bawaan Nuxt untuk routing, layouts, middleware, plugins,
   composables, dan komponen global.
2. Kelompokkan UI berdasarkan fungsi atau domain ketika aplikasinya mulai besar.
3. Jaga file di `pages/` tetap tipis. Sebuah page bertugas menyusun section,
   mengambil data level-route, memilih layout, dan mendefinisikan SEO.
4. Jangan membuat semua folder dari awal. Buat folder saat sudah ada file yang
   memang membutuhkannya.

## Perbedaan Penting dari Next.js

### Route group

Di Nuxt 4, route group menggunakan tanda kurung biasa:

```text
app/pages/(marketing)/about.vue -> /about
```

Nama `(marketing)` hanya untuk organisasi dan tidak menjadi bagian URL.
Route group tidak otomatis memberikan layout seperti pada Next.js; routing group
dan pemilihan layout adalah dua concern terpisah di Nuxt.

Jangan menggunakan `[admin]` untuk mengelompokkan halaman. Tanda kurung siku
adalah dynamic route:

```text
app/pages/[admin].vue -> /:admin
```

Jika URL yang diinginkan memang `/admin`, gunakan folder biasa:

```text
app/pages/admin/index.vue       -> /admin
app/pages/admin/users/index.vue -> /admin/users
app/pages/admin/users/[id].vue  -> /admin/users/:id
```

### Layout

Layout Nuxt berada di `app/layouts/`. Page memilih named layout melalui
`definePageMeta`:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>
```

`app.vue` sebaiknya hanya menjadi root shell:

```vue
<template>
  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

Jika suatu section membutuhkan wrapper bertingkat seperti nested layout di
Next.js, gunakan parent page dengan `<NuxtPage />`. Gunakan pola ini hanya jika
memang ada UI bertingkat; untuk perbedaan shell utama, named layout lebih jelas.

## Struktur untuk Fase Landing Page

Mulai dengan struktur kecil berikut:

```text
apps/web/
├── app/
│   ├── app.vue
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css
│   │   └── images/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.vue
│   │   │   ├── Container.vue
│   │   │   └── Icon.vue
│   │   └── marketing/
│   │       ├── Header.vue
│   │       ├── Footer.vue
│   │       └── sections/
│   │           ├── HeroSection.vue
│   │           ├── FeaturesSection.vue
│   │           ├── TestimonialsSection.vue
│   │           └── CtaSection.vue
│   ├── layouts/
│   │   └── default.vue
│   ├── pages/
│   │   └── (marketing)/
│   │       ├── index.vue
│   │       ├── about.vue
│   │       └── contact.vue
│   ├── composables/
│   │   └── useSiteSeo.ts
│   ├── constants/
│   │   └── site.ts
│   ├── types/
│   └── utils/
├── public/
│   ├── fonts/
│   ├── images/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

### Tanggung jawab pada fase ini

- `layouts/default.vue`: header, footer, dan shell untuk halaman publik.
- `pages/(marketing)/index.vue`: menyusun landing-page sections dan menentukan
  metadata halaman.
- `components/marketing/sections`: section khusus landing page.
- `components/ui`: komponen visual dasar yang reusable dan tidak mengetahui
  domain bisnis.
- `constants/site.ts`: nama situs, navigation, URL sosial, dan informasi situs
  yang stabil.
- `composables/useSiteSeo.ts`: helper SEO hanya jika metadata mulai berulang.
- `assets/`: file yang masuk pipeline build, seperti CSS dan gambar yang di-import.
- `public/`: file yang harus tersedia dengan URL tetap tanpa diproses build.

Jangan memecah setiap teks atau elemen kecil menjadi komponen. Buat komponen
ketika elemen digunakan ulang, memiliki state/logic sendiri, atau sebuah section
sudah cukup besar untuk berdiri sendiri.

## Struktur Saat Aplikasi Bertambah

Struktur berikut adalah arah pengembangan, bukan daftar folder yang harus dibuat
sekarang:

```text
apps/web/
├── app/
│   ├── app.vue
│   ├── error.vue
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── marketing/
│   │   ├── admin/
│   │   └── dashboard/
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── auth.vue
│   │   ├── admin.vue
│   │   └── dashboard.vue
│   ├── pages/
│   │   ├── (marketing)/
│   │   │   ├── index.vue
│   │   │   ├── about.vue
│   │   │   └── contact.vue
│   │   ├── (auth)/
│   │   │   ├── login.vue
│   │   │   └── oauth/
│   │   │       └── callback.vue
│   │   ├── admin/
│   │   │   ├── index.vue
│   │   │   └── users/
│   │   │       ├── index.vue
│   │   │       └── [id].vue
│   │   └── dashboard/
│   │       ├── index.vue
│   │       └── shipments/
│   │           ├── index.vue
│   │           └── [id].vue
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── composables/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   └── shipment/
│   │       ├── api/
│   │       ├── components/
│   │       ├── composables/
│   │       ├── schemas/
│   │       └── types/
│   ├── composables/
│   ├── constants/
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── guest.ts
│   │   └── role.ts
│   ├── plugins/
│   │   ├── api.ts
│   │   └── vue-query.ts
│   ├── services/
│   │   └── api/
│   │       └── client.ts
│   ├── stores/
│   ├── types/
│   └── utils/
├── public/
├── server/
└── nuxt.config.ts

packages/
├── api-client/
└── contracts/
```

### Batasan folder

- `components/ui`: presentational primitives seperti button, input, modal, badge,
  table, dan typography.
- `components/<area>`: komponen reusable untuk suatu area tampilan.
- `features/<domain>`: business logic yang hanya dimiliki satu domain. Import dari
  folder ini dibuat eksplisit agar dependency domain mudah terlihat.
- `composables`: logic Vue/Nuxt lintas domain. Jangan memindahkan semua fungsi ke
  sini hanya demi auto-import.
- `services/api`: konfigurasi HTTP client dan concern lintas endpoint.
- `stores`: client state global; jangan jadikan store sebagai cache seluruh API.
- `middleware`: navigation guard. Otorisasi sebenarnya tetap wajib dilakukan di
  backend.
- `server`: endpoint/BFF Nuxt bila memang diperlukan. REST API utama tetap berada
  di `apps/api`.

## Data dan State Management

Padanan dari stack Next/React yang pernah digunakan:

| React/Next | Rekomendasi Nuxt/Vue |
| --- | --- |
| Zustand | Pinia untuk client state global; `useState` untuk state global kecil yang SSR-safe |
| React Query | `@tanstack/vue-query` untuk cache, mutation, dan invalidation yang kompleks |
| Server component/data fetch | `useFetch` atau `useAsyncData` untuk data yang dibutuhkan saat SSR |
| Zod | Tetap gunakan Zod untuk validation dan parsing boundary data |

Untuk landing page yang membutuhkan SEO, prioritaskan `useAsyncData`/`useFetch`
agar konten tersedia pada HTML awal. Vue Query dapat ditambahkan ketika area
aplikasi membutuhkan cache dan mutation yang kompleks.

Jangan menyimpan server data yang sama di Pinia dan Vue Query sekaligus. Pinia
digunakan untuk client state seperti session summary, UI preference, atau workflow
state; cache response API menjadi tanggung jawab data-fetching layer.

## REST dan OpenAPI

Ketika Swagger/OpenAPI backend sudah stabil:

1. Generate typed client ke `packages/api-client`.
2. Jangan mengimpor source internal `apps/api` langsung dari frontend.
3. Letakkan schema lintas aplikasi yang benar-benar shared di `packages/contracts`.
4. Gunakan wrapper di `apps/web/app/services/api` untuk base URL, credentials,
   error normalization, dan token lifecycle.
5. Validasi data yang datang dari boundary eksternal dengan Zod bila diperlukan.

## SEO

- Tentukan default title template, bahasa dokumen, favicon, dan metadata situs di
  root app atau konfigurasi Nuxt.
- Gunakan `useSeoMeta` pada setiap page untuk title, description, Open Graph, dan
  Twitter metadata.
- Gunakan `useHead` untuk canonical link atau head tag yang tidak tersedia melalui
  shortcut `useSeoMeta`.
- Landing page harus menghasilkan konten utama pada SSR atau prerender, bukan baru
  muncul setelah client-side fetch.
- Tambahkan sitemap, robots, canonical policy, dan structured data setelah domain
  serta daftar halaman final sudah diketahui.
- Gambar Open Graph diletakkan di `public/` jika membutuhkan URL publik yang stabil.

Contoh page yang tetap tipis:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Home',
  description: 'Deskripsi landing page.',
  ogTitle: 'Home',
  ogDescription: 'Deskripsi landing page.',
  ogImage: '/images/og/home.jpg',
})
</script>

<template>
  <div>
    <MarketingSectionsHeroSection />
    <MarketingSectionsFeaturesSection />
    <MarketingSectionsCtaSection />
  </div>
</template>
```

## Urutan Implementasi yang Disarankan

1. Ubah root `app.vue` agar merender `NuxtLayout` dan `NuxtPage`.
2. Buat `layouts/default.vue` untuk header dan footer landing page.
3. Buat `pages/(marketing)/index.vue` sebagai halaman `/`.
4. Buat primitives yang benar-benar dibutuhkan di `components/ui`.
5. Slice landing page per section di `components/marketing/sections`.
6. Tambahkan global SEO defaults dan metadata khusus landing page.
7. Tambahkan halaman publik lain hanya saat desain/kebutuhannya tersedia.
8. Tambahkan auth, admin, Pinia, Vue Query, dan generated API client saat area
   tersebut mulai dikerjakan.

## Hal yang Masih Terbuka

- Daftar role dan permission final.
- Detail endpoint dan format error REST API.
- Mekanisme penyimpanan serta refresh JWT.
- OAuth provider dan callback flow.
- Generator OpenAPI yang akan digunakan.
- Daftar route publik dan route aplikasi.
- Konten, domain, canonical URL, serta aset SEO final.
- Strategi testing dan Docker production.

## Referensi Resmi

- [Nuxt pages and route groups](https://nuxt.com/docs/4.x/directory-structure/app/pages)
- [Nuxt layouts](https://nuxt.com/docs/4.x/directory-structure/app/layouts)
- [Nuxt auto-imports](https://nuxt.com/docs/4.x/guide/concepts/auto-imports)
- [Nuxt `useSeoMeta`](https://nuxt.com/docs/4.x/api/composables/use-seo-meta)

