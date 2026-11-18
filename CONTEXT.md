# Cargo Shipment Context

Istilah bisnis untuk layanan Cargo Shipment. Pelanggan menggunakan aplikasi mobile; staf internal menggunakan dashboard web untuk menjalankan proses operasional.

## Language

**Pelanggan**:
Perorangan yang memiliki akun mobile dan mengajukan pengiriman kargo miliknya sendiri.
_Avoid_: Perusahaan, akun bersama

**Staf internal**:
Petugas yang menggunakan dashboard web untuk memeriksa pengajuan, menetapkan nominal pembayaran, menerbitkan invoice, memverifikasi pembayaran, dan memperbarui progres pengiriman.
_Avoid_: Pelanggan, pengguna mobile

**Pengajuan Kargo**:
Data kargo yang dikirim pelanggan untuk diperiksa staf sebelum harga, invoice, dan lokasi gudang China diberikan.
_Avoid_: Pengiriman aktif

**Shipment**:
Rangkaian layanan pengiriman milik satu pelanggan, dari pengajuan kargo hingga pengiriman akhir ke alamat penerima.
_Avoid_: Step, layar

**Resi Seller**:
Nomor pelacakan opsional untuk kiriman dari seller menuju gudang China. Satu pengajuan kargo dapat memiliki beberapa resi seller.
_Avoid_: Nomor shipment ETH

**P1**:
Pembayaran awal yang harus diverifikasi sebelum pengiriman internasional diproses.
_Avoid_: Pelunasan

**P2**:
Sisa biaya kargo setelah P1, ditetapkan berdasarkan kargo aktual saat tiba di gudang Indonesia dan diverifikasi sebelum pengiriman akhir diproses.
_Avoid_: DP

**Bukti Pembayaran**:
Dokumen atau gambar yang diunggah pelanggan setelah transfer manual P1 atau P2 untuk diperiksa staf internal.
_Avoid_: Pembayaran terverifikasi

**Ongkir Lokal**:
Biaya ekspedisi dari gudang Indonesia ke alamat penerima, terpisah dari P1 dan P2. Pembayaran COD disarankan, dengan cara lain sesuai kasus pelanggan.
_Avoid_: P2
