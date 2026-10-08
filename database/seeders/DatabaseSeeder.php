<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Gallery;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([UserSeeder::class]);

        $admin = User::where('email', 'admin@smaliska.sch.id')->first();
        $humas = User::where('email', 'humas@smaliska.sch.id')->first();

        // 1. Categories (semua konten lewat posts)
        $catBerita = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);
        $catPengumuman = Category::firstOrCreate(['slug' => 'pengumuman'], ['name' => 'Pengumuman']);
        $catAgenda = Category::firstOrCreate(['slug' => 'agenda'], ['name' => 'Agenda']);
        $catPrestasi = Category::firstOrCreate(['slug' => 'prestasi'], ['name' => 'Prestasi']);
        $catFasilitas = Category::firstOrCreate(['slug' => 'fasilitas'], ['name' => 'Fasilitas']);
        $catAlumni = Category::firstOrCreate(['slug' => 'cerita-alumni'], ['name' => 'Cerita Alumni']);
        $catKegiatan = Category::firstOrCreate(['slug' => 'kegiatan'], ['name' => 'Kegiatan Sekolah']);
        $catEkstra = Category::firstOrCreate(['slug' => 'ekstrakurikuler'], ['name' => 'Ekstrakurikuler']);

        // 2. Site Settings
        $settings = [
            ['key' => 'site_name',       'value' => 'SMA Al Islam Krian',                                      'type' => 'text',  'group_name' => 'general'],
            ['key' => 'site_tagline',    'value' => 'Berakhlak Mulia, Berprestasi Tinggi, Berwawasan Global',  'type' => 'text',  'group_name' => 'general'],
            ['key' => 'hero_title',      'value' => 'Membentuk Generasi Rabbani & Berprestasi',                'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_subtitle',   'value' => 'Selamat Datang di Portal Resmi SMA Al Islam Krian (SMALISKA). Pendidikan Islam modern berbasis teknologi & akhlakul karimah di Sidoarjo.', 'type' => 'text', 'group_name' => 'hero'],
            ['key' => 'hero_background', 'value' => '#065F46',                                                 'type' => 'color', 'group_name' => 'hero'],
            ['key' => 'contact_phone',   'value' => '(031) 8971234',                                           'type' => 'text',  'group_name' => 'contact'],
            ['key' => 'contact_email',   'value' => 'info@smaliska.sch.id',                                    'type' => 'text',  'group_name' => 'contact'],
            ['key' => 'contact_address', 'value' => 'Jl. Kyai Mojo No. 1, Krian, Sidoarjo, Jawa Timur 61262', 'type' => 'text',  'group_name' => 'contact'],
            ['key' => 'ppdb_link',       'value' => 'https://ppdb.smaliska.sch.id',                            'type' => 'text',  'group_name' => 'links'],
            ['key' => 'welcome_message', 'value' => "Assalamu'alaikum Wr. Wb. Segala puji syukur kami panjatkan ke hadirat Allah SWT atas rahmat dan hidayah-Nya sehingga SMA Al Islam Krian terus konsisten menjadi pelopor sekolah Islam berprestasi di Jawa Timur. Kami memadukan Kurikulum Merdeka dengan pendidikan karakter Al-Qur'an dan penguasaan teknologi digital modern untuk menyiapkan lulusan yang siap bersaing secara global.", 'type' => 'text', 'group_name' => 'general'],
            ['key' => 'principal_name',  'value' => 'Dr. H. Ahmad Dahlan, M.Pd.',                             'type' => 'text',  'group_name' => 'general'],
            ['key' => 'principal_photo', 'value' => '',                                                        'type' => 'image', 'group_name' => 'general'],
            ['key' => 'total_students',  'value' => '850+',                                                    'type' => 'text',  'group_name' => 'statistics'],
            ['key' => 'total_teachers',  'value' => '45',                                                      'type' => 'text',  'group_name' => 'statistics'],
            ['key' => 'total_staff',     'value' => '18',                                                      'type' => 'text',  'group_name' => 'statistics'],
            ['key' => 'year_founded',    'value' => '1978',                                                    'type' => 'text',  'group_name' => 'statistics'],
        ];
        foreach ($settings as $s) {
            SiteSetting::updateOrCreate(['key' => $s['key']], $s);
        }

        // 3. Pages
        $pages = [
            ['title' => 'Sejarah', 'slug' => 'sejarah', 'group' => 'tentang', 'is_published' => true,
                'content' => "SMA Al Islam Krian didirikan pada tahun 1978 di bawah naungan Yayasan Pendidikan Al Islam Krian. Berawal dari niat suci para tokoh masyarakat dan ulama setempat untuk menghadirkan lembaga pendidikan tingkat menengah atas yang bernafaskan Islam.\n\nSeiring berjalannya waktu, SMALISKA tumbuh pesat dari sekolah berbasis komunitas menjadi salah satu SMA swasta rujukan terfavorit di Kabupaten Sidoarjo. Dengan akreditasi A (Unggul), SMALISKA kini memiliki laboratorium komputer canggih, masjid megah, serta jaringan alumni yang tersebar di perguruan tinggi ternama dan berbagai industri nasional."],
            ['title' => 'Visi, Misi dan Tujuan', 'slug' => 'visi-misi-tujuan', 'group' => 'tentang', 'is_published' => true,
                'content' => "VISI:\n\"Terwujudnya Generasi Rabbani yang Berakhlak Mulia, Unggul dalam IPTEK, Berwawasan Global, dan Berbudaya Lingkungan.\"\n\nMISI:\n1. Menyelenggarakan pendidikan berbasis karakter Al-Qur'an dan As-Sunnah.\n2. Mengembangkan kurikulum merdeka terintegrasi teknologi informasi dan komunikasi.\n3. Meningkatkan prestasi akademik dan non-akademik siswa di tingkat nasional dan internasional.\n4. Membina kemampuan berbahasa asing (Arab & Inggris) secara aktif.\n5. Mewujudkan lingkungan sekolah yang bersih, hijau, dan kondusif bagi pembelajaran."],
            ['title' => 'Sambutan', 'slug' => 'sambutan', 'group' => 'tentang', 'is_published' => true,
                'content' => "Assalamu'alaikum Wr. Wb.\n\nSelamat datang di website resmi SMA Al Islam Krian. Sebagai institusi pendidikan Islam modern, kami berkomitmen untuk memberikan layanan pendidikan terbaik yang menyeimbangkan antara kecerdasan intelektual (IQ), kecerdasan emosional (EQ), dan kecerdasan spiritual (SQ).\n\nWassalamu'alaikum Wr. Wb.\n\nDr. H. Ahmad Dahlan, M.Pd."],
            ['title' => 'Kerjasama', 'slug' => 'kerjasama', 'group' => 'tentang', 'is_published' => true,
                'content' => "SMA Al Islam Krian menjalin kerjasama strategis dengan:\n\n1. Universitas Airlangga (UNAIR) - Pembinaan Olimpiade Sains\n2. Institut Teknologi Sepuluh Nopember (ITS) - Pelatihan Coding & Robotika\n3. Markaz Lughah Al-Arabiyah Cairo - Sertifikasi Bahasa Arab\n4. Ruangguru - Kemitraan Pembelajaran Digital\n5. PT PLN & Bank Syariah Indonesia - Beasiswa Pendidikan"],
            ['title' => 'Fasilitas', 'slug' => 'fasilitas', 'group' => 'tentang', 'is_published' => true,
                'content' => 'SMALISKA menyediakan ruang kelas nyaman, laboratorium komputer dan IPA, perpustakaan digital, masjid, lapangan olahraga, serta studio multimedia untuk mendukung pembelajaran dan pengembangan bakat siswa.'],
            ['title' => 'Guru dan Tendik', 'slug' => 'guru-tendik', 'group' => 'tentang', 'is_published' => true,
                'content' => 'Guru dan tenaga kependidikan SMALISKA terdiri dari pendidik profesional dan staf layanan sekolah yang mendukung proses akademik, administrasi, serta pengembangan karakter siswa.'],
            ['title' => 'GTK', 'slug' => 'gtk', 'group' => 'tentang', 'is_published' => true,
                'content' => 'SMALISKA didukung oleh 45 Guru berkualifikasi S1 & S2 lulusan PTN terkemuka (UNAIR, ITS, UNESA, UINSA) serta 18 Tenaga Kependidikan profesional.'],
            ['title' => 'Struktur Organisasi', 'slug' => 'struktur-organisasi', 'group' => 'tentang', 'is_published' => true,
                'content' => "- Ketua Yayasan: H. Muhammad Ridwan, M.M.\n- Kepala Sekolah: Dr. H. Ahmad Dahlan, M.Pd.\n- Waka Kurikulum: Rina Wulandari, M.Si.\n- Waka Kesiswaan: M. Rizky Pratama, S.Pd.\n- Waka Humas: Siti Aminah, S.Pd.\n- Kepala TU: Budi Santoso, S.Kom."],
            ['title' => 'Petunjuk Pendaftaran PPDB', 'slug' => 'petunjuk-ppdb', 'group' => 'laman', 'is_published' => true,
                'content' => "1. Akses portal https://ppdb.smaliska.sch.id\n2. Buat akun dengan NIK & Email aktif.\n3. Isi formulir dan unggah berkas (Rapor SMP, Akta Lahir, KK).\n4. Pilih jalur: Prestasi Akademik, Tahfidz, atau Reguler.\n5. Bayar biaya pendaftaran via BSI/Transfer Bank.\n6. Ikuti tes pemetaan potensi & wawancara karakter."],
            ['title' => 'Program Unggulan Tahfidz', 'slug' => 'program-tahfidz', 'group' => 'laman', 'is_published' => true,
                'content' => "Program Tahfidzul Qur'an SMALISKA:\n- Target hafalan 3-5 Juz selama 3 tahun.\n- Pembimbing Hafiz & Hafizah bersertifikat Sanad.\n- Setoran hafalan harian sebelum jam KBM.\n- Wisuda Tahfidz tahunan dengan ijazah resmi yayasan."],
        ];
        foreach ($pages as $p) {
            Page::updateOrCreate(['slug' => $p['slug']], $p);
        }

        // 4. Posts - Berita
        $beritaData = [
            [
                'title' => 'Penerimaan Peserta Didik Baru (PPDB) TA 2026/2027 Resmi Dibuka',
                'slug' => 'ppdb-2026-2027-dibuka',
                'category_id' => $catPengumuman->id,
                'content' => "SMA Al Islam Krian resmi membuka PPDB Gelombang I untuk TA 2026/2027.\n\nPotongan biaya khusus dan beasiswa penuh tersedia bagi calon siswa hafal Al-Qur'an minimal 3 Juz atau juara Olimpiade tingkat kabupaten.\n\nPendaftaran 1 Oktober – 31 Desember 2026 via website atau datang langsung ke sekretariat PPDB.",
                'status' => 'published', 'published_at' => now(),
            ],
            [
                'title' => 'Siswa SMALISKA Raih Medali Emas OSN Matematika & Fisika 2026',
                'slug' => 'emas-osn-matematika-fisika-2026',
                'category_id' => $catBerita->id,
                'content' => "Dua siswa SMALISKA meraih Medali Emas dalam OSN tingkat Kabupaten Sidoarjo.\n\nJuara 1 Matematika: Muhammad Farhan (XI MIPA 1). Juara 1 Fisika: Nabilah Putri (XII MIPA 2).\n\nKeduanya lolos mewakili Sidoarjo ke tingkat Provinsi Jawa Timur.",
                'status' => 'published', 'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Pesantren Kilat Ramadhan 1447 H Berlangsung Khidmat',
                'slug' => 'pesantren-kilat-ramadhan-1447h',
                'category_id' => $catKegiatan->id,
                'content' => "Pesantren Kilat Ramadhan 1447 H diikuti seluruh siswa kelas X dan XI. Kegiatan meliputi kajian fiqih, tahsin Al-Qur'an, qiyamul lail, dan bakti sosial pembagian takjil.",
                'status' => 'published', 'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Workshop Digital Innovation: Belajar React & Laravel',
                'slug' => 'workshop-react-laravel',
                'category_id' => $catBerita->id,
                'content' => "Lab Komputer SMALISKA menggelar Workshop Web Development bertema 'Building Modern Web Apps with React & Laravel' diikuti 50 siswa Klub Coding. Narasumber alumni SMALISKA yang kini Senior Software Engineer.",
                'status' => 'published', 'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Tim Futsal SMALISKA Juara 1 Sidoarjo High School Cup 2026',
                'slug' => 'futsal-juara-1-sidoarjo-cup-2026',
                'category_id' => $catEkstra->id,
                'content' => 'Tim Futsal SMALISKA meraih Juara 1 menundukkan SMAN 1 Krian di final dengan skor 3-2. Kapten tim sekaligus meraih penghargaan Best Player.',
                'status' => 'published', 'published_at' => now()->subDays(15),
            ],
            [
                'title' => 'Pengumuman Pelaksanaan Ulangan Tengah Semester (UTS) Ganjil',
                'slug' => 'pengumuman-uts-ganjil-2026',
                'category_id' => $catPengumuman->id,
                'content' => 'UTS Ganjil TA 2026/2027 dilaksanakan 15–22 Oktober 2026 berbasis Computer Based Test (CBT). Kartu ujian diambil di wali kelas mulai Senin mendatang.',
                'status' => 'published', 'published_at' => now()->subDays(3),
            ],
        ];

        // 5. Posts - Agenda (dengan metadata event_date & location)
        $agendaData = [
            [
                'title' => 'Pertemuan Wali Murid & Pembagian Lapor Mid Semester',
                'slug' => 'pertemuan-wali-murid-mid-semester',
                'category_id' => $catAgenda->id,
                'content' => 'Sosialisasi perkembangan belajar siswa serta penerimaan laporan hasil belajar pertengahan semester ganjil.',
                'metadata' => ['event_date' => now()->addDays(7)->toDateString(), 'location' => 'Aula Utama SMALISKA'],
                'status' => 'published', 'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Ulangan Tengah Semester (UTS) Ganjil 2026',
                'slug' => 'agenda-uts-ganjil-2026',
                'category_id' => $catAgenda->id,
                'content' => 'Pelaksanaan ujian tertulis dan praktikum CBT untuk seluruh kelas X, XI, dan XII.',
                'metadata' => ['event_date' => now()->addDays(14)->toDateString(), 'location' => 'Ruang Ujian CBT SMALISKA'],
                'status' => 'published', 'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Peringatan Hari Santri Nasional & Pawai Taaruf',
                'slug' => 'hari-santri-nasional-2026',
                'category_id' => $catAgenda->id,
                'content' => 'Upacara bendera peringatan Hari Santri dilanjutkan pawai taaruf keliling Krian.',
                'metadata' => ['event_date' => now()->addDays(25)->toDateString(), 'location' => 'Lapangan Utama SMALISKA'],
                'status' => 'published', 'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Try Out Ujian Mandiri & SNBT 2027 Serentak',
                'slug' => 'tryout-snbt-2027',
                'category_id' => $catAgenda->id,
                'content' => 'Simulasi ujian masuk PTN bagi siswa kelas XII bekerjasama dengan lembaga bimbingan belajar nasional.',
                'metadata' => ['event_date' => now()->addDays(35)->toDateString(), 'location' => 'Lab Komputer 1, 2, dan 3'],
                'status' => 'published', 'published_at' => now()->subDays(4),
            ],
            [
                'title' => 'Pentas Seni & Pameran Karya Kewirausahaan Siswa',
                'slug' => 'pensi-pameran-karya-2026',
                'category_id' => $catAgenda->id,
                'content' => 'Ajang kreativitas siswa menampilkan seni budaya Islam, bazar kewirausahaan, dan pameran produk digital.',
                'metadata' => ['event_date' => now()->addDays(50)->toDateString(), 'location' => 'Halaman Kampus SMALISKA'],
                'status' => 'published', 'published_at' => now()->subDays(5),
            ],
        ];

        // 6. Posts - Prestasi (dengan metadata rank, year, participant_name)
        $prestasiData = [
            [
                'title' => 'Juara 1 OSN Matematika Tingkat Kabupaten Sidoarjo',
                'slug' => 'juara-1-osn-matematika-sidoarjo-2026',
                'category_id' => $catPrestasi->id,
                'content' => 'Muhammad Farhan (XI MIPA 1) meraih nilai tertinggi pada ajang OSN Kabupaten bidang Matematika dan lolos mewakili Sidoarjo ke tingkat Provinsi.',
                'metadata' => ['participant_name' => 'Muhammad Farhan (XI MIPA 1)', 'rank' => 'Juara 1 (Emas)', 'year' => 2026],
                'status' => 'published', 'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Juara 1 OSN Fisika Tingkat Kabupaten Sidoarjo',
                'slug' => 'juara-1-osn-fisika-sidoarjo-2026',
                'category_id' => $catPrestasi->id,
                'content' => 'Nabilah Putri (XII MIPA 2) lolos ke tingkat Provinsi Jawa Timur mewakili Kabupaten Sidoarjo bidang Fisika.',
                'metadata' => ['participant_name' => 'Nabilah Putri (XII MIPA 2)', 'rank' => 'Juara 1 (Emas)', 'year' => 2026],
                'status' => 'published', 'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Juara 2 MTQ Jawa Timur Cabang Mujawwad',
                'slug' => 'juara-2-mtq-jawa-timur-2026',
                'category_id' => $catPrestasi->id,
                'content' => 'Ahmad Zainuddin (X Keagamaan) meraih Juara 2 Musabaqah Tilawatil Qur\'an Provinsi Jawa Timur cabang Mujawwad.',
                'metadata' => ['participant_name' => 'Ahmad Zainuddin (X Keagamaan)', 'rank' => 'Juara 2 (Perak)', 'year' => 2026],
                'status' => 'published', 'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Juara 1 Futsal Sidoarjo High School Cup 2026',
                'slug' => 'prestasi-futsal-sidoarjo-cup-2026',
                'category_id' => $catPrestasi->id,
                'content' => 'Tim Futsal SMALISKA menjuarai turnamen futsal antar SMA se-Kabupaten Sidoarjo.',
                'metadata' => ['participant_name' => 'Tim Futsal SMALISKA', 'rank' => 'Juara 1', 'year' => 2026],
                'status' => 'published', 'published_at' => now()->subDays(15),
            ],
            [
                'title' => 'Juara 3 Robotika Line Follower Tingkat Nasional (ITS)',
                'slug' => 'juara-3-robotika-its-2025',
                'category_id' => $catPrestasi->id,
                'content' => 'Dimas Prayoga & Rizky Ramadhan meraih Juara 3 dalam kompetisi robotika otomatis yang diselenggarakan ITS Surabaya.',
                'metadata' => ['participant_name' => 'Dimas Prayoga & Rizky Ramadhan', 'rank' => 'Juara 3 (Perunggu)', 'year' => 2025],
                'status' => 'published', 'published_at' => now()->subDays(120),
            ],
            [
                'title' => 'Juara 1 Lomba Pidato Bahasa Arab Se-Jawa Timur',
                'slug' => 'juara-1-pidato-arab-jatim-2025',
                'category_id' => $catPrestasi->id,
                'content' => 'Aisyah Az-Zahra (XI IPS 1) meraih Juara 1 Lomba Pidato Bahasa Arab Se-Jawa Timur dengan tema Peran Pemuda Islam di Era Digital.',
                'metadata' => ['participant_name' => 'Aisyah Az-Zahra (XI IPS 1)', 'rank' => 'Juara 1', 'year' => 2025],
                'status' => 'published', 'published_at' => now()->subDays(130),
            ],
        ];

        $fasilitasData = [
            ['title' => 'Laboratorium Komputer & Digital Class', 'content' => '40 unit PC Core i7, monitor FHD 24 inci, fiber optik 500 Mbps, dan smart board.', 'slug' => 'laboratorium-komputer-digital-class'],
            ['title' => 'Masjid Kampus Al-Iman', 'content' => 'Masjid dua lantai berkapasitas 800 jamaah dengan ruang kajian dan tahfidz harian.', 'slug' => 'masjid-kampus-al-iman'],
            ['title' => 'Perpustakaan Digital & Media Center', 'content' => 'Koleksi buku fisik, akses e-library nasional, ruang baca ber-AC, dan katalog digital.', 'slug' => 'perpustakaan-digital-media-center'],
            ['title' => 'Laboratorium IPA Terpadu', 'content' => 'Peralatan praktikum Fisika, Kimia, dan Biologi, termasuk mikroskop digital.', 'slug' => 'laboratorium-ipa-terpadu'],
            ['title' => 'Lapangan Olahraga Multifungsi', 'content' => 'Lapangan outdoor untuk Futsal, Basket, Voli, dan Bulutangkis dengan pencahayaan malam.', 'slug' => 'lapangan-olahraga-multifungsi'],
            ['title' => 'Studio Podcast & Multimedia', 'content' => 'Studio kedap suara dengan kamera 4K, lighting, mixer audio, dan podcast microphone.', 'slug' => 'studio-podcast-multimedia'],
        ];

        $alumniData = [
            ['title' => 'dr. Farhan Al-Ghifari', 'content' => "Pendidikan di SMALISKA memberi dua fondasi penting: disiplin sains akademik dan hafalan Al-Qur'an yang menenangkan jiwa saat tekanan kuliah kedokteran.", 'slug' => 'dr-farhan-al-ghifari', 'metadata' => ['graduation_year' => 2020, 'current_profession' => 'Dokter Muda / Mahasiswa FK Universitas Airlangga']],
            ['title' => 'Nabila Syakira, S.T.', 'content' => 'Klub Komputer dan Coding di SMALISKA menjadi pintu awal karir saya di industri IT nasional. Guru-gurunya sangat mendukung bakat siswa!', 'slug' => 'nabila-syakira', 'metadata' => ['graduation_year' => 2021, 'current_profession' => 'Cloud Engineer di Bank Syariah Indonesia Jakarta']],
            ['title' => 'Muhammad Hafiz, Lc.', 'content' => 'Bimbingan Bahasa Arab intensif di SMALISKA memudahkan saya lolos seleksi beasiswa Al-Azhar Mesir tanpa kendala bahasa.', 'slug' => 'muhammad-hafiz', 'metadata' => ['graduation_year' => 2019, 'current_profession' => 'Alumni Universitas Al-Azhar Kairo / Dai Muda']],
            ['title' => 'Anisa Rahmawati, S.M.', 'content' => 'Pameran Kewirausahaan di sekolah mengajarkan saya berani eksekusi ide bisnis sejak kelas 11. Bangga menjadi alumni SMALISKA.', 'slug' => 'anisa-rahmawati', 'metadata' => ['graduation_year' => 2022, 'current_profession' => 'Entrepreneur / Founder Startup Fashion Muslim Sidoarjo']],
        ];

        foreach ([...$beritaData, ...$agendaData, ...$prestasiData] as $pData) {
            Post::updateOrCreate(['slug' => $pData['slug']], array_merge($pData, ['user_id' => $humas->id]));
        }

        foreach ($fasilitasData as $fData) {
            Post::updateOrCreate(['slug' => $fData['slug']], [
                'user_id' => $admin->id,
                'category_id' => $catFasilitas->id,
                'title' => $fData['title'],
                'slug' => $fData['slug'],
                'content' => $fData['content'],
                'status' => 'published',
                'published_at' => now()->subDays(20),
            ]);
        }

        foreach ($alumniData as $aData) {
            Post::updateOrCreate(['slug' => $aData['slug']], array_merge($aData, [
                'user_id' => $humas->id,
                'category_id' => $catAlumni->id,
                'status' => 'published',
                'published_at' => now()->subDays(30),
            ]));
        }

        // 7. Staff
        $staffData = [
            ['name' => 'Dr. H. Ahmad Dahlan, M.Pd.',       'role' => 'Kepala Sekolah',              'type' => 'gtk',    'email' => 'dahlan@smaliska.sch.id',  'phone' => '081234567890'],
            ['name' => 'Rina Wulandari, M.Si.',             'role' => 'Waka Kurikulum / Guru Fisika', 'type' => 'guru',   'email' => 'rina@smaliska.sch.id',    'phone' => '081234567891'],
            ['name' => 'M. Rizky Pratama, S.Pd.',           'role' => 'Waka Kesiswaan / Guru PJOK',  'type' => 'guru',   'email' => 'rizky@smaliska.sch.id',   'phone' => '081234567892'],
            ['name' => 'Siti Aminah, S.Pd.',                'role' => 'Waka Humas / Guru B. Inggris', 'type' => 'guru',   'email' => 'aminah@smaliska.sch.id',  'phone' => '081234567893'],
            ['name' => 'Ustadz H. Abdul Samad, Lc., M.H.', 'role' => 'Guru PAI & Koordinator Tahfidz', 'type' => 'guru', 'email' => 'samad@smaliska.sch.id',   'phone' => '081234567894'],
            ['name' => 'Budi Santoso, S.Kom.',              'role' => 'Kepala Tata Usaha / IT Staff', 'type' => 'tendik', 'email' => 'budi@smaliska.sch.id',    'phone' => '081234567895'],
            ['name' => 'Dewi Kartika, S.Si.',               'role' => 'Guru Biologi & Pembina OSIS',  'type' => 'guru',   'email' => 'dewi@smaliska.sch.id',    'phone' => '081234567896'],
            ['name' => 'Eko Prasetyo, S.Pd.',               'role' => 'Guru Matematika',              'type' => 'guru',   'email' => 'eko@smaliska.sch.id',     'phone' => '081234567897'],
            ['name' => 'Hj. Nurul Hidayah, S.Ag.',          'role' => 'Guru Bahasa Arab',             'type' => 'guru',   'email' => 'nurul@smaliska.sch.id',   'phone' => '081234567898'],
            ['name' => 'Bambang Utomo, A.Md.',              'role' => 'Staf Perpustakaan',            'type' => 'tendik', 'email' => 'bambang@smaliska.sch.id', 'phone' => '081234567899'],
        ];
        foreach ($staffData as $s) {
            Staff::updateOrCreate(['email' => $s['email']], $s);
        }

        // 8. Galleries
        $galleriesData = [
            'Upacara Peringatan Hari Kemerdekaan RI di SMALISKA',
            'Kunjungan Edukasi Industri Komputer Siswa SMALISKA',
            'Wisuda Tahfidz Al-Qur\'an Angkatan ke-15',
            'Juara Futsal Sidoarjo High School Cup 2026',
            'Bakti Sosial & Pembagian Takjil Ramadhan',
            'Praktikum Biologi Ekosistem di Lab IPA Terpadu',
            'Pentas Seni Islam & Bazar Kewirausahaan',
            'Studi Lapangan Pelatihan Kepemimpinan OSIS',
        ];
        foreach ($galleriesData as $title) {
            Gallery::updateOrCreate(['title' => $title], ['title' => $title, 'media_type' => 'image', 'file_path' => '']);
        }
    }
}
