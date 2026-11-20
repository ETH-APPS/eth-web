# Alur CI/CD frontend, versi sederhana

Dokumen ini menjelaskan cara perubahan frontend sampai ke website yang berjalan
di VM kantor. Untuk rincian teknis dan pemeriksaan masalah, lihat
[panduan deployment](../deploy/README.md).

## Gambaran singkat

```text
Kode di laptop
  → commit dan push ke branch main di GitHub
  → GitHub Actions memberi tugas ke runner di VM
  → VM mengambil kode main terbaru dan membangun image frontend
  → VM mengganti container web
  → pengunjung melihat versi baru melalui Caddy dan tunnel sementara
```

**CI** biasanya memeriksa perubahan kode secara otomatis, misalnya dengan test
dan build. **CD** memasang hasilnya ke server. Saat ini repository hanya punya
satu workflow deployment. Proses itu membangun frontend, tetapi belum
menjalankan job lint, typecheck, atau test terpisah untuk setiap pull request.

## Yang dilakukan saat mengubah frontend

1. Selesaikan dan periksa perubahan di laptop.
2. Commit file yang ingin dirilis, lalu push ke branch `main`.
3. Buka GitHub Actions, pilih **Deploy web to VM**, dan tunggu sampai run selesai
   dengan status sukses.
4. Buka website dan periksa halaman atau fitur yang diubah.

File yang masih berada di laptop dan belum di-commit/push tidak ikut terpasang di
VM. Untuk perubahan frontend biasa, tidak perlu SSH, `git pull`, atau restart
container secara manual.

## Yang terjadi otomatis di VM

Runner GitHub Actions di VM menjalankan script deployment. Script itu mengambil
`main` terbaru, membangun image Docker untuk Nuxt, lalu mengganti **hanya**
container `web`. Caddy dan `cloudflared` tetap berjalan. Script menunggu web baru
sehat dan memastikan Caddy masih bisa membuka homepage.

Jika pemeriksaan setelah penggantian gagal, script mencoba mengembalikan image
web sebelumnya. Run tetap ditandai gagal agar masalahnya terlihat. Proses
penggantian container bisa menyebabkan jeda singkat.

## Cara membaca hasil deploy

- **Sukses:** periksa website di browser. Status sukses dan respons HTTP 200
  belum membuktikan semua fitur bekerja.
- **`already deployed`:** versi `main` yang diambil sudah aktif; ini hasil sukses.
- **Gagal:** buka log run di GitHub Actions. Versi lama biasanya tetap berjalan,
  tetapi periksa website untuk memastikan kondisinya.
- **Push baru belum terlihat:** periksa apakah run sudah selesai dan commit/image
  mana yang tertulis di log. Script mengambil `main` terbaru saat proses berjalan,
  sehingga commit yang dipasang bisa lebih baru dari commit pemicu run.

## Batasan penting

- Alur ini **hanya memasang frontend**. Backend NestJS belum termasuk.
- Perubahan file konfigurasi deployment di repository tidak otomatis memperbarui
  salinan konfigurasi yang dilindungi di VM. Perlu pemasangan terpisah oleh
  operator.
- File `.env` di laptop tidak otomatis ikut ke VM. Alamat website untuk SEO
  dibaca dari konfigurasi di VM.
- Saat ini pengunjung masih masuk melalui Cloudflare Quick Tunnel dengan URL
  sementara. Pemakaian domain sendiri adalah pekerjaan terpisah dari deploy
  frontend harian.

Sumber alur: [workflow GitHub Actions](../.github/workflows/deploy-web.yml) dan
[script deployment](../deploy/deploy-web.sh).
