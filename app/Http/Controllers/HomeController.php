<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\Staff;
use Illuminate\Http\Request;
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
            'galleries' => $this->categoryPosts('galeri', 8),
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

        $postsByCategory = Post::with(['category', 'user'])
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

    public function pageBySlug(Request $request, $slug)
    {
        $previewing = $request->boolean('preview') && (bool) $request->user()?->canManageContent();

        $page = Page::where('slug', $slug)
            ->when(! $previewing, fn ($query) => $query->where('is_published', true))
            ->first();

        if ($page) {
            return Inertia::render('Public/Page', [
                'page' => $page,
                'draftPreview' => $previewing && ! $page->is_published,
            ]);
        }

        $category = Category::where('slug', $slug)->firstOrFail();

        return Inertia::render('Public/Archive', [
            'title' => $category->name,
            'type' => $category->slug,
            'items' => $this->categoryPosts($category->slug, null, true),
        ]);
    }

    public function news()
    {
        $posts = $this->categoryPosts('berita', null, true);

        return Inertia::render('Public/Archive', ['title' => 'Berita', 'type' => 'berita', 'items' => $posts]);
    }

    public function search(Request $request)
    {
        $keyword = trim((string) $request->query('q', ''));

        $items = Post::with(['category', 'user'])
            ->where('status', 'published')
            ->when($keyword !== '', fn ($query) => $query->where('title', 'like', '%'.$keyword.'%'))
            ->latest('published_at')
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('Public/Search', [
            'keyword' => $keyword,
            'items' => $items,
        ]);
    }

    public function statistics()
    {
        return Inertia::render('Public/Statistics', [
            'statSettings' => SiteSetting::where('group_name', 'statistics')->pluck('value', 'key'),
            'counts' => [
                'posts' => Post::where('status', 'published')->count(),
                'galleries' => Post::whereHas('category', fn ($query) => $query->where('slug', 'galeri'))->count(),
                'teachers' => Staff::where('type', 'guru')->count(),
                'staff' => Staff::whereIn('type', ['tendik', 'gtk'])->count(),
            ],
        ]);
    }

    public function showPost($category, $slug)
    {
        $post = Post::with(['category', 'user'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->whereHas('category', fn ($c) => $c->where('slug', $category))
            ->firstOrFail();

        $relatedPosts = Post::with(['category', 'user'])
            ->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->where('status', 'published')
            ->latest('published_at')
            ->take(3)
            ->get();

        $prevPost = Post::with(['category', 'user'])
            ->where('category_id', $post->category_id)
            ->where('status', 'published')
            ->where(function ($query) use ($post) {
                $query->where('published_at', '<', $post->published_at)
                    ->orWhere(function ($q) use ($post) {
                        $q->where('published_at', $post->published_at)
                            ->where('id', '<', $post->id);
                    });
            })
            ->orderBy('published_at', 'desc')
            ->orderBy('id', 'desc')
            ->first();

        $nextPost = Post::with(['category', 'user'])
            ->where('category_id', $post->category_id)
            ->where('status', 'published')
            ->where(function ($query) use ($post) {
                $query->where('published_at', '>', $post->published_at)
                    ->orWhere(function ($q) use ($post) {
                        $q->where('published_at', $post->published_at)
                            ->where('id', '>', $post->id);
                    });
            })
            ->orderBy('published_at', 'asc')
            ->orderBy('id', 'asc')
            ->first();

        return Inertia::render('Public/PostDetail', compact('post', 'relatedPosts', 'prevPost', 'nextPost'));
    }

    private function categoryPosts(string $slug, ?int $limit = null, bool $paginate = false)
    {
        $query = Post::with(['category', 'user'])
            ->where('status', 'published')
            ->whereHas('category', fn ($q) => $q->where('slug', $slug))
            ->latest('published_at');

        if ($paginate) {
            return $query->paginate(8);
        }

        return $limit ? $query->take($limit)->get() : $query->get();
    }
}
