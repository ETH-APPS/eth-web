# Roadmap Backend Cargo Shipment

> Rencana pelaksanaan bertahap berdasarkan [alur bisnis keseluruhan](cargo-shipment-overall-flow.md). Setiap fase menghasilkan alur API yang dapat diuji. Urutan ini tidak mengunci tabel, endpoint, atau teknologi database sebelum fase terkait dimulai.

Backend `apps/api` memakai Prisma dan PostgreSQL lokal `eth_apps` pada container yang sudah disiapkan pemilik proyek; Compose repository belum menjalankan database. Fase 1 menyediakan auth email/password, pengajuan kargo, dan pemeriksaan staf. API yang sama akan melayani pelanggan di mobile dan staf internal di dashboard web, dengan akses sesuai perannya. Remittance menyusul setelah alur bisnisnya ditentukan.

## Langkah awal sebelum API pengajuan

1. Pilih database dan alat migration yang akan dipakai backend, lalu siapkan database lokal dan konfigurasi koneksi melalui environment. Pilihan ini dibahas saat mulai implementasi karena menambah dependency produksi dan menentukan pola perubahan schema.
2. Pastikan API gagal dengan jelas jika konfigurasi atau koneksi database yang wajib tidak tersedia. Buat migration pertama hanya untuk data Fase 1, serta cara menyiapkan akun staf pengembangan tanpa menyimpan kredensial di repository.
3. Tentukan kontrak autentikasi minimum pelanggan dan staf, termasuk bagaimana PIN mock mobile akan diganti. Terapkan akses sesuai peran bersama API Fase 1.
4. Terapkan validasi input pada batas HTTP dan tes API untuk alur pertama, memakai fondasi Vitest/Supertest yang sudah ada. Logging Pino, lint, build, dan type-check sudah tersedia di repository.

Langkah awal ini menjadi bagian dari pekerjaan Fase 1, bukan fondasi terpisah yang dikerjakan tanpa alur pengguna.

Penyimpanan file disiapkan saat upload media atau bukti pembayaran mulai dikerjakan. CORS dashboard browser dan deployment API/database disiapkan saat klien serta lingkungan terkait dihubungkan; semuanya tidak perlu menjadi proyek pendahuluan tersendiri.

## Fase 1 — Pengajuan dan pemeriksaan

**Hasil yang bisa dipakai:** pelanggan mengirim pengajuan kargo; staf melihat antrean, meminta perbaikan, menyetujui, atau menolak dengan alasan; pelanggan dapat memperbaiki dan mengirim ulang.

- Gunakan database, migration, dan autentikasi minimum dari langkah awal untuk menyimpan dan mengamankan alur ini.
- Simpan kepemilikan pengajuan, data kargo, catatan, dan riwayat keputusan pemeriksaan.
- Batasi pelanggan pada pengajuannya sendiri; tindakan pemeriksaan hanya untuk staf.
- Uji alur berhasil, revisi, penolakan, input tidak valid, dan akses oleh akun yang tidak berhak melalui API.

## Fase 2 — Harga, invoice, dan P1

**Hasil yang bisa dipakai:** staf menetapkan harga DP, invoice, dan lokasi gudang China; pelanggan melihatnya, mengunggah bukti transfer P1, lalu staf memverifikasi atau menolak bukti dengan alasan.

- Catat revisi harga dan invoice tanpa menimpa versi yang sudah diberikan kepada pelanggan.
- Izinkan diskusi harga dan pembatalan sebelum P1 sesuai alur CS; rincian komunikasi dapat tetap di luar API pada fase ini.
- Bukti yang ditolak dapat dikirim ulang. Pengiriman internasional baru terbuka setelah P1 diverifikasi.
- Uji bahwa pelanggan tidak dapat menetapkan nominal atau mengesahkan pembayarannya sendiri.

## Fase 3 — Resi seller dan tracking internasional

**Hasil yang bisa dipakai:** pelanggan dapat menambahkan beberapa resi seller secara opsional; staf memperbarui milestone; pelanggan melihat progres sampai kargo tiba di gudang Indonesia.

- Mulai dari pembaruan staf. Catat sumber dan waktu tiap pembaruan agar integrasi API tracking dapat ditambahkan kemudian.
- Kedatangan di gudang Indonesia membuka proses P2.
- Uji urutan transisi penting dan batas akses pelanggan/staf tanpa membuat aturan penguncian resi yang belum dibutuhkan.

## Fase 4 — P2 dan pengiriman lokal

**Hasil yang bisa dipakai:** staf menetapkan biaya akhir dan sisa P2; pelanggan memilih ekspedisi lokal, memperbarui alamat, membayar P2, lalu mengikuti pengiriman sampai staf menandainya selesai berdasarkan bukti ekspedisi.

- Catat P1, P2, dan ongkir lokal secara terpisah. COD adalah pilihan yang disarankan untuk ongkir lokal, dengan penanganan lain per kasus.
- Simpan revisi tagihan P2; setelah pembayaran, koreksi menjadi catatan penyesuaian atau pengembalian dana.
- Izinkan perubahan alamat dan ekspedisi lokal sampai P2 diverifikasi. Setelah itu perubahan melalui CS sebelum barang diserahkan ke ekspedisi.
- Bukti P2 yang ditolak dapat dikirim ulang; pengiriman lokal baru berjalan setelah P2 diverifikasi.
- Staf mencatat penyelesaian berdasarkan bukti ekspedisi; pelanggan dapat melaporkan masalah penerimaan.
- Pembatalan setelah P1 ditangani CS, dengan biaya dan pengembalian dana diputuskan per kasus.

## Integrasi berikutnya

Dokumentasi OpenAPI/Swagger untuk API Fase 1 tersedia di `/docs` dan `/docs-json`. API tracking eksternal, Payment Gateway/VA, notifikasi, dan flow Remittance ditambahkan ketika kontrak serta kebutuhan operasionalnya tersedia. Struktur fase sebelumnya cukup mencatat data sumber dan riwayat agar integrasi tersebut dapat disambungkan tanpa mengubah arti pembayaran atau milestone.

## Cara menjalankan tiap fase

Sebelum mengubah `apps/api`, ikuti [pedoman backend](backend-guidelines.md): periksa implementasi dan perubahan lokal, tetapkan kontrak fase yang sedang dikerjakan, lalu uji perilaku melalui API termasuk kegagalan yang relevan. Fase dianggap selesai setelah pemeriksaan lint, build, type-check, dan tes integrasi/API yang relevan lulus.
