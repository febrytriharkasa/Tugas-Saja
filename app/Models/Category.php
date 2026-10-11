<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    /**
     * Categories the home page always renders, in order, regardless of show_on_home.
     *
     * @var list<string>
     */
    public const FIXED_HOME_SLUGS = ['berita'];

    protected $fillable = ['name', 'slug', 'metadata', 'metadata_schema', 'show_on_home'];

    protected $casts = [
        'metadata' => 'array',
        'metadata_schema' => 'array',
        'show_on_home' => 'boolean',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function scopeShownOnHome(Builder $query): Builder
    {
        return $query
            ->where('show_on_home', true)
            ->whereNotIn('slug', self::FIXED_HOME_SLUGS)
            ->orderBy('id');
    }

    public function isFixedOnHome(): bool
    {
        return in_array($this->slug, self::FIXED_HOME_SLUGS, true);
    }
}
