<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'metadata', 'metadata_schema'];

    protected $casts = [
        'metadata' => 'array',
        'metadata_schema' => 'array',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
