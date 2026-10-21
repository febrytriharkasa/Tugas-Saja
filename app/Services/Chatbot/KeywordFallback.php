<?php

namespace App\Services\Chatbot;

/**
 * Jawaban cadangan tanpa LLM. Deterministik: teksnya identik setiap kali,
 * jadi bisa dipakai sebagai patokan pengujian. Semua fakta diambil dari
 * site_settings lewat SchoolContext::profile() supaya tidak berbeda dengan
 * jawaban AI.
 */
class KeywordFallback
{
    public function respond(string $message): string
    {
        $msg = strtolower($message);
        $p = SchoolContext::profile();

        if (str_contains($msg, 'ppdb') || str_contains($msg, 'daftar') || str_contains($msg, 'biaya') || str_contains($msg, 'syarat')) {
            return "Pendaftaran Peserta Didik Baru (PPDB) {$p['name']} saat ini telah dibuka. Pendaftaran dapat diakses daring melalui {$p['ppdb']} atau datang langsung ke sekretariat pendaftaran di kampus sekolah setiap hari kerja.";
        }

        if (str_contains($msg, 'alamat') || str_contains($msg, 'lokasi') || str_contains($msg, 'dimana')) {
            return "{$p['name']} berlokasi di {$p['address']}.";
        }

        if (str_contains($msg, 'kontak') || str_contains($msg, 'telepon') || str_contains($msg, 'email') || str_contains($msg, 'wa') || str_contains($msg, 'whatsapp')) {
            return "Anda dapat menghubungi sekretariat kami di telepon {$p['phone']} atau email resmi {$p['email']} pada jam operasional {$p['hours']}.";
        }

        if (str_contains($msg, 'jurusan') || str_contains($msg, 'program') || str_contains($msg, 'kurikulum') || str_contains($msg, 'akademik')) {
            return "{$p['name']} menyelenggarakan Kurikulum Merdeka dengan peminatan MIPA, IPS, dan Keagamaan, didukung program unggulan Tahfidzul Quran, Digital Innovation Class, dan Bahasa Asing (Arab & Inggris).";
        }

        return "Terima kasih telah menghubungi {$p['name']} AI Assistant. Ada yang bisa kami bantu terkait PPDB, program akademik, fasilitas, atau informasi kontak sekolah?";
    }
}
