<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DummyPostWithTableSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (! $user) {
            return;
        }

        $prestasi = Category::firstOrCreate(['slug' => 'prestasi'], ['name' => 'Prestasi']);
        $pengumuman = Category::firstOrCreate(['slug' => 'pengumuman'], ['name' => 'Pengumuman']);
        $ekstra = Category::firstOrCreate(['slug' => 'ekstrakurikuler'], ['name' => 'Ekstrakurikuler']);

        // 1. Prestasi
        Post::updateOrCreate(
            ['slug' => 'juara-olimpiade-sains-nasional-2026-tingkat-provinsi'],
            [
                'user_id' => $user->id,
                'category_id' => $prestasi->id,
                'title' => 'Siswa SMA XYZ Raih Prestasi Gemilang di OSN Tingkat Provinsi Jawa Timur 2026',
                'content' => <<<'HTML'
                <p>Tiga siswa SMA XYZ meraih medali pada Olimpiade Sains Nasional (OSN) tingkat Provinsi Jawa Timur 2026. Sebelumnya mereka lolos seleksi kabupaten dan mengikuti pembinaan intensif di sekolah selama tiga bulan.</p>
                <p>Dua dari tiga delegasi berhak melaju ke tingkat nasional:</p>
                <ul>
                    <li>Medali emas Olimpiade Fisika: Ahmad Fauzi (XII MIPA 1).</li>
                    <li>Medali perak Olimpiade Kimia: Nabila Putri (XI MIPA 3).</li>
                    <li>Juara harapan 1 Olimpiade Matematika: Rizky Pratama (XII MIPA 2).</li>
                </ul>
                <p>Sekolah berterima kasih kepada para delegasi, guru pembina, dan orang tua yang mendampingi selama masa pembinaan.</p>
                HTML,
                'status' => 'published',
                'published_at' => now()->subDays(2),
                'metadata' => [
                    'tingkat' => 'Provinsi',
                    'tahun' => '2026',
                    'blocks' => [
                        ['type' => 'table', 'title' => 'Perolehan Medali OSN Provinsi', 'description' => 'Diumumkan pada penutupan OSN Jawa Timur 2026 di Surabaya.', 'columns' => ['Nama / Kelas', 'Peringkat', 'Keterangan'], 'rows' => [
                            ['Ahmad Fauzi (XII MIPA 1)', 'Juara 1', 'Olimpiade Fisika'],
                            ['Nabila Putri (XI MIPA 3)', 'Juara 2', 'Olimpiade Kimia'],
                            ['Rizky Pratama (XII MIPA 2)', 'Juara Harapan 1', 'Olimpiade Matematika'],
                        ]],
                        ['type' => 'blockquote', 'content' => '<p>Soal nomor empat sempat saya lewatkan. Guru pembina mengajarkan untuk kembali ke soal sulit setelah yang mudah selesai.</p>', 'source' => 'Ahmad Fauzi, peraih medali emas Olimpiade Fisika'],
                        ['type' => 'callout', 'content' => '<p>Pembinaan menuju OSN nasional digelar Senin, Rabu, dan Jumat di Laboratorium IPA Terpadu, pukul 14.00-17.00.</p>'],
                    ],
                ],
            ]
        );

        // 2. Pengumuman
        Post::updateOrCreate(
            ['slug' => 'pengumuman-hasil-seleksi-olimpiade-internal-dan-delegasi-sekolah-2026'],
            [
                'user_id' => $user->id,
                'category_id' => $pengumuman->id,
                'title' => 'Pengumuman Hasil Seleksi Delegasi Kompetisi Akademik Internal Semester Genap 2026',
                'content' => <<<'HTML'
                <p>Seleksi delegasi kompetisi akademik internal digelar 10-12 Maret 2026 melalui penilaian berkas dan tes tulis. Panitia menetapkan tiga siswa dengan nilai tertinggi sebagai delegasi resmi sekolah.</p>
                <p>Langkah bagi peserta yang dinyatakan lolos:</p>
                <ol>
                    <li>Mengikuti pembinaan terpusat di Ruang Multimedia mulai Senin pekan depan.</li>
                    <li>Menyerahkan jadwal kegiatan pribadi ke pembina untuk menyusun waktu latihan.</li>
                    <li>Mengikuti uji coba internal sebelum keberangkatan lomba.</li>
                </ol>
                <p>Keputusan dewan juri bersifat mutlak. Peserta lain dipersilakan mengikuti seleksi pada periode berikutnya.</p>
                HTML,
                'status' => 'published',
                'published_at' => now()->subDay(),
                'metadata' => [
                    'nomor_surat' => '045/SMA-M/PENG/III/2026',
                    'blocks' => [
                        ['type' => 'table', 'title' => 'Hasil Seleksi Delegasi', 'description' => 'Nilai akhir gabungan berkas (40 persen) dan tes tulis (60 persen).', 'columns' => ['Nama / Kelas', 'Peringkat', 'Bidang'], 'rows' => [
                            ['Dewi Sartika (X-A)', 'Peringkat 1', 'Debat Bahasa Inggris'],
                            ['Fahmi Idris (XI-MIPA 2)', 'Peringkat 2', 'Karya Tulis Ilmiah Remaja'],
                            ['Zahra Aulia (X-C)', 'Peringkat 3', 'Pidato Bahasa Arab'],
                        ]],
                        ['type' => 'callout', 'content' => '<p>Peserta yang ingin meninjau nilai bisa menemui panitia di ruang tata usaha pada hari kerja, pukul 08.00-14.00.</p>'],
                        ['type' => 'text', 'content' => <<<'HTML'
                        <p>Hal yang dibawa peserta pada pembinaan pertama:</p>
                        <ul>
                            <li>Naskah atau materi lomba yang sudah disiapkan.</li>
                            <li>Catatan hasil tes tulis untuk dibahas bersama pembina.</li>
                            <li>Buku catatan latihan baru.</li>
                        </ul>
                        HTML],
                    ],
                ],
            ]
        );

        // 3. Ekstrakurikuler
        Post::updateOrCreate(
            ['slug' => 'rekap-perolehan-medali-kejuaraan-tapak-suci-piala-bupati-2026'],
            [
                'user_id' => $user->id,
                'category_id' => $ekstra->id,
                'title' => 'Kontingen Tapak Suci SMA XYZ Bawa Pulang 4 Medali pada Kejuaraan Piala Bupati 2026',
                'content' => <<<'HTML'
                <p>Kontingen Tapak Suci SMA XYZ membawa pulang empat medali dari kejuaraan terbuka tingkat kabupaten di GOR Serbaguna akhir pekan lalu. Tiga atlet bertanding di kelas tanding dan satu tim turun di kelas seni beregu.</p>
                <p>Pelatih menilai para atlet sudah menerapkan pola serangan yang dilatih dua bulan terakhir, meski dua pertandingan berjalan ketat sampai babak tambahan.</p>
                <p>Medali yang diraih:</p>
                <ul>
                    <li>Emas tanding kelas C putra: Muhammad Ilham (XI IPS 1).</li>
                    <li>Perak tanding kelas D putra: Farhan Ramadhan (X-B).</li>
                    <li>Perunggu seni tunggal putri: Aisyah Nur (XI MIPA 4).</li>
                    <li>Emas seni beregu putra: tim beregu Tapak Suci SMA XYZ.</li>
                </ul>
                <p>Latihan rutin berjalan kembali setiap Selasa dan Jumat di halaman kampus.</p>
                HTML,
                'status' => 'published',
                'published_at' => now(),
                'metadata' => [
                    'cabang' => 'Tapak Suci',
                    'lokasi' => 'GOR Serbaguna',
                    'blocks' => [
                        ['type' => 'table', 'title' => 'Perolehan Medali Kejuaraan', 'description' => 'Kejuaraan terbuka Piala Bupati 2026, kelas tanding dan seni.', 'columns' => ['Nama / Kelas', 'Peringkat', 'Keterangan'], 'rows' => [
                            ['Muhammad Ilham (XI IPS 1)', 'Medali Emas', 'Tanding Kelas C Putra'],
                            ['Farhan Ramadhan (X-B)', 'Medali Perak', 'Tanding Kelas D Putra'],
                            ['Aisyah Nur (XI MIPA 4)', 'Medali Perunggu', 'Seni Tunggal Putri'],
                            ['Tim Beregu Putra', 'Medali Emas', 'Seni Beregu Putra'],
                        ]],
                        ['type' => 'blockquote', 'content' => '<p>Dua atlet kami kalah di babak tambahan, dan itu bukan lagi soal tenaga. Dari sana mereka belajar membaca lawan sampai detik terakhir.</p>', 'source' => 'M. Rizky Pratama, S.Pd., pembina ekstrakurikuler'],
                        ['type' => 'callout', 'content' => '<p>Seleksi atlet baru untuk kejuaraan berikutnya dibuka bagi kelas X. Latihan percobaan berjalan setiap Jumat sore di halaman kampus.</p>'],
                    ],
                ],
            ]
        );
    }
}
