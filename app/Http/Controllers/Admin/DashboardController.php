<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $metrics = [
            'total_posts' => Post::count(),
            'published_posts' => Post::where('status', 'published')->count(),
            'total_categories' => Category::count(),
            'total_galleries' => Post::whereHas('category', fn ($query) => $query->where('slug', 'galeri'))->count(),
            'total_users' => User::count(),
        ];

        $latestPosts = Post::with(['category', 'user'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'metrics' => $metrics,
            'latestPosts' => $latestPosts,
        ]);
    }
}
