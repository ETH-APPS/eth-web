# Bukti audit SEO per area

Terakhir diperbarui: 10 November 2026 (Asia/Jakarta).

Mulai dari [ringkasan progres](progress.md) untuk status yang mudah dilaporkan.
Dokumen ini menyimpan metode, angka, URL sampel, dan batasan per area. Catatan
sebelum pengelompokan ini tetap ada di [arsip lengkap](archive/2026-11-audit-notes.md).
Hasil lokal tidak membuktikan kondisi deployment publik atau pengindeksan Google.

## 1. Semantik HTML dan bahasa

Halaman marketing diperiksa dan dirapikan bertahap dengan menjaga tampilan serta
wording Figma. Kesepakatan proyek adalah satu H1 per halaman. Perbaikan khusus
di `AllArticles.vue` memakai H1 untuk `/blog/search` dan `/blog/tags`, sedangkan
heading daftar artikel di `/blog` tetap H2. Bahasa dokumen `lang="id"` dipasang
secara global di `apps/web/nuxt.config.ts`.

Audit HTTP langsung terhadap 25 URL di tabel bagian SSR menghasilkan HTTP 200,
tepat satu H1, dan `lang="id"` pada masing-masing HTML awal. Ini sampel, bukan
pemeriksaan seluruh kemungkinan slug atau query.

## 2. Schema markup

Schema JSON-LD dipasang melalui `useHead` dan muncul dalam HTML awal saat site
URL tersedia. Tabel ini merekam hasil Schema Markup Validator yang dikirim
pengguna untuk sampel lokal; itu bukan validasi otomatis seluruh route.

| Halaman | Tipe schema | Hasil sampel |
| --- | --- | --- |
| `/` | `Organization`, `WebSite` | 0 error, 0 warning |
| `/blog` | `CollectionPage`, `ItemList` | 0 error, 0 warning |
| `/blog/popular-import-guide` | `BlogPosting` | 0 error, 0 warning |
| `/china-cargo`, `/multinational-cargo`, `/sea-freight`, `/air-freight`, `/transfer-rmb`, `/sourcing` | `Service` per halaman | 0 error, 0 warning per sampel |
| `/about-us` | `AboutPage` | 0 error, 0 warning |
| `/complete-guide` | `Article` | 0 error, 0 warning |
| `/faq` | `FAQPage` dengan `Question` dan `Answer` | 0 error, 0 warning |

ID organisasi dan website konsisten memakai `<origin>/#organization` serta
`<origin>/#website`. Schema blog root tidak ikut terbawa ke detail, search, atau
tag. `ItemList` mengikuti filter dan pagination: data sementara berjumlah 120
artikel, 12 per halaman. FAQ memuat 16 pertanyaan dari data tampilan yang sama.
Tanggal artikel belum dimasukkan karena data saat ini masih placeholder.
Glossary sengaja tidak diberi schema sesuai keputusan pengguna. Detail file dan
keputusan schema per halaman tersedia di [arsip lengkap](archive/2026-11-audit-notes.md).

## 3. SSR dan hydration

SSR Nuxt aktif secara default; tidak ada perubahan `ssr: true`. Audit awal
mengambil respons HTTP langsung dari `http://localhost:3000` tanpa JavaScript
browser. Semua URL di bawah HTTP 200, memiliki konten di HTML awal dan satu H1.
Schema yang dicantumkan juga muncul dalam HTML awal.

| URL lokal yang diuji | Schema pada HTML awal |
| --- | --- |
| `/` | `Organization`, `WebSite` |
| `/china-cargo` | `Service` |
| `/multinational-cargo` | `Service` |
| `/sea-freight` | `Service` |
| `/air-freight` | `Service` |
| `/transfer-rmb` | `Service` |
| `/sourcing` | `Service` |
| `/calculator` | Tidak dipasang |
| `/calculator-transfer-rmb` | Tidak dipasang |
| `/live-tracking` | Tidak dipasang |
| `/about-us` | `AboutPage` |
| `/faq` | `FAQPage` |
| `/terms-and-conditions` | Tidak dipasang |
| `/legalities` | Tidak dipasang |
| `/promo` | Tidak dipasang |
| `/blog` | `CollectionPage`, `ItemList` |
| `/blog/popular-import-guide` | `BlogPosting` |
| `/blog/popular-supplier-payment` | `BlogPosting` |
| `/blog/article-1` | `BlogPosting` |
| `/blog/search?q=China` | Tidak dipasang |
| `/blog/tags?tag=Import` | Tidak dipasang |
| `/complete-guide` | `Article` |
| `/glossary` | Tidak dipasang |
| `/glossary/a` | Tidak dipasang |
| `/glossary/a/sea-freight` | Tidak dipasang |

Hydration kemudian diuji pada Nuxt dev server port 3001 dengan Chrome headless
156. Sampelnya: `/`, `/china-cargo`, `/blog`, `/blog/popular-import-guide`,
`/blog/search?q=China`, `/blog/tags?tag=Import`, `/faq`, dan `/about-us`.
Tidak ditemukan console error, runtime exception, atau hydration mismatch.
Setiap snapshot tetap memiliki satu H1; title, canonical, robots, dan JSON-LD
sesuai route aktif. Search/tag tetap `noindex, follow`, tanpa canonical dan tanpa
schema blog yang tertinggal. Pagination blog berpindah dari halaman 1 ke 2;
accordion FAQ berubah dari `aria-expanded=false` menjadi `true`.

Audit browser belum mencakup semua 25 URL, seluruh interaksi, Safari/Firefox,
perangkat mobile nyata, atau deployment publik.

## 4. Metadata halaman dan Open Graph

Pemeriksaan source menemukan `title` dan `description` pada 23/23 komponen route
marketing. Search/tag dan detail dinamis memakai metadata reaktif. Ini baseline
teknis; search intent, keyword, panjang teks, duplikasi semua varian slug/query,
dan HTML build terbaru belum diaudit khusus.

Sebanyak 20/23 komponen route mempunyai `ogTitle`, `ogDescription`, dan `ogType`.
Yang belum: `/blog/search`, `/blog/tags`, dan detail glossary. Belum ditemukan
deklarasi `ogImage`, `ogUrl`, atau `twitterImage` pada halaman marketing. Homepage
sudah memakai `twitterCard: summary_large_image`, tetapi belum menyediakan gambar.
Preview nyata di aplikasi berbagi belum diuji.

## 5. Canonical, sitemap, robots, dan noindex

Canonical global di `apps/web/app/app.vue` memakai runtime site URL dan path aktif.
Query/fragment dibuang, trailing slash selain root dinormalisasi. Search/tag
dikecualikan karena query mengubah hasil dan keduanya sudah `noindex, follow`.
Tanpa site URL pada production, canonical tidak diterbitkan.

`/sitemap.xml` berisi 16 route statis dari allowlist `indexableRoutes.ts`: `/`,
`/china-cargo`, `/multinational-cargo`, `/sea-freight`, `/air-freight`,
`/transfer-rmb`, `/sourcing`, `/calculator`, `/calculator-transfer-rmb`,
`/live-tracking`, `/about-us`, `/faq`, `/terms-and-conditions`, `/legalities`,
`/promo`, dan `/complete-guide`. Search/tag `noindex`, blog placeholder,
glossary placeholder, error, serta slug dinamis yang belum tervalidasi tidak
masuk. Sitemap tidak memakai `lastmod` fiktif.

Pada build production lokal dengan site URL terisi, sitemap merespons HTTP 200,
content type XML, berisi 16 URL unik, dan setiap target lokalnya HTTP 200.
`robots.txt` merespons text/plain, mengizinkan crawling, serta menunjuk sitemap
pada origin yang sama. Jika site URL kosong, sitemap merespons 503 dan robots
tidak menampilkan baris sitemap. Audit 25 URL setelah implementasi menemukan
canonical sesuai kebijakan dan origin schema/canonical/sitemap konsisten.

Pengecualian dari sitemap tidak mencegah indexing: blog/glossary placeholder
masih bisa ditemukan melalui link dan belum mempunyai `noindex`. Slug tidak
valid masih bisa merespons 200 dan mendapat self-canonical; validasi 404
ditunda sampai API blog. Kelayakan editorial seluruh 16 URL statis perlu
dikonfirmasi sebelum domain final diaktifkan.

## 6. Konten dan internal link

Audit source menghitung 102 kemunculan `<NuxtLink>` pada 41 file. Link tersebar
melalui header, mobile navigation, footer, halaman layanan, blog, glossary,
CTA, dan breadcrumb. Angka itu tidak membuktikan semua target valid.

Blog dan glossary masih mempunyai banyak konten serta link placeholder.
`/legalities` memiliki jalur terbatas dari halaman kebijakan dan belum tertaut
langsung dari navigasi/footer global. Beberapa tujuan masih `#`. Belum ada crawl
otomatis untuk broken link, redirect chain, orphan page, atau status HTTP semua
target setelah hydration.

## 7. Gambar dan performa

Audit source menemukan 76 `<img>` dan semuanya memiliki atribut `alt`.
Sebanyak 25 memakai lazy loading; empat gambar hero utama memakai eager loading
dan `fetchpriority="high"`. Hanya 33/76 memiliki `width` dan `height` lengkap,
meskipun sebagian layout sudah dijaga oleh CSS aspect ratio.

Total aset gambar/public sekitar 80,7 MiB, didominasi 60 PNG. Aset terbesar:
`hero.png` sekitar 33,6 MiB (5760×3240), `about-us.png` sekitar 13,6 MiB
(4892×2012), `article.png` sekitar 10,8 MiB (5760×2220), dan
`sourcing-hero.png` sekitar 9 MiB (3256×2440). Belum ditemukan WebP/AVIF,
`srcset`/`sizes`, atau image optimizer Nuxt. Ini risiko performa berdasarkan
ukuran source; LCP, CLS, network waterfall, dan Core Web Vitals belum diukur.
Optimasi aset harus menjaga hasil visual Figma.

## 8. Domain, deployment, dan Search Console

Audit Quick Tunnel pada 9 November 2026 memeriksa `/` dan `/blog`: keduanya
HTTP 200, tetapi `siteUrl` runtime kosong dan schema tidak keluar. Homepage
memiliki `lang="id"` dari deklarasi lama, sedangkan `/blog` belum. Ini adalah
snapshot deployment saat itu, sebelum perubahan lokal terbaru dipasang.

Perbandingan HTML homepage yang dikirim pengguna setelah push pada 10 November
2026 menunjukkan production sudah memiliki `lang="id"` dan satu H1, tetapi
payload runtime masih `public: { siteUrl: "" }`: tidak ada canonical atau
`application/ld+json` di `<head>`. HTML localhost juga memuat site URL kosong,
namun mode development memakai origin request sebagai fallback, sehingga
canonical `http://localhost:3000/` dan schema homepage tetap muncul. Ini
menunjukkan konfigurasi origin pada container production belum aktif; HTML yang
disalin sendiri tidak membuktikan apakah file konfigurasi VM sudah dipasang atau
helper deployment terbaru sudah dijalankan.

Repository kemudian disiapkan untuk meneruskan `NUXT_PUBLIC_SITE_URL` melalui
Compose dan helper deployment. Pemeriksaan sintaks, konfigurasi Compose, build
production dengan URL terisi/kosong, serta sampel runtime lokal berhasil.
Catatan ini mendahului pemasangan konfigurasi di VM.

Pada 10 November 2026, file `/etc/eth-web/site-url` dipasang dengan origin
Quick Tunnel yang aktif, dimiliki `root:root` dan bermode `644`. Salinan
root-owned `web.compose.yaml` dan `deploy-web` diperbarui dari release commit
`c02c78c`; `bash -n` lolos. Helper deploy menggunakan ulang image
`eth-web-web:c02c78ce3aa7`, mengganti hanya container web, dan melaporkan
gateway serta cloudflared tetap berjalan. Pemeriksaan `docker inspect`
menunjukkan `NUXT_PUBLIC_SITE_URL` sudah masuk ke environment container.

`curl` terhadap homepage melalui Caddy lokal dan URL publik Quick Tunnel sama-sama
menemukan JSON-LD `WebSite` dalam HTML respons. HTML publik juga memuat canonical
ke homepage Quick Tunnel. Kedua respons homepage mengembalikan HTTP 200.
Respons publik memiliki dua header `X-Robots-Tag: none`, sementara respons
langsung dari Caddy tidak memilikinya; asal header setelah Caddy belum
dipastikan. Menurut [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag),
nilai `none` berarti `noindex, nofollow`, sehingga URL sementara ini bukan
bukti kesiapan indexing. Schema halaman lain, sitemap, robots,
validator publik, dan domain final belum diperiksa ulang setelah deploy.

Search Console belum dikonfigurasi. Setelah domain final tersedia, rekomendasi
yang dicatat adalah Domain property dengan verifikasi DNS TXT Cloudflare; tidak
perlu token verifikasi di kode Nuxt. Setelah deployment publik lolos pemeriksaan
origin, kirim sitemap dan inspeksi URL prioritas. Langkah operasional ada di
[rencana lanjutan](next-plan.md).

## Cara membaca hasil

Angka audit adalah hasil pada sampel dan tanggal yang disebutkan. Validator
schema yang valid tidak menjamin rich result atau ranking. HTTP 200, SSR, dan
sitemap yang valid tidak membuktikan Google sudah mengindeks halaman. Riwayat
perintah, keputusan, dan batasan yang lebih lengkap tetap tersedia di
[arsip November 2026](archive/2026-11-audit-notes.md).
