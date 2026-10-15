<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatBotController extends Controller
{
    public function send(Request $request)
    {
        if (SiteSetting::getVal('chat_enabled', '1') === '0') {
            return response()->json(['error' => 'Fitur chat sedang dinonaktifkan.'], 403);
        }

        $validated = $request->validate([
            'session_token' => 'nullable|string',
            'message' => 'required|string|max:1000',
        ]);

        $token = $validated['session_token'] ?? (string) Str::uuid();

        $session = ChatSession::firstOrCreate(
            ['session_token' => $token],
            ['created_at' => now()]
        );

        ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => 'user',
            'content' => $validated['message'],
            'created_at' => now(),
        ]);

        $reply = $this->generateResponse($validated['message']);

        ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => 'assistant',
            'content' => $reply,
            'created_at' => now(),
        ]);

        return response()->json([
            'session_token' => $token,
            'reply' => $reply,
        ]);
    }

    private function generateResponse(string $message): string
    {
        $msg = strtolower($message);

        if (str_contains($msg, 'ppdb') || str_contains($msg, 'daftar') || str_contains($msg, 'biaya') || str_contains($msg, 'syarat')) {
            return 'Pendaftaran Peserta Didik Baru (PPDB) SMA XYZ saat ini telah dibuka. Pendaftaran dapat diakses daring melalui tombol "Daftar PPDB" di navigasi atas atau datang langsung ke sekretariat pendaftaran di kampus sekolah setiap hari kerja.';
        }

        if (str_contains($msg, 'alamat') || str_contains($msg, 'lokasi') || str_contains($msg, 'dimana')) {
            return 'SMA XYZ berlokasi di Jl. Kyai Mojo No. 1, Krian, Kabupaten Sidoarjo, Jawa Timur.';
        }

        if (str_contains($msg, 'kontak') || str_contains($msg, 'telepon') || str_contains($msg, 'email') || str_contains($msg, 'wa') || str_contains($msg, 'whatsapp')) {
            return 'Anda dapat menghubungi sekretariat kami di telepon (031) 8971234 atau email resmi info@smaxyz.sch.id pada jam operasional Senin - Jumat (07.00 - 15.30 WIB).';
        }

        if (str_contains($msg, 'jurusan') || str_contains($msg, 'program') || str_contains($msg, 'kurikulum') || str_contains($msg, 'akademik')) {
            return 'SMA XYZ menyelenggarakan Kurikulum Merdeka dengan peminatan MIPA, IPS, dan Keagamaan, didukung program unggulan Tahfidzul Quran, Digital Innovation Class, dan Bahasa Asing (Arab & Inggris).';
        }

        return 'Terima kasih telah menghubungi SMA XYZ AI Assistant. Ada yang bisa kami bantu terkait PPDB, program akademik, fasilitas, atau informasi kontak sekolah?';
    }
}
