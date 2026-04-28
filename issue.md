# Issue: Quality Assurance (QA) & Production Verification

## 🎯 Objektif
Tugas ini ditujukan untuk Junior Programmer atau AI Model. Tujuan utama dari tugas ini adalah untuk melakukan verifikasi langsung di lingkungan *production* (produksi) guna memastikan semua fitur utama aplikasi berjalan dengan lancar tanpa kendala.

## 📝 Checklist Utama
- [ ] Login dan Register berfungsi normal
- [ ] Fitur Generate Sales Page berhasil membuat konten
- [ ] Halaman Preview UI tampil dengan benar, rapi, dan responsif
- [ ] Data History (riwayat pembuatan sales page) tersimpan dan dapat diakses
- [ ] Tidak ada error di *browser console* pada semua halaman

---

## 🛠️ Tahapan Implementasi & Pengujian (Step-by-Step Guide)

Silakan ikuti langkah-langkah pengujian berikut secara berurutan. Panduan ini dirancang sangat detail agar mudah diikuti.

### Langkah 1: Pengujian Login & Register
1. Buka URL aplikasi *production* di browser.
2. Navigasi ke halaman **Register**. Buat akun baru dengan mengisi email dan password *dummy*.
3. Pastikan proses registrasi berhasil dan kamu diarahkan ke halaman Login atau langsung masuk ke Dashboard.
4. Lakukan **Logout** untuk memastikan *session* berhasil dihapus.
5. Navigasi ke halaman **Login**. Masuk kembali menggunakan akun yang baru saja dibuat.
6. **Ekspektasi:** Login berhasil dan pengguna langsung diarahkan ke halaman Dashboard utama tanpa ada pesan error.

### Langkah 2: Pengujian Generate Sales Page
1. Di dalam Dashboard, akses fitur pembuatan Sales Page.
2. Isi form input (seperti nama produk, deskripsi, dll) dengan data yang sesuai.
3. Buka *Developer Tools* (tekan F12), masuk ke tab **Network**.
4. Tekan tombol **Generate/Submit**.
5. Perhatikan permintaan (request) di tab Network. Pastikan request ke API OpenAI/Backend merespons dengan status `200 OK`.
6. **Ekspektasi:** Sistem mengembalikan respon sukses, menyimpan data ke database, dan mengarahkan pengguna ke halaman hasil/preview.

### Langkah 3: Pengujian Halaman Preview
1. Setelah *generate* selesai, periksa halaman Preview dengan teliti.
2. Periksa apakah semua bagian (Hero, Benefits, Features, Testimonial, Pricing, CTA) terisi dengan data JSON yang benar.
3. Pastikan desain menggunakan *spacing* yang konsisten, tipografi yang jelas (font Inter), dan desain modern.
4. Lakukan uji coba **Mobile Responsiveness**: Kecilkan ukuran window browser (atau gunakan mode *Device Toolbar* di F12) dan pastikan UI tidak ada yang meluber (*overflow*) atau tumpang tindih.
5. Uji coba tombol **Export HTML** di header. Pastikan file `.html` berhasil terunduh dan isinya valid.
6. **Ekspektasi:** Halaman tampil sempurna, menarik, responsif di semua ukuran layar, dan tombol ekspor berfungsi.

### Langkah 4: Pengujian History (Riwayat)
1. Navigasi ke menu **History** atau riwayat pembuatan di Dashboard.
2. Pastikan Sales Page yang baru saja dibuat pada *Langkah 2* muncul di urutan teratas dalam daftar riwayat.
3. Klik tombol detail/view pada item tersebut.
4. **Ekspektasi:** Halaman diarahkan ke Preview page dari id riwayat tersebut, dan data berhasil dipanggil dari backend tanpa ada bagian yang hilang.

### Langkah 5: Pengecekan Error Console
1. Selama melakukan Langkah 1 hingga 4, pastikan tab **Console** di Developer Tools (F12) selalu terbuka.
2. Perhatikan apakah ada teks berwarna merah (*Error*) atau kuning (*Warning*). Perhatikan khusus error mengenai CORS, *React hydration*, *Network failure*, atau pemanggilan fungsi pada objek yang *undefined*.
3. **Ekspektasi:** Console sepenuhnya bersih dari error.

---

## 🐛 Panduan Penanganan Bug Kecil

Jika kamu menemukan **bug kecil** selama pengujian (misalnya typo teks, error styling CSS, nilai *undefined* yang membuat halaman putih/crash, atau tombol tidak berfungsi):

1. Lakukan *debugging* dan temukan akar masalahnya di kode sumber (*source code*).
2. Lakukan perbaikan secara efisien. Jangan merombak arsitektur, perbaiki hanya bagian yang bermasalah.
3. Buat **Commit** dengan pesan yang sangat jelas agar programmer lain tahu apa yang terjadi.

**Format Pesan Commit yang Diwajibkan:**
Gunakan format yang informatif dengan menyertakan *apa* masalahnya dan *bagaimana* memperbaikinya.
*Contoh:*
> `fix(preview): menangani nilai undefined pada daftar features`
> 
> Penjelasan: Menambahkan optional chaining `content.features?.map` di `page.tsx` agar aplikasi tidak crash saat AI secara tidak sengaja tidak mengembalikan properti features.

## 🏁 Kriteria Penyelesaian
Issue ini dapat ditandai sebagai **Selesai (Closed)** apabila:
1. Seluruh item pada **Checklist Utama** sudah tercentang hijau setelah verifikasi di *production*.
2. Apabila ditemukan bug kecil, perbaikannya sudah diselesaikan dan di-commit menggunakan format pesan yang telah ditentukan.
