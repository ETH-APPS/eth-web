# Catatan audit SEO November 2026 (versi lengkap)

Terakhir diperbarui: 10 November 2026 (Asia/Jakarta).

Arsip bukti dan riwayat untuk [ringkasan progres](../progress.md) dan
[audit per area](../audit-history.md). Catatan di bawah
mempertahankan hasil sesuai waktu pemeriksaannya; gunakan ringkasan untuk status
terkini. Arsip ini menggabungkan implementasi yang diperiksa di workspace dan
hasil validasi yang dikirim pengguna. Ini bukan audit SEO produksi menyeluruh.

## Overview: tujuan optimasi SEO

SEO membantu mesin pencari menemukan dan memahami isi website, serta membantu
pengguna menemukan halaman yang relevan. Pekerjaan saat ini berfokus pada struktur
HTML dan deskripsi konten melalui schema; status detailnya tercatat di bawah.

### Semantic HTML

Semantic HTML berarti memakai elemen sesuai maknanya: `<nav>` untuk navigasi,
`<main>` untuk konten utama, `<article>` untuk artikel, `<a>` untuk berpindah
halaman, dan `<button>` untuk tindakan. Heading `h1`–`h6` menggambarkan susunan
topik. Ini membantu browser, mesin pencari, dan pengguna pembaca layar memahami
struktur halaman. Di proyek ini, satu `h1` per halaman menjadi kesepakatan untuk
judul utama yang konsisten, bukan jaminan ranking. Perubahan semantik tetap harus
menjaga tampilan Figma. [Referensi MDN](https://developer.mozilla.org/en-US/docs/Glossary/Semantics).

### Schema markup

Schema markup adalah data terstruktur yang menjelaskan arti konten kepada mesin.
Contohnya, `Organization` mengenalkan ETH Cargo, `Service` mendeskripsikan layanan,
dan `Article` menjelaskan artikel beserta penerbitnya. Di proyek ini, datanya
ditulis sebagai JSON-LD di HTML melalui `useHead`, sehingga tidak menambah elemen
visual. Data harus sesuai isi halaman. Schema tertentu bisa mendukung rich result
yang tersedia di mesin pencari, tetapi tidak semua tipe memiliki tampilan khusus
dan hasil validator yang valid tidak menjamin ranking atau rich result.
[Referensi Google](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

### Optimasi lain yang perlu dipahami

Tabel ini menjelaskan fungsi area lain; bukan daftar pekerjaan yang semuanya
sudah selesai. Periksa implementasi terbaru sebelum melanjutkan.

| Area | Tujuan singkat | Status dalam pekerjaan ini |
| --- | --- | --- |
| Title dan meta description | Menjelaskan topik; dapat menjadi bahan judul dan cuplikan pencarian. | Implementasi dasar tersedia pada 23/23 komponen route marketing; kualitas, keunikan seluruh varian dinamis, dan hasil render belum diaudit menyeluruh. |
| Open Graph | Mengatur judul, deskripsi, dan gambar saat tautan dibagikan. | Implementasi parsial: 20/23 komponen route memiliki judul, deskripsi, dan tipe OG; belum ada `og:image` atau `og:url`, serta preview berbagi belum diuji. |
| Canonical | Menunjukkan URL utama pilihan untuk konten yang sama. | Sudah diimplementasikan lokal berdasarkan runtime site URL; verifikasi publik menunggu deployment. |
| Sitemap | Membantu mesin pencari menemukan URL penting. | `/sitemap.xml` dinamis berisi 16 halaman statis yang layak diindeks; pemasangan dan verifikasi publik masih pending. |
| Robots dan noindex | `robots.txt` mengatur crawling; `noindex` mengatur pengindeksan. Memblokir crawling saja tidak menjamin URL hilang dari indeks. | Robots dinamis dan kebijakan `noindex` search/tag sudah diverifikasi lokal; kondisi publik belum diverifikasi ulang. |
| Konten dan internal link | Memberi informasi berguna serta jalur menuju halaman terkait. | Internal link sudah tersebar melalui navigasi dan konten, tetapi audit source menemukan placeholder, tujuan `#`, serta jalur terbatas ke `/legalities`; kualitas konten dan crawl link belum final. |
| Gambar | Alt text menjelaskan gambar bermakna; ukuran dan kompresi yang tepat membantu pemuatan. | Audit source selesai: 76/76 `<img>` memiliki `alt`, tetapi aset sekitar 80,7 MiB, belum memakai WebP/AVIF, responsive image, atau image optimizer. Optimasi belum diimplementasikan. |
| SSR dan performa | SSR menyediakan konten pada HTML awal; kecepatan, respons interaksi, dan kestabilan layout mendukung pengalaman pengguna. | SSR lokal terverifikasi pada 25 URL; hydration/navigasi SPA lolos pada delapan sampel route. Core Web Vitals belum diaudit. |
| Search Console | Memantau pengindeksan, pencarian, dan masalah situs di Google. | Fondasi coding lokal tersedia; property, ownership DNS, domain final, sitemap submission, dan validasi publik belum dilakukan. |

Gambaran umum optimasi tersebut tersedia di
[SEO Starter Guide Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

### Apa itu canonical dan mengapa diperlukan

Canonical adalah elemen `<link rel="canonical">` di `<head>` yang memberi sinyal
kepada mesin pencari mengenai URL utama yang diinginkan untuk suatu konten. Satu
halaman bisa ditemukan melalui beberapa variasi URL, misalnya:

```text
https://domain-final.example/china-cargo
https://domain-final.example/china-cargo/
https://domain-final.example/china-cargo?utm_source=instagram
```

Jika ketiganya menampilkan konten yang sama, canonical dapat menunjuk semuanya ke:

```html
<link rel="canonical" href="https://domain-final.example/china-cargo">
```

Tujuannya adalah membantu mesin pencari menggabungkan sinyal halaman yang sama,
mengurangi kebingungan akibat URL duplikat, dan memilih URL yang konsisten untuk
ditampilkan pada hasil pencarian. Canonical juga sebaiknya konsisten dengan URL
internal link, schema, dan sitemap.

Canonical bukan redirect: pengguna tetap berada pada URL yang dibuka. Canonical
juga bukan `noindex` dan tidak melarang crawling. Ini merupakan sinyal, bukan
perintah mutlak, sehingga mesin pencari masih dapat memilih URL lain apabila
sinyal situs saling bertentangan. Halaman valid umumnya memakai self-canonical,
yaitu canonical yang menunjuk ke URL bersih halaman itu sendiri.

Implementasi proyek membuat canonical secara global dari path aktif dan
`NUXT_PUBLIC_SITE_URL`. Query/fragment tidak dimasukkan dan slash penutup selain
root dinormalisasi. Search dan tag blog dikecualikan karena query mengubah isi
hasil; keduanya memakai `noindex, follow`. Kebijakan query harus ditinjau ulang
jika nantinya ada parameter lain yang benar-benar menghasilkan konten berbeda.

Domain final belum tersedia dan tidak di-hardcode. Ketika domain sudah tetap:

1. Isi `NUXT_PUBLIC_SITE_URL` dengan origin HTTPS final tanpa path tambahan.
2. Deploy/recreate web container menggunakan konfigurasi tersebut.
3. Periksa canonical pada homepage, layanan, blog, dan sampel halaman dinamis.
4. Pastikan canonical, schema, sitemap, internal link, dan redirect HTTP/HTTPS
   memakai host final yang sama.
5. Uji variasi query/trailing slash serta pastikan slug tidak valid merespons 404,
   bukan menerbitkan self-canonical untuk konten yang tidak ada.
6. Setelah verifikasi publik berhasil, kirim sitemap domain final ke Search Console.

[Panduan canonical Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

### Cakupan sitemap saat ini — 10 November 2026

Sitemap tidak harus memuat setiap URL yang dapat dibuka. Sitemap sebaiknya hanya
berisi URL canonical yang memang ingin diindeks, mengembalikan HTTP 200, memiliki
konten final, dan bukan halaman duplikat/filter/noindex. Masuk sitemap juga bukan
jaminan halaman akan diindeks; ini membantu discovery dan memberi sinyal URL yang
dianggap penting oleh situs.

`server/utils/indexableRoutes.ts` saat ini memuat 16 route statis:

```text
/
/china-cargo
/multinational-cargo
/sea-freight
/air-freight
/transfer-rmb
/sourcing
/calculator
/calculator-transfer-rmb
/live-tracking
/about-us
/faq
/terms-and-conditions
/legalities
/promo
/complete-guide
```

Alasan jumlahnya 16 dapat dijelaskan sebagai berikut: repository memiliki 23
komponen route marketing, tetapi 7 jenis route belum layak atau memang tidak
ditujukan untuk sitemap—blog root, detail blog, search blog, tag blog, glossary
root, glossary per huruf, dan detail glossary. Route dinamis dapat mewakili
banyak URL, sehingga jumlah komponen route bukan jumlah akhir URL sitemap.

Route berikut sengaja belum dimasukkan:

- `/blog` dan `/blog/[slug]`: daftar serta detail artikel masih memakai data
  placeholder. Tambahkan collection page dan hanya slug artikel valid setelah API
  menyediakan konten publik yang nyata, status publikasi, dan URL final.
- `/blog/search` dan `/blog/tags`: tetap dikecualikan karena merupakan halaman
  hasil/filter dengan `noindex, follow`; halaman seperti ini umumnya tidak perlu
  masuk sitemap meskipun API sudah tersedia.
- `/glossary`, `/glossary/[letter]`, dan `/glossary/[letter]/[slug]`: data masih
  banyak berisi placeholder. Jika glossary nantinya memang ingin diindeks,
  tambahkan root, letter page yang memiliki konten nyata, dan hanya detail istilah
  yang valid setelah data final tersedia.

Secara coverage teknis sitemap sudah sesuai kebijakan konservatif saat ini, tetapi
belum final untuk production. Sebelum domain final diluncurkan, konfirmasi kembali
bahwa seluruh 16 route statis memang layak diindeks—terutama halaman yang masih
memiliki wording placeholder—lalu pastikan setiap URL HTTP 200, memiliki canonical
ke dirinya sendiri, dan tidak memiliki `noindex`. Setelah API blog/glossary masuk,
daftar sitemap sebaiknya dibentuk dari record yang berstatus published, bukan dari
seluruh kemungkinan slug.

Komentar Inggris ditambahkan pada handler sitemap untuk menjelaskan fungsi
allowlist dan behavior aman ketika origin production belum dikonfigurasi. Tidak
ada perubahan pada logic atau daftar URL dalam pembaruan komentar tersebut.

### Robots.txt dan noindex — 10 November 2026

`robots.txt` mengatur URL mana yang boleh dirayapi crawler. Implementasi saat ini
menghasilkan `User-agent: *` dan `Disallow:` kosong, yang berarti seluruh crawler
diizinkan merayapi seluruh route. Jika runtime site URL tersedia, robots juga
menambahkan lokasi absolut `/sitemap.xml`. Ketika origin belum dikonfigurasi,
baris sitemap tidak diterbitkan agar tidak menunjuk domain yang salah.

`noindex` memiliki fungsi berbeda: instruksi ini meminta mesin pencari agar tidak
memasukkan halaman ke hasil pencarian. Saat ini hanya `/blog/search` dan
`/blog/tags` yang memakai `noindex, follow`, karena keduanya merupakan hasil/filter
dinamis. Keduanya tetap boleh dirayapi agar crawler dapat membaca instruksi
`noindex` dan mengikuti link artikel yang ada pada halaman tersebut.

Analogi sederhananya, anggap website sebagai gedung dan hasil pencarian sebagai
katalog gedung:

- Sitemap adalah daftar ruangan penting yang direkomendasikan kepada petugas untuk
  dikunjungi. Tidak tercantum dalam daftar bukan berarti ruangannya tidak ada atau
  tidak mungkin ditemukan dari lorong lain.
- `robots.txt` adalah aturan pintu masuk yang menjelaskan area mana yang boleh
  dimasuki petugas. `Disallow:` kosong berarti semua pintu terbuka untuk dirayapi.
- `noindex` adalah papan di dalam ruangan yang berbunyi “boleh dilihat, tetapi
  jangan masukkan ruangan ini ke katalog publik”. Karena papannya berada di dalam,
  petugas harus dapat masuk terlebih dahulu untuk membacanya.

Itulah alasan search/tag tetap boleh dirayapi oleh robots tetapi membawa
`noindex`. Jika pintunya ditutup dengan `Disallow`, crawler dapat gagal melihat
papan `noindex`; URL juga masih mungkin diketahui dari link lain tanpa isi halaman
dirayapi. Sitemap membantu discovery, robots mengatur crawling, sedangkan
`noindex` mengatur apakah halaman diminta tampil dalam indeks pencarian.

Hal penting untuk handoff:

- Menghapus URL dari sitemap tidak otomatis mencegah indexing. Blog dan glossary
  placeholder saat ini tidak masuk sitemap, tetapi belum memiliki `noindex` dan
  masih dapat ditemukan melalui internal link atau URL publik.
- `Disallow` pada robots bukan pengganti `noindex`. Jika crawler dilarang membuka
  halaman, crawler dapat gagal membaca meta `noindex` di halaman itu.
- Untuk staging/preview yang benar-benar tidak boleh muncul di mesin pencari,
  pembatasan akses adalah pilihan yang lebih kuat daripada hanya robots.txt.
- Sebelum domain final diluncurkan, putuskan apakah blog/glossary placeholder akan
  dibuat final, diberi `noindex` sementara, atau tidak dipublikasikan. Setelah
  konten API siap, hapus `noindex` hanya dari halaman valid yang memang ingin
  diindeks dan masukkan URL published tersebut ke sitemap.

Status saat ini konsisten untuk search/tag dan discovery sitemap, tetapi kebijakan
indexing placeholder belum final. Deployment publik juga belum diverifikasi ulang
setelah route robots dinamis ditambahkan.

### Kesiapan Google Search Console — 10 November 2026

Search Console bukan library yang perlu dipasang pada aplikasi. Fungsinya adalah
memverifikasi kepemilikan situs, memantau crawling/indexing, melihat query,
impression, click dan CTR, memeriksa URL, serta menerima laporan masalah dari
Google. Menambahkan property tidak otomatis menaikkan ranking atau menjamin URL
terindeks.

Untuk ETH Cargo, metode yang direkomendasikan setelah domain final tersedia adalah
**Domain property dengan verifikasi DNS TXT di Cloudflare**. Domain property
mencakup seluruh variasi protokol dan subdomain. Verifikasi ini dilakukan di DNS,
sehingga tidak membutuhkan meta tag, file verifikasi, Google Analytics, Google Tag
Manager, ataupun dependency baru pada Nuxt. Quick Tunnel `trycloudflare.com` tidak
digunakan sebagai property final karena URL sementara dan DNS root-nya bukan milik
ETH Cargo.

Fondasi coding yang sudah tersedia:

- Halaman utama dirender melalui SSR dan konten tersedia pada HTML awal.
- Canonical memakai `NUXT_PUBLIC_SITE_URL` dan akan mengikuti origin final.
- `/sitemap.xml` menghasilkan URL absolut dari origin yang sama.
- `/robots.txt` mengizinkan crawling dan mengumumkan lokasi sitemap ketika origin
  tersedia.
- Search/tag memakai `noindex, follow` dan tidak masuk sitemap.
- Schema serta `lang="id"` tersedia pada halaman yang relevan.

Coding yang masih perlu dilakukan sekarang: **tidak ada khusus Search Console**.
Jangan menambahkan verification token fiktif atau meng-hardcode domain sementara.
Jika tim tidak memiliki akses DNS dan memilih URL-prefix property, barulah gunakan
salah satu metode alternatif resmi: meta `google-site-verification` pada homepage
atau file HTML verifikasi persis dari Google di root publik. Metode tersebut hanya
boleh diterapkan setelah token asli tersedia dan harus tetap dapat diakses agar
ownership tidak hilang.

Checklist setelah domain final tersedia:

1. Tentukan satu host HTTPS final (`example.com` atau `www.example.com`) dan atur
   redirect variasi host/protokol menuju host tersebut.
2. Isi `NUXT_PUBLIC_SITE_URL` dengan origin final, deploy ulang web, lalu verifikasi
   canonical, schema, robots, dan sitemap menggunakan origin yang sama.
3. Buat Domain property di Search Console tanpa protokol/path, lalu tambahkan TXT
   verification yang diberikan Google ke DNS Cloudflare.
4. Setelah ownership terverifikasi, kirim URL absolut `/sitemap.xml` melalui menu
   Sitemaps. Baris sitemap di robots tetap dipertahankan.
5. Gunakan URL Inspection dan Test Live URL pada homepage serta sampel layanan,
   blog, FAQ, dan halaman dinamis. Pastikan fetch berhasil, indexing allowed, dan
   Google-selected canonical sesuai.
6. Request indexing untuk beberapa URL prioritas; untuk banyak URL gunakan sitemap.
   Submission/request merupakan sinyal, bukan jaminan indexing.
7. Pantau Page indexing, Sitemaps, Enhancements/Rich results, Core Web Vitals,
   Manual actions, Security issues, serta Performance setelah data mulai tersedia.
8. Jangan submit search/tag `noindex`, placeholder, slug tidak valid, Quick Tunnel,
   atau URL yang tidak tercantum sebagai konten published.

Referensi resmi:
[verifikasi ownership](https://support.google.com/webmasters/answer/9008080),
[menambah property](https://support.google.com/webmasters/answer/34592),
[submit sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
dan [URL Inspection](https://support.google.com/webmasters/answer/9012289).

### Konten dan internal link — 10 November 2026

Konten adalah informasi yang menjawab kebutuhan pengguna pada setiap halaman.
Internal link adalah link dari satu halaman ETH Cargo ke halaman ETH Cargo lain.
Selain membantu pengguna berpindah konteks, internal link membantu crawler
menemukan halaman dan memahami hubungan serta hierarki topik. Sitemap membantu
discovery, tetapi tidak menggantikan internal link yang relevan di dalam situs.

Implementasi internal link ditemukan pada beberapa lapisan:

- Header desktop, mobile navigation, dan footer menghubungkan layanan, fitur,
  panduan, promo, blog, FAQ, dan halaman perusahaan.
- Homepage dan halaman layanan menghubungkan layanan terkait, kalkulator, live
  tracking, alur pengiriman, serta CTA konsultasi.
- Blog menghubungkan daftar, detail, tag, artikel terkait, homepage, about, dan
  kalkulator.
- Glossary menghubungkan root, halaman huruf, detail istilah terkait, homepage,
  dan kalkulator.
- Halaman kebijakan memiliki breadcrumb dan jalur kembali ke direktori legalitas.

Audit source menemukan 102 kemunculan `<NuxtLink>` pada 41 file. Angka tersebut
menunjukkan implementasi sudah luas, tetapi bukan bukti bahwa semua link valid,
unik, atau dapat dirayapi pada hasil render.

Batasan yang masih perlu ditindaklanjuti:

- Blog menghasilkan banyak artikel dan link dari data placeholder; target harus
  dibentuk dari record API yang benar-benar published.
- Glossary memiliki banyak istilah placeholder; link final harus mengikuti data
  istilah yang valid.
- `/legalities` belum memiliki link langsung dari navigasi/footer global. Route
  tersebut masih dapat dicapai melalui komponen halaman kebijakan, tetapi jalur
  masuknya terbatas. Item pada direktori legalities juga masih berupa button/div,
  bukan link menuju dokumen kebijakan.
- Masih ada tujuan `#`, antara lain CTA transfer RMB dan fitur aplikasi yang belum
  memiliki destination final. Anchor section seperti `#quote` tetap valid jika ID
  target benar; `#` kosong bukan link halaman SEO yang bermakna.
- Wording dan placeholder dipertahankan sesuai keputusan pengguna, sehingga audit
  kualitas, search intent, keyword, duplikasi, dan akurasi editorial belum selesai.
- Belum dilakukan crawl otomatis pada build terbaru untuk memeriksa broken link,
  redirect chain, orphan page, status HTTP target, dan link setelah hydration.

Sebelum production, hubungkan route yang memang ingin diindeks dari halaman yang
relevan, bukan hanya dari sitemap. Setelah API tersedia, ulangi audit berdasarkan
URL published dan putuskan apakah `/legalities` akan difinalkan serta diberi jalur
global atau dikeluarkan sementara dari daftar URL indexable.

### Audit gambar — 10 November 2026

Audit ini membaca source dan aset repository; belum mengubah gambar, styling,
layout, atau wording. Ditemukan 76 elemen `<img>` dan belum ada penggunaan
`NuxtImg`/`NuxtPicture` maupun modul image optimizer.

Yang sudah baik:

- Seluruh 76 elemen memiliki atribut `alt`; tidak ditemukan `<img>` tanpa `alt`.
- Gambar informatif umumnya memiliki deskripsi yang relevan, sedangkan logo/icon
  dekoratif dan salinan carousel memakai `alt=""` agar tidak dibacakan berulang.
- Empat gambar hero utama memakai `loading="eager"` dan `fetchpriority="high"`.
- Sebanyak 25 gambar memakai lazy loading, terutama konten di bawah fold.
- Banyak container sudah memakai aspect ratio atau ukuran CSS sehingga sebagian
  risiko layout shift dapat diredam walaupun atribut dimensi belum lengkap.

Temuan utama:

- Total aset pada direktori gambar/public sekitar **80,7 MiB** dan didominasi 60
  file PNG. Belum ditemukan WebP atau AVIF.
- Aset terbesar adalah `hero.png` sekitar 33,6 MiB (5760×3240), `about-us.png`
  sekitar 13,6 MiB (4892×2012), `article.png` sekitar 10,8 MiB (5760×2220), dan
  `sourcing-hero.png` sekitar 9 MiB (3256×2440). Ukurannya jauh melampaui ukuran
  render umum dan berisiko memperlambat LCP serta transfer data.
- Homepage merender sumber `hero.png` yang sama melalui dua elemen `<img>` untuk
  treatment desktop/mobile. Browser biasanya dapat memakai cache URL yang sama,
  tetapi tetap ada pekerjaan decode/render tambahan dan file sumbernya sangat besar.
- Hanya 33 dari 76 gambar memiliki atribut `width` dan `height` lengkap; 43 belum.
  CSS aspect ratio membantu pada beberapa komponen, tetapi dimensi intrinsik tetap
  disarankan untuk kestabilan layout dan predictable rendering.
- Sebanyak 47 gambar memakai behavior loading default, 25 lazy, dan 4 eager. Tidak
  semua default salah—logo/header atau gambar above-the-fold dapat membutuhkannya—
  tetapi card blog, carousel, dan konten bawah fold perlu diaudit berdasarkan posisi
  render aktual agar tidak semuanya dimuat terlalu awal.
- Tidak ditemukan `srcset` atau `sizes`, sehingga browser tidak dapat memilih file
  yang lebih kecil berdasarkan viewport/density. Nuxt image module juga belum ada.
- Belum ada `og:image` atau `twitter:image`; ini terpisah dari gambar konten dan
  diperlukan untuk preview link yang konsisten.
- Produk sourcing masih memakai gambar/alt placeholder. Gambar artikel dan glossary
  nantinya perlu URL serta alt text dari data API yang tervalidasi.

Prioritas tindak lanjut tanpa mengubah hasil visual:

1. Optimalkan dahulu gambar LCP/hero ke WebP/AVIF dengan fallback yang sesuai dan
   sediakan ukuran responsif; pertahankan crop, aspect ratio, dan object positioning
   existing agar tampilan Figma tidak berubah.
2. Tentukan strategi image pipeline: Nuxt Image, CDN image transformation, atau
   aset statis yang sudah dikompresi. Jangan menambah dependency sebelum strategi
   deployment/cache dan sumber gambar API dipastikan.
3. Tambahkan dimensi intrinsik atau aspect ratio yang terjamin pada gambar yang
   masih berisiko layout shift, lalu audit loading priority berdasarkan posisi nyata.
4. Siapkan aset OG 1200×630 pada URL publik stabil dan hubungkan ke metadata setelah
   domain final tersedia.
5. Setelah API masuk, validasi format, ukuran, URL, alt text, fallback, serta hanya
   tampilkan gambar milik konten published.
6. Jalankan Lighthouse/PageSpeed dan pemeriksaan Network pada mobile/desktop untuk
   mengukur LCP, CLS, bytes transferred, responsive selection, dan cache headers.

Audit ini belum membuktikan performa browser: server lokal tidak aktif, belum ada
Lighthouse, Core Web Vitals, network waterfall, visual comparison 390/1440px, atau
pengujian deployment/CDN. Karena optimasi aset dapat mengubah kualitas visual,
implementasinya harus dilakukan sebagai tahap terpisah dengan verifikasi Figma.

### Audit hydration browser — 10 November 2026

Hydration diuji menggunakan Nuxt dev server lokal pada port 3001 dan Chrome
headless 156 yang dijalankan dengan profil sementara terisolasi. Pengujian ini
menjalankan JavaScript Vue di browser, berbeda dari audit SSR yang hanya membaca
HTML respons awal.

Snapshot setelah hydration dan perpindahan SPA diperiksa pada homepage,
`/china-cargo`, `/blog`, detail blog `/blog/popular-import-guide`,
`/blog/search?q=China`, `/blog/tags?tag=Import`, `/faq`, dan `/about-us`.
Hasilnya:

- Tidak ditemukan console error, runtime exception, hydration mismatch, atau
  peringatan hydration selama rangkaian pengujian.
- Setiap snapshot mempertahankan tepat satu H1 dan konten body tetap tersedia.
- Title berubah mengikuti route aktif.
- Canonical berubah mengikuti route pada halaman indexable dan bersih dari query.
- Search/tag tidak memiliki canonical, tetap `noindex, follow`, dan tidak membawa
  schema halaman blog sebelumnya.
- Schema berganti dan dibersihkan sesuai route: homepage `Organization`/`WebSite`,
  China Cargo `Service`, blog `CollectionPage`/`ItemList`, detail `BlogPosting`,
  FAQ `FAQPage`, serta About Us `AboutPage`.
- Pagination blog berfungsi setelah hydration: state aktif berubah dari halaman 1
  ke halaman 2 tanpa menambah H1.
- Accordion FAQ berfungsi: `aria-expanded` berubah dari `false` menjadi `true`.

Dengan hasil tersebut, hambatan verifikasi hydration/navigasi SPA pada Tahap 1.2
dan 1.4 dianggap selesai untuk sampel route dan interaksi di atas. Batasannya:
belum semua 25 URL dan seluruh variasi interaksi diuji melalui browser; belum ada
visual regression matrix, mobile browser nyata, Safari/Firefox, throttling,
Lighthouse/Core Web Vitals, ataupun verifikasi hydration deployment publik.

### Status title dan meta description — 10 November 2026

Audit source menemukan seluruh 23 komponen halaman di `app/pages/(marketing)`
memakai `useSeoMeta` dan mendefinisikan `title` serta `description`. Halaman
search dan tag blog juga memiliki metadata dinamis, tetapi tetap menggunakan
`noindex, follow`. Metadata detail blog dan glossary dibentuk dari data route.

Status ini berarti baseline teknis sudah diimplementasikan, bukan berarti
optimasi metadata sudah selesai. Belum dilakukan audit khusus terhadap intent
pencarian, keyword target, panjang dan keunikan seluruh judul/deskripsi, seluruh
kemungkinan slug/query, atau hasil metadata pada HTML build terbaru. Server lokal
tidak sedang aktif saat pemeriksaan ini, sehingga temuan tersebut merupakan
audit source. Validasi metadata detail blog yang memakai data API tetap menunggu
integrasi API dan penanganan slug tidak valid pada Tahap 1.3.

### Status Open Graph — 10 November 2026

Audit source menemukan 20 dari 23 komponen halaman memiliki `ogTitle`,
`ogDescription`, dan `ogType`. Tiga halaman tanpa deklarasi OG adalah pencarian
blog, tag blog, dan detail glossary. Search/tag merupakan halaman `noindex`, tetapi
detail glossary perlu dievaluasi apabila akan dipublikasikan untuk dibagikan.

Belum ada deklarasi `ogImage`, `ogUrl`, atau `twitterImage` pada halaman marketing.
Homepage sudah mendeklarasikan `twitterCard: summary_large_image`, tetapi belum
menyediakan gambarnya. Karena server lokal tidak sedang aktif, output HTML dan
preview aktual di WhatsApp, Facebook, LinkedIn, atau platform lain belum diuji.
Judul/deskripsi OG boleh sama dengan title/meta description biasa; perbedaannya
adalah konsumen metadata tersebut, bukan kewajiban membuat wording berbeda.

## Kesepakatan dengan pengguna

- Pertahankan styling, layout, interaksi, dan wording yang sudah sesuai Figma.
- Placeholder, termasuk lorem ipsum, jangan diganti tanpa permintaan pengguna.
- Kerjakan SEO bertahap per halaman. Schema glossary sengaja dilewati atas
  permintaan pengguna; jangan otomatis menambahkannya.
- Pengguna menyatakan cakupan schema saat ini cukup. Daftar tindak lanjut di bawah
  adalah catatan untuk pekerjaan berikutnya, bukan izin memperluas scope.
- Baca `AGENTS.md` dan pedoman frontend yang relevan sebelum mengedit frontend.
- Periksa staged dan unstaged changes; jangan menimpa pekerjaan lain.

## Semantik HTML

Fase sebelumnya berfokus pada elemen HTML yang sesuai fungsi, hierarki heading,
dan satu `h1` per halaman, dengan mempertahankan tampilan dan wording.

Halaman yang tercakup dalam rangkaian pemeriksaan/perapian sebelumnya:

- `/`
- `/china-cargo`, `/multinational-cargo`, `/sea-freight`, `/air-freight`
- `/transfer-rmb`, `/sourcing`
- `/calculator`, `/calculator-transfer-rmb`, `/live-tracking`
- `/about-us`, `/faq`, `/terms-and-conditions`, `/promo`
- `/blog` dan detail blog, termasuk `/blog/popular-supplier-payment`
- `/complete-guide`, `/glossary`

Daftar ini merupakan riwayat cakupan, bukan pernyataan bahwa setiap halaman
memerlukan perubahan atau telah diaudit ulang saat dokumen ini dibuat. Jika
komponen berubah, periksa kembali DOM hasil render dan heading-nya. Jangan
menganggap seluruh dynamic route otomatis sudah terverifikasi.

Audit SSR lokal awal menemukan `/blog/search?q=China` dan
`/blog/tags?tag=Import` belum memiliki `h1` pada HTML respons awal. Tahap 1.1
kemudian memperbaikinya dengan heading dinamis pada `AllArticles.vue`: `h1`
untuk hasil pencarian/tag dan `h2` untuk section daftar utama `/blog`. Teks, ID,
class, atribut, dan styling heading existing dipertahankan.

Tahap 1.2 memindahkan `lang="id"` dari deklarasi khusus homepage ke konfigurasi
head global Nuxt. Dengan demikian bahasa dokumen berlaku pada seluruh route tanpa
mengubah metadata, schema, styling, wording, atau logic halaman.

Tahap 1.3 (validasi slug artikel dan HTTP 404) ditunda sampai integrasi API blog
agar status artikel ditentukan oleh sumber data sebenarnya. Keputusan ini perlu
ditinjau ulang apabila versi blog placeholder akan dibuka untuk indexing sebelum
API tersedia.

Audit Tahap 1.4 tidak memerlukan perubahan aplikasi. Implementasi metadata
existing sudah reaktif: search/tag memakai `noindex, follow`, halaman detail
memasang `BlogPosting`, dan root blog membatasi `CollectionPage` serta `ItemList`
ke `/blog`. Audit direct-request memastikan metadata setiap route sesuai; uji
perpindahan SPA pada delapan sampel route kemudian lolos melalui Chrome headless
tanpa metadata tertinggal atau hydration mismatch.

## Schema markup yang sudah diimplementasikan

Semua path file pada tabel relatif terhadap `apps/web/app/`.

| Halaman | Schema | Lokasi implementasi | Status validator dari pengguna |
| --- | --- | --- | --- |
| `/` | `Organization`, `WebSite` | `pages/(marketing)/index.vue` | 0 error, 0 warning |
| `/blog` | `CollectionPage`, `ItemList` | `pages/(marketing)/blog.vue`, `components/marketing/blog/AllArticles.vue` | 0 error, 0 warning |
| `/blog/[slug]` | `BlogPosting` | `pages/(marketing)/blog/[slug].vue` | Sampel `/blog/popular-import-guide`: 0 error, 0 warning |
| `/china-cargo` | `Service` | `pages/(marketing)/china-cargo.vue` | 0 error, 0 warning |
| `/multinational-cargo` | `Service` | `pages/(marketing)/multinational-cargo.vue` | 0 error, 0 warning |
| `/sea-freight` | `Service` | `pages/(marketing)/sea-freight.vue` | 0 error, 0 warning |
| `/air-freight` | `Service` | `pages/(marketing)/air-freight.vue` | 0 error, 0 warning |
| `/transfer-rmb` | `Service` | `pages/(marketing)/transfer-rmb.vue` | 0 error, 0 warning |
| `/sourcing` | `Service` | `pages/(marketing)/sourcing.vue` | 0 error, 0 warning |
| `/about-us` | `AboutPage` | `pages/(marketing)/about-us.vue` | 0 error, 0 warning |
| `/complete-guide` | `Article` | `pages/(marketing)/complete-guide.vue` | 0 error, 0 warning |
| `/faq` | `FAQPage`, `Question`, `Answer` | `pages/(marketing)/faq.vue` | 0 error, 0 warning |

### Keputusan implementasi

- JSON-LD dipasang menggunakan `useHead` dan `application/ld+json`; karakter `<`
  di hasil `JSON.stringify` di-escape menjadi `\\u003c`.
- ID organisasi konsisten: `<origin>/#organization`. ID website:
  `<origin>/#website`. Referensi tersebut mewakili entitas yang sama antarhalaman.
- `isPartOf` di blog, About Us, dan FAQ menyertakan `@type: WebSite`, nama, dan
  URL. Referensi yang sebelumnya hanya berisi ID terbaca sebagai `CreativeWork`
  pada validator; tipe eksplisit sudah ditambahkan.
- Schema daftar blog hanya aktif di root `/blog`, bukan di child route detail,
  pencarian, atau tag. `ItemList` mengikuti artikel yang tampil pada pagination
  dan filter di `AllArticles.vue`.
- `numberOfItems` pada daftar blog adalah total hasil filter; `itemListElement`
  hanya memuat halaman pagination aktif. Data saat ini berjumlah 120 artikel,
  dengan 12 item per halaman. Posisi item mengikuti offset pagination.
- Enam halaman layanan memakai `Service` dengan `provider` berupa organisasi
  ETH Cargo. Gambar berasal dari gambar layanan yang sudah dipakai; schema
  Transfer RMB tidak mencantumkan gambar.
- About Us memakai `mainEntity` organisasi ETH Cargo dan `isPartOf` website.
- Complete Guide memakai headline yang sesuai H1: "Panduan Lengkap Cara Import
  Barang dari China", gambar `article.png` yang ada di isi artikel, dan publisher
  ETH Cargo. Penulis serta tanggal tidak ditambahkan karena tidak tercantum pada
  artikel.
- Tanggal `datePublished` dan `dateModified` pada detail blog sengaja belum
  ditambahkan karena tanggal existing masih placeholder. Author existing:
  `ETH Cargo Team` bertipe `Organization`.
- FAQ mengambil pasangan pertanyaan/jawaban langsung dari `faqGroups` yang juga
  diteruskan ke komponen tampilan, tanpa menyalin wording. Hasil validasi terakhir
  memuat 16 pertanyaan. Schema memuat daftar lengkap FAQ; pencarian di komponen
  tampilan tidak mengubah daftar schema tersebut.

## Konfigurasi domain

`apps/web/nuxt.config.ts` mendefinisikan `runtimeConfig.public.siteUrl`.

- Set `NUXT_PUBLIC_SITE_URL` ke URL absolut domain publik final saat deploy.
- Development memakai origin request sebagai fallback, sehingga hasil pengujian
  pengguna berisi `http://localhost:3000/`.
- Pada production, schema di atas tidak dipasang jika konfigurasi site URL kosong.
- Domain publik final dan hasil validasi produksi belum dikonfirmasi dalam sesi
  ini. URL localhost pada hasil pengujian bukan konfigurasi final deployment.

### Audit Cloudflare Quick Tunnel — 9 November 2026

URL sementara `https://runtime-keith-plaza-naval.trycloudflare.com` masih aktif.
Direct-request ke `/` dan `/blog` menghasilkan HTTP 200, tetapi HTML deployment
menunjukkan runtime config `siteUrl` masih kosong dan kedua halaman tidak memuat
schema yang sudah diimplementasikan. Homepage masih memiliki `lang="id"` dari
deklarasi page lama, sedangkan `/blog` belum memiliki atribut bahasa; ini
menunjukkan deployment belum memuat perubahan lokal Tahap 1.2.

Hasil tersebut mengonfirmasi kebutuhan Tahap 2 untuk meneruskan
`NUXT_PUBLIC_SITE_URL` ke container web dan melakukan deploy perubahan terbaru.
Quick Tunnel boleh dipakai untuk validasi sementara, tetapi URL-nya tidak boleh
di-hardcode sebagai domain final. Audit ini hanya membaca deployment; tidak ada
perubahan VM, container, tunnel, atau aplikasi.

### Persiapan repository Tahap 2 — 9 November 2026

Persiapan repository untuk runtime site URL sudah diterapkan, tetapi belum
dipasang ke VM:

- `compose.yaml` meneruskan `NUXT_PUBLIC_SITE_URL` ke service web dan tetap
  mengizinkan nilai kosong untuk bootstrap/development.
- `deploy/web.compose.yaml` mewajibkan nilai tersebut untuk deployment web-only.
- `deploy/deploy-web.sh` membaca origin HTTPS dari file root-owned
  `/etc/eth-web/site-url`, memvalidasi owner, mode, format, lalu meneruskannya ke
  Compose meskipun helper memakai environment bersih dan `--env-file /dev/null`.
- Helper mendeteksi perubahan site URL sebagai configuration drift. Jika commit
  sama, image tervalidasi digunakan ulang dan hanya container web yang diganti;
  gateway serta cloudflared tetap tidak disentuh.
- `deploy/README.md` mendokumentasikan pemasangan file site URL, salinan
  root-owned, bootstrap, perubahan URL Quick Tunnel, dan pemeriksaan schema.

Verifikasi lokal berhasil: sintaks Bash valid; Compose bootstrap valid dengan
nilai kosong; spec web-only valid saat URL terisi dan menolak nilai yang hilang;
build production berhasil dengan site URL terisi maupun kosong. Server production
sementara dengan URL terisi menghasilkan schema `Organization`/`WebSite`,
`CollectionPage`/`ItemList`, dan `BlogPosting` menggunakan origin Quick Tunnel,
bukan origin localhost. Dengan nilai kosong, ketiga halaman sampel tetap HTTP 200,
memiliki satu H1, dan tidak mengeluarkan schema sesuai behavior aman existing.

Belum dilakukan: membuat `/etc/eth-web/site-url` di VM, memasang ulang salinan
root-owned helper/spec, menjalankan deployment, atau memverifikasi HTML publik
setelah deploy. Audit publik sebelumnya masih menggambarkan deployment aktif.

### Implementasi lokal Tahap 3 — 9 November 2026

Canonical, sitemap, dan robots sudah diimplementasikan secara lokal:

- `app/app.vue` menghasilkan canonical absolut dari path aktif dan runtime site
  URL. Slash penutup selain root dinormalisasi; query dan fragment tidak masuk.
  `/blog/search` dan `/blog/tags` tidak diberi canonical karena query mengubah
  hasil dan kedua route sudah `noindex, follow`.
- `server/routes/sitemap.xml.ts` menghasilkan XML berisi 16 halaman statis tanpa
  `lastmod` fiktif. Search/tag, error, blog beserta detail placeholder, dan seluruh
  glossary placeholder tidak dimasukkan.
- `server/routes/robots.txt.ts` menggantikan file statis dan menambahkan URL
  sitemap berdasarkan runtime site URL tanpa memblokir crawling.
- Jika runtime site URL kosong pada production, canonical tidak dikeluarkan,
  robots tetap aman tanpa baris sitemap, dan sitemap merespons 503 agar tidak
  menerbitkan URL dengan origin palsu.

Verifikasi build production dengan origin Quick Tunnel berhasil. Audit 25 URL
menghasilkan 25/25 HTTP 200, tepat satu H1, `lang="id"`, schema yang diharapkan,
canonical sesuai kebijakan, serta seluruh URL JSON-LD selain konteks Schema.org
memakai origin yang sama. Sitemap menghasilkan HTTP 200, content type XML, tepat
16 URL unik yang seluruh target lokalnya HTTP 200, tanpa search/tag/blog/glossary
placeholder dan tanpa `lastmod`. Robots menghasilkan text/plain dan menunjuk
sitemap pada origin yang sama. `git diff --check` serta build berhasil.

Review 10 November 2026 mengonfirmasi canonical global sudah sesuai untuk route
valid: memakai origin runtime, menghapus query/fragment, dan menormalkan slash
penutup. Batasannya, route detail blog atau glossary dengan slug yang belum
divalidasi masih dapat menerima self-canonical selama route tersebut merespons
200. Sitemap tidak memasukkan detail placeholder tersebut, tetapi validasi slug
dan respons 404 tetap perlu diselesaikan bersama data API pada Tahap 1.3.

Navigasi SPA kemudian berhasil diuji melalui Chrome headless terisolasi pada
10 November 2026; hasil dan batasannya dicatat pada bagian audit hydration.
Safari tetap belum diuji karena WebDriver memerlukan `Allow remote automation`.
Deployment publik belum berubah, sehingga canonical/sitemap/robots baru belum
diverifikasi pada Quick Tunnel. Quick Tunnel diperlakukan sebagai lingkungan
validasi sementara; aktivasi domain final dan pengiriman sitemap ke Search
Console tetap pending.

## Audit SSR lokal — 9 November 2026

SSR sudah aktif secara default di Nuxt yang digunakan proyek ini. Tidak ditemukan
`ssr: false` atau aturan route yang menonaktifkan SSR. Docker menjalankan server
Nitro melalui `.output/server/index.mjs`. Tidak ada perubahan konfigurasi SSR
yang dilakukan pada audit ini.
[Referensi mode rendering Nuxt](https://learn.nuxt.com/en/concepts/rendering-modes).

Metode: mengambil respons HTTP langsung dari server yang sudah berjalan di
`http://localhost:3000`, tanpa menjalankan JavaScript browser. HTML diperiksa
untuk teks konten utama, H1, dan JSON-LD. Semua **25 URL** berikut menghasilkan
**HTTP 200** dan teks konten dalam HTML awal.

| URL yang diuji (relatif terhadap localhost:3000) | Jumlah H1 | Schema dalam HTML awal |
| --- | --- | --- |
| `/` | 1 | `Organization`, `WebSite` |
| `/china-cargo` | 1 | `Service` |
| `/multinational-cargo` | 1 | `Service` |
| `/sea-freight` | 1 | `Service` |
| `/air-freight` | 1 | `Service` |
| `/transfer-rmb` | 1 | `Service` |
| `/sourcing` | 1 | `Service` |
| `/calculator` | 1 | Tidak dipasang |
| `/calculator-transfer-rmb` | 1 | Tidak dipasang |
| `/live-tracking` | 1 | Tidak dipasang |
| `/about-us` | 1 | `AboutPage` |
| `/faq` | 1 | `FAQPage` |
| `/terms-and-conditions` | 1 | Tidak dipasang |
| `/legalities` | 1 | Tidak dipasang |
| `/promo` | 1 | Tidak dipasang |
| `/blog` | 1 | `CollectionPage`, `ItemList` |
| `/blog/popular-import-guide` | 1 | `BlogPosting` |
| `/blog/popular-supplier-payment` | 1 | `BlogPosting` |
| `/blog/article-1` | 1 | `BlogPosting` |
| `/blog/search?q=China` | 1 — diperbaiki pada Tahap 1.1 | Tidak dipasang |
| `/blog/tags?tag=Import` | 1 — diperbaiki pada Tahap 1.1 | Tidak dipasang |
| `/complete-guide` | 1 | `Article` |
| `/glossary` | 1 | Tidak dipasang |
| `/glossary/a` | 1 | Tidak dipasang |
| `/glossary/a/sea-freight` | 1 | Tidak dipasang |

Schema yang sudah diimplementasikan tersedia dalam HTML awal pada URL yang
diuji. Ketiadaan schema pada halaman lain bukan kegagalan SSR. Pemeriksaan
glossary hanya membaca respons; keputusan melewati implementasi schema glossary
tetap berlaku.

Hasil ini berlaku untuk server lokal dan URL yang tercantum, bukan seluruh
kemungkinan slug atau query. Belum dilakukan verifikasi deployment Cloudflare,
hydration seluruh 25 URL, seluruh variasi interaksi, maupun Core Web Vitals.
Hydration delapan sampel route dan dua interaksi sudah diuji secara terpisah.
Respons 200 dan keberadaan konten juga tidak membuktikan indexing atau ranking.

## Verifikasi yang sudah dilakukan dan batasannya

- Build frontend berhasil setelah perubahan, termasuk build terakhir untuk
  Complete Guide dan FAQ: `pnpm --filter ./apps/web build`.
- `git diff --check` berhasil pada perubahan implementasi.
- Verifikasi Tahap 1.1 pada respons SSR lokal menghasilkan HTTP 200 dan tepat
  satu H1: `Blog ETH Cargo` pada `/blog`, `Search Result` pada
  `/blog/search?q=China`, dan `Tags` pada `/blog/tags?tag=Import`. Heading
  `All Article` di `/blog` tetap `h2`; class heading ketiga halaman tetap
  `text-[28px] font-semibold text-primary-500`. Build production juga berhasil.
- Verifikasi Tahap 1.2 melalui direct-request pada seluruh 25 URL audit
  menghasilkan HTTP 200 dan tepat satu `lang="id"` pada setiap elemen `<html>`.
  Build production berhasil. Navigasi SPA kemudian diverifikasi pada delapan
  sampel route melalui Chrome headless; Safari masih belum diuji.
- Audit SSR Tahap 1.4 berhasil pada empat state: search dan tag memiliki title
  sesuai query serta `noindex, follow` tanpa schema blog; detail artikel memiliki
  `BlogPosting` tanpa schema daftar; `/blog` memiliki `CollectionPage` dan
  `ItemList` tanpa `BlogPosting`. Keempatnya HTTP 200 dan memakai `lang="id"`.
  Tidak ada perubahan aplikasi pada audit ini.
- Template halaman layanan, About Us, Complete Guide, dan FAQ dibandingkan
  dengan versi sebelum perubahan dan tetap identik. Ini pemeriksaan source,
  bukan klaim pengujian visual seluruh viewport.
- Logika daftar blog diperiksa untuk pagination, halaman terakhir, filter,
  hasil kosong, dan pembatasan CollectionPage ke root blog.
- Pengguna menyalin HTML hasil render lokal ke
  [Schema Markup Validator](https://validator.schema.org/) lalu mengirim hasilnya.
  Tabel di atas merekam hasil tersebut, bukan pengujian validator otomatis agent.
- Riwayat: verifikasi HTML via server sementara pada tahap daftar blog tidak
  dilakukan karena izin menjalankan server ditolak. Pada audit berikutnya,
  pembacaan server localhost yang sudah berjalan diizinkan dan pemeriksaan 25 URL
  berhasil, sebagaimana dicatat pada bagian audit SSR lokal. Kedua pemeriksaan
  tersebut berbeda; audit terbaru tidak mencakup seluruh kemungkinan route dinamis.
- Validitas schema tidak membuktikan indexing, peningkatan ranking, atau
  kemunculan rich result di Google.
- `FAQPage` tetap merupakan tipe Schema.org. Google menghentikan FAQ rich result
  sejak 7 Mei 2026; implementasi ini untuk mendeskripsikan isi FAQ, bukan janji
  tampilan FAQ khusus di pencarian.
  [Catatan Google](https://developers.google.com/search/updates#may-2026).

## Belum dikerjakan / sengaja ditunda dalam scope schema ini

- Glossary beserta detail istilah: dilewati sesuai keputusan pengguna.
- Kalkulator, kalkulator Transfer RMB, live tracking, promo, terms and conditions,
  legalities, serta hasil pencarian/tag blog: tidak ditambahkan schema khusus
  dalam pekerjaan ini. Evaluasi kebutuhan berdasarkan konten sebelum menambah.
- Tanggal artikel: tunggu data publikasi/perubahan yang nyata.
- Konten blog masih memakai data placeholder; validasi schema tidak memvalidasi
  kesiapan editorial atau kebenaran klaim bisnis.
- Canonical, sitemap, dan robots/indexability sudah diimplementasikan serta
  diverifikasi lokal. Penerapan pada deployment publik, aktivasi domain final,
  pengiriman sitemap ke Search Console, audit performa/Core Web Vitals, dan
  validasi production masih belum dilakukan.

## Cara melanjutkan dan memperbarui catatan

1. Baca dokumen ini, instruksi repository, lalu periksa implementasi dan git diff.
2. Pastikan scope halaman bersama pengguna; pertahankan keputusan melewati glossary.
3. Ambil data schema dari konten halaman yang benar-benar tersedia. Jangan membuat
   tanggal, rating, harga, identitas penulis, atau detail perusahaan fiktif.
4. Jalankan pemeriksaan sesuai perubahan. Untuk validasi lokal, refresh halaman,
   salin HTML hasil render dan uji melalui input kode Schema Markup Validator.
5. Catat halaman, tipe schema, file terkait, metode verifikasi, hasil, dan batasan
   baru di dokumen ini. Bedakan implementasi, validasi lokal, dan validasi produksi.
6. Perbarui tanggal dokumen. Jangan tandai pekerjaan sebagai committed/deployed
   tanpa memeriksa bukti git/deployment; dokumen ini bukan bukti commit atau deploy.
