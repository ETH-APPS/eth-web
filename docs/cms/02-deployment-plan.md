# Deployment CMS, API, dan database

Rencana, bukan catatan layanan sudah live. Disepakati 27 November 2026.
Ikuti [fase CMS](00-phases.md) serta [operasional existing](../../deploy/README.md).
Rilis CMS dijalankan setelah login/create lokal lulus. Perubahan VM, DNS, secret,
atau helper root-owned tetap merupakan pekerjaan fase deployment tersendiri.

## Kondisi existing dan batas rilis

- `apps/web` berjalan melalui Cloudflare Named Tunnel → Caddy → web Nitro.
- Workflow `deploy-web.yml` dipicu setiap push `main`; helper existing fetch
  `origin/main` terbaru, membangun web, lalu mengganti hanya container web.
- CMS/API/PostgreSQL serta staging belum termasuk deployment ini. Caddy masih
  memiliki satu catch-all ke web. `api.ethcargoindo.com` tercatat menuju layanan
  sebelumnya; jangan mengambil alih hostname itu untuk API baru.
- Helper/Compose/sudoers/env root-owned di VM tidak otomatis diperbarui oleh push.
  Kondisi VM pada docs existing berasal dari output operator; cek ulang saat
  fase deployment, bukan menganggap snapshot tersebut masih pasti berlaku.

Rilis pertama memasang CMS dan backend; web publik tetap memakai katalog lokal.
Integrasi artikel web dimulai sesudah perubahan ada di `main` dan API production
sehat. Tidak menjalankan migrasi tujuh artikel sebagai prasyarat rilis CMS pertama.

## Target layanan dan isolasi environment

| Bagian | Staging | Production |
| --- | --- | --- |
| Branch release | `staging` | `main` |
| CMS hostname | `cms-staging.ethcargoindo.com` | `cms.ethcargoindo.com` |
| Compose project | `eth-cms-staging` | `eth-cms-production` |
| Service aplikasi | `cms`, `api` | `cms`, `api` |
| Service database | `postgres` + volume staging | `postgres` + volume production |
| Database | `eth_apps_staging` | `eth_apps_production` |
| Spaces prefix | `articles/staging` | `articles/production` |
| CMS origin config | HTTPS hostname staging | HTTPS hostname production |
| Secret sesi/JWT/database | Nilai khusus staging | Nilai khusus production |

Satu VM boleh menjalankan kedua project. Setiap project memiliki network internal
sendiri untuk CMS → API → PostgreSQL. CMS juga tersambung ke network gateway
existing dengan alias unik `cms-staging` atau `cms-production`; nama service yang
sama tidak boleh menyebabkan DNS ambigu di network bersama. API/database tidak
dipublikasikan ke internet atau ke network gateway bersama.

```text
cms-staging.ethcargoindo.com → Named Tunnel → Caddy → cms-staging:3000
                                               → API internal → DB staging
cms.ethcargoindo.com         → Named Tunnel → Caddy → cms-production:3000
                                               → API internal → DB production
ethcargoindo.com / www       → jalur web existing
```

CMS memakai Nitro/Node untuk sesi dan adapter API. Browser hanya mengakses origin
CMS; upstream API memakai `http://api:3001` pada network environment masing-masing.
Spaces tetap outbound dari NestJS. TLS publik ditangani Cloudflare; cookie Secure
tetap aktif karena browser menggunakan HTTPS.

## Health check CMS dan API

[Docker Compose CMS](../../deploy/cms.compose.yaml) memakai dua pemeriksaan
terpisah untuk setiap environment.

| Service | Pemeriksaan dari dalam container | Arti HTTP 200 |
| --- | --- | --- |
| `cms` | `GET http://127.0.0.1:3000/api/health` | Nitro bisa merespons tanpa login dan tanpa memanggil API, database, atau Spaces. |
| `api` | `GET http://127.0.0.1:3001/health` | NestJS siap menerima request dan Prisma berhasil menjalankan `SELECT 1` di PostgreSQL. |

Saat stack pertama dijalankan, `migrate` menunggu PostgreSQL berstatus sehat,
`api` menunggu migrasi selesai dengan sukses, lalu `cms` menunggu status sehat
dari `api`. Health check CMS tetap dipakai Docker setelah startup. Karena itu,
memindahkan atau menghapus `/api/health` perlu disertai pembaruan pemeriksaan
di Compose.

Jika CMS merespons `502 API unavailable` saat login atau mengambil artikel,
cek log startup `api` dan `GET /health` terlebih dahulu. Jika API sehat, periksa
apakah `NUXT_API_BASE_URL` di container CMS mengarah ke `http://api:3001` pada
network internal. HTTP 200 dari `/api/health` hanya mengonfirmasi Nitro hidup,
jadi verifikasi login dan artikel tetap dilakukan saat smoke test rilis.

## Status persiapan staging — 28 November 2026

Checklist ini mencatat bukti aktual yang sudah dilaporkan operator. Checklist
utama di bawah tetap belum dicentang jika satu butir mencakup pekerjaan staging
dan production yang belum seluruhnya selesai.

- [x] Ruang VM dipulihkan dari 14 GB menjadi 68 GB kosong; penggunaan turun ke
  28% dan Docker build cache menjadi 0 B. Tidak ada volume aplikasi yang dihapus.
- [x] Runner `eth-apps-production` aktif. Gateway existing berstatus healthy,
  Named Tunnel running, dan network `eth-web_default` aktif. Checkout
  `/opt/eth-web` tertinggal dari remote dan sengaja tidak dipakai sebagai sumber
  build CMS.
- [x] `/etc/eth-cms/staging` adalah `root:root` mode `0700`. `postgres.env`,
  `api.env`, dan `cms.env` adalah `root:root` mode `0600`; nama variabel lengkap
  sudah diverifikasi tanpa menampilkan nilainya. Prefix Spaces staging adalah
  `articles/staging`.
- [x] Kandidat kode berada pada commit `64a649c` di remote branch
  `codex/article-cms-plan`. CMS type-check/build, API lint/build/type-check,
  seluruh 58 tes E2E, pemeriksaan Dockerfile, dan `git diff --check` lulus.
- [x] Persiapan di atas tidak mengganti atau membuat ulang web, gateway, tunnel,
  Caddy, volume, DNS, maupun container production.
- [ ] Belum ada branch release `staging`, workflow deploy CMS, helper root-owned,
  atau sudoers khusus staging. Jangan menjalankan `cms.compose.yaml` sebelum jalur
  release ini dipasang dan ditinjau.
- [ ] Image kandidat belum dibangun di VM; PostgreSQL/migration/API/CMS staging
  belum dijalankan; Caddy, Cloudflare Tunnel, DNS, dan Access staging belum diubah.

## Persiapan dan bootstrap VM

- [ ] Periksa kapasitas VM/disk, service existing, akses runner, DNS, dan tunnel.
  Pastikan penambahan CMS/API/database muat tanpa menghentikan website aktif.
- [ ] Buat Dockerfile CMS dan API dengan build monorepo dari root, dependency
  sesuai lockfile, runtime non-root, dan image berlabel source SHA. Build CMS
  memasukkan dependency `@eth/ui`; API menyertakan Prisma Client dan kebutuhan
  runtime driver/image validator. Jangan memasukkan `.env` dalam image.
- [ ] Tambahkan liveness CMS `GET /api/health` yang tidak membutuhkan login,
  database, atau request berbayar; API menyediakan readiness `GET /health`
  dengan pemeriksaan database dan respons aman tanpa rincian koneksi.
- [ ] Tambahkan Compose/environment-specific runtime, healthcheck, restart policy,
  batas log, network, serta volume database persisten. Pin release PostgreSQL
  yang kompatibel dengan development saat bootstrap; jangan memakai `latest`.
- [ ] Provision secret melalui file root-owned di `/etc/eth-cms/staging/` dan
  `/etc/eth-cms/production/`, mode 0600. File aplikasi terpisah dari file database.
  Dokumentasikan nama env, bukan nilai rahasianya.
- [ ] CMS memerlukan `NUXT_API_BASE_URL`, `NUXT_CMS_ORIGIN`, dan secret sesi sesuai
  versi Nuxt Auth Utils yang dipin. API memerlukan `DATABASE_URL`,
  `JWT_ACCESS_SECRET`, konfigurasi logging, serta seluruh `SPACES_*` existing.
  Gunakan user/database dan secret JWT yang berbeda untuk setiap environment.
- [ ] Jalankan migration yang sudah di-commit dengan `prisma migrate deploy`
  sebagai job sekali jalan dari release API. Tidak memakai `migrate dev`,
  `db push`, atau reset database pada deployment.
- [ ] Bootstrap staging dahulu. Buat akun melalui register existing agar password
  di-hash, lalu provision `CMS_ACCESS` dan AuthorProfile secara administratif.
  Izin CMS tidak memerlukan perubahan role menjadi `STAFF` yang juga memberi
  akses operasional kargo. Siapkan kategori/tag/banner melalui CMS/API sesuai
  kebutuhan. Production mempunyai provisioning tersendiri, tidak menerima
  salinan sesi atau akun dummy lokal.
- [ ] Pasang hostname Caddy eksplisit untuk kedua CMS sebelum catch-all web,
  validasi config dan reload terkontrol. Pasang route hostname pada Named Tunnel
  serta DNS sesuai akses operator. Hindari recreate seluruh stack/tunnel.
- [ ] Batasi staging untuk tim internal melalui Cloudflare Access. CMS staging
  dan production mengirim `noindex, nofollow`; bukan bagian sitemap marketing.
  Jangan menganggap noindex sebagai penjagaan akses.
- [ ] Bucket `cargoindo` sementara boleh dibagi dengan prefix berbeda. File
  staging yang public tetap dapat diakses lewat URL langsung; gunakan data uji
  nonrahasia. Pemisahan bucket/credential menjadi tindak lanjut.

## CI dan CD per aplikasi

Tetap satu repo. Target rilis terpisah; perubahan CMS tidak otomatis harus
mengganti container web publik.

- [ ] Tambahkan CI pull request untuk install frozen lockfile, lint/type-check,
  build aplikasi yang terpengaruh, dan tes relevan. Jalankan kode PR pada runner
  terisolasi; jangan mengeksekusi PR tak tepercaya pada runner VM production.
- [ ] Tentukan input perubahan secara eksplisit: `apps/cms/**` memengaruhi CMS;
  `apps/api/**` memengaruhi API; `packages/ui/**` memengaruhi CMS dan web;
  lockfile/workspace/tooling bersama memerlukan pemeriksaan semua consumer.
  Perubahan deployment menjalankan validasi script/Compose terkait.
- [ ] Sesuaikan trigger workflow web existing agar perubahan CMS/API saja tidak
  memicu deploy web. Perubahan shared UI tetap membangun dan memverifikasi web.
  Jangan sekadar membuat workflow CMS sambil membiarkan tiap push men-deploy web.
- [ ] Siapkan job deploy CMS/API staging dari branch `staging`, serta production
  dari `main` setelah pemeriksaan staging. Pakai concurrency/lock khusus setiap
  environment dan cegah deploy bersamaan yang menyentuh gateway yang sama.
- [ ] Tambahkan helper root-owned terpisah untuk deploy CMS/API dengan target
  environment yang tetap dan input release tervalidasi. Jangan membuat helper
  sudo yang menerima path, Compose, environment, atau shell command bebas.
- [ ] Build/test kandidat dari SHA tertentu; catat manifest source SHA, image
  digest, migration, dan hasil uji staging. Helper baru tidak boleh diam-diam
  mengganti kandidat dengan HEAD branch terbaru saat fetch.
- [ ] Setelah kandidat staging lulus, merge/promosikan perubahan yang sama ke
  `main`. Production memakai artifact yang sudah diuji; pastikan sumbernya ada
  dalam riwayat `main`. Jika resolusi merge mengubah kode aplikasi/dependency,
  uji kandidat baru di staging dahulu. Catat SHA merge dan SHA sumber artifact.
- [ ] Healthcheck dan bootstrap database membedakan instalasi pertama dari update
  rutin. Helper web existing memerlukan web sehat dan bukan alat bootstrap CMS.
- [ ] Pasang perubahan helper/Compose/sudoers di VM setelah operator meninjau
  diff, memvalidasi sintaks, dan menyimpan backup. Push Git saja belum cukup.
- [ ] Setelah deploy rutin, periksa bahwa hanya target CMS/API yang diganti;
  web, gateway, tunnel, dan volume database tetap seperti yang dimaksud.

## Backup, kegagalan, dan rollback

- [ ] Siapkan backup PostgreSQL production di luar volume aktif, sebelum migration
  dan secara berkala; dokumentasikan jadwal/retensi dan uji restore ke database
  terpisah sebelum menyatakan production siap.
- [ ] Simpan image/config release sebelumnya serta status migration. Terapkan
  migration yang kompatibel dengan rollback aplikasi; migration gagal menghentikan
  deploy sebelum aplikasi baru aktif. Jangan memakai schema rollback destruktif
  sebagai mekanisme otomatis.
- [ ] Jika readiness/smoke test gagal setelah swap, pulihkan image CMS/API yang
  kompatibel dan periksa ulang layanan. Jangan menghapus artikel baru, volume DB,
  atau file Spaces. Pemulihan data menjadi tindakan terpisah yang ditinjau.
- [ ] Uji simulasi release gagal dan rollback di staging, termasuk login dan
  pembacaan artikel setelah pulih. Retain artifact yang diperlukan untuk rollback.

## Checklist penerimaan rilis

- [ ] Staging: akun valid dapat login; akun tanpa `CMS_ACCESS` ditolak; refresh dan
  logout benar; sesi tidak berlaku di hostname production.
- [ ] Upload cover/body/banner masuk prefix staging dan URL gambar dapat dibuka;
  create satu artikel lengkap lalu periksa daftar/detail API beserta relasinya.
- [ ] Periksa proxy multipart, batas ukuran, error yang aman, CSRF Origin,
  host-only/HttpOnly/Secure cookie, dan tidak ada token pada respons sesi/log.
- [ ] Jalankan pemeriksaan CMS/API dan regresi web shared UI; catat SHA, digest,
  hasil tes, operator, serta environment. Jangan menganggap healthcheck sebagai
  bukti semua fitur berjalan.
- [ ] Setelah staging lulus dan perubahan ada di `main`, pasang release production
  dan provision akun asli. Verifikasi login serta create menggunakan artikel
  pertama yang memang disetujui untuk tersimpan; tidak ada delete CMS pada MVP.
- [ ] Periksa database/prefix production, HTTPS kedua hostname, log tanpa secret,
  restart layanan, backup/restore, dan prosedur rollback. Record uji staging tidak
  dipindahkan otomatis ke production.
- [ ] Periksa web publik melalui healthcheck/aset statis agar tidak memanggil API
  produk Ducking berbayar tanpa izin. Website tetap memakai katalog lokal.
- [ ] Catat rilis CMS/API selesai; buka pekerjaan Fase 6 untuk konsumsi artikel
  di website publik. SSR web nanti memerlukan akses server ke API production;
  rencanakan network alias privat khusus saat fase itu dimulai, bukan mengganti
  `api.ethcargoindo.com` yang masih digunakan layanan sebelumnya.

Sumber keputusan: [deployment existing](../../deploy/README.md),
[frontend CMS](01-frontend-plan.md), dan
[arsitektur package Turborepo](https://turborepo.dev/docs/core-concepts/package-types).
