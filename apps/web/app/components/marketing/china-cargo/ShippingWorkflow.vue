<script setup lang="ts">
const steps = [
  {
    title: 'Konsultasi & Hitung Estimasi',
    description:
      'Kirim detail kargo (volume/CBM atau berat) dan jenis layanan yang diinginkan. Tim kami akan memberikan penawaran biaya All-In yang transparan.',
  },
  {
    title: 'Pengiriman ke Gudang China',
    description:
      'Supplier Anda mengirimkan barang ke gudang konsolidasi ETH Cargo di China (Guangzhou/Yiwu) lengkap dengan Kode Marking Anda.',
  },
  {
    title: 'Pengiriman Kargo & Clearance',
    description:
      'Kami melakukan verifikasi barang, pemuatan ke kontainer/pesawat, dan pengurusan seluruh proses bea cukai serta dokumen kepabeanan.',
  },
  {
    title: 'Tiba di Gudang Indonesia',
    description:
      'Kargo tiba di gudang penyortiran ETH Cargo di Indonesia. Tim logistik melakukan pemeriksaan kondisi barang, pengukuran ulang, dan penimbangan akhir demi kepastian data.',
  },
  {
    title: 'Pengiriman Akhir ke Alamat Anda',
    description:
      'Barang langsung didistribusikan ke alamat gudang, pabrik, atau toko Anda secara aman dan tepat waktu.',
  },
]
</script>

<template>
  <MarketingSectionsShippingWorkflow
    title="Cara Kerja Layanan Kargo"
    description="Proses pengiriman kargo yang simpel, transparan, dan terukur dari awal hingga barang tiba di gudang Anda."
    :steps="steps"
    cta-prompt="Siap memulai pengiriman kargo bisnis Anda hari ini?"
    cta-label="Konsultasi Gratis"
    cta-to="#quote"
  />
</template>
