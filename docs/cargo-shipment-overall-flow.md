# Cargo Shipment: Alur Bisnis Keseluruhan

> Status: alur bisnis utama disepakati pada 18 November 2026. UI mobile masih berupa gambaran; dokumen ini belum menetapkan tabel, endpoint, atau urutan implementasi backend.

## Cakupan dan pelaku

- **Pelanggan** memakai aplikasi mobile dan memiliki pengajuan kargonya sendiri sebagai perorangan.
- **Staf internal/CS** memakai dashboard web untuk memeriksa pengajuan, menghubungi pelanggan, menetapkan harga dan invoice, memverifikasi pembayaran, serta memperbarui progres.
- **Remittance** berada di luar alur ini dan dibahas setelah flow bisnisnya tersedia.
- Satu pengajuan dapat memuat beberapa resi seller. Resi bersifat opsional.

## Alur utama

| Tahap bisnis | Pelanggan di mobile | Staf internal di dashboard | Syarat untuk lanjut |
| --- | --- | --- | --- |
| 1. Pengajuan kargo | Mengisi metode kirim, jenis dan ukuran kargo, berat, jumlah box, media opsional, serta catatan; lalu mengirim pengajuan. | Meninjau kelengkapan dan kesesuaian data; menghubungi pelanggan jika perlu. | Staf menyetujui pengajuan. Jika data perlu diperbaiki, pelanggan merevisi dan mengirim ulang. Staf juga dapat menolak dengan alasan yang terlihat oleh pelanggan. |
| 2. Harga dan P1 | Melihat nominal DP, invoice, dan lokasi gudang China. Dapat berdiskusi tentang harga atau membatalkan sebelum membayar. Membayar P1 melalui transfer manual dan mengunggah bukti. | Menetapkan atau merevisi harga DP, menerbitkan invoice, memberikan lokasi gudang China, dan memverifikasi bukti P1. | P1 terverifikasi sebelum proses pengiriman internasional dilanjutkan. Jika bukti ditolak, staf memberi alasan dan pelanggan dapat mengunggah ulang. |
| 3. Seller dan pengiriman internasional | Dapat menambahkan satu atau beberapa resi seller bila tersedia; memantau progres menuju gudang China hingga gudang Indonesia. | Memperbarui milestone tracking secara manual pada versi awal. Integrasi API tracking direncanakan kemudian. | Kargo tiba di gudang Indonesia. |
| 4. P2 dan tujuan akhir | Melihat sisa tagihan, memilih ekspedisi lokal, serta mengubah alamat penerima sampai P2 diverifikasi. Membayar P2 melalui transfer manual dan mengunggah bukti. | Menetapkan biaya akhir berdasarkan kargo aktual, memperhitungkan P1 yang telah dibayar, menerbitkan atau merevisi tagihan P2, dan memverifikasi buktinya. | P2 terverifikasi sebelum pengiriman akhir diproses. Jika bukti ditolak, staf memberi alasan dan pelanggan dapat mengunggah ulang. |
| 5. Pengiriman lokal | Memantau pengiriman ke alamat penerima dan dapat melaporkan masalah bila barang belum diterima. | Memperbarui progres dan menandai pengiriman selesai berdasarkan bukti dari ekspedisi. | Staf mencatat barang telah diterima berdasarkan bukti pengiriman. |

Empat langkah UI mobile merangkum alur di atas; jumlah layar atau titik pada stepper tidak menentukan jumlah status backend.

## Aturan bisnis yang sudah disepakati

- Pengajuan yang dikirim pelanggan masuk pemeriksaan staf sebelum harga P1 dan detail gudang China diberikan. Pengajuan yang perlu diperbaiki dikembalikan kepada pelanggan untuk direvisi; pengajuan yang tidak dapat dilayani dapat ditolak dengan alasan.
- Nominal P1 ditentukan staf, bukan dihitung sebagai angka final di mobile. Harga dapat didiskusikan, direvisi, atau pengajuan dibatalkan sebelum pembayaran.
- Pembayaran awal memakai transfer manual, unggah bukti, dan verifikasi staf. Payment Gateway/VA belum termasuk keputusan versi awal.
- Bukti P1 atau P2 yang ditolak dapat diunggah ulang setelah staf memberikan alasan. Pembayaran tetap menunggu verifikasi sampai bukti diterima.
- Pembatalan setelah P1 dibayar ditangani melalui CS. Biaya yang sudah timbul dan pengembalian dana diputuskan per kasus.
- P2 adalah sisa biaya kargo berdasarkan kondisi aktual, dikurangi P1. Staf boleh merevisi nominal sebelum dibayar, dengan riwayat invoice. Koreksi setelah dibayar dicatat sebagai penyesuaian atau pengembalian dana, bukan mengubah catatan pembayaran lama.
- Alamat penerima dan pilihan ekspedisi lokal dapat diubah pelanggan sampai P2 diverifikasi. Setelah itu perubahan perlu dibantu CS sebelum barang diserahkan ke ekspedisi.
- Ongkir ekspedisi lokal dicatat terpisah dari P1 dan P2. COD disarankan, tetapi cara pembayaran dapat disesuaikan per kasus.
- Resi seller boleh lebih dari satu dan bersifat opsional. Belum ada aturan penguncian waktu penambahan resi untuk versi awal.
- Server menjadi sumber kebenaran nominal, invoice, hasil verifikasi pembayaran, dan progres. Input serta tampilan mobile tidak boleh dianggap sebagai persetujuan atau verifikasi otomatis.

## Detail yang ditentukan saat implementasi

- Aturan harga lebih rinci, upload media, dan masa berlaku invoice.
- Sumber API tracking, pemetaan milestone, serta hubungan pembaruan otomatis dengan pembaruan staf.
- Bentuk bukti ekspedisi untuk menyatakan pengiriman lokal selesai dan cara pelanggan melaporkan masalah.
- Ketentuan biaya dan pengembalian dana untuk pembatalan setelah P1, sesuai kasus yang ditangani CS.

Dokumen flow mobile saat ini masih menggambarkan perpindahan antarlayar dengan data mock. Alur pemeriksaan staf dan pemberian harga sebelum P1 di dokumen ini berasal dari penjelasan bisnis terbaru; UI dan dokumen mobile perlu diselaraskan saat implementasi terkait dimulai.
