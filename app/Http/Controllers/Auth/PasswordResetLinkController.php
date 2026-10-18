<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->string('email'))->first();

        if (! $user) {
            return back()->with('status', 'Jika email tersebut terdaftar, permintaan reset akan kami catat.');
        }

        if (! $user->is_active) {
            return back()->with('status', 'Akun ini belum disetujui superadmin, jadi kata sandi belum bisa direset.');
        }

        $user->password_reset_requested_at = now();
        $user->save();

        return back()->with('status', 'Permintaan reset tercatat. Kata sandi baru dikirim ke email Anda setelah superadmin memprosesnya.');
    }
}
