<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Once;

class SiteSetting extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['key', 'value', 'type', 'group_name', 'updated_at'];

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => Once::flush());
        static::deleted(fn () => Once::flush());
    }

    /**
     * @return Collection<int, SiteSetting>
     */
    public static function allCached(): Collection
    {
        return once(fn () => static::all());
    }

    public static function getVal(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();

        return $setting ? $setting->value : $default;
    }

    public static function getNavItems(): array
    {
        $items = json_decode(
            (string) static::allCached()->firstWhere('key', 'nav_items')?->value,
            true
        );

        return is_array($items) ? $items : [];
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    public static function saveNavItems(array $items): void
    {
        static::updateOrCreate(
            ['key' => 'nav_items'],
            ['value' => json_encode(array_values($items)), 'updated_at' => now()],
        );
    }
}
