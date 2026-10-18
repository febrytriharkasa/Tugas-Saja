<?php

namespace App\Models;

use App\Support\PostCoverGenerator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'content',
        'metadata',
        'featured_image',
        'media_type',
        'video_url',
        'status',
        'published_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        // Every post keeps a generated cover until an author uploads a photo.
        static::saved(fn (Post $post) => app(PostCoverGenerator::class)->ensure($post));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
