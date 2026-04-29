# Laporan Review & Testing: Fitur Register dan Login

## 1. Status Code Backend (`AuthController.php` & `User.php`)
Secara logika, struktur kode untuk register dan login pada backend sudah **sangat baik** dan mengikuti standar Laravel Sanctum.

- **Register:** Validasi berjalan dengan baik, menggunakan `Hash::make()` untuk password, dan token digenerate menggunakan `$user->createToken('auth_token')->plainTextToken`.
- **Login:** Menggunakan `Auth::attempt()`, menghapus token lama (`$user->tokens()->delete()`) untuk memastikan single-session, dan token digenerate dengan benar.
- **Model User (`User.php`):** Menggunakan fitur attribute PHP modern `#[Fillable(['name', 'email', 'password'])]` (didukung di Laravel versi terbaru).

## 2. Kendala Testing Saat Ini (Blocker)
Saat ini simulasi End-to-End (E2E) dengan membuat akun secara langsung tidak dapat dilakukan oleh sistem otomatis karena *environment variable* (PATH) untuk mengeksekusi PHP (`php artisan serve`) tidak terdeteksi di terminal sistem saya saat ini.

## 3. Tugas untuk Junior Programmer / Tim QA
Tolong lakukan pengecekan manual secara lokal (di PC Anda) untuk memastikan integrasi berjalan lancar. Ikuti langkah-langkah berikut:

### A. Persiapan Lingkungan
1. Buka terminal di folder `backend`, lalu jalankan: `php artisan migrate:fresh`
2. Jalankan server backend lokal: `php artisan serve --port=8000`
3. Buka terminal baru di folder `frontend`, lalu jalankan: `npm run dev`

### B. Skenario Pengujian (Test Cases)
*   **[ ] Test Case 1: Registrasi Berhasil**
    *   Buka browser ke `http://localhost:3000/register`.
    *   Isi nama, email yang belum pernah didaftarkan, password, dan konfirmasi password.
    *   *Ekspektasi:* Anda diarahkan ke `/dashboard` dan data tersimpan di database. Token tersimpan di *cookies* (cek via Inspect Element -> Application -> Cookies).
*   **[ ] Test Case 2: Registrasi Gagal (Validasi Email)**
    *   Ulangi form register, gunakan email yang **sama** dengan Test Case 1.
    *   *Ekspektasi:* Muncul pesan error "The email has already been taken" di bawah kolom email.
*   **[ ] Test Case 3: Registrasi Gagal (Password Mismatch)**
    *   Isi password dan konfirmasi password dengan teks yang berbeda.
    *   *Ekspektasi:* Muncul pesan error terkait konfirmasi password yang tidak cocok.
*   **[ ] Test Case 4: Login Berhasil**
    *   Buka `http://localhost:3000/login`.
    *   Gunakan email dan password dari Test Case 1.
    *   *Ekspektasi:* Diarahkan ke `/dashboard`, token baru ter-set di *cookies*.
*   **[ ] Test Case 5: Login Gagal**
    *   Gunakan password yang salah sembarang.
    *   *Ekspektasi:* Muncul pesan error "The provided credentials are incorrect".

### C. Potensi Isu Tambahan (SUDAH DIPERBAIKI ✅)
1. **Keamanan Cookie Frontend:** Telah ditambahkan flag `secure: process.env.NODE_ENV === 'production'` pada file `login/page.tsx` dan `register/page.tsx`.

### D. Isu Produksi (CORS & Domain) - HARAP DIPERBAIKI OLEH JUNIOR PROGRAMMER
Saat ini terjadi kendala **CORS (Cross-Origin Resource Sharing)** saat mencoba melakukan register/login dari frontend (Vercel) ke backend (Railway). Backend menolak request karena origin Vercel belum diizinkan.

**Tugas Perbaikan:**
1. Login ke dashboard **Railway**.
2. Buka project backend Laravel, masuk ke tab **Variables**.
3. Pastikan variabel `FRONTEND_URL` telah diisi dengan URL Vercel yang benar (misal: `https://pt-dakwah-frontend.vercel.app`). *Penting: Jangan tambahkan garis miring `/` di akhir URL*.
4. Pastikan variabel `SANCTUM_STATEFUL_DOMAINS` telah diisi dengan domain Vercel **tanpa awalan https://** (misal: `pt-dakwah-frontend.vercel.app`).
5. Karena sebelumnya `config/cors.php` telah diubah untuk membaca `env('FRONTEND_URL')`, perubahan variabel ini di Railway akan otomatis mengizinkan request dari Vercel setelah server *restart*.

Silakan *checklist* kotak-kotak di atas jika sudah berhasil diuji. Jika ada *Test Case* yang gagal (berperilaku berbeda dari ekspektasi), silakan debug di sisi controller Laravel atau file Axios frontend.
