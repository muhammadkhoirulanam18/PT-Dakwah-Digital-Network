# Issue: Build Product Input Form Page

## Description
Build a product input form page to collect data for generating a sales page via AI.

## Fields Required
* name
* description
* features
* audience
* price
* usp

## Expected Behavior On Submit
* Call API `/generate` (sesuaikan base path dengan konfigurasi, misal `/api/auth/generate`).
* Show loading state (contoh: spinner pada tombol atau disable form).
* Redirect to preview page setelah data berhasil di-generate.

## UI Requirements
* Clean UI (gunakan Tailwind CSS, jaga konsistensi dengan tema desain aplikasi saat ini).

## Rules
* No explanation, code only.

---

## Detailed Implementation Steps
*(Panduan ini ditujukan untuk Junior Programmer atau AI Model untuk memandu proses implementasi yang terstruktur).*

### Tahap 1: Setup File dan Environment
Buat file halaman baru di frontend Next.js Anda. Disarankan meletakkannya di dalam rute dashboard, misalnya `src/app/dashboard/generate/page.tsx`.
Pastikan file ini dideklarasikan sebagai Client Component dengan menambahkan direktif `'use client';` di baris paling atas karena kita akan membutuhkan manajemen state dan interaksi *event handler* (onsubmit).

### Tahap 2: Inisialisasi State Management
Gunakan hook `useState` dari React untuk menyiapkan state berikut:
1.  **Form Data:** Buat object state untuk menampung input pengguna. Inisialisasi key berikut dengan string kosong: `name`, `description`, `features`, `audience`, `price`, dan `usp`.
2.  **Loading State:** Buat boolean state (misal `loading`) dengan nilai awal `false`. Ini akan mengontrol indikator visual saat request API sedang berjalan.
3.  **Error State:** Buat state untuk menangkap pesan error jika validasi API gagal atau terjadi masalah koneksi.

### Tahap 3: Membangun Clean UI Form
Desain antarmuka form menggunakan class Tailwind CSS. Pastikan tampilannya profesional, rapi (*clean*), dan konsisten dengan komponen halaman login/register sebelumnya (seperti penggunaan *glassmorphism* atau *dark mode background*).
*   Gunakan `<input type="text">` untuk field yang pendek (name, audience, price, usp).
*   Gunakan `<textarea>` untuk field yang panjang (description, features).
*   Tambahkan label untuk setiap field.
*   Buat struktur grid atau stack yang memberikan *spacing* (*gap*) yang cukup antar field agar tidak sesak.

### Tahap 4: Integrasi API dan Loading State
Buat fungsi asinkron (misal `handleSubmit`) yang akan dipicu oleh event `onSubmit` form. Di dalam fungsi ini:
1.  Cegah perilaku default form dengan `e.preventDefault()`.
2.  Set state `loading` menjadi `true` dan bersihkan state error sebelumnya.
3.  Gunakan axios instance (`api` dari `src/lib/axios.ts`) untuk mengirim *POST request* ke endpoint generator backend (sesuaikan path-nya, misal `/api/auth/generate`).
    *   **Catatan Penting:** Sesuaikan nama property di dalam payload agar cocok dengan validasi backend (misal mapping input `name` menjadi `product_name`).
4.  Terapkan try-catch block:
    *   **On Success:** Jika respons berhasil, tangkap data ID hasil generate, lalu gunakan `useRouter()` dari `next/navigation` untuk mengeksekusi `router.push('/dashboard/preview/' + dataId)`.
    *   **On Error:** Jika gagal, ekstrak pesan error dari respons axios dan set ke dalam state error untuk ditampilkan di UI.
5.  Di dalam blok `finally`, set kembali state `loading` menjadi `false`.

### Tahap 5: Menyempurnakan Feedback Visual (UX)
Terapkan state `loading` yang telah dibuat ke dalam elemen UI:
*   Tambahkan atribut `disabled={loading}` pada tombol submit dan juga pada elemen form lainnya agar tidak bisa diketik saat proses loading berlangsung.
*   Ubah konten teks tombol submit dari "Generate" menjadi elemen yang mengandung icon *spinner* berputar dan teks "Generating..." saat state `loading` adalah `true`.
*   Render pesan peringatan berwarna merah jika terdapat pesan error di dalam state error.

---
**Peringatan Tambahan (Sesuai Rules):** Saat memberikan balasan hasil implementasi tugas ini, pastikan memberikan **NO EXPLANATION, CODE ONLY**. Cukup berikan output kode dari file yang dibuat atau dimodifikasi.
