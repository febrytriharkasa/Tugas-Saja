<?php

namespace App\Models;

use App\Support\PublicCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

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
        static::saved(function () {
            PublicCache::forgetSettings();
            PublicCache::forgetFooterLinks();
        });
        static::deleted(function () {
            PublicCache::forgetSettings();
            PublicCache::forgetFooterLinks();
        });
    }

    /**
     * @return Collection<int, SiteSetting>
     */
    public static function allCached(): Collection
    {
        return once(function (): Collection {
            $rows = Cache::remember(
                PublicCache::SETTINGS,
                now()->addMinutes(PublicCache::SHELL_TTL_MINUTES),
                fn () => static::query()->get()->toArray(),
            );

            return static::hydrate($rows);
        });
    }

    public static function getVal(string $key, $default = null)
    {
        $setting = static::allCached()->firstWhere('key', $key);

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
