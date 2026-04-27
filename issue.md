# Issue: Create database schema for sales_pages in Laravel

## Description
Create database schema for sales_pages in Laravel.

## Environment
* Database runs in Docker (MySQL container)

## Tasks
* Create migration and model
* Fields:
  * `user_id` (foreign key)
  * `product_name`
  * `description`
  * `features` (text or JSON)
  * `audience`
  * `price`
  * `usp`
  * `generated_content` (JSON)

## Rules
* Use proper foreign key constraint
* Use JSON type where appropriate
* Ensure compatible with MySQL
* No explanation, code only

---

## Detailed Implementation Steps
*(Panduan ini ditujukan untuk Junior Programmer atau AI Model untuk memandu proses implementasi yang terstruktur).*

### Tahap 1: Generate Model dan Migration
Jalankan perintah Artisan di dalam container Docker (misalnya menggunakan Laravel Sail atau docker exec) untuk men-generate model `SalesPage` beserta file migration-nya sekaligus.
*   **Target File:** Tidak ada, command line eksekusi.
*   **Aksi:** Jalankan `php artisan make:model SalesPage -m`

### Tahap 2: Mendefinisikan Schema Migration
Buka file migration yang baru saja dibuat di dalam folder `database/migrations/`. 
*   **Target File:** `database/migrations/YYYY_MM_DD_HHMMSS_create_sales_pages_table.php`
*   **Aksi:** Pada method `up()`, definisikan kolom-kolom berikut di dalam blok `Schema::create`:
    *   `foreignId('user_id')->constrained()->cascadeOnDelete();` (Tipe foreign key yang mengacu ke tabel `users`).
    *   `string('product_name');`
    *   `text('description')->nullable();`
    *   `json('features')->nullable();` (Gunakan tipe JSON untuk kompatibilitas dengan MySQL).
    *   `string('audience')->nullable();`
    *   `decimal('price', 15, 2)->nullable();` (Tipe decimal sangat disarankan untuk harga).
    *   `string('usp')->nullable();`
    *   `json('generated_content')->nullable();` (Gunakan tipe JSON).

### Tahap 3: Konfigurasi Model `SalesPage`
Buka file model `SalesPage` untuk mengizinkan mass assignment, mengkonversi tipe data JSON, dan mendefinisikan relasi ke model `User`.
*   **Target File:** `app/Models/SalesPage.php`
*   **Aksi:**
    1.  Tambahkan properti `protected $fillable = [...]` yang berisi array dari nama-nama kolom di atas (user_id, product_name, description, features, audience, price, usp, generated_content).
    2.  Tambahkan fungsi method `casts(): array` (atau properti `$casts`) untuk melakukan casting otomatis pada field JSON ke tipe data array. Contoh: `'features' => 'array'`, `'generated_content' => 'array'`.
    3.  Buat public method bernama `user()` yang mereturn `$this->belongsTo(User::class);`.

### Tahap 4: Update Model `User` (Opsional, Best Practice)
Meskipun tidak diwajibkan secara eksplisit, menambahkan relasi kebalikan pada model `User` adalah best practice di Laravel.
*   **Target File:** `app/Models/User.php`
*   **Aksi:** Tambahkan public method bernama `salesPages()` yang mereturn `$this->hasMany(SalesPage::class);`.

### Tahap 5: Jalankan Migration
Eksekusi file migration untuk membuat tabel di dalam database MySQL.
*   **Target File:** Tidak ada, command line eksekusi.
*   **Aksi:** Jalankan `php artisan migrate`

---
**Peringatan Tambahan (Sesuai Rules):** Saat memberikan balasan hasil implementasi tugas ini, pastikan memberikan **NO EXPLANATION, CODE ONLY**. Cukup berikan output kode dari file yang dibuat atau dimodifikasi.
