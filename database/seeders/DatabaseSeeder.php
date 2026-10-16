<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([UserSeeder::class]);

        $admin = User::where('email', 'admin@smaxyz.sch.id')->first();
        $humas = User::where('email', 'humas@smaxyz.sch.id')->first();

        // 1. Categories (semua konten lewat posts)
        $catBerita = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita', 'show_on_home' => true]);
        $catPengumuman = Category::firstOrCreate(['slug' => 'pengumuman'], ['name' => 'Pengumuman', 'show_on_home' => true]);
        $catAgenda = Category::firstOrCreate(['slug' => 'agenda'], [
            'name' => 'Agenda',
            'show_on_home' => true,
            'metadata_schema' => [
                ['key' => 'event_date', 'label' => 'Tanggal Agenda', 'type' => 'date'],
                ['key' => 'location', 'label' => 'Lokasi', 'type' => 'text'],
            ],
        ]);
        $catPrestasi = Category::firstOrCreate(['slug' => 'prestasi'], ['name' => 'Prestasi', 'show_on_home' => true]);
        $catFasilitas = Category::firstOrCreate(['slug' => 'fasilitas'], ['name' => 'Fasilitas', 'show_on_home' => true]);
        $catAlumni = Category::firstOrCreate(['slug' => 'cerita-alumni'], ['name' => 'Cerita Alumni', 'show_on_home' => true]);
        $catKegiatan = Category::firstOrCreate(['slug' => 'kegiatan'], ['name' => 'Kegiatan Sekolah']);
        $catEkstra = Category::firstOrCreate(['slug' => 'ekstrakurikuler'], ['name' => 'Ekstrakurikuler']);

        // 2. Site Settings
        $settings = [
            ['key' => 'site_name',       'value' => 'SMA XYZ',                                      'type' => 'text',  'group_name' => 'general'],
            ['key' => 'site_tagline',    'value' => 'Berakhlak Mulia, Berprestasi Tinggi, Berwawasan Global',  'type' => 'text',  'group_name' => 'general'],
            ['key' => 'hero_title',      'value' => 'Membentuk Generasi Rabbani & Berprestasi',                'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_subtitle',   'value' => 'Selamat Datang di Portal Resmi SMA XYZ. Pendidikan Islam modern berbasis teknologi & akhlakul karimah di Sidoarjo.', 'type' => 'text', 'group_name' => 'hero'],
            ['key' => 'hero_background', 'value' => '#065F46',                                                 'type' => 'color', 'group_name' => 'hero'],
            ['key' => 'hero_slide_1_tag',      'value' => 'Portal resmi SMA XYZ',                                  'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_1_title',    'value' => 'Membentuk Generasi Rabbani & Berprestasi',                'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_1_subtitle', 'value' => 'Selamat Datang di Portal Resmi SMA XYZ. Pendidikan Islam modern berbasis teknologi & akhlakul karimah di Sidoarjo.', 'type' => 'text', 'group_name' => 'hero'],
            ['key' => 'hero_slide_1_btn_text', 'value' => 'Sambutan Kepala Sekolah',                                'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_1_btn_url',  'value' => '#sambutan',                                               'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_1_image',    'value' => '',                                                       'type' => 'image', 'group_name' => 'hero'],

            ['key' => 'hero_slide_2_tag',      'value' => 'PPDB Online 2025/2026',                                  'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_2_title',    'value' => 'Pendaftaran Peserta Didik Baru',                         'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_2_subtitle', 'value' => 'Buka peluang masa depan terbaikmu bersama SMA XYZ. Bergabunglah dengan pendidikan Islam modern berwawasan global.', 'type' => 'text', 'group_name' => 'hero'],
            ['key' => 'hero_slide_2_btn_text', 'value' => 'Daftar Sekarang',                                         'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_2_btn_url',  'value' => 'https://ppdb.smaxyz.sch.id',                            'type' => 'text',  'group_name' => 'hero'],
            ['key' => 'hero_slide_2_image',    'value' => '',                                                       'type' => 'image', 'group_name' => 'hero'],
            ['key' => 'contact_phone',   'value' => '(031) 8971234',                                           'type' => 'text',  'group_name' => 'contact'],
            ['key' => 'contact_email',   'value' => 'info@smaxyz.sch.id',                                    'type' => 'text',  'group_name' => 'contact'],
            ['key' => 'contact_address', 'value' => 'Jl. Kyai Mojo No. 1, Krian, Sidoarjo, Jawa Timur 61262', 'type' => 'text',  'group_name' => 'contact'],
            ['key' => 'ppdb_link',       'value' => 'https://ppdb.smaxyz.sch.id',                            'type' => 'text',  'group_name' => 'links'],
            ['key' => 'quick_link_1_title', 'value' => 'Pendaftaran', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_1_url',   'value' => 'https://ppdb.smaxyz.sch.id', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_1_desc',  'value' => 'Portal Resmi Pendaftaran PPDB Online', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_2_title', 'value' => 'SMA XYZ via mobile', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_2_url',   'value' => 'https://mobile.smaxyz.or.id', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_2_desc',  'value' => 'Aplikasi Layanan Mobile SMA XYZ', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_3_title', 'value' => 'perpustakaan SMA XYZ', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_3_url',   'value' => 'https://perpus.smaxyz.or.id', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'quick_link_3_desc',  'value' => 'Layanan Perpustakaan Digital', 'type' => 'text', 'group_name' => 'links'],
            ['key' => 'welcome_message', 'value' => "Assalamu'alaikum Wr. Wb. Segala puji syukur kami panjatkan ke hadirat Allah SWT atas rahmat dan hidayah-Nya sehingga SMA XYZ terus konsisten menjadi pelopor sekolah Islam berprestasi di Jawa Timur. Kami memadukan Kurikulum Merdeka dengan pendidikan karakter Al-Qur'an dan penguasaan teknologi digital modern untuk menyiapkan lulusan yang siap bersaing secara global.", 'type' => 'text', 'group_name' => 'general'],
            ['key' => 'principal_name',  'value' => 'Dr. H. Ahmad Dahlan, M.Pd.',                             'type' => 'text',  'group_name' => 'general'],
            ['key' => 'social_facebook',   'value' => 'https://facebook.com/SMAXYZ',        'type' => 'text',  'group_name' => 'social'],
            ['key' => 'social_instagram',  'value' => 'https://instagram.com/SMAXYZ',       'type' => 'text',  'group_name' => 'social'],
            ['key' => 'social_twitter',    'value' => 'https://twitter.com/SMAXYZ',          'type' => 'text',  'group_name' => 'social'],
            ['key' => 'social_youtube',    'value' => 'https://youtube.com/SMAXYZ',          'type' => 'text',  'group_name' => 'social'],
            ['key' => 'social_linkedin',   'value' => 'https://linkedin.com/company/SMAXYZ', 'type' => 'text',  'group_name' => 'social'],
            ['key' => 'social_whatsapp',   'value' => 'https://wa.me/628123456789',            'type' => 'text',  'group_name' => 'social'],
            ['key' => 'social_tiktok',     'value' => 'https://tiktok.com/@SMAXYZ',          'type' => 'text',  'group_name' => 'social'],
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
            [
                'title' => 'Sejarah',
                'slug' => 'sejarah',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>SMA XYZ berdiri pada 17 Juli 1978 di Krian, Sidoarjo. Pendiriannya digagas tokoh masyarakat dan ulama setempat yang ingin menyediakan SMA bernafaskan Islam bagi warga Krian dan sekitarnya.</p>
                <p>Bangunan pertamanya tiga ruang kelas di atas tanah wakaf, dengan 42 siswa dan tujuh guru. Jumlah pendaftar bertambah setiap tahun, sehingga yayasan menambah ruang kelas, masjid, dan asrama tahfidz secara bertahap.</p>
                <p>Tonggak yang menandai perjalanan sekolah:</p>
                <ul>
                    <li>1978: tiga ruang kelas pertama dibuka.</li>
                    <li>1989: masjid kampus dan asrama tahfidz berdiri.</li>
                    <li>2005: akreditasi A pertama diraih.</li>
                    <li>2016: laboratorium komputer dan studio multimedia mulai digunakan.</li>
                    <li>2024: akreditasi A (Unggul) diperbarui.</li>
                </ul>
                <p>Saat ini SMA XYZ menampung 850 siswa dalam 27 rombel. Alumni tersebar di perguruan tinggi negeri, pesantren, dan industri, dan sebagian dari mereka kembali mengajar atau menjadi pembina ekstrakurikuler.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'text', 'content' => <<<'HTML'
                    <p>Kebiasaan yang kami jaga sejak angkatan pertama:</p>
                    <ul>
                        <li>Kurikulum agama ditinjau setiap awal tahun ajaran.</li>
                        <li>Forum MGMP internal digelar setiap Jumat untuk para guru.</li>
                        <li>Laporan keuangan yayasan dibuka untuk orang tua setiap semester.</li>
                    </ul>
                    HTML],
                    ['type' => 'table', 'title' => 'Kepala Sekolah dari Masa ke Masa', 'description' => 'Periode kepemimpinan dan penanda utama pada tiap masa.', 'columns' => ['Nama', 'Periode', 'Penanda'], 'rows' => [
                        ['K.H. Abdullah Syafi\'i', '1978-1992', 'Pendirian gedung induk'],
                        ['Drs. H. Sulaiman Hakim', '1992-2004', 'Masjid kampus dan asrama tahfidz'],
                        ['Dra. Hj. Maimunah Yusuf', '2004-2015', 'Akreditasi A pertama'],
                        ['Dr. H. Ahmad Dahlan, M.Pd.', '2015-sekarang', 'Laboratorium komputer dan kelas digital'],
                    ]],
                ]],
            ],
            [
                'title' => 'Visi, Misi dan Tujuan',
                'slug' => 'visi-misi-tujuan',
                'is_published' => true,
                'content' => <<<'HTML'
                <h3>Visi</h3>
                <p>Terwujudnya generasi rabbani yang berakhlak mulia, unggul dalam IPTEK, berwawasan global, dan berbudaya lingkungan.</p>
                <h3>Misi</h3>
                <ol>
                    <li>Menyelenggarakan pendidikan berbasis karakter Al-Qur'an dan As-Sunnah.</li>
                    <li>Mengembangkan Kurikulum Merdeka yang terhubung dengan teknologi informasi.</li>
                    <li>Membina prestasi akademik dan non-akademik sampai tingkat nasional.</li>
                    <li>Membiasakan bahasa Arab dan Inggris dalam keseharian siswa.</li>
                    <li>Menjaga lingkungan sekolah yang bersih, hijau, dan aman.</li>
                </ol>
                <h3>Tujuan</h3>
                <ul>
                    <li>Lulusan diterima di PTN, perguruan tinggi luar negeri, atau pesantren tahfidz pilihan.</li>
                    <li>Siswa hafal 3-5 juz dengan tajwid yang benar sebelum lulus.</li>
                    <li>Guru punya jalur naik jenjang lewat pelatihan dan sertifikasi.</li>
                </ul>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'text', 'content' => <<<'HTML'
                    <p>Visi ini diterjemahkan menjadi kebiasaan harian di sekolah:</p>
                    <ul>
                        <li>Tadarus Al-Qur'an sebelum jam pertama.</li>
                        <li>Satu proyek lintas mata pelajaran setiap semester.</li>
                        <li>Piket kebersihan kelas dan taman kampus setiap hari.</li>
                    </ul>
                    HTML],
                    ['type' => 'table', 'title' => 'Indikator Ketercapaian Visi', 'description' => 'Diperiksa dalam rapat evaluasi akhir tahun ajaran.', 'columns' => ['Indikator', 'Satuan', 'Target'], 'rows' => [
                        ['Rata-rata nilai rapor', 'Skala 100', '85'],
                        ['Hafalan Al-Qur\'an minimal 3 juz', 'Persen angkatan', '90'],
                        ['Lulusan diterima di PTN', 'Persen angkatan', '70'],
                        ['Guru ikut pelatihan bersertifikat', 'Orang per tahun', '30'],
                    ]],
                ]],
            ],
            [
                'title' => 'Sambutan',
                'slug' => 'sambutan',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>Assalamu'alaikum warahmatullahi wabarakatuh.</p>
                <p>Selamat datang di portal resmi SMA XYZ. Portal ini kami jaga agar orang tua dan calon siswa bisa mengikuti kegiatan sekolah tanpa menunggu pengumuman di papan informasi.</p>
                <p>Kami percaya pendidikan yang baik berdampingan dengan pembinaan ibadah dan kepekaan sosial, tidak berhenti pada nilai akademik. Jam belajar karena itu disandingkan dengan tahfidz, latihan kepemimpinan OSIS, dan kegiatan bakti di lingkungan Krian.</p>
                <p>Fokus kami tahun ini:</p>
                <ul>
                    <li>Pembinaan olimpiade untuk kelas X dan XI.</li>
                    <li>Penambahan jam praktikum di laboratorium IPA.</li>
                    <li>Kelas bahasa Arab aktif untuk kelas XII.</li>
                </ul>
                <p>Bila ada pertanyaan tentang pendaftaran atau layanan sekolah, silakan hubungi sekretariat pada hari kerja.</p>
                <p>Wassalamu'alaikum warahmatullahi wabarakatuh.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'blockquote', 'content' => '<p>Sekolah ini bukan sekadar tempat mengejar nilai. Di sini siswa belajar jujur, disiplin, dan bertanggung jawab atas pilihannya sendiri.</p>', 'source' => 'Dr. H. Ahmad Dahlan, M.Pd., Kepala SMA XYZ'],
                    ['type' => 'callout', 'content' => '<p>Layanan tatap muka: Senin-Jumat, 07.00-15.00 di sekretariat. WhatsApp sekretariat aktif sampai pukul 20.00.</p>'],
                ]],
            ],
            [
                'title' => 'Kerjasama',
                'slug' => 'kerjasama',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>SMA XYZ bekerja sama dengan kampus, lembaga bahasa, dan industri untuk pembinaan siswa serta pelatihan guru. Setiap kerja sama berjalan dengan perjanjian tertulis yang ditinjau sekali setahun.</p>
                <p>Mitra yang berjalan saat ini:</p>
                <ol>
                    <li>Universitas Airlangga (UNAIR): pembinaan olimpiade biologi dan kimia.</li>
                    <li>Institut Teknologi Sepuluh Nopember (ITS): pelatihan coding dan robotika.</li>
                    <li>Markaz Lughah Al-Arabiyah Cairo: sertifikasi bahasa Arab untuk kelas XII.</li>
                    <li>Ruangguru: kelas tambahan daring untuk kelas XII.</li>
                    <li>Bank Syariah Indonesia: beasiswa siswa berprestasi dan kelas literasi keuangan.</li>
                </ol>
                <p>Usulan kerja sama baru diajukan ke bidang Humas dengan proposal berisi ruang lingkup dan jadwal kegiatan.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Mitra dan Ruang Lingkup Kerja Sama', 'description' => 'Ditinjau setiap akhir tahun ajaran bersama bidang Humas.', 'columns' => ['Mitra', 'Bidang', 'Kegiatan'], 'rows' => [
                        ['Universitas Airlangga', 'Pendidikan', 'Pembinaan olimpiade biologi dan kimia'],
                        ['ITS Surabaya', 'Teknologi', 'Pelatihan coding dan robotika'],
                        ['Markaz Lughah Al-Arabiyah', 'Bahasa', 'Sertifikasi bahasa Arab kelas XII'],
                        ['Ruangguru', 'Pendidikan', 'Kelas tambahan daring'],
                        ['Bank Syariah Indonesia', 'Beasiswa', 'Beasiswa berprestasi dan literasi keuangan'],
                    ]],
                    ['type' => 'callout', 'content' => '<p>Pengajuan kerja sama: proposal dikirim ke humas@smaxyz.sch.id, lalu dijadwalkan rapat dengan bidang terkait dalam dua minggu.</p>'],
                ]],
            ],
            [
                'title' => 'Fasilitas',
                'slug' => 'fasilitas',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>SMA XYZ menempati kampus di Jl. Kyai Mojo No. 1, Krian. Ruang kelas ber-AC, masjid dua lantai, perpustakaan, tiga laboratorium, dan lapangan multifungsi dipakai bergiliran sesuai jadwal pelajaran.</p>
                <p>Fasilitas yang paling sering dipakai siswa:</p>
                <ul>
                    <li>Laboratorium Komputer dan Digital Class, 40 unit PC dengan jaringan fiber 500 Mbps.</li>
                    <li>Masjid Kampus Al-Iman berkapasitas 800 jamaah.</li>
                    <li>Perpustakaan Digital dan Media Center dengan koleksi fisik dan akses e-library nasional.</li>
                    <li>Laboratorium IPA Terpadu untuk praktikum Fisika, Kimia, dan Biologi.</li>
                    <li>Lapangan Olahraga Multifungsi dengan lampu untuk latihan malam.</li>
                    <li>Studio Podcast dan Multimedia untuk kelas konten dan siaran sekolah.</li>
                </ul>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Jam Layanan Fasilitas', 'description' => 'Di luar jam ini, pemakaian ruang harus mengajukan izin ke Kepala TU.', 'columns' => ['Fasilitas', 'Hari', 'Jam'], 'rows' => [
                        ['Perpustakaan', 'Senin-Jumat', '07.00-16.00'],
                        ['Laboratorium Komputer', 'Senin-Jumat', '07.00-15.00'],
                        ['Studio Podcast', 'Selasa dan Kamis', '13.00-16.00'],
                        ['Lapangan Olahraga', 'Setiap hari', '06.00-21.00'],
                    ]],
                    ['type' => 'callout', 'content' => '<p>Peminjaman ruang melalui petugas sarana atau Kepala TU. Kerusakan alat dilaporkan ke wali kelas agar segera diperbaiki.</p>'],
                ]],
            ],
            [
                'title' => 'Guru dan Tendik',
                'slug' => 'guru-tendik',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>Tenaga pendidik SMA XYZ berjumlah 45 guru dan 18 tenaga kependidikan. Sebagian besar guru berlatar S1 dan S2 dari UNAIR, ITS, UNESA, dan UINSA, ditambah guru pondok pesantren mitra untuk mapel PAI dan tahfidz.</p>
                <p>Pembagian tugas yang berjalan:</p>
                <ul>
                    <li>Waka Kurikulum mengatur jadwal, asesmen, dan supervisi kelas.</li>
                    <li>Waka Kesiswaan menangani OSIS, ekstrakurikuler, dan kedisiplinan.</li>
                    <li>Waka Humas menjadi pintu masuk kerja sama dan layanan orang tua.</li>
                    <li>Koordinator Tahfidz mengatur setoran hafalan dan wisuda tahfidz.</li>
                    <li>Kepala TU mengelola administrasi, sarana, dan sistem informasi sekolah.</li>
                </ul>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Komposisi Guru dan Tendik', 'description' => 'Data tahun ajaran 2026/2027.', 'columns' => ['Pendidikan Terakhir', 'Guru', 'Tendik'], 'rows' => [
                        ['S2', '12', '1'],
                        ['S1', '33', '9'],
                        ['D3/SMA', '0', '8'],
                    ]],
                    ['type' => 'text', 'content' => <<<'HTML'
                    <p>Jalur pengembangan yang tersedia bagi guru dan tendik:</p>
                    <ul>
                        <li>Pelatihan kurikulum dan asesmen setiap awal semester.</li>
                        <li>Pendampingan guru baru oleh guru senior selama satu tahun.</li>
                        <li>Studi banding ke sekolah atau kampus mitra satu kali setahun.</li>
                    </ul>
                    HTML],
                ]],
            ],
            [
                'title' => 'GTK',
                'slug' => 'gtk',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>Guru dan tenaga kependidikan SMA XYZ bekerja dengan pembagian tugas yang jelas: 45 guru, 18 tenaga kependidikan, dan tim tahfidz dari pondok pesantren mitra.</p>
                <ul>
                    <li>Kualifikasi guru: S1 dan S2 dari UNAIR, ITS, UNESA, dan UINSA.</li>
                    <li>Guru bersertifikat pendidik: 38 orang.</li>
                    <li>Guru tahfidz bersanad: 6 orang hafiz dan hafizah.</li>
                    <li>Tenaga kependidikan: administrasi, perpustakaan, laboratorium, dan sarana prasarana.</li>
                </ul>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Program Pengembangan Tenaga Pendidik', 'description' => 'Jadwal rutin yang berjalan setiap tahun ajaran.', 'columns' => ['Program', 'Peserta', 'Jadwal'], 'rows' => [
                        ['MGMP internal', 'Semua guru mapel', 'Setiap Jumat'],
                        ['Pelatihan Kurikulum Merdeka', 'Guru baru', 'Awal tahun ajaran'],
                        ['Pengurusan sertifikasi pendidik', 'Guru yang memenuhi syarat', 'Sesuai jadwal pemerintah'],
                        ['Pelatihan sistem informasi sekolah', 'Tenaga kependidikan', 'Setiap semester'],
                    ]],
                    ['type' => 'callout', 'content' => '<p>Guru dan tendik baru menjalani orientasi dua pekan sebelum mulai bertugas, termasuk pendampingan wali kelas senior.</p>'],
                ]],
            ],
            [
                'title' => 'Struktur Organisasi',
                'slug' => 'struktur-organisasi',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>Struktur organisasi SMA XYZ berada di bawah Yayasan Pendidikan SMA XYZ. Kepala sekolah membawahi empat wakil, kepala tata usaha, dan koordinator tahfidz.</p>
                <ol>
                    <li>Ketua Yayasan membawahi kepala sekolah.</li>
                    <li>Kepala sekolah memimpin wakil kurikulum, kesiswaan, humas, dan sarana prasarana.</li>
                    <li>Kepala tata usaha menangani administrasi, keuangan harian, dan sistem informasi.</li>
                    <li>Koordinator tahfidz mengatur program hafalan bersama guru PAI.</li>
                </ol>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Pimpinan Sekolah', 'description' => 'Pejabat yang menjabat pada tahun ajaran ini.', 'columns' => ['Jabatan', 'Nama', 'Email'], 'rows' => [
                        ['Kepala Sekolah', 'Dr. H. Ahmad Dahlan, M.Pd.', 'dahlan@smaxyz.sch.id'],
                        ['Waka Kurikulum', 'Rina Wulandari, M.Si.', 'rina@smaxyz.sch.id'],
                        ['Waka Kesiswaan', 'M. Rizky Pratama, S.Pd.', 'rizky@smaxyz.sch.id'],
                        ['Waka Humas', 'Siti Aminah, S.Pd.', 'aminah@smaxyz.sch.id'],
                        ['Kepala Tata Usaha', 'Budi Santoso, S.Kom.', 'budi@smaxyz.sch.id'],
                    ]],
                    ['type' => 'callout', 'content' => '<p>Layanan surat keterangan dan legalisasi: Senin-Jumat, 08.00-14.00 di ruang tata usaha.</p>'],
                ]],
            ],
            [
                'title' => 'Petunjuk Pendaftaran PPDB',
                'slug' => 'petunjuk-ppdb',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>Pendaftaran PPDB SMA XYZ dilakukan daring melalui portal ppdb.smaxyz.sch.id. Berkas yang diunggah diverifikasi tim panitia, dan hasilnya dikirim ke email pendaftar dalam dua hari kerja.</p>
                <ol>
                    <li>Akses portal ppdb.smaxyz.sch.id dan buat akun dengan NIK serta email aktif.</li>
                    <li>Isi formulir data diri, sekolah asal, dan nilai rapor.</li>
                    <li>Unggah berkas: rapor SMP semester 1-5, akta lahir, kartu keluarga, dan sertifikat prestasi bila ada.</li>
                    <li>Pilih jalur pendaftaran: prestasi akademik, tahfidz, atau reguler.</li>
                    <li>Bayar biaya pendaftaran melalui BSI atau transfer bank, lalu simpan bukti bayar.</li>
                    <li>Ikuti tes pemetaan potensi dan wawancara karakter di kampus.</li>
                    <li>Pantau hasil seleksi di portal, lalu lakukan daftar ulang bila dinyatakan diterima.</li>
                </ol>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Gelombang Pendaftaran', 'description' => 'Kuota tiap gelombang terbatas, pendaftar yang menyelesaikan administrasi lebih dulu diprioritaskan saat daftar ulang.', 'columns' => ['Gelombang', 'Periode', 'Catatan'], 'rows' => [
                        ['Gelombang 1', '1 Oktober sampai 31 Desember 2026', 'Potongan biaya pendaftaran'],
                        ['Gelombang 2', '1 Januari sampai 31 Maret 2027', 'Biaya penuh'],
                        ['Gelombang 3', '1 April sampai 30 Juni 2027', 'Sesuai sisa kuota'],
                    ]],
                    ['type' => 'callout', 'content' => '<p>Jalur tahfidz: beasiswa penuh untuk hafalan 3 juz atau lebih dengan surat keterangan dari ustadz pembimbing. Berkas diunggah bersama dokumen lain saat mendaftar.</p>'],
                ]],
            ],
            [
                'title' => 'Program Unggulan Tahfidz',
                'slug' => 'program-tahfidz',
                'is_published' => true,
                'content' => <<<'HTML'
                <p>Program Tahfidzul Qur'an berjalan sejak 1989 dan kini menjadi salah satu jalur pendaftaran favorit. Setoran hafalan digelar sore hari bersama pembimbing hafiz bersanad.</p>
                <p>Rangkaian program selama tiga tahun:</p>
                <ul>
                    <li>Kelas X: tahsin bacaan, kaidah tajwid, dan hafalan satu juz.</li>
                    <li>Kelas XI: penambahan hafalan minimal dua juz dengan ujian juz tiap semester.</li>
                    <li>Kelas XII: penyelesaian target 3-5 juz dan persiapan wisuda tahfidz.</li>
                </ul>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Jadwal Program Tahfidz', 'description' => 'Berjalan sepanjang tahun ajaran, di luar jadwal ujian semester.', 'columns' => ['Kegiatan', 'Hari', 'Jam'], 'rows' => [
                        ['Setoran hafalan harian', 'Senin-Kamis', '14.00-16.00'],
                        ['Tahsin dan tajwid', 'Jumat', '13.00-14.30'],
                        ['Ujian juz', 'Akhir semester', 'Sesuai jadwal panitia'],
                        ['Wisuda tahfidz', 'Sekali setahun', 'April'],
                    ]],
                    ['type' => 'blockquote', 'content' => '<p>Hafalan yang baik bukan yang paling cepat selesai, tapi yang paling rajin diulang.</p>', 'source' => 'Ustadz H. Abdul Samad, Lc., M.H., Koordinator Tahfidz'],
                ]],
            ],
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
                'content' => <<<'HTML'
                <p>SMA XYZ membuka Penerimaan Peserta Didik Baru (PPDB) tahun ajaran 2026/2027 untuk gelombang pertama. Pendaftaran berjalan daring melalui portal resmi sampai 31 Desember 2026.</p>
                <p>Empat jalur pendaftaran yang tersedia:</p>
                <ul>
                    <li>Prestasi akademik: nilai rapor semester 1-5 dan sertifikat lomba tingkat kabupaten ke atas.</li>
                    <li>Tahfidz: hafalan minimal 3 juz dengan surat keterangan ustadz pembimbing.</li>
                    <li>Reguler: tes pemetaan potensi dan wawancara karakter.</li>
                    <li>Beasiswa yayasan: bagi pemegang KIP atau siswa berprestasi dari sekolah mitra.</li>
                </ul>
                <p>Pendaftar gelombang pertama mendapat potongan biaya pendaftaran. Rincian biaya, jadwal tes, dan panduan pengisian formulir ada di laman Petunjuk Pendaftaran PPDB.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'callout', 'content' => '<p>Kuota gelombang pertama 160 siswa, dan pendaftaran ditutup lebih awal bila kuota terpenuhi. Sekretariat PPDB melayani pertanyaan pada hari kerja, 07.00-15.00.</p>'],
                    ['type' => 'table', 'title' => 'Jadwal PPDB Gelombang 1', 'description' => 'Tanggal dapat bergeser bila kuota terpenuhi lebih awal.', 'columns' => ['Tahapan', 'Tanggal'], 'rows' => [
                        ['Pendaftaran daring', '1 Oktober sampai 31 Desember 2026'],
                        ['Tes pemetaan dan wawancara', '6-10 Januari 2027'],
                        ['Pengumuman hasil', '13 Januari 2027'],
                        ['Daftar ulang', '14-20 Januari 2027'],
                    ]],
                    ['type' => 'text', 'content' => <<<'HTML'
                    <p>Berkas yang disiapkan sebelum mendaftar:</p>
                    <ul>
                        <li>Scan rapor semester 1-5 dalam satu berkas PDF.</li>
                        <li>Scan akta lahir dan kartu keluarga.</li>
                        <li>Pas foto berwarna 3x4 terbaru.</li>
                        <li>Sertifikat prestasi atau surat keterangan tahfidz bagi pendaftar jalur khusus.</li>
                    </ul>
                    HTML],
                ]],
                'status' => 'published', 'published_at' => now(),
            ],
            [
                'title' => 'Siswa SMA XYZ Raih Medali Emas OSN Matematika & Fisika 2026',
                'slug' => 'emas-osn-matematika-fisika-2026',
                'category_id' => $catBerita->id,
                'content' => <<<'HTML'
                <p>Dua siswa SMA XYZ meraih medali emas Olimpiade Sains Nasional (OSN) tingkat Kabupaten Sidoarjo. Muhammad Farhan dari XI MIPA 1 menempati peringkat pertama bidang Matematika, dan Nabilah Putri dari XII MIPA 2 meraih peringkat pertama bidang Fisika.</p>
                <p>Keduanya dibina sejak Februari lewat bimbingan dua kali sepekan bersama Rina Wulandari, M.Si. dan Eko Prasetyo, S.Pd. Soal latihan diambil dari arsip OSN lima tahun terakhir, lalu dibahas bersama sampai semua langkah pengerjaan jelas.</p>
                <p>Faktor yang disebut pembina sebagai penentu hasil:</p>
                <ul>
                    <li>Kebiasaan mengerjakan satu paket soal setiap pekan sejak kelas X.</li>
                    <li>Diskusi terbuka setelah latihan, termasuk saat jawaban salah.</li>
                    <li>Penyesuaian tenggat tugas dari wali kelas selama masa pembinaan.</li>
                </ul>
                <p>Farhan dan Nabilah mewakili Sidoarjo pada OSN tingkat Provinsi Jawa Timur. Pendampingan berlanjut di ruang multimedia sekolah sampai hari pelaksanaan.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Hasil Delegasi SMA XYZ', 'description' => 'Hasil OSN tingkat Kabupaten Sidoarjo 2026.', 'columns' => ['Bidang', 'Nama', 'Kelas', 'Hasil'], 'rows' => [
                        ['Matematika', 'Muhammad Farhan', 'XI MIPA 1', 'Medali emas'],
                        ['Fisika', 'Nabilah Putri', 'XII MIPA 2', 'Medali emas'],
                    ]],
                    ['type' => 'blockquote', 'content' => '<p>Farhan dan Nabilah bukan siswa yang paling cepat selesai, tapi paling konsisten mengulang soal yang pernah salah.</p>', 'source' => 'Rina Wulandari, M.Si., pembina Matematika'],
                    ['type' => 'callout', 'content' => '<p>Latihan olimpiade tingkat provinsi digelar Selasa dan Kamis, 15.00-17.00 di ruang multimedia. Siswa kelas X dan XI yang berminat bisa mendaftar ke wali kelas.</p>'],
                ]],
                'status' => 'published', 'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Pesantren Kilat Ramadhan 1447 H Berlangsung Khidmat',
                'slug' => 'pesantren-kilat-ramadhan-1447h',
                'category_id' => $catKegiatan->id,
                'content' => <<<'HTML'
                <p>Pesantren Kilat Ramadhan 1447 H digelar lima hari dan diikuti seluruh siswa kelas X dan XI. Materinya disusun bersama guru PAI, koordinator tahfidz, dan pengurus OSIS.</p>
                <p>Kegiatan yang berjalan setiap hari:</p>
                <ul>
                    <li>Kajian fiqih puasa setelah shalat Dzuhur.</li>
                    <li>Tahsin dan setoran hafalan sebelum berbuka.</li>
                    <li>Qiyamul lail berjamaah pada hari keempat.</li>
                    <li>Bakti sosial membagikan takjil ke warga sekitar kampus.</li>
                </ul>
                <p>Penutupan diisi pembagian hadiah untuk kelompok dengan setoran hafalan terbanyak.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'callout', 'content' => '<p>Peserta membawa buku setoran dan hadir sebelum pukul 07.00. Siswa yang sakit melapor ke wali kelas agar tetap menerima catatan materi.</p>'],
                    ['type' => 'blockquote', 'content' => '<p>Yang paling berat bukan bangun untuk qiyamul lail, tapi melanjutkan setoran hafalan tepat setelahnya.</p>', 'source' => 'Ahmad Zainuddin, siswa X Keagamaan'],
                ]],
                'status' => 'published', 'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Workshop Digital Innovation: Belajar React & Laravel',
                'slug' => 'workshop-react-laravel',
                'category_id' => $catBerita->id,
                'content' => <<<'HTML'
                <p>Lab Komputer SMA XYZ menggelar Workshop Web Development bertema <em>Building Modern Web Apps with React &amp; Laravel</em> selama dua hari. Pesertanya 50 siswa Klub Coding dari kelas X sampai XII.</p>
                <p>Materi hari pertama:</p>
                <ul>
                    <li>Dasar komponen React, props, dan state.</li>
                    <li>Latihan membuat halaman daftar siswa.</li>
                </ul>
                <p>Hari kedua diisi routing, penyimpanan data dengan Laravel, dan cara menampilkan data dari API. Sesi terakhir dipakai untuk demo proyek akhir serta tanya jawab soal karier di bidang perangkat lunak.</p>
                <p>Narasumbernya alumni SMA XYZ angkatan 2017 yang kini bekerja sebagai senior software engineer di perusahaan teknologi di Surabaya.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Jadwal Workshop', 'description' => 'Digelar di Lab Komputer 1 dan 2, peserta dibagi dua ruang.', 'columns' => ['Hari', 'Waktu', 'Materi'], 'rows' => [
                        ['Sabtu', '08.00-12.00', 'Komponen React, props, dan state'],
                        ['Sabtu', '13.00-15.30', 'Latihan halaman daftar siswa'],
                        ['Minggu', '08.00-12.00', 'Routing dan API Laravel'],
                        ['Minggu', '13.00-15.00', 'Demo proyek dan tanya jawab'],
                    ]],
                    ['type' => 'callout', 'content' => '<p>Peserta membawa laptop sendiri dan akun GitHub aktif. Siswa yang belum punya laptop bisa memakai komputer lab dengan mendaftar ke pengurus Klub Coding.</p>'],
                    ['type' => 'blockquote', 'content' => '<p>Yang membedakan bukan siapa yang paling cepat paham, tapi siapa yang berani menyerahkan proyek setengah jadi untuk dikritik.</p>', 'source' => 'Narasumber workshop, alumni SMA XYZ angkatan 2017'],
                    ['type' => 'text', 'content' => <<<'HTML'
                    <p>Lanjutan setelah workshop:</p>
                    <ul>
                        <li>Kelas Flutter untuk 20 siswa, dibuka bulan depan.</li>
                        <li>Portal siswa dikerjakan bersama sebagai tugas akhir Klub Coding.</li>
                    </ul>
                    HTML],
                ]],
                'status' => 'published', 'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Tim Futsal SMA XYZ Juara 1 Sidoarjo High School Cup 2026',
                'slug' => 'futsal-juara-1-sidoarjo-cup-2026',
                'category_id' => $catEkstra->id,
                'content' => <<<'HTML'
                <p>Tim Futsal SMA XYZ menjuarai Sidoarjo High School Cup 2026 setelah menundukkan SMAN 1 Krian 3-2 di partai final. Kapten tim, Adi Nugroho, terpilih sebagai pemain terbaik turnamen.</p>
                <p>Perjalanan tim sejak babak penyisihan:</p>
                <ol>
                    <li>Penyisihan grup: menang 4-1 atas SMAN 2 Sidoarjo.</li>
                    <li>Perempat final: menang 2-0 atas SMK Negeri 1 Buduran.</li>
                    <li>Semifinal: menang adu penalti 5-4 atas SMA Muhammadiyah 1.</li>
                    <li>Final: menang 3-2 atas SMAN 1 Krian.</li>
                </ol>
                <p>Latihan rutin Selasa dan Kamis bersama pelatih M. Rizky Pratama, S.Pd. dilanjutkan untuk persiapan kejuaraan provinsi pada November.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'callout', 'content' => '<p>Seleksi anggota tim untuk musim berikutnya dibuka bagi kelas X dan XI. Latihan percobaan digelar dua kali sebelum seleksi resmi.</p>'],
                    ['type' => 'blockquote', 'content' => '<p>Kami kalah di final tahun lalu. Sekarang anak-anak tahu apa yang harus diperbaiki setelah setiap pertandingan, bukan setelah peluit akhir turnamen.</p>', 'source' => 'M. Rizky Pratama, S.Pd., pelatih tim futsal'],
                    ['type' => 'text', 'content' => <<<'HTML'
                    <p>Persiapan menuju kejuaraan provinsi:</p>
                    <ul>
                        <li>Latihan fisik tambahan setiap Senin pagi.</li>
                        <li>Uji coba melawan dua klub lokal akhir bulan ini.</li>
                        <li>Evaluasi video pertandingan setiap Jumat.</li>
                    </ul>
                    HTML],
                ]],
                'status' => 'published', 'published_at' => now()->subDays(15),
            ],
            [
                'title' => 'Pengumuman Pelaksanaan Ulangan Tengah Semester (UTS) Ganjil',
                'slug' => 'pengumuman-uts-ganjil-2026',
                'category_id' => $catPengumuman->id,
                'content' => <<<'HTML'
                <p>Ulangan Tengah Semester (UTS) ganjil tahun ajaran 2026/2027 dilaksanakan 15-22 Oktober 2026 dengan sistem Computer Based Test (CBT). Jadwal mata pelajaran diunggah di portal siswa dan ditempel di papan pengumuman setiap kelas.</p>
                <p>Ketentuan yang berlaku:</p>
                <ol>
                    <li>Kartu ujian diambil di wali kelas mulai Senin, dua hari sebelum jadwal pertama.</li>
                    <li>Siswa hadir 15 menit sebelum sesi dimulai dan membawa kartu ujian.</li>
                    <li>Perangkat dan akun CBT diuji sendiri melalui simulasi pada 13 Oktober.</li>
                    <li>Siswa yang sakit menyerahkan surat keterangan dokter untuk mengikuti ujian susulan.</li>
                </ol>
                <p>Nilai diumumkan paling lambat dua minggu setelah ujian terakhir dan dibagikan pada pertemuan wali murid.</p>
                HTML,
                'metadata' => ['blocks' => [
                    ['type' => 'table', 'title' => 'Jadwal UTS per Kelas', 'description' => 'Sesi susulan digelar 23-24 Oktober 2026 setelah jam pelajaran.', 'columns' => ['Hari', 'Kelas X', 'Kelas XI', 'Kelas XII'], 'rows' => [
                        ['Kamis, 15 Oktober', 'Matematika', 'Bahasa Indonesia', 'Matematika'],
                        ['Jumat, 16 Oktober', 'Bahasa Inggris', 'Matematika', 'Bahasa Indonesia'],
                        ['Senin, 19 Oktober', 'Fisika', 'Biologi', 'Fisika'],
                        ['Selasa, 20 Oktober', 'Biologi', 'Kimia', 'Biologi'],
                    ]],
                    ['type' => 'callout', 'content' => '<p>Kartu ujian wajib dibawa pada setiap sesi. Peserta yang lupa membawa kartu tetap boleh mengikuti ujian setelah konfirmasi ke wali kelas.</p>'],
                    ['type' => 'text', 'content' => <<<'HTML'
                    <p>Sebelum ujian dimulai, pastikan hal teknis ini:</p>
                    <ul>
                        <li>Password akun CBT sudah dicoba pada sesi simulasi.</li>
                        <li>Nomor sesi dan ruang ujian dibaca ulang sehari sebelumnya.</li>
                        <li>Komputer lab sudah tertutup dari aplikasi selain CBT.</li>
                    </ul>
                    HTML],
                ]],
                'status' => 'published', 'published_at' => now()->subDays(3),
            ],
        ];

        // 5. Posts - Agenda (dengan metadata event_date & location)
        $agendaData = [
            [
                'title' => 'Pertemuan Wali Murid & Pembagian Lapor Mid Semester',
                'slug' => 'pertemuan-wali-murid-mid-semester',
                'category_id' => $catAgenda->id,
                'content' => <<<'HTML'
                <p>Pertemuan wali murid kelas X sampai XII untuk menerima laporan hasil belajar pertengahan semester ganjil. Agendanya sosialisasi perkembangan belajar, penyerahan laporan, dan konsultasi dengan wali kelas.</p>
                <p>Orang tua diharapkan datang tepat waktu karena sesi konsultasi dibagi per kelas.</p>
                HTML,
                'metadata' => [
                    'event_date' => now()->addDays(7)->toDateString(),
                    'location' => 'Aula Utama SMA XYZ',
                    'blocks' => [
                        ['type' => 'table', 'title' => 'Rundown Pertemuan', 'description' => 'Waktu dapat bergeser mengikuti jumlah orang tua yang hadir.', 'columns' => ['Waktu', 'Agenda', 'Penanggung Jawab'], 'rows' => [
                            ['07.30-08.00', 'Registrasi dan pengambilan nomor kelas', 'Panitia OSIS'],
                            ['08.00-08.30', 'Sambutan kepala sekolah', 'Dr. H. Ahmad Dahlan, M.Pd.'],
                            ['08.30-10.00', 'Penyerahan laporan hasil belajar', 'Wali kelas'],
                            ['10.00-10.30', 'Konsultasi dan tanya jawab', 'Waka Kurikulum'],
                        ]],
                        ['type' => 'callout', 'content' => '<p>Orang tua yang tidak bisa hadir dapat mengambil laporan di ruang wali kelas pada hari kerja berikutnya, pukul 08.00-14.00.</p>'],
                    ],
                ],
                'status' => 'published', 'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Ulangan Tengah Semester (UTS) Ganjil 2026',
                'slug' => 'agenda-uts-ganjil-2026',
                'category_id' => $catAgenda->id,
                'content' => 'Pelaksanaan ujian tertulis dan praktikum CBT untuk seluruh kelas X, XI, dan XII.',
                'metadata' => ['event_date' => now()->addDays(14)->toDateString(), 'location' => 'Ruang Ujian CBT SMA XYZ'],
                'status' => 'published', 'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Peringatan Hari Santri Nasional & Pawai Taaruf',
                'slug' => 'hari-santri-nasional-2026',
                'category_id' => $catAgenda->id,
                'content' => 'Upacara bendera peringatan Hari Santri dilanjutkan pawai taaruf keliling Krian.',
                'metadata' => ['event_date' => now()->addDays(25)->toDateString(), 'location' => 'Lapangan Utama SMA XYZ'],
                'status' => 'published', 'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Try Out Ujian Mandiri & SNBT 2027 Serentak',
                'slug' => 'tryout-snbt-2027',
                'category_id' => $catAgenda->id,
                'content' => <<<'HTML'
                <p>Simulasi ujian masuk PTN bagi seluruh siswa kelas XII, bekerja sama dengan lembaga bimbingan belajar nasional. Hasil try out dipakai untuk memetakan kesiapan siswa pada setiap subtes.</p>
                <p>Nilai dan pembahasannya dibagikan ke siswa dua pekan setelah pelaksanaan.</p>
                HTML,
                'metadata' => [
                    'event_date' => now()->addDays(35)->toDateString(),
                    'location' => 'Lab Komputer 1, 2, dan 3',
                    'blocks' => [
                        ['type' => 'text', 'content' => <<<'HTML'
                        <p>Subtes yang diujikan mengikuti pola SNBT:</p>
                        <ul>
                            <li>Penalaran umum.</li>
                            <li>Pengetahuan dan pemahaman umum.</li>
                            <li>Pemahaman bacaan dan menulis.</li>
                            <li>Pengetahuan kuantitatif.</li>
                            <li>Literasi bahasa Indonesia dan bahasa Inggris.</li>
                            <li>Penalaran matematika.</li>
                        </ul>
                        HTML],
                        ['type' => 'callout', 'content' => '<p>Peserta membawa kartu peserta dan memakai akun try out sekolah. Sesi dibagi tiga gelombang, satu gelombang 40 siswa.</p>'],
                    ],
                ],
                'status' => 'published', 'published_at' => now()->subDays(4),
            ],
            [
                'title' => 'Pentas Seni & Pameran Karya Kewirausahaan Siswa',
                'slug' => 'pensi-pameran-karya-2026',
                'category_id' => $catAgenda->id,
                'content' => 'Ajang kreativitas siswa menampilkan seni budaya Islam, bazar kewirausahaan, dan pameran produk digital.',
                'metadata' => ['event_date' => now()->addDays(50)->toDateString(), 'location' => 'Halaman Kampus SMA XYZ'],
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
                'content' => 'Tim Futsal SMA XYZ menjuarai turnamen futsal antar SMA se-Kabupaten Sidoarjo.',
                'metadata' => ['participant_name' => 'Tim Futsal SMA XYZ', 'rank' => 'Juara 1', 'year' => 2026],
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
            ['title' => 'dr. Farhan Al-Ghifari', 'content' => "Pendidikan di SMA XYZ memberi dua fondasi penting: disiplin sains akademik dan hafalan Al-Qur'an yang menenangkan jiwa saat tekanan kuliah kedokteran.", 'slug' => 'dr-farhan-al-ghifari', 'metadata' => ['graduation_year' => 2020, 'current_profession' => 'Dokter Muda / Mahasiswa FK Universitas Airlangga']],
            ['title' => 'Nabila Syakira, S.T.', 'content' => 'Klub Komputer dan Coding di SMA XYZ menjadi pintu awal karir saya di industri IT nasional. Guru-gurunya sangat mendukung bakat siswa!', 'slug' => 'nabila-syakira', 'metadata' => ['graduation_year' => 2021, 'current_profession' => 'Cloud Engineer di Bank Syariah Indonesia Jakarta']],
            ['title' => 'Muhammad Hafiz, Lc.', 'content' => 'Bimbingan Bahasa Arab intensif di SMA XYZ memudahkan saya lolos seleksi beasiswa Al-Azhar Mesir tanpa kendala bahasa.', 'slug' => 'muhammad-hafiz', 'metadata' => ['graduation_year' => 2019, 'current_profession' => 'Alumni Universitas Al-Azhar Kairo / Dai Muda']],
            ['title' => 'Anisa Rahmawati, S.M.', 'content' => 'Pameran Kewirausahaan di sekolah mengajarkan saya berani eksekusi ide bisnis sejak kelas 11. Bangga menjadi alumni SMA XYZ.', 'slug' => 'anisa-rahmawati', 'metadata' => ['graduation_year' => 2022, 'current_profession' => 'Entrepreneur / Founder Startup Fashion Muslim Sidoarjo']],
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
            ['name' => 'Dr. H. Ahmad Dahlan, M.Pd.',       'role' => 'Kepala Sekolah',              'type' => 'gtk',    'email' => 'dahlan@smaxyz.sch.id',  'phone' => '081234567890'],
            ['name' => 'Rina Wulandari, M.Si.',             'role' => 'Waka Kurikulum / Guru Fisika', 'type' => 'guru',   'email' => 'rina@smaxyz.sch.id',    'phone' => '081234567891'],
            ['name' => 'M. Rizky Pratama, S.Pd.',           'role' => 'Waka Kesiswaan / Guru PJOK',  'type' => 'guru',   'email' => 'rizky@smaxyz.sch.id',   'phone' => '081234567892'],
            ['name' => 'Siti Aminah, S.Pd.',                'role' => 'Waka Humas / Guru B. Inggris', 'type' => 'guru',   'email' => 'aminah@smaxyz.sch.id',  'phone' => '081234567893'],
            ['name' => 'Ustadz H. Abdul Samad, Lc., M.H.', 'role' => 'Guru PAI & Koordinator Tahfidz', 'type' => 'guru', 'email' => 'samad@smaxyz.sch.id',   'phone' => '081234567894'],
            ['name' => 'Budi Santoso, S.Kom.',              'role' => 'Kepala Tata Usaha / IT Staff', 'type' => 'tendik', 'email' => 'budi@smaxyz.sch.id',    'phone' => '081234567895'],
            ['name' => 'Dewi Kartika, S.Si.',               'role' => 'Guru Biologi & Pembina OSIS',  'type' => 'guru',   'email' => 'dewi@smaxyz.sch.id',    'phone' => '081234567896'],
            ['name' => 'Eko Prasetyo, S.Pd.',               'role' => 'Guru Matematika',              'type' => 'guru',   'email' => 'eko@smaxyz.sch.id',     'phone' => '081234567897'],
            ['name' => 'Hj. Nurul Hidayah, S.Ag.',          'role' => 'Guru Bahasa Arab',             'type' => 'guru',   'email' => 'nurul@smaxyz.sch.id',   'phone' => '081234567898'],
            ['name' => 'Bambang Utomo, A.Md.',              'role' => 'Staf Perpustakaan',            'type' => 'tendik', 'email' => 'bambang@smaxyz.sch.id', 'phone' => '081234567899'],
        ];
        foreach ($staffData as $s) {
            Staff::updateOrCreate(['email' => $s['email']], $s);
        }

        // 8. Galleries (disimpan sebagai posts kategori galeri)
        $catGaleri = Category::firstOrCreate(['slug' => 'galeri'], ['name' => 'Galeri', 'show_on_home' => false]);
        $galleriesData = [
            'Upacara Peringatan Hari Kemerdekaan RI di SMA XYZ',
            'Kunjungan Edukasi Industri Komputer Siswa SMA XYZ',
            'Wisuda Tahfidz Al-Qur\'an Angkatan ke-15',
            'Juara Futsal Sidoarjo High School Cup 2026',
            'Bakti Sosial & Pembagian Takjil Ramadhan',
            'Praktikum Biologi Ekosistem di Lab IPA Terpadu',
            'Pentas Seni Islam & Bazar Kewirausahaan',
            'Studi Lapangan Pelatihan Kepemimpinan OSIS',
        ];
        foreach ($galleriesData as $title) {
            Post::updateOrCreate(['slug' => Str::slug($title)], [
                'user_id' => $humas->id,
                'category_id' => $catGaleri->id,
                'title' => $title,
                'content' => '',
                'media_type' => 'image',
                'status' => 'published',
                'published_at' => now(),
            ]);
        }

        Post::updateOrCreate(['slug' => 'dokumentasi-video-pesantren-kilat'], [
            'user_id' => $humas->id,
            'category_id' => $catGaleri->id,
            'title' => 'Dokumentasi Video: Dokumentasi Video Pesantren Kilat Ramadhan',
            'content' => 'Video dokumentasi kegiatan Pesantren Kilat Ramadhan yang diikuti seluruh siswa kelas X dan XI.',
            'media_type' => 'video',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
