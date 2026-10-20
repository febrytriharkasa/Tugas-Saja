<?php

namespace App\Models;

use App\Support\PublicCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'role', 'type', 'photo', 'email', 'phone'];

    protected static function booted(): void
    {
        static::saved(fn () => PublicCache::forgetHome());
        static::deleted(fn () => PublicCache::forgetHome());
    }
}
