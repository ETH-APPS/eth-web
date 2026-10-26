<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

useSeoMeta({
  title: 'Syarat & Ketentuan | ETH Cargo',
  description: 'Syarat dan ketentuan penggunaan layanan pengiriman ETH Cargo.',
  ogTitle: 'Syarat & Ketentuan | ETH Cargo',
  ogDescription: 'Syarat dan ketentuan penggunaan layanan pengiriman ETH Cargo.',
  ogType: 'website',
})

const policyNavigation = [
  {
    label: 'Umum',
    items: [
      { id: 'terms-and-conditions', label: 'Syarat & Ketentuan' },
      { id: 'privacy-policy', label: 'Kebijakan Privasi' },
      { id: 'purchase-policy', label: 'Kebijakan Titip Beli' },
    ],
  },
  {
    label: 'Cargo',
    items: [
      { id: 'fcl-policy', label: 'Kebijakan FCL Cargo' },
      { id: 'lcl-policy', label: 'Kebijakan LCL Cargo' },
      { id: 'air-cargo-policy', label: 'Kebijakan Air Cargo' },
    ],
  },
  {
    label: 'Transfer Services',
    items: [
      { id: 'transfer-rmb-policy', label: 'Kebijakan Transfer RMB' },
      { id: 'transfer-rmb-notice', label: 'Pemberitahuan Transfer RMB' },
    ],
  },
] as const

function createPolicyContent(subject: string, items: readonly string[]) {
  return [
    {
      type: 'paragraph' as const,
      text: `Lorem ipsum dolor sit amet consectetur adipiscing elit. ${subject} mengatur ketentuan yang berlaku bagi seluruh pengguna layanan ETH Cargo. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.`,
    },
    {
      type: 'paragraph' as const,
      text: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu.',
    },
    {
      type: 'paragraph' as const,
      text: `Pokok-pokok ${subject.toLocaleLowerCase('id-ID')} meliputi:`,
    },
    {
      type: 'list' as const,
      items,
    },
    {
      type: 'paragraph' as const,
      text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.',
    },
    {
      type: 'paragraph' as const,
      text: `Ketentuan pada ${subject} dapat diperbarui secara berkala sesuai kebutuhan operasional dan regulasi yang berlaku. Iaculis massa nisl malesuada lacinia integer nunc posuere.`,
    },
  ]
}

const policyDocuments = [
  {
    id: 'terms-and-conditions',
    title: 'Syarat & Ketentuan',
    updatedAt: '24 SEP 2026',
    content: createPolicyContent('Syarat dan Ketentuan', [
      'Penggunaan dan cakupan layanan ETH Cargo.',
      'Tanggung jawab serta kewajiban pengguna layanan.',
      'Prosedur penyerahan dan pemrosesan barang.',
      'Ketentuan penyimpanan serta pengiriman kargo.',
    ]),
  },
  {
    id: 'privacy-policy',
    title: 'Kebijakan Privasi',
    updatedAt: '22 SEP 2026',
    content: createPolicyContent('Kebijakan Privasi', [
      'Jenis data pribadi yang dikumpulkan.',
      'Tujuan penggunaan dan pengolahan data.',
      'Perlindungan serta penyimpanan informasi pengguna.',
      'Hak pengguna atas data pribadi yang tersimpan.',
    ]),
  },
  {
    id: 'purchase-policy',
    title: 'Kebijakan Titip Beli',
    updatedAt: '20 SEP 2026',
    content: createPolicyContent('Kebijakan Titip Beli', [
      'Prosedur pengajuan pembelian barang.',
      'Konfirmasi harga dan ketersediaan produk.',
      'Ketentuan pembayaran kepada supplier.',
      'Pemeriksaan serta penyerahan barang pesanan.',
    ]),
  },
  {
    id: 'fcl-policy',
    title: 'Kebijakan FCL Cargo',
    updatedAt: '18 SEP 2026',
    content: createPolicyContent('Kebijakan FCL Cargo', [
      'Penggunaan kontainer penuh untuk satu pengirim.',
      'Ketentuan kapasitas dan jenis kontainer.',
      'Dokumen pengiriman dan proses kepabeanan.',
      'Jadwal keberangkatan serta estimasi kedatangan.',
    ]),
  },
  {
    id: 'lcl-policy',
    title: 'Kebijakan LCL Cargo',
    updatedAt: '16 SEP 2026',
    content: createPolicyContent('Kebijakan LCL Cargo', [
      'Perhitungan volume dan minimum pengiriman.',
      'Proses konsolidasi muatan dalam kontainer.',
      'Ketentuan pelabelan dan pengemasan barang.',
      'Jadwal keberangkatan layanan LCL.',
    ]),
  },
  {
    id: 'air-cargo-policy',
    title: 'Kebijakan Air Cargo',
    updatedAt: '14 SEP 2026',
    content: createPolicyContent('Kebijakan Air Cargo', [
      'Perhitungan berat aktual dan volumetrik.',
      'Ketentuan barang sensitif dan berbahaya.',
      'Dokumen pendukung untuk proses penerbangan.',
      'Estimasi waktu dan status pengiriman udara.',
    ]),
  },
  {
    id: 'transfer-rmb-policy',
    title: 'Kebijakan Transfer RMB',
    updatedAt: '12 SEP 2026',
    content: createPolicyContent('Kebijakan Transfer RMB', [
      'Verifikasi penerima dan rekening tujuan.',
      'Konfirmasi nominal serta nilai tukar transaksi.',
      'Prosedur pembayaran kepada supplier China.',
      'Penerbitan bukti transfer resmi.',
    ]),
  },
  {
    id: 'transfer-rmb-notice',
    title: 'Pemberitahuan Transfer RMB',
    updatedAt: '10 SEP 2026',
    content: createPolicyContent('Pemberitahuan Transfer RMB', [
      'Batas waktu pengajuan transaksi harian.',
      'Perubahan nilai tukar dan biaya layanan.',
      'Pemeriksaan ulang informasi penerima.',
      'Prosedur penanganan transaksi tertunda.',
    ]),
  },
] as const
</script>

<template>
  <MarketingSectionsPolicyDocument
    :navigation="policyNavigation"
    :documents="policyDocuments"
    initial-policy-id="terms-and-conditions"
  />
</template>
