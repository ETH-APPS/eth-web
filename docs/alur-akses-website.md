# Alur akses website dari internet ke VM

Dokumen ini menjelaskan jalur yang dilewati pengunjung saat membuka frontend ETH
Cargo. Domain utama dan `www` sekarang memakai Named Cloudflare Tunnel.

## Saat ini: domain sendiri melalui Named Tunnel

```text
Pengunjung
  → ethcargoindo.com atau www.ethcargoindo.com
  → Cloudflare (HTTPS untuk pengunjung)
  → Named Tunnel ethcargo
  → cloudflared di VM kantor (proyek eth-web-named-tunnel)
  → Caddy di jaringan Docker
  → frontend Nuxt di jaringan Docker
```

Respons halaman kembali lewat jalur yang sama, dari Nuxt ke pengunjung. Tunnel
dibuka **dari VM ke Cloudflare**, sehingga pengunjung tidak perlu masuk langsung
melalui router kantor. Hostname domain tetap sama jika proses tunnel mulai ulang.
`www` diarahkan ke domain utama. Record `api`, `member`, dan `cdn` masih menuju
layanan sebelumnya.

Untuk section produk di Home, Nuxt juga menjalankan endpoint server yang
menghubungi gateway Ducking dengan signature privat. Browser tidak mengirim
secret ke Ducking. Detailnya ada di [alur produk Ducking](ducking-product-flow.md).

| Bagian | Tugas sederhana |
| --- | --- |
| Cloudflare | Menerima pengunjung di domain dan menyediakan HTTPS. |
| `cloudflared` | Menjaga sambungan tunnel dari VM ke Cloudflare dan meneruskan request ke Caddy. |
| Caddy | Menerima request dari tunnel lalu meneruskannya ke frontend. |
| Nuxt (`web`) | Membuat dan mengirim halaman website. |
| Docker | Menjalankan `cloudflared`, Caddy, dan Nuxt sebagai container yang saling terhubung. |

Nuxt mendengarkan pada port `3000` **di dalam jaringan Docker**, bukan terbuka
langsung ke internet. Caddy bisa diperiksa dari VM melalui
`http://127.0.0.1:8080/`; alamat `127.0.0.1` hanya berlaku di VM itu sendiri.
Saat ini HTTPS publik ditangani Cloudflare, sedangkan Caddy menerima HTTP di
dalam jaringan Docker.

## Alternatif masa depan: akses langsung melalui IP publik

Jalur sekarang tidak membutuhkan port website dibuka pada router atau firewall
VM. Jika kelak tunnel diganti dengan jalur langsung, alurnya menjadi:

```text
Pengunjung → ethcargoindo.com → IP publik kantor → router kantor
           → firewall VM → Caddy (HTTPS) → Nuxt
```

Untuk jalur ini, DNS domain harus menunjuk ke IP publik yang benar. Router harus
meneruskan port website `80` dan `443` ke VM; firewall VM harus mengizinkannya;
Caddy harus mendengarkan pada port tersebut dan mengurus HTTPS. **Mengganti DNS
saja belum membuka jalur website.** Port SSH bukan port website.

## Apa yang sudah diketahui dari pemeriksaan VM

- IP VM di jaringan kantor: `192.168.10.95`; alamat router: `192.168.10.1`.
- SSH dari luar berhasil lewat `103.118.175.181:58811` dan sampai ke port `22`
  VM. Ini membuktikan jalur SSH, bukan jalur website.
- Saat VM membuka internet, IP yang terlihat adalah `36.77.235.25`. Perbedaan
  dari IP SSH belum dijelaskan oleh konfigurasi router, jadi jangan memilih IP
  untuk DNS berdasarkan dugaan.
- Di VM, Caddy baru tersedia pada `127.0.0.1:8080`. Port `80` dan `443` belum
  mendengarkan di host VM.
- Firewall UFW aktif, menolak koneksi masuk secara default, dan baru mengizinkan
  SSH port `22`. Belum ada aturan website yang diubah.
- Web dan Caddy sehat; permintaan ke Caddy lokal menghasilkan HTTP `200`.

Pemeriksaan jaringan di atas hanya membaca kondisi VM saat itu. Setelahnya,
DNS domain utama telah dialihkan ke tunnel tanpa mengubah router atau firewall.

## Istilah yang sering tertukar

- **Domain/DNS:** alamat yang dicari pengunjung dan petunjuk ke mana mereka
  harus pergi. DNS tidak menjalankan website.
- **IP publik:** alamat yang dapat dituju dari internet. IP lokal
  `192.168.10.95` tidak dapat langsung dipakai sebagai tujuan DNS publik.
- **Port:** nomor pintu layanan. SSH memakai jalur tersendiri; browser biasanya
  memakai `80` untuk HTTP dan `443` untuk HTTPS.
- **Router:** jika memakai jalur langsung, meneruskan request dari IP publik
  ke VM kantor.
- **Firewall:** menentukan port masuk yang diizinkan. Router dan firewall VM
  adalah dua pemeriksaan yang berbeda.

Rincian operasional ada di
[panduan deployment](../deploy/README.md). Konfigurasi aktif di repository dapat
dilihat pada [Compose web/gateway](../compose.yaml),
[Compose Named Tunnel](../deploy/named-tunnel.compose.yaml), dan
[Caddyfile](../deploy/Caddyfile).
