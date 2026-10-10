# SMALISKA Web

Portal sekolah SMA Al Islam Krian. Dibangun dengan Laravel, Inertia React, Tailwind CSS, dan MySQL atau SQLite.

## Kebutuhan

- PHP 8.3 atau lebih baru
- Composer 2
- Node.js 20 atau lebih baru
- npm
- MySQL 8 jika memakai MySQL

## Instalasi

```bash
git clone <repository-url>
cd sekolah-web
composer install
npm install
copy .env.example .env
php artisan key:generate
```

Di macOS atau Linux, ganti `copy` dengan:

```bash
cp .env.example .env
```

## Konfigurasi lingkungan

Atur nilai berikut pada `.env`:

```env
APP_NAME=SMALISKA
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=id
APP_FALLBACK_LOCALE=id
APP_FAKER_LOCALE=id_ID

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smaliska
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public
```

Jangan commit file `.env`. Isi `APP_KEY`, kredensial database, dan konfigurasi produksi hanya di server atau secret manager.

### Opsi SQLite

Untuk pengembangan tanpa MySQL:

```env
DB_CONNECTION=sqlite
```

Pastikan file `database/database.sqlite` tersedia, lalu jalankan migrasi.

### Opsi MySQL

Buat database terlebih dahulu:

```sql
CREATE DATABASE smaliska CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Lalu isi `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` pada `.env`.

## Database dan data awal

Jalankan migrasi dan seeder utama:

```bash
php artisan migrate --seed
```

Untuk menghapus seluruh tabel, membuat ulang skema, lalu mengisi ulang data awal:

```bash
php artisan migrate:fresh --seed
```

Perintah `migrate:fresh` menghapus seluruh data database aktif.

Seeder utama membuat akun admin, kategori, pengaturan situs, halaman, konten contoh, staf, dan galeri.

### Akun dummy

| Email | Password | Role |
| --- | --- | --- |
| `admin@smaliska.sch.id` | `password` | superadmin |
| `humas@smaliska.sch.id` | `password` | admin |
| `it@smaliska.sch.id` | `password` | admin |

Ganti password dummy sebelum deployment.

### Dummy post dengan tabel data

Jalankan seeder berikut untuk membuat tiga post dengan tabel pada metadata:

```bash
php artisan db:seed --class=DummyPostWithTableSeeder
```

Data dibuat atau diperbarui berdasarkan slug untuk kategori:

- Prestasi: hasil Olimpiade Sains
- Pengumuman: hasil seleksi delegasi kompetisi
- Ekstrakurikuler: perolehan medali Tapak Suci

Setiap tabel disimpan pada `metadata.achievement_table` dengan struktur berikut:

```json
{
  "achievement_table": [
    {
      "name": "Nama peserta atau kelas",
      "rank": "Juara atau peringkat",
      "event": "Lomba atau keterangan"
    }
  ]
}
```

## Penyimpanan gambar

Post dan galeri memakai disk `public`. Buat symbolic link sekali setelah instalasi:

```bash
php artisan storage:link
```

## Menjalankan aplikasi

Untuk menjalankan Laravel dan Vite bersamaan:

```bash
composer run dev
```

Atau jalankan terpisah:

```bash
php artisan serve
npm run dev
```

Build aset produksi:

```bash
npm run build
```

## Pengelolaan konten

1. Masuk melalui `/login` memakai akun admin.
2. Buka menu admin untuk membuat kategori, post, halaman, galeri, staf, dan pengaturan situs.
3. Pada form post, aktifkan **Tabel Data (Opsional)** bila konten membutuhkan daftar terstruktur.
4. Isi kolom Nama, Peringkat, dan Keterangan. Tambahkan atau hapus baris sesuai kebutuhan.
5. Terbitkan post agar tampil pada halaman publik.

Tabel dapat dipakai pada kategori apa pun. Halaman detail post menampilkan tabel otomatis bila `metadata.achievement_table` berisi data.

## Pengujian dan format kode

```bash
php artisan test
vendor/bin/pint --format agent
npm run build
```

## Struktur penting

```text
app/Http/Controllers/Admin/PostController.php  Validasi dan simpan post
resources/js/Pages/Admin/Posts/Form.jsx        Form post dan editor tabel
resources/js/Pages/Public/PostDetail.jsx       Tampilan detail post publik
database/seeders/DatabaseSeeder.php            Data awal aplikasi
database/seeders/DummyPostWithTableSeeder.php  Data dummy tabel post
```
