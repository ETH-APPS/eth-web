# Logging project

Cara menjalankan FE/BE, konfigurasi Pino, contoh request, dan panduan menambahkan
log ada di [docs/logging.md](../../docs/logging.md).

## Database lokal

Backend menggunakan PostgreSQL dan Prisma. Siapkan database lokal, lalu salin
`apps/api/.env.example` ke `apps/api/.env` dan isi `DATABASE_URL` dengan kredensial
lokal. File `.env` tidak masuk Git.

Dari root repository:

```sh
pnpm --filter api db:validate
pnpm --filter api exec prisma migrate status
pnpm --filter api db:migrate:deploy
pnpm --filter api db:generate
```

Perintah di atas mengecek dan menerapkan migration yang sudah ada ke database
pada `DATABASE_URL` dari environment shell atau `apps/api/.env`. Gunakan
`pnpm --filter api db:migrate:dev` ketika membuat migration baru setelah mengubah
schema. `db:generate` dan `build` hanya menghasilkan Prisma Client; keduanya
tidak memasang tabel ke database.

Tes API memakai `apps/api/.env.test` dan database terpisah berakhiran `_test`.
Migration yang sudah terpasang di database tes belum tentu terpasang di database
pengembangan. Jika pgAdmin menampilkan `relation "Article" does not exist`, cek
status migration dan pastikan host, port, database, serta schema sama dengan
konfigurasi API. Untuk konfigurasi lokal saat ini: `localhost:5432`, database
`eth_apps`, schema `public`; refresh daftar tabel di pgAdmin setelah migration.

Profil penulis disimpan di tabel `AuthorProfile`, sedangkan izin CMS/CRM di
`UserPermissionGrant`, keduanya terhubung melalui `userId`. Field relasi Prisma
`User.authorProfile` dan `User.permissionGrants` tidak menjadi kolom langsung
pada tabel PostgreSQL `User`. Record profil dan izin tetap diprovisi manual.
Pemasangan schema juga terpisah dari migrasi isi tujuh artikel lama.

Migration tersimpan di `apps/api/prisma/migrations`. Saat deployment, gunakan
`pnpm --filter api db:migrate:deploy` untuk menerapkan migration yang sudah
di-commit.

## Auth dan pengajuan kargo (Fase 1)

Jalankan API dengan `pnpm --filter api dev` dari root. Dokumentasi interaktif
tersedia di [Swagger UI](http://localhost:3001/docs), dan spesifikasi OpenAPI
JSON di `http://localhost:3001/docs-json`. Untuk mencoba auth di Swagger:

1. Buka `POST /auth/register`, klik **Try it out**, isi data pelanggan, lalu
   **Execute**. Gunakan email berbeda jika sudah pernah mendaftar.
2. Salin `data.accessToken` dari respons, klik **Authorize**, dan masukkan token
   tersebut pada skema Bearer.
3. Coba `GET /auth/me`. `refreshToken` dipakai pada `POST /auth/refresh` atau
   `POST /auth/logout`, bukan pada tombol Authorize.

Swagger UI hanya alat mencoba API. Akun dan token yang dibuat tetap tersimpan
di database lokal `eth_apps`.

### Format respons API

Respons sukses menggunakan `request_id` dan `data`. Untuk daftar yang belum
dipaginasi, `data` berupa array. `request_id` sama dengan header `x-request-id`.

```json
{
  "request_id": "0f24a86d-37d4-4bb5-a987-042d79430376",
  "data": {
    "id": "e1dcc78e-0e71-4a5e-ad44-933643bfb9ce",
    "status": "PENDING_REVIEW"
  }
}
```

Respons gagal tetap memakai status HTTP yang sesuai, dengan rincian di `error`:

```json
{
  "request_id": "0f24a86d-37d4-4bb5-a987-042d79430376",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload Validation Failed",
    "fields": { "boxCount": ["MIN_VALUE"] }
  }
}
```

`fields` hanya ada bila error terkait field input. `POST /auth/logout` berhasil
dengan status 204 dan body kosong. Swagger di `/docs` dan spesifikasi `/docs-json`
menampilkan format respons ini sehingga dapat diimpor ke Postman.

Set `JWT_ACCESS_SECRET` acak minimal 32 byte pada `.env`. Untuk akun staf lokal,
set `STAFF_EMAIL`, `STAFF_FIRST_NAME`, dan `STAFF_PASSWORD` (minimal 8 karakter)
sebagai environment variable sementara, lalu jalankan `pnpm --filter api build`
dan `pnpm --filter api staff:create` dari root. Perintah ini membuat akun staf
baru; alamat email yang sudah terdaftar akan ditolak. Jangan simpan password
staf di repository. Pelanggan mendaftar sendiri melalui API.

| Method | Path | Akses | Fungsi |
| --- | --- | --- | --- |
| POST | `/auth/register` | Publik | Daftar pelanggan dengan email, nama depan, password, dan `acceptedTerms: true` |
| POST | `/auth/login` | Publik | Login email/password |
| POST | `/auth/refresh` | Publik | Tukar `refreshToken` dan rotasi token |
| POST | `/auth/logout` | Publik | Cabut `refreshToken` (204) |
| POST | `/auth/google` | Publik | Daftar atau masuk pelanggan dengan Google ID token |
| POST | `/auth/google/link` | Pelanggan | Tautkan Google ke akun email/password yang sedang login (204) |
| GET | `/auth/me` | Bearer | Profil ringkas akun |
| POST, GET | `/cargo-requests` | Pelanggan | Kirim dan lihat pengajuan sendiri |
| GET, PUT | `/cargo-requests/:id` | Pelanggan | Lihat atau kirim ulang setelah diminta revisi |
| GET | `/staff/cargo-requests` | Staf | Antrean; filter opsional `?status=PENDING_REVIEW` |
| GET | `/staff/cargo-requests/:id` | Staf | Detail pengajuan |
| POST | `/staff/cargo-requests/:id/review` | Staf | `decision`: `APPROVED`, `NEEDS_REVISION`, atau `REJECTED` |

Body pengajuan berisi `shippingMethod` (`FCL`, `LCL`, atau `AIR`), `cargoType`,
`heightCm`, `lengthCm`, `widthCm`, `boxWeightKg`, `boxCount`, dan `notes` opsional.
Alasan `reason` wajib untuk keputusan revisi atau penolakan. Access token berlaku
15 menit; refresh token berlaku 30 hari dan disimpan sebagai hash. PIN mobile
belum menjadi bagian dari auth server.

## Artikel: CMS dan pembaca publik

Endpoint CMS memerlukan Bearer token dari `POST /auth/login` dan permission
`CMS_ACCESS`. Akun, permission, profil penulis, dan banner default untuk tahap
awal diprovisi langsung di database. `GET /auth/me` mengembalikan
`permissions` serta `authorProfile` di samping data akun existing.
Implementasi kategori, tag, banner, media, dan publikasi berada dalam satu
`ArticleModule` dan satu `ArticleController`; `@CmsAccess()` melindungi method
CMS. Prefix `/cms` menunjukkan akses endpoint, bukan modul terpisah.

Endpoint publik tanpa autentikasi:

| Method | Path | Fungsi |
| --- | --- | --- |
| GET | `/articles` | Daftar kartu artikel, pagination, pencarian, dan filter |
| GET | `/articles/:slug` | Detail artikel, HTML, gambar, banner, dan profil penulis |
| GET | `/categories` | Semua kategori artikel, diurutkan berdasarkan nama |
| GET | `/tags` | Semua tag artikel, diurutkan berdasarkan nama |

Contoh: `GET /articles?page=1&limit=12&q=ekspor&tag=dokumen-pengiriman`.
Filter `category`, `tag`, dan `author` memakai slug dan digabung dengan AND;
`q` mencari substring judul atau nama tag tanpa membedakan kapital. Pagination
mengembalikan `data.items` dan `data.pagination` (`page`, `limit`, `total`,
`totalPages`), dengan urutan terbaru lalu ID sebagai pemecah tanggal yang sama.
Hanya record dengan `publishedAt <= sekarang` yang keluar. Slug tidak ada atau
belum terbit menghasilkan 404. Rincian query, batas, dan contoh respons ada di
[kontrak public read API](../../docs/article-cms/01-api-plan.md#kontrak-get-articles-dan-get-articlesslug)
dan OpenAPI `/docs-json`.

`GET /categories` dan `GET /tags` mengembalikan array pada `data`, berisi `id`,
`name`, dan `slug`, dengan urutan `name ASC, id ASC`. Keduanya memakai list
taksonomi yang sama dengan CMS, termasuk kategori/tag yang belum dipakai artikel.
Gunakan slug hasilnya sebagai filter `category` atau `tag` pada `GET /articles`.
Pembuatan kategori/tag tetap melalui endpoint CMS yang memerlukan izin.

Untuk sumber sitemap, baca `GET /articles?page=1&limit=100`, lanjutkan sampai
`pagination.totalPages`, lalu gunakan `slug`, `publishedAt`, dan `updatedAt` dari
setiap kartu. Integrasi sitemap frontend dan migrasi artikel lama dikerjakan
terpisah.

Endpoint CMS:

| Method | Path | Fungsi |
| --- | --- | --- |
| POST | `/cms/articles/assets` | Upload cover atau gambar isi artikel |
| GET, POST | `/cms/categories` | Baca atau buat kategori |
| GET, POST | `/cms/tags` | Baca atau buat tag |
| GET | `/cms/banners` | Baca banner reusable |
| POST | `/cms/banners` | Buat banner sekaligus upload gambar |
| POST | `/cms/articles` | Buat dan langsung terbitkan artikel |

Upload memakai `multipart/form-data`. Asset artikel memakai field `file` dan
`kind` (`ARTICLE_COVER` atau `ARTICLE_BODY`); banner memakai `title`,
`description`, dan field file `image`. JPEG, PNG, serta WebP diterima sampai
5 MiB. SVG tidak diterima. API membaca format dan dimensi dari isi file sebelum
mengunggahnya ke DigitalOcean Spaces.

Isi konfigurasi `SPACES_*` pada `.env`. `SPACES_ARTICLE_PREFIX` lokal disarankan
`articles/development`; staging dan production memakai prefix masing-masing.
URL CDN disimpan di `MediaAsset`, banner mereferensikan `imageMediaId`, dan
artikel mereferensikan `bannerId`. Secret Spaces tidak boleh dicatat di log atau
repository. Tes API mengganti storage dengan fake sehingga tidak menghubungi
bucket sebenarnya.

### Google Sign-In untuk mobile

Isi `GOOGLE_WEB_CLIENT_ID` dari OAuth Client bertipe **Web application** di
Google Cloud. Backend memakai ID ini untuk memverifikasi Google ID token dari
aplikasi mobile; client secret dan callback URL web tidak digunakan. Jika belum
diisi, login email/password tetap berjalan dan endpoint Google mengembalikan
`GOOGLE_AUTH_NOT_CONFIGURED`.

Aplikasi mobile mengirim `POST /auth/google` dengan body `{ "idToken": "..." }`.
Jika akun Google baru, API mengembalikan `TERMS_ACCEPTANCE_REQUIRED`; setelah
pelanggan menerima syarat, kirim ulang dengan `acceptedTerms: true`. Respons
berhasil memakai `data.user`, `data.accessToken`, dan `data.refreshToken` yang
sama seperti login email/password. Google ID token tidak dipakai sebagai Bearer
token ETH Cargo.

Jika email sudah terdaftar dengan password, responsnya `ACCOUNT_LINK_REQUIRED`.
Pelanggan masuk lewat password dahulu, lalu kirim Google ID token ke
`POST /auth/google/link` dengan Bearer access token ETH Cargo. Staf tidak dapat
masuk atau menautkan akun lewat Google pada tahap ini. Konfigurasi OAuth mobile
dan development build dijelaskan dalam README `eth-mobile`.

Untuk tes API, salin `.env.test.example` ke `.env.test`, gunakan database lokal
terpisah dengan nama berakhiran `_test`, lalu terapkan migration dengan
`DOTENV_CONFIG_PATH=.env.test pnpm --filter api db:migrate:deploy`. Jalankan
`pnpm --filter api test:e2e` dari root. Tes menolak database yang tidak
berakhiran `_test`.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

To add it to this project:

```bash
$ pnpm install @nestjs/observe
```

Then follow the [setup guide](https://docs.nestjs.com/observability/overview) - it takes a single import and an app key.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
