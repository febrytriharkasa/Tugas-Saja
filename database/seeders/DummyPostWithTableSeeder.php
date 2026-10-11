<?php

namespace Database\Seeders;

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

        // 1. Prestasi
        Post::updateOrCreate(
            ['slug' => 'juara-olimpiade-sains-nasional-2026-tingkat-provinsi'],
            [
                'user_id' => $user->id,
                'category_id' => 4,
                'title' => 'Siswa SMA XYZ Raih Prestasi Gemilang di OSN Tingkat Provinsi Jawa Timur 2026',
                'content' => "Prestasi membanggakan kembali ditorehkan oleh siswa-siswi SMA XYZ dalam ajang Olimpiade Sains Nasional (OSN) Tingkat Provinsi Jawa Timur tahun 2026.\n\nKompetisi bergengsi ini diikuti oleh ratusan peserta dari berbagai SMA/MA se-Jawa Timur. Berkat kerja keras, bimbingan intensif para guru pembina, dan doa keluarga besar sekolah, tiga siswa berhasil mengamankan gelar juara dan berhak melaju ke tingkat nasional.\n\nPihak sekolah menyampaikan apresiasi setinggi-tingginya kepada para delegasi dan pembimbing atas capaian yang mengharumkan nama sekolah di kancah provinsi.",
                'status' => 'published',
                'published_at' => now()->subDays(2),
                'metadata' => [
                    'tingkat' => 'Provinsi',
                    'tahun' => '2026',
                    'achievement_table' => [
                        ['name' => 'Ahmad Fauzi (XII MIPA 1)', 'rank' => 'Juara 1', 'event' => 'Olimpiade Fisika'],
                        ['name' => 'Nabila Putri (XI MIPA 3)', 'rank' => 'Juara 2', 'event' => 'Olimpiade Kimia'],
                        ['name' => 'Rizky Pratama (XII MIPA 2)', 'rank' => 'Juara Harapan 1', 'event' => 'Olimpiade Matematika'],
                    ],
                ],
            ]
        );

        // 2. Pengumuman
        Post::updateOrCreate(
            ['slug' => 'pengumuman-hasil-seleksi-olimpiade-internal-dan-delegasi-sekolah-2026'],
            [
                'user_id' => $user->id,
                'category_id' => 2,
                'title' => 'Pengumuman Hasil Seleksi Delegasi Kompetisi Akademik Internal Semester Genap 2026',
                'content' => "Berdasarkan hasil penilaian seleksi berkas dan tes tulis internal yang diselenggarakan pada tanggal 10-12 Maret 2026, berikut kami umumkan daftar siswa terpilih sebagai delegasi resmi sekolah.\n\nSiswa yang tercantum pada tabel di bawah ini diwajibkan mengikuti pembinaan terpusat yang akan dimulai pada Senin mendatang di Ruang Multimedia.\n\nKeputusan dewan juri bersifat mutlak dan tidak dapat diganggu gugat. Selamat kepada seluruh peserta terpilih.",
                'status' => 'published',
                'published_at' => now()->subDay(),
                'metadata' => [
                    'nomor_surat' => '045/SMA-M/PENG/III/2026',
                    'achievement_table' => [
                        ['name' => 'Dewi Sartika (X-A)', 'rank' => 'Peringkat 1', 'event' => 'Debat Bahasa Inggris'],
                        ['name' => 'Fahmi Idris (XI-MIPA 2)', 'rank' => 'Peringkat 2', 'event' => 'Karya Tulis Ilmiah Remaja'],
                        ['name' => 'Zahra Aulia (X-C)', 'rank' => 'Peringkat 3', 'event' => 'Pidato Bahasa Arab'],
                    ],
                ],
            ]
        );

        // 3. Ekstrakurikuler
        Post::updateOrCreate(
            ['slug' => 'rekap-perolehan-medali-kejuaraan-tapak-suci-piala-bupati-2026'],
            [
                'user_id' => $user->id,
                'category_id' => 8,
                'title' => 'Kontingen Tapak Suci SMA XYZ Bawa Pulang 4 Medali pada Kejuaraan Piala Bupati 2026',
                'content' => "Keluarga besar SMA XYZ kembali bersyukur atas capaian membanggakan dari kontingen Ekstrakurikuler Tapak Suci Putera Muhammadiyah.\n\nDalam kejuaraan terbuka tingkat kabupaten yang berlangsung akhir pekan lalu, para atlet muda berhasil menampilkan teknik terbaik dan sportivitas tinggi, sehingga mengumpulkan medali di berbagai kelas tanding.\n\nBerikut rekapitulasi capaian kontingen sekolah:",
                'status' => 'published',
                'published_at' => now(),
                'metadata' => [
                    'cabang' => 'Tapak Suci',
                    'lokasi' => 'GOR Serbaguna',
                    'achievement_table' => [
                        ['name' => 'Muhammad Ilham (XI IPS 1)', 'rank' => 'Medali Emas', 'event' => 'Tanding Kelas C Putra'],
                        ['name' => 'Farhan Ramadhan (X-B)', 'rank' => 'Medali Perak', 'event' => 'Tanding Kelas D Putra'],
                        ['name' => 'Aisyah Nur (XI MIPA 4)', 'rank' => 'Medali Perunggu', 'event' => 'Seni Tunggal Putri'],
                        ['name' => 'Tim Beregu Putra', 'rank' => 'Medali Emas', 'event' => 'Seni Beregu Putra'],
                    ],
                ],
            ]
        );
    }
}
