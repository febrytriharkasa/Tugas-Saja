<?php

namespace App\Models;

use App\Support\PublicCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Page extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'content', 'image', 'metadata', 'is_published'];

    protected $casts = [
        'metadata' => 'array',
        'is_published' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saved(function () {
            PublicCache::forgetPages();
            PublicCache::forgetFooterLinks();
        });
        static::deleted(function () {
            PublicCache::forgetPages();
            PublicCache::forgetFooterLinks();
        });
    }

    /**
     * @return array{draftSlugs: array<int, string>, customPages: array<int, array{title: string, slug: string}>}
     */
    public static function cachedLists(): array
    {
        return once(fn (): array => Cache::remember(
            PublicCache::PAGE_LISTS,
            now()->addMinutes(PublicCache::SHELL_TTL_MINUTES),
            fn (): array => [
                'draftSlugs' => static::query()
                    ->where('is_published', false)
                    ->orderBy('title')
                    ->pluck('slug')
                    ->all(),
                'customPages' => static::query()
                    ->where('is_published', true)
                    ->orderBy('title')
                    ->get(['title', 'slug'])
                    ->toArray(),
            ],
        ));
    }
}
