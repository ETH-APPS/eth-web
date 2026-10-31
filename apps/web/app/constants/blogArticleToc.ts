export const blogArticleToc = [
  {
    id: 'memahami-kebutuhan',
    number: '1',
    title: 'Memahami kebutuhan pengiriman',
    children: [
      { id: 'mengenali-karakter-barang', number: '1.1', title: 'Mengenali karakter dan kebutuhan barang' },
      { id: 'menentukan-target-pengiriman', number: '1.2', title: 'Menentukan target waktu pengiriman' },
    ],
  },
  {
    id: 'memilih-layanan',
    number: '2',
    title: 'Memilih layanan yang tepat',
    children: [
      { id: 'membandingkan-opsi', number: '2.1', title: 'Membandingkan opsi pengiriman' },
    ],
  },
  {
    id: 'kesimpulan',
    number: '3',
    title: 'Kesimpulan',
    children: [],
  },
] as const
