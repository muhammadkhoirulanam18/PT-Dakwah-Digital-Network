# Panduan Deployment: PT Dakwah Digital Network

Dokumen ini berisi panduan teknis untuk melakukan deployment dan sinkronisasi antara **Laravel (Backend - Railway)** dan **Next.js (Frontend - Vercel)**.

## 1. Persiapan Backend (Railway)

Pastikan semua variabel di bawah ini sudah diatur pada tab **Variables** di dashboard Railway agar sistem autentikasi dan CORS berjalan lancar.

### Variabel Utama (Environment Variables)
| Key | Value (Contoh) | Keterangan |
| :--- | :--- | :--- |
| `APP_ENV` | `production` | Wajib untuk keamanan. |
| `APP_KEY` | `base64:xxxx...` | Bisa digenerate via `php artisan key:generate --show`. |
| `APP_URL` | `https://api-project.up.railway.app` | URL domain backend Anda sendiri. |
| `FRONTEND_URL` | `https://project.vercel.app` | **SANGAT PENTING.** URL domain Vercel Anda (Tanpa slash `/` di akhir). |
| `SANCTUM_STATEFUL_DOMAINS` | `project.vercel.app` | Domain Vercel tanpa `https://`. |
| `SESSION_DOMAIN` | `.railway.app` | Gunakan ini atau kosongkan jika ada masalah cookie. |
| `DB_CONNECTION` | `pgsql` | Railway menggunakan PostgreSQL secara default. |
| `OPENAI_API_KEY` | `sk-xxxx...` | Key OpenAI Anda untuk fitur generator. |

---

## 2. Persiapan Frontend (Vercel)

Tambahkan variabel ini di dashboard Vercel (**Settings > Environment Variables**).

| Key | Value (Contoh) | Keterangan |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api-project.up.railway.app` | URL backend Railway Anda. |

---

## 3. Penanganan Masalah CORS

Jika muncul error *“Blocked by CORS policy”* di konsol browser:

1.  **Cek URL Frontend**: Pastikan `FRONTEND_URL` di Railway sama persis dengan domain yang Anda buka di browser (termasuk `https://`).
2.  **Jangan Pakai Slash**: Pastikan tidak ada `/` di akhir URL pada variabel `FRONTEND_URL`. Contoh Salah: `https://app.vercel.app/`. Contoh Benar: `https://app.vercel.app`.
3.  **Restart Server**: Setelah mengubah variabel di Railway, tunggu proses redeploy atau klik *Restart* pada service tersebut.

---

## 4. Troubleshooting Autentikasi

Jika login berhasil tapi `/user` atau `/dashboard` mengembalikan error `401 Unauthorized`:

1.  **Bearer Token**: Pastikan token tersimpan di browser Cookies (`auth_token`).
2.  **Axios Config**: Kode frontend sudah diatur untuk mengirim header `Authorization: Bearer <token>`. Pastikan `baseURL` di `src/lib/axios.ts` sudah menyertakan prefix `/api`.
3.  **Sanctum Settings**: Pastikan `SANCTUM_STATEFUL_DOMAINS` sudah mencakup domain Vercel Anda.

---

## 5. Perintah Berguna (Railway CLI / Terminal)
Jika Anda memiliki akses terminal ke server:
```bash
# Membersihkan cache konfigurasi (Wajib setelah ganti variabel)
php artisan config:clear
php artisan route:clear

# Menjalankan migrasi database
php artisan migrate --force
```

---
*Dibuat untuk membantu Junior Programmer mempercepat proses go-live.*
