# Issue: Create Preview Page for Generated Sales Page

## Description
Create a preview page that renders the generated JSON content into a complete, modern, and clean landing page UI.

## Requirements
* Render the JSON data into specific landing page sections:
  * Hero (headline, subheadline)
  * Benefits (array)
  * Features (array)
  * Testimonial
  * Pricing
  * CTA (Call to Action)
* UI Design: Modern, clean, responsive (mobile-friendly) using Tailwind CSS.

## Rules
* No explanation, code only.

---

## Detailed Implementation Steps
*(Panduan ini ditujukan untuk Junior Programmer atau AI Model untuk memandu proses implementasi yang terstruktur).*

### Tahap 1: Setup File dan Routing Dinamis
Buat file halaman baru di project frontend Next.js Anda yang menggunakan *dynamic routing* untuk menerima parameter ID dari sales page.
*   **Lokasi File:** Buat folder dan file di `src/app/dashboard/preview/[id]/page.tsx`.
*   **Tipe Komponen:** Tambahkan direktif `'use client';` di bagian paling atas karena kita akan membutuhkan *hooks* untuk *data fetching* dan mengambil parameter URL.

### Tahap 2: Manajemen State dan Pengambilan Data (Data Fetching)
1.  Gunakan hook `useParams` dari modul `next/navigation` untuk mengekstrak parameter `id` dari URL.
2.  Siapkan state menggunakan `useState`:
    *   `data`: Untuk menampung keseluruhan data *sales page* dari backend (terutama yang berisi *property* `generated_content`).
    *   `loading`: Boolean dengan inisialisasi `true` untuk menampung status *fetching*.
    *   `error`: Untuk menampung pesan kesalahan (jika ada).
3.  Gunakan `useEffect` untuk mengambil data dari backend melalui `axios` (instance `api` dari `src/lib/axios.ts`). Lakukan request `GET` ke endpoint yang sesuai, misalnya `/api/auth/sales-pages/${params.id}` *(Catatan: pastikan untuk menyesuaikan endpoint dengan ketersediaan di backend Anda)*.
4.  Tampilkan indikator *loading* (misal spinner) jika state `loading` masih bernilai `true`.
5.  Tampilkan pesan error jika terjadi kesalahan atau jika data `generated_content` tidak ditemukan.

### Tahap 3: Pembuatan Komponen UI per Section (Render JSON)
Asumsikan data berhasil diambil dan disimpan dalam variabel `content = data.generated_content`. Rancang UI menggunakan Tailwind CSS agar *modern* dan *clean* (sebaiknya selaras dengan tema dark/glassmorphism yang sudah ada):

1.  **Hero Section:** 
    *   Tampilkan `content.headline` menggunakan tag H1 dengan ukuran font besar (`text-4xl` atau `text-5xl`), tebal (`font-bold`), dan posisikan di tengah (`text-center`).
    *   Tampilkan `content.subheadline` di bawahnya dengan warna teks yang sedikit redup (`text-white/70`).
2.  **Benefits Section:** 
    *   Buat sebuah *grid layout* (misal `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) untuk merender perulangan (`map`) dari array `content.benefits`.
    *   Tampilkan setiap benefit dalam komponen *card* sederhana (menggunakan *border*, *padding*, dan *rounded corners*).
3.  **Features Section:** 
    *   Render perulangan array `content.features`. Bisa menggunakan struktur daftar berurutan bergaya modern (misal dengan icon checkmark di sebelah kirinya) atau bentuk *card* berjejer vertikal.
4.  **Testimonial Section:** 
    *   Render data `content.testimonial` ke dalam blok kutipan (`<blockquote>`). Berikan gaya cetak miring (*italic*) dan beri batas *border* kiri yang tebal untuk menegaskan gaya kutipan.
5.  **Pricing Section:** 
    *   Desain sebuah *pricing card* yang menonjol (berikan bayangan tebal/glow effect). Render isi teks dari `content.pricing` ke dalam *card* tersebut.
6.  **CTA (Call to Action) Section:** 
    *   Di bagian terbawah, buat area penutup dengan teks dari `content.cta`. 
    *   Tambahkan sebuah tombol utama (misal menggunakan background gradient) untuk mensimulasikan tombol pembelian/aksi.

### Tahap 4: Polishing dan Responsivitas
*   Bungkus keseluruhan konten dalam *container* (misalnya `<div className="max-w-5xl mx-auto px-4 py-12">`).
*   Berikan *spacing* vertikal (`space-y-24` atau margin-top/bottom yang besar) antar *section* agar antarmuka terlihat lega (*breathing room*).
*   Pastikan semua struktur grid menggunakan class responsif (seperti penggunaan prefiks `sm:`, `md:`, dan `lg:`) agar tata letak menyesuaikan dengan baik di layar ponsel pintar.

---
**Peringatan Tambahan (Sesuai Rules):** Saat memberikan balasan hasil implementasi tugas ini, pastikan memberikan **NO EXPLANATION, CODE ONLY**. Cukup berikan output kode dari file yang dibuat atau dimodifikasi.
