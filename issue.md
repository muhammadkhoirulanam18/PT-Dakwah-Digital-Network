# Issue: Investigasi "Connection error: Network Error" di Production

## 📌 Konteks Masalah
Aplikasi mengalami `Connection error: Network Error` saat melakukan request dari Frontend (Vercel) ke Backend (Railway). Database juga di-host di Railway. Secara level kode (konfigurasi Axios, pengaturan CORS di `cors.php`, dan routing API), perbaikan telah dilakukan dan sudah dipastikan menggunakan *best practice*. Namun, error ini masih muncul, yang mengindikasikan adanya masalah konfigurasi pada tingkat infrastruktur (environment variables) atau konektivitas antar-layanan.

## 🎯 Tujuan Tugas
Tugas Anda (Junior Programmer / AI) adalah memeriksa, mengidentifikasi, dan memperbaiki konfigurasi deployment di **Vercel** dan **Railway** agar Frontend dapat berkomunikasi dengan Backend tanpa terhalang *Network Error* atau isu CORS.

---

## 🔍 Kemungkinan Penyebab (Hipotesis)

1.  **Mismatch Environment Variables:** `NEXT_PUBLIC_API_URL` di Vercel mungkin salah ketik, masih menggunakan `http://localhost`, atau menggunakan HTTP (bukan HTTPS).
2.  **CORS Terblokir Penuh:** `FRONTEND_URL` di Railway mungkin tidak persis sama dengan domain asal (origin) Vercel.
3.  **Backend Gagal Start / Crash:** Aplikasi Laravel di Railway mungkin gagal berjalan karena konfigurasi Database yang salah, sehingga endpoint API benar-benar mati.
4.  **Mixed Content Policy:** Browser memblokir koneksi karena frontend berjalan di HTTPS (Vercel) namun mencoba mengakses backend lewat HTTP biasa.

---

## 🛠️ Rencana Aksi (Action Plan) / Langkah Pemeriksaan

Harap ikuti langkah-langkah investigasi berikut secara berurutan:

### Tahap 1: Verifikasi Kondisi Backend (Railway)
1. **Cek Status Service**: Buka dashboard Railway, pastikan service backend berstatus **Active** (warna hijau).
2. **Cek Endpoint Manual**: Coba akses URL backend langsung dari browser Anda. Tambahkan path `/api/health` jika ada, atau sekadar akses root domainnya (contoh: `https://pt-dakwah-backend.up.railway.app/api/health`).
    - *Ekspektasi*: Muncul respon JSON atau halaman kosong tanpa error "Site not found".
3. **Cek Variabel Railway (Tab Variables)**:
    - Pastikan `FRONTEND_URL` berisi URL Vercel secara eksak. Contoh benar: `https://pt-dakwah.vercel.app` (TANPA trailing slash `/` di akhir).
    - Pastikan `SANCTUM_STATEFUL_DOMAINS` berisi domain tanpa protokol. Contoh benar: `pt-dakwah.vercel.app`.
    - Pastikan variabel koneksi database (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) terisi dengan benar sesuai kredensial database yang diberikan oleh Railway (biasanya tersedia di tab "Variables" milik service PostgreSQL/MySQL di Railway).
4. **Cek Log Deployment (Tab Deployments -> View Logs)**:
    - Cari pesan error terkait gagal terhubung ke database.
    - Pastikan perintah `php artisan migrate --force` sukses dijalankan di awal log.

### Tahap 2: Verifikasi Kondisi Frontend (Vercel)
1. **Cek Variabel Vercel**: Buka dashboard Vercel -> Project -> Settings -> Environment Variables.
2. **Validasi `NEXT_PUBLIC_API_URL`**:
    - Harus diawali dengan `https://` (wajib, jangan HTTP).
    - Harus berupa URL Railway backend Anda.
    - Jangan menggunakan akhiran slash `/` atau `/api`. Contoh benar: `https://pt-dakwah-backend.up.railway.app`.
3. **Redeploy**: Jika Anda baru saja mengubah variabel di Vercel, pastikan Anda melakukan **Redeploy** agar frontend di-build ulang menggunakan variabel terbaru.

### Tahap 3: Inspeksi Lewat Browser (DevTools)
Jika Tahap 1 & 2 sudah benar namun masih error:
1. Buka halaman frontend Anda di Chrome/Edge/Firefox.
2. Tekan `F12` (atau klik kanan -> Inspect), lalu buka tab **Console** dan **Network**.
3. Coba lakukan *Register* atau *Login*.
4. **Analisis Pesan**:
    - Jika tab *Console* merah dengan tulisan `CORS policy: No 'Access-Control-Allow-Origin' header is present`, berarti masalah ada di `FRONTEND_URL` Railway yang belum terdeteksi.
    - Jika tab *Console* merah dengan pesan `Mixed Content`, berarti URL Backend di Vercel masih menggunakan `http://`.
    - Jika tab *Network* menunjukkan status `500 Internal Server Error`, berarti backend gagal memproses (kemungkinan besar masalah koneksi database). Cek log Railway.

---

## 📝 Instruksi Tambahan untuk Junior/AI

-   **Dilarang mengubah kode secara sembarangan**: Sebelum memodifikasi `axios.ts` atau file `cors.php`, pastikan Anda sudah melakukan inspeksi via browser (Tahap 3). Struktur kode saat ini sudah diatur menggunakan standar *best practice*.
-   **Laporkan Hasil**: Silakan update dokumen ini atau tambahkan komentar dengan hasil *screenshot* tab *Network/Console* jika error belum terpecahkan.
