<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'content', 'image', 'metadata', 'is_published'];

    protected $casts = [
        'metadata' => 'array',
        'is_published' => 'boolean',
    ];
}
