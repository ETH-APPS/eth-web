# Alur akses website dari internet ke VM

Dokumen ini menjelaskan jalur yang dilewati pengunjung saat membuka frontend ETH
Cargo. **Bagian "Saat ini" adalah kondisi yang sudah berjalan.** Jalur domain
sendiri di bawahnya masih pilihan untuk tahap berikutnya.

## Saat ini: memakai alamat Cloudflare sementara

```text
Pengunjung
  → alamat sementara *.trycloudflare.com
  → Cloudflare (HTTPS untuk pengunjung)
  → Cloudflare Tunnel
  → cloudflared di VM kantor
  → Caddy di jaringan Docker
  → frontend Nuxt di jaringan Docker
```

Respons halaman kembali lewat jalur yang sama, dari Nuxt ke pengunjung. Tunnel
dibuka **dari VM ke Cloudflare**, sehingga pengunjung tidak perlu masuk langsung
melalui router kantor. Alamat Quick Tunnel ini bisa berubah jika tunnel mulai
ulang.

| Bagian | Tugas sederhana |
| --- | --- |
| Cloudflare | Menerima pengunjung di internet dan menyediakan HTTPS pada alamat sementara. |
| `cloudflared` | Menjaga sambungan tunnel dari VM ke Cloudflare dan meneruskan request ke Caddy. |
| Caddy | Menerima request dari tunnel lalu meneruskannya ke frontend. |
| Nuxt (`web`) | Membuat dan mengirim halaman website. |
| Docker | Menjalankan `cloudflared`, Caddy, dan Nuxt sebagai container yang saling terhubung. |

Nuxt mendengarkan pada port `3000` **di dalam jaringan Docker**, bukan terbuka
langsung ke internet. Caddy bisa diperiksa dari VM melalui
`http://127.0.0.1:8080/`; alamat `127.0.0.1` hanya berlaku di VM itu sendiri.
Saat ini HTTPS publik ditangani Cloudflare, sedangkan Caddy menerima HTTP di
dalam jaringan Docker.

## Domain sendiri nanti: dua pilihan jalur

**Pilihan 1 — tetap memakai tunnel:**

```text
Pengunjung → ethcargoindo.com → Cloudflare → Named Tunnel
           → cloudflared di VM → Caddy → Nuxt
```

Domain menjadi alamat tetap, sementara tunnel tetap menjadi jalan ke VM. Jalur
ini tidak membutuhkan port website dibuka pada router atau firewall VM. Quick
Tunnel perlu diganti dengan Named Tunnel dan domain perlu dikonfigurasi di
Cloudflare. **Punya domain sendiri tidak berarti tunnel harus dilepas.**

**Pilihan 2 — langsung melalui IP publik kantor:**

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

Pemeriksaan di atas **hanya membaca kondisi**. DNS, router, firewall, Caddy, dan
tunnel yang sedang berjalan belum diubah.

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

Rincian operasional dan rencana perpindahan domain ada di
[panduan deployment](../deploy/README.md). Konfigurasi aktif di repository dapat
dilihat pada [Compose](../compose.yaml) dan [Caddyfile](../deploy/Caddyfile).
