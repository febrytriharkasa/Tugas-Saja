<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AccountApprovedNotification;
use App\Notifications\AdminPasswordResetNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $role = in_array($request->query('role'), ['staff', 'admin', 'superadmin'], true)
            ? $request->query('role')
            : null;
        $status = in_array($request->query('status'), ['active', 'pending', 'reset_requested'], true)
            ? $request->query('status')
            : null;
        $search = trim((string) $request->query('search', ''));

        $users = User::query()
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($role, fn ($query) => $query->where('role', $role))
            ->when($status === 'active', fn ($query) => $query->where('is_active', true))
            ->when($status === 'pending', fn ($query) => $query->where('is_active', false))
            ->when($status === 'reset_requested', fn ($query) => $query->whereNotNull('password_reset_requested_at'))
            ->orderByRaw("CASE role WHEN 'superadmin' THEN 1 WHEN 'admin' THEN 2 ELSE 3 END")
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'status' => $status,
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['staff', 'admin', 'superadmin'])],
            'is_active' => ['required', 'boolean'],
        ]);

        $this->protectLastSuperAdmin($user, $validated['role'], $validated['is_active']);
        $wasInactive = ! $user->is_active;

        $user->fill($validated);

        if ($wasInactive && $user->is_active && $user->email_verified_at === null) {
            $user->email_verified_at = now();
        }

        $user->save();

        if ($wasInactive && $user->is_active) {
            $user->notify(new AccountApprovedNotification);
        }

        return back()->with('success', 'Akun pengguna berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            throw ValidationException::withMessages(['user' => 'Akun yang sedang digunakan tidak dapat dihapus.']);
        }

        $this->protectLastSuperAdmin($user, 'staff', false);
        $user->delete();

        return back()->with('success', 'Akun pengguna berhasil dihapus.');
    }

    public function resetPassword(User $user): RedirectResponse
    {
        if (! $user->is_active) {
            throw ValidationException::withMessages(['user' => 'Setujui akun sebelum mengirim password baru.']);
        }

        $password = Str::password(12);
        $user->password_reset_requested_at = null;
        $user->update([
            'password' => Hash::make($password),
        ]);
        $user->notify(new AdminPasswordResetNotification($password));

        return back()->with('success', "Password baru sudah dikirim ke {$user->email}.");
    }

    private function protectLastSuperAdmin(User $user, string $newRole, bool $isActive): void
    {
        if (! $user->isSuperAdmin() || ($newRole === 'superadmin' && $isActive)) {
            return;
        }

        if (User::where('role', 'superadmin')->where('is_active', true)->whereKeyNot($user->id)->doesntExist()) {
            throw ValidationException::withMessages([
                'role' => 'Minimal satu superadmin aktif harus tersedia.',
            ]);
        }
    }
}
