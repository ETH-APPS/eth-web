# Repository Agent Instructions

Instruksi ini berlaku untuk seluruh repository. Instruksi yang lebih spesifik di
direktori turunan boleh menambahkan aturan, tetapi tidak boleh mengabaikan aturan
di bawah ini.

## Konteks wajib untuk frontend

Sebelum mengubah file apa pun di `apps/web`:

1. Baca `docs/frontend-architecture.md` sampai selesai.
2. Untuk pekerjaan yang menyentuh UI, layout, styling, komponen visual, Figma,
   atau responsive behavior, baca `docs/responsive-guidelines.md` sampai selesai.
3. Periksa implementasi existing dan perubahan lokal yang belum di-commit sebelum
   mengedit. Jangan menimpa pekerjaan pengguna yang tidak terkait.
4. Jika referensi Figma tersedia, periksa frame mobile 390px dan desktop 1440px
   sebelum membuat keputusan visual. Keduanya adalah endpoint sumber kebenaran.

## Aturan kerja UI

- Gunakan pendekatan mobile-first dan aturan breakpoint dari
  `docs/responsive-guidelines.md`.
- Jangan menciptakan desain tablet baru. Tablet hanya menjembatani desain mobile
  dan desktop secara aman.
- Desktop existing pada 1440px adalah baseline terkunci. Ketika tugas hanya
  meminta mobile atau tablet, jangan mengubah tampilan, spacing, typography,
  hierarchy, interaction, atau behavior desktop.
- Jangan melakukan refactor atau improvement desktop secara oportunistik dalam
  tugas mobile/tablet. Perubahan class atau struktur hanya boleh dilakukan untuk
  mengisolasi responsive behavior dan hasil render desktop wajib tetap identik.
- Jika kebutuhan mobile/tablet tidak dapat diimplementasikan tanpa mengubah hasil
  desktop, hentikan pekerjaan dan minta persetujuan pengguna sebelum melanjutkan.
- Gunakan data bersama untuk konten yang sama. Markup desktop dan mobile boleh
  berbeda hanya ketika struktur atau interaksinya memang berbeda.
- Jangan menyatakan pekerjaan UI selesai sebelum menjalankan matriks viewport
  wajib dan pemeriksaan overflow yang tercantum di pedoman responsive.
- Untuk tugas mobile/tablet, ambil baseline desktop 1440px sebelum mengedit dan
  bandingkan kembali setelahnya. Deviasi desktop dianggap regresi.

Jika referensi desain tidak dapat diakses, pertahankan behavior existing, ikuti
pedoman responsive, dan laporkan keterbatasan verifikasi tersebut kepada pengguna.
