<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Gallery;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\Staff;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->pluck('value', 'key');

        return Inertia::render('Welcome', [
            'settings' => $settings,
            'posts' => $this->categoryPosts('berita', 6),
            'homeSections' => $this->homeSections(),
            'galleries' => Gallery::latest()->take(8)->get(),
            'staff' => Staff::latest()->take(8)->get(),
        ]);
    }

    /**
     * Categories the editor chose to show on the home page, in their set order.
     *
     * @return Collection<int, array{id: int, name: string, slug: string, posts: Collection<int, Post>}>
     */
    private function homeSections()
    {
        $categories = Category::shownOnHome()->get();

        $postsByCategory = Post::with('category')
            ->where('status', 'published')
            ->whereIn('category_id', $categories->pluck('id'))
            ->latest('published_at')
            ->get()
            ->groupBy('category_id');

        return $categories->map(fn (Category $category) => [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'posts' => $postsByCategory->get($category->id, collect())->take(3)->values(),
        ]);
    }

    public function page($slug)
    {
        $page = Page::with('category')->where('slug', $slug)->where('is_published', true)->firstOrFail();

        if ($page->display_type === 'category' && $page->category) {
            return Inertia::render('Public/Archive', [
                'title' => $page->title,
                'type' => $page->category->slug,
                'items' => $this->categoryPosts($page->category->slug, null, true),
            ]);
        }

        return Inertia::render('Public/Page', ['page' => $page]);
    }

    public function news()
    {
        $posts = $this->categoryPosts('berita', null, true);

        return Inertia::render('Public/Archive', ['title' => 'Berita', 'type' => 'berita', 'items' => $posts]);
    }

    public function archive($type)
    {
        $configs = [
            'pengumuman' => ['title' => 'Pengumuman', 'items' => $this->categoryPosts('pengumuman', null, true)],
            'agenda' => ['title' => 'Agenda', 'items' => $this->categoryPosts('agenda', null, true)],
            'prestasi' => ['title' => 'Prestasi', 'items' => $this->categoryPosts('prestasi', null, true)],
            'galeri' => ['title' => 'Galeri Aktivitas', 'items' => Gallery::latest()->paginate(16)],
        ];

        if (! isset($configs[$type])) {
            $category = Category::where('slug', $type)->firstOrFail();
            $configs[$type] = [
                'title' => $category->name,
                'items' => $this->categoryPosts($category->slug, null, true),
            ];
        }

        return Inertia::render('Public/Archive', [
            'title' => $configs[$type]['title'],
            'type' => $type,
            'items' => $configs[$type]['items'],
        ]);
    }

    public function statistics()
    {
        return Inertia::render('Public/Statistics', [
            'settings' => SiteSetting::where('group_name', 'statistics')->pluck('value', 'key'),
            'counts' => [
                'posts' => Post::where('status', 'published')->count(),
                'galleries' => Gallery::count(),
                'teachers' => Staff::where('type', 'guru')->count(),
                'staff' => Staff::whereIn('type', ['tendik', 'gtk'])->count(),
            ],
        ]);
    }

    public function showPost($slug)
    {
        $post = Post::with(['category', 'user'])->where('slug', $slug)->where('status', 'published')->firstOrFail();
        $relatedPosts = Post::where('category_id', $post->category_id)->where('id', '!=', $post->id)->where('status', 'published')->latest('published_at')->take(3)->get();

        return Inertia::render('Public/PostDetail', compact('post', 'relatedPosts'));
    }

    private function categoryPosts(string $slug, ?int $limit = null, bool $paginate = false)
    {
        $query = Post::with('category')
            ->where('status', 'published')
            ->whereHas('category', fn ($q) => $q->where('slug', $slug))
            ->latest('published_at');

        if ($paginate) {
            return $query->paginate(12);
        }

        return $limit ? $query->take($limit)->get() : $query->get();
    }
}
