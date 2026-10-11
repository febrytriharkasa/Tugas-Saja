# Progress Proyek SMALISKA

**Tanggal pembaruan:** 9 Oktober 2026
**Dokumen acuan:** `PRD.md` versi 2.0

## Status Saat Ini

### Selesai

- Setup Laravel 13, React 18, Inertia.js 2, Tailwind CSS, Vite 7, MySQL, dan Laravel Breeze.
- Auth login dan register diperbarui mengikuti `DESIGN.md`.
- Skema konten dikonsolidasikan:
  - `posts` untuk berita, pengumuman, agenda, prestasi, fasilitas, dan cerita alumni.
  - `categories` untuk membedakan tipe konten.
  - `metadata` JSON untuk field khusus agenda, prestasi, dan cerita alumni.
  - `featured_image` opsional pada `posts`.
  - `staff` tetap terpisah untuk Guru, Tendik, dan GTK.
- Tabel dan model duplikat `agendas`, `achievements`, `facilities`, dan `testimonials` dihapus.
- Seeder data sekolah tersedia untuk users, categories, posts, pages, galleries, site settings, staff, dan chatbot.
- CRUD admin tersedia untuk:
  - Posts dan categories.
  - Pages.
  - Galleries.
  - Site settings.
  - Staff.
- Halaman publik tersedia untuk beranda, berita, detail post, laman statis, arsip, statistik, dan chatbot.
- Navbar publik tersedia dengan menu Beranda, Tentang Kami, Berita, Laman, Arsip, dan Statistik.
- Daftar navbar dibagikan secara global melalui `HandleInertiaRequests` agar tetap tersedia di halaman detail.
- Urutan dropdown Tentang Kami:
  1. Sejarah
  2. Visi, Misi dan Tujuan
  3. Sambutan
  4. Kerjasama
  5. Fasilitas
  6. Guru dan Tendik
  7. GTK
  8. Struktur Organisasi
- UI menggunakan palet emerald, cyan, amber, slate, Plus Jakarta Sans, rounded-lg/xl, dan shadow-card sesuai `DESIGN.md`.
- Build frontend berhasil dengan `npm run build`.
- Test login dan register berhasil.
- Pint berhasil untuk file yang diubah.
- Hero carousel dengan auto-slide dan fade transition pada halaman beranda.
- Quick-link cards (3 cards) dengan data dari site_settings.
- Chat widget dengan animasi framer-motion (open/close).
- Footer sticky dengan social media icons (Facebook, Instagram, YouTube, TikTok, WhatsApp, Twitter, LinkedIn).
- Admin settings dipisah menjadi 4 sub-halaman dengan dropdown menu:
  1. Hero Carousel Banner (`/admin/settings/hero`)
  2. Informasi Kontak & Tautan (`/admin/settings/contact`)
  3. Layanan Pintas (`/admin/settings/quick-links`)
  4. Media Sosial (`/admin/settings/social-media`)
- Setiap sub-halaman settings memiliki controller method dan route terpisah.

## Catatan Verifikasi

- `php artisan migrate:fresh --seed` berhasil.
- `npm run build` berhasil.
- Test autentikasi berhasil.
- `ExampleTest` bawaan masih gagal karena konfigurasi SQLite in-memory tidak membuat tabel `site_settings`. Test ini perlu diperbaiki agar menjalankan migrasi project.

## Pekerjaan Berikutnya Berdasarkan PRD

### Prioritas Tinggi

1. Tambahkan test feature untuk beranda, navbar global, arsip berdasarkan kategori, CRUD posts, dan upload gambar.
2. Perbaiki konfigurasi test database agar seluruh test menjalankan migrasi lengkap dan tidak gagal pada `site_settings`.
3. Tambahkan pencarian publik untuk berita dan pengumuman.
4. Tambahkan pagination dan filter kategori pada arsip publik.
5. Tambahkan rich text editor atau editor konten yang aman untuk posts dan pages.
6. Validasi dan tampilkan gambar `featured_image` pada daftar post, detail post, fasilitas, dan cerita alumni.

### Prioritas Rendah

1. Optimasi ukuran gambar saat upload.
2. Tambahkan dark mode hanya jika kebutuhan pengguna sudah jelas dan kedua tema dapat diverifikasi.
3. Tambahkan deployment configuration dan dokumentasi environment produksi.
4. Integrasikan OpenAI API jika chatbot rule-based tidak lagi mencukupi.

## Struktur Konten Saat Ini

| Tipe | Penyimpanan | Field khusus |
|---|---|---|
| Berita | `posts` + kategori `berita` | Tidak ada |
| Pengumuman | `posts` + kategori `pengumuman` | Tidak ada |
| Agenda | `posts` + kategori `agenda` | `event_date`, `location` |
| Prestasi | `posts` + kategori `prestasi` | `participant_name`, `rank`, `year` |
| Fasilitas | `posts` + kategori `fasilitas` | `featured_image` opsional |
| Cerita Alumni | `posts` + kategori `cerita-alumni` | `graduation_year`, `current_profession` |
| Guru dan Tendik | `staff` | `role`, `type`, `photo`, `email`, `phone` |

## Aturan Pembaruan Progress

Setiap pekerjaan baru dicatat di bagian status dan pekerjaan berikutnya. Item dipindahkan ke bagian selesai setelah implementasi dan verifikasi berhasil. `PRD.md` diperbarui jika arsitektur, rute, fitur, atau keputusan produk berubah.
