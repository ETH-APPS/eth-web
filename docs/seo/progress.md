# Progres SEO ETH Cargo

Terakhir diperbarui: 10 November 2026 (Asia/Jakarta).

Dokumen ini adalah ringkasan untuk membaca progres dan melaporkannya ke tim SEO.
Angka, daftar URL, hasil validator, dan riwayat pemeriksaan ada di
[arsip audit](audit-history.md). Tugas berikutnya ada di [rencana lanjutan](next-plan.md).

## Ringkasan cepat

**Fondasi SEO sudah diuji secara lokal. Schema dan canonical homepage kini juga
terlihat pada HTML publik Quick Tunnel.** Pada 10 November, konfigurasi
`NUXT_PUBLIC_SITE_URL` dipasang di VM dan container web diganti tanpa mengganti
image, gateway, atau tunnel. Ini masih alamat sementara: domain final dan Google
Search Console belum diverifikasi. Riwayat sebelum dan sesudah perbaikan ada di
[audit domain](audit-history.md#8-domain-deployment-dan-search-console).

| Area | Status sekarang | Bukti singkat | Langkah berikutnya |
| --- | --- | --- | --- |
| Struktur HTML dan bahasa | Selesai untuk sampel lokal | 25 URL: HTTP 200, satu H1, `lang="id"`; konten ada di HTML awal | Ulangi pada domain final dan data API |
| Schema markup | Terpasang; homepage terlihat di Quick Tunnel | Hasil validator sebelumnya: 0 error dan 0 warning pada sampel; JSON-LD `WebSite` ada di HTML awal publik | Uji ulang validator pada URL publik dan data final |
| SSR dan hydration | SSR aktif; sampel interaksi browser lolos | 25 URL lolos audit SSR; 8 route dan 2 interaksi diuji di Chrome headless tanpa hydration mismatch | Uji browser/perangkat lain dan deployment |
| Title dan meta description | Dasar teknis terpasang | 23/23 komponen halaman marketing memiliki keduanya | Audit kualitas teks, keyword, dan data API |
| Open Graph | Sebagian | 20/23 komponen halaman punya judul, deskripsi, dan tipe; belum ada `og:image`/`og:url` | Siapkan gambar dan uji preview link |
| Canonical | Homepage terlihat di Quick Tunnel | HTML publik memuat canonical ke URL tunnel; search/tag dikecualikan | Ganti ke domain final dan periksa slug tidak valid |
| Sitemap | Selesai secara lokal, daftar konservatif | 16 URL statis; blog/glossary placeholder dan search/tag tidak masuk | Tinjau kelayakan 16 URL; tambah konten published setelah API |
| Robots dan noindex | Selesai secara lokal untuk kebijakan saat ini | Crawler boleh membaca halaman; search/tag memakai `noindex, follow` | Putuskan kebijakan blog/glossary placeholder |
| Konten dan internal link | Ada, belum final | Link tersebar di navigasi dan konten; sebagian tujuan/konten masih placeholder | Audit broken link dan konten final |
| Gambar dan performa | Baru diaudit | Semua 76 `<img>` punya `alt`; aset gambar sekitar 80,7 MiB | Optimasi gambar dan ukur Core Web Vitals |
| Search Console | Menunggu domain final | Sitemap, robots, dan canonical sudah disiapkan di kode | Verifikasi kepemilikan DNS dan kirim sitemap |

Angka di atas berasal dari audit lokal dan pemeriksaan source pada 9–10 November
2026. Hasil validator schema adalah hasil yang dibagikan pengguna. Lihat
[metode dan daftar sampel](audit-history.md) sebelum memakai angka untuk klaim
yang lebih luas.

**Catatan Quick Tunnel:** respons publik mengirim `X-Robots-Tag: none` dua kali,
sedangkan respons langsung dari Caddy tidak. Artinya alamat sementara ini
meminta crawler untuk tidak mengindeks dan tidak mengikuti tautan. Asal header
belum dipastikan; periksa lagi pada domain final.

## Penjelasan singkat

**Struktur HTML** memakai elemen sesuai fungsinya, misalnya heading untuk judul
dan link untuk navigasi. Satu H1 per halaman menjadi aturan struktur di proyek
ini. **Schema** adalah keterangan tambahan dalam kode agar mesin pencari lebih
mudah memahami organisasi, layanan, artikel, dan FAQ. Keduanya membantu memahami
isi halaman; keduanya tidak menjamin peringkat pencarian.

**SSR** berarti server sudah mengirim isi halaman dalam HTML awal. **Hydration**
mengaktifkan interaksi Vue setelah halaman tampil. Audit lokal menunjukkan
konten tersedia sebelum JavaScript dan metadata tetap benar pada sampel
navigasi browser yang diuji.

**Title dan meta description** membantu menjelaskan halaman pada hasil
pencarian. **Open Graph** mengatur preview ketika tautan dibagikan, termasuk
gambar preview. Judul keduanya boleh sama; gambar OG masih perlu disiapkan.

**Canonical** memberi sinyal URL utama ketika satu isi dapat dibuka melalui
beberapa variasi alamat. Misalnya `/china-cargo` dan
`/china-cargo?utm_source=instagram` menunjuk ke URL utama `/china-cargo`.
Canonical tidak memindahkan pengunjung. Domain final nantinya harus sama dengan
origin schema dan sitemap.

**Sitemap** adalah daftar URL penting yang kita sarankan untuk ditemukan mesin
pencari. Jumlahnya saat ini 16 karena dari 23 jenis route marketing, tujuh
jenis route dikecualikan: blog root/detail, search/tag blog, dan glossary
root/huruf/detail. Blog dan glossary masih berisi data placeholder; search/tag
memang memakai `noindex`. Route dinamis dapat mewakili banyak URL, jadi 23 file
route bukan berarti hanya ada 23 URL. Tidak masuk sitemap juga tidak otomatis
mencegah suatu halaman terindeks.

**Robots.txt** mengatur pintu yang boleh dimasuki crawler. **Noindex** meminta
agar halaman yang sudah dibaca tidak ditampilkan dalam indeks. Search/tag
tetap boleh dirayapi supaya crawler dapat membaca instruksi `noindex` di
dalamnya. Blog/glossary placeholder belum diberi `noindex`; kebijakannya harus
diputuskan sebelum domain final diluncurkan.

**Internal link** menghubungkan halaman di dalam situs, misalnya dari menu
layanan ke halaman kargo. **Gambar** sudah memiliki alt text, tetapi ukuran
file dan kecepatan muatnya belum dioptimalkan. Kualitas konten, tautan, gambar,
dan performa masih perlu diperiksa bersama data final dan pengukuran browser.

## Yang perlu disiapkan sebelum laporan “sudah live”

1. Tentukan domain HTTPS final, lalu ganti nilai `NUXT_PUBLIC_SITE_URL` yang saat
   ini memakai Quick Tunnel dan jalankan ulang deploy web.
2. Pada domain final, cek HTML publik, canonical, schema, `/sitemap.xml`, dan
   `/robots.txt` memakai domain yang sama. Schema dan canonical homepage di
   Quick Tunnel sudah diperiksa; endpoint lain belum diperiksa setelah deploy.
3. Tentukan nasib halaman placeholder, terutama blog, glossary, dan halaman
   statis yang belum memiliki konten final. Validasi slug artikel agar URL yang
   tidak ada merespons 404.
4. Verifikasi Domain property di Google Search Console melalui DNS Cloudflare,
   kemudian kirim sitemap. Langkah ini tidak memerlukan kode Nuxt khusus.
5. Uji preview berbagi, performa gambar, Core Web Vitals, dan browser/perangkat
   yang belum tercakup audit lokal.

Rincian langkah dan syarat verifikasinya ada di [rencana lanjutan](next-plan.md).
Styling, layout, dan wording halaman yang mengikuti Figma tetap dipertahankan;
placeholder tidak diganti tanpa keputusan pemilik konten.
