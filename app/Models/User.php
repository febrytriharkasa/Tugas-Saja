<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Support\PublicCache;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'is_active', 'password_reset_requested_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'password_reset_requested_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saved(fn () => PublicCache::forgetHome());
        static::deleted(fn () => PublicCache::forgetHome());
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }

    public function canAccessAdmin(): bool
    {
        return in_array($this->role, ['staff', 'admin', 'superadmin'], true) && $this->is_active;
    }

    public function canManageContent(): bool
    {
        return in_array($this->role, ['admin', 'superadmin'], true) && $this->is_active;
    }
}
