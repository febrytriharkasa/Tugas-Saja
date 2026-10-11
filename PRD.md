# PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Proyek:** Website Dinamis SMA Al Islam Krian (SMALISKA)
**Versi:** 2.0 (Revisi Arsitektur Konten Tunggal)
**Tanggal:** Oktober 2026

## 1. Ringkasan Eksekutif
Website resmi SMA Al Islam Krian (SMALISKA) dibangun ulang dengan arsitektur SPA Laravel + React + Inertia.js. Admin dapat mengelola seluruh konten (berita, pengumuman, agenda, prestasi, fasilitas, cerita alumni) melalui satu tabel `posts` dengan `metadata` JSON. Website publik mencakup landing page, arsip konten, halaman statis, statistik, dan chatbot AI. Tabel `staff` berdiri terpisah untuk data Guru dan Tendik.

## 2. Tech Stack
- **Backend:** Laravel 13 (PHP 8.3+)
- **Frontend:** React 18 + Inertia.js 2
- **Styling:** Tailwind CSS
- **Bundler:** Vite 7
- **Database:** MySQL
- **Scaffolding Auth:** Laravel Breeze
- **AI Integration:** Rule-based chatbot (demo tanpa API key eksternal, dapat diintegrasikan OpenAI kemudian)

## 3. Arsitektur Data: Satu Tabel Posts

Semua konten publik terbit (berita, pengumuman, agenda, prestasi, fasilitas, cerita alumni) disimpan di tabel `posts` dengan kolom `metadata` JSON untuk data spesifik per kategori.

| Kategori | Slug | Metadata |
|---|---|---|
| Berita | `berita` | - |
| Pengumuman | `pengumuman` | - |
| Agenda | `agenda` | `event_date`, `location` |
| Prestasi | `prestasi` | `participant_name`, `rank`, `year` |
| Cerita Alumni | `cerita-alumni` | `graduation_year`, `current_profession` |
| Fasilitas | `fasilitas` | - (gambar dari `featured_image`) |

Staff (Guru & Tendik) dikelola lewat tabel `staff` terpisah.

## 4. Skema Database

### 4.1 `users`
`id`, `name`, `email`, `password`, `role` (superadmin/admin/editor/viewer), `email_verified_at`, `timestamps`

### 4.2 `categories`
`id`, `name`, `slug` (unique), `timestamps`
Slug yang digunakan: `berita`, `pengumuman`, `agenda`, `prestasi`, `kegiatan`, `ekstrakurikuler`, `fasilitas`, `cerita-alumni`

### 4.3 `posts`
`id`, `user_id` (FK), `category_id` (FK), `title`, `slug` (unique), `content`, `metadata` (JSON, nullable), `featured_image` (VARCHAR, nullable), `status` (published/draft), `published_at`, `timestamps`

### 4.4 `pages`
`id`, `title`, `slug` (unique), `content`, `group` (tentang/laman), `is_published`, `timestamps`

Dropdown Tentang Kami di navbar diurutkan berdasarkan slug: sejarah, visi-misi-tujuan, sambutan, kerjasama, fasilitas, guru-tendik, gtk, struktur-organisasi

### 4.5 `galleries`
`id`, `title`, `media_type` (image/video), `file_path`, `timestamps`

### 4.6 `site_settings`
`id`, `key` (unique), `value` (TEXT), `type` (text/color/image/boolean), `group_name`, `updated_at`

Group yang digunakan: `general`, `hero`, `contact`, `statistics`, `links`

### 4.7 `chat_sessions` & `chat_messages`
`chat_sessions`: `id`, `session_token`, `created_at`
`chat_messages`: `id`, `chat_session_id` (FK), `role` (user/assistant), `content` (TEXT), `created_at`

### 4.8 `staff`
`id`, `name`, `role`, `type` (guru/tendik/gtk), `photo`, `email`, `phone`, `timestamps`

## 5. Rute Publik & Admin

### Rute Publik
| Method | URI | Deskripsi |
|---|---|---|
| GET | `/` | Beranda (Welcome page, 10 sections) |
| GET | `/berita` | Daftar berita |
| GET | `/berita/{slug}` | Detail berita/post |
| GET | `/laman/{slug}` | Halaman statis |
| GET | `/arsip/{type}` | Arsip (berita/pengumuman/agenda/prestasi/galeri) |
| GET | `/statistik` | Statistik sekolah |
| POST | `/api/chat` | Chatbot AI |

### Rute Admin (middleware auth+verified)
`/admin/dashboard`, `/admin/posts` (CRUD), `/admin/pages` (CRUD), `/admin/categories` (CRUD), `/admin/galleries`, `/admin/content` (staff), `/admin/settings/hero`, `/admin/settings/contact`, `/admin/settings/quick-links`, `/admin/settings/social-media`

## 6. Spesifikasi UI/UX

- **Font:** Plus Jakarta Sans
- **Warna:** Emerald primary (#065F46), Cyan secondary (#0891B2), Amber tertiary (#D97706), Surface canvas (#F8FAFC)
- **Layout Auth:** Split panel emerald kiri (info) + form kanan, card putih dengan shadow-card
- **Input:** rounded-lg, border emerald focus, min-h-11 untuk tap target
- **Navbar:** 6 menu (Beranda, Tentang Kami, Berita, Laman, Arsip, Statistik)
- **Dropdown:** hover-triggered, visible opacity
- **Responsif:** md:flex navbar desktop, hamburger mobile
- **Admin Settings:** Dropdown menu di sidebar dengan 4 sub-halaman terpisah:
  1. Hero Carousel Banner (slide 1, slide 2, warna background)
  2. Informasi Kontak & Tautan (telepon, email, alamat, link PPDB)
  3. Layanan Pintas (3 quick-link cards dengan judul, deskripsi, URL)
  4. Media Sosial (7 platform: Facebook, Instagram, Twitter, YouTube, LinkedIn, WhatsApp, TikTok)
- **Footer:** Sticky di bawah, site name + tagline, contact info, social media icons (baris baru kiri), links di kanan

## 7. Fitur AI Chatbot
Widget floating chat di sudut kanan bawah. Menggunakan logic rule-based sederhana yang membaca keyword (ppdb, alamat, kontak, program). Session tracking via UUID token di localStorage.

## 8. Roadmap Pengembangan
- **Fase 1:** Setup (Laravel, Breeze, React, Vite, Tailwind) -- SELESAI
- **Fase 2:** Database schema, model, seeder -- SELESAI
- **Fase 3:** Backend CRUD (posts, pages, categories, galleries, settings, staff) -- SELESAI
- **Fase 4:** Frontend publik (Welcome, Archive, Page, Statistics) -- SELESAI
- **Fase 5:** Frontend admin (Dashboard, Posts, Pages, Categories, Galleries, Settings, Content/Staff) -- SELESAI
- **Fase 6:** UI auth sesuai design.md -- SELESAI
- **Fase 7:** Chatbot AI widget -- SELESAI
- **Fase 8:** SEO, SSR, deployment -- TERSISA
- **Fase 9:** Optimasi gambar (upload/resize), dark mode toggle -- TERSISA
- **Fase 10:** Paginated archive, search -- TERSISA