# Responsive Design Guidelines

Dokumen ini adalah pedoman wajib untuk menerjemahkan desain Figma mobile dan
desktop ke implementasi responsive di `apps/web`. Pedoman ini tidak membuat
desain tablet ketiga. Tablet adalah jembatan yang aman antara dua endpoint Figma.

## Sumber kebenaran

Gunakan urutan prioritas berikut ketika terdapat perbedaan:

1. Instruksi eksplisit pengguna untuk tugas yang sedang dikerjakan.
2. Frame Figma mobile 390px dan desktop 1440px.
3. Design token, komponen shared, dan behavior existing yang sudah tervalidasi.
4. Aturan interpolasi dalam dokumen ini.
5. Inferensi agent, hanya jika tidak ada sumber lain dan tidak mengubah hierarchy,
   copy, atau interaction model.

Mobile 390px dan desktop 1440px harus mendekati Figma secara pixel-accurate.
Ukuran di antaranya harus tetap terbaca, stabil, dan bebas overflow; ukuran
intermediate tidak perlu menjadi desain baru.

## Desktop lock untuk tugas mobile dan tablet

Desktop existing pada 1440px adalah baseline visual yang terkunci. Jika scope
tugas hanya mobile atau tablet:

- Jangan mengubah hasil render desktop, termasuk typography, spacing, ukuran,
  hierarchy, alignment, wrapping, media crop, interaction, dan animation.
- Jangan sekalian merapikan, menyederhanakan, atau mengoptimalkan markup desktop.
- Jangan mengubah nilai `lg:` atau `xl:` kecuali perubahan tersebut hanya
  memindahkan nilai desktop existing agar tetap menghasilkan computed style yang
  sama setelah mobile base ditambahkan.
- Jika struktur mobile berbeda secara material, gunakan presentation markup atau
  component mobile terpisah dan pertahankan data source bersama.
- Ambil screenshot baseline 1440px sebelum mengedit dan screenshot pembanding
  setelah implementasi. Perbedaan desktop yang tidak diminta adalah regresi.
- Jika perubahan tidak dapat diisolasi tanpa mengubah desktop, hentikan pekerjaan
  dan minta persetujuan pengguna. Jangan mengambil keputusan desktop sendiri.

## Breakpoint contract

Project menggunakan breakpoint default Tailwind CSS 4.

| Rentang | Breakpoint | Peran |
| --- | --- | --- |
| 0–639px | base | Implementasi mobile. Nilai pada 390px mengikuti Figma mobile. |
| 640–767px | `sm` | Mobile lebar. Hanya tambah ruang atau lebar; hierarchy tetap mobile. |
| 768–1023px | `md` | Tablet bridge. Struktur mobile tetap berlaku; grid dua kolom boleh dipakai jika konten aman. |
| 1024–1279px | `lg` | Struktur desktop mulai aktif dengan gap dan ukuran yang masih konservatif. |
| 1280px ke atas | `xl` | Skala menuju endpoint desktop 1440px. Nilai Figma desktop menjadi batas maksimum. |

Aturan penting:

- Tulis class mobile sebagai base, tablet dengan `md:`, dan desktop dengan `lg:`.
- Jangan memakai struktur desktop pada tablet hanya karena ruang terlihat cukup.
- `lg` mengubah composition; `xl` menyelesaikan spacing dan scale menuju Figma
  1440px bila nilai desktop terlalu besar untuk 1024px.
- Di atas 1440px, pertahankan max-width dan pusatkan konten. Jangan terus
  memperbesar typography, gap, kartu, atau media.
- Navbar hamburger berlaku sampai 1023px. Navbar desktop mulai tepat pada 1024px.

## Layout dan container

- Mobile memakai gutter horizontal 16px.
- Tablet memakai gutter horizontal 24px.
- Desktop memakai `UiContainer` dengan `max-w-[1080px]` dan posisi centered.
- Karena `UiContainer` adalah shared component, perubahan gutter global harus
  diuji pada seluruh halaman yang memakainya; jangan membuat banyak aturan
  container lokal yang saling bertentangan.
- Gunakan content-driven height. Hindari fixed height untuk teks, kartu, form,
  menu, dan section.
- Gunakan `w-full`, `min-w-0`, `minmax(0,1fr)`, flex wrapping, dan max-width untuk
  mencegah overflow.
- Fixed height hanya boleh dipakai untuk media dengan aspect ratio yang jelas,
  control dengan ukuran pasti, atau hero yang memang membutuhkannya. Hero tetap
  wajib diuji pada layar pendek agar konten tidak terdorong keluar viewport.

Pola grid default:

```html
<!-- Empat kolom desktop -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

<!-- Tiga kolom desktop -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
```

- Grid empat kolom mengikuti urutan 1 → 2 → 4.
- Grid tiga kolom mengikuti urutan 1 → 2 → 3.
- Grid dua kolom desktop tetap satu kolom pada mobile dan boleh menjadi dua kolom
  di `md` hanya jika copy, control, dan media tidak tertekan.
- Form dengan lebar kolom fixed harus ditumpuk pada mobile. Gunakan grid fluid
  pada tablet/desktop dan jangan mengecilkan input hingga label atau value terpotong.

## Typography dan spacing

- Gunakan font family, weight, size, line-height, dan letter-spacing yang diukur
  dari Figma pada 390px dan 1440px.
- Body text, label, dan button memakai ukuran diskret pada endpoint; jangan
  menggunakan fluid scaling sembarang.
- Display heading boleh memakai `clamp()` jika nilai minimum dan maksimum berasal
  dari kedua frame Figma dan hasilnya diuji pada seluruh matriks viewport.
- Jika `clamp()` tidak diperlukan, gunakan ukuran mobile sebagai base dan ukuran
  desktop melalui `lg:` atau `xl:`.
- Jangan menggunakan fixed height untuk menyamakan kartu yang berisi copy.
  Gunakan grid/flex stretch, padding, dan `min-height` hanya jika tidak memotong
  wrapping teks.
- Gunakan `gap` untuk hubungan antar-item dan margin untuk hubungan antarblok.
  Tablet memakai langkah spacing di antara nilai mobile dan desktop, bukan angka
  baru yang mengubah rhythm desain.

## Komponen dan data

- Konten, route, label, dan icon yang sama harus berasal dari satu data source.
- Desktop dan mobile boleh memakai presentation component terpisah ketika
  interaction model berbeda, seperti dropdown desktop dan drawer mobile.
- Presentation component terpisah tidak boleh menduplikasi data menu atau copy.
- Urutan konten, hierarchy heading, dan CTA harus sama dengan Figma kecuali ada
  instruksi produk yang eksplisit.
- Jangan menyembunyikan konten pada tablet untuk mengatasi layout yang sempit;
  ubah susunan, wrapping, atau jumlah kolom terlebih dahulu.

## Media dan interaction

- Gunakan aspect ratio yang sesuai desain serta `object-cover` atau
  `object-contain` berdasarkan fungsi gambar. Jangan meregangkan gambar.
- Tentukan `object-position` jika subjek utama berisiko terpotong pada rasio lain.
- Berikan dimensi intrinsik atau aspect ratio untuk mencegah layout shift.
- Control interaktif mobile harus memiliki target sentuh minimal 44×44px.
- Hover tidak boleh menjadi satu-satunya cara mengakses informasi atau aksi.
- Pertahankan focus state, keyboard navigation, semantic heading, label form, dan
  reduced-motion behavior yang sudah ada.

## Workflow wajib untuk agent

Sebelum mengedit:

1. Baca dokumen ini dan `docs/frontend-architecture.md` sampai selesai.
2. Periksa kedua frame Figma, bukan hanya frame yang diminta pengguna.
3. Periksa component existing, shared primitive, data source, dan perubahan lokal.
4. Catat nilai endpoint mobile dan desktop untuk typography, spacing, grid, media,
   serta interaction sebelum memilih class responsive.
5. Untuk scope mobile/tablet, ambil screenshot baseline desktop 1440px sebelum
   mengubah kode.

Saat mengimplementasikan:

1. Bangun mobile sebagai base.
2. Tambahkan tablet bridge hanya untuk mencegah ruang kosong berlebihan,
   wrapping buruk, atau kartu terlalu lebar.
3. Aktifkan struktur desktop di `lg` dan capai endpoint 1440px di `xl` bila perlu.
4. Reuse primitive dan data existing; jangan membuat versi tablet khusus.
5. Jangan memperbaiki masalah responsive dengan menyembunyikan overflow yang
   seharusnya diselesaikan pada layout.

## Definition of done

Uji minimal pada lebar viewport berikut:

| Lebar | Tujuan |
| --- | --- |
| 320px | Safety check mobile kecil. |
| 390px | Perbandingan pixel-accurate dengan Figma mobile. |
| 768px | Tablet portrait bridge. |
| 1023px | Batas terakhir struktur mobile/tablet. |
| 1024px | Batas pertama struktur desktop. |
| 1280px | Desktop menengah. |
| 1440px | Perbandingan pixel-accurate dengan Figma desktop. |

Pada setiap viewport, pastikan:

- Tidak ada horizontal scroll atau elemen keluar container.
- Teks, CTA, input, card, dan navigation tidak terpotong.
- Wrapping tidak membuat hierarchy atau urutan baca berubah.
- Tap target dan focus state tetap dapat digunakan.
- Navbar berganti tepat antara 1023px dan 1024px.
- Image tidak terdistorsi dan focal point tetap masuk akal.
- Layout tidak bergantung pada tinggi viewport tertentu; uji juga laptop pendek.
- Pada tugas mobile/tablet, screenshot desktop 1440px sebelum dan sesudah tidak
  memiliki perubahan visual.

Ambil screenshot pada 390px dan 1440px dan bandingkan dengan Figma. Jika terdapat
deviasi yang disengaja, tuliskan alasan dan dampaknya saat menyerahkan hasil.
Jalankan type-check/build yang tersedia serta `git diff --check`; jangan menutup
pekerjaan hanya berdasarkan tampilan pada satu viewport.
