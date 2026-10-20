<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;

class SitemapController extends Controller
{
    public function index()
    {
        $base = rtrim((string) config('app.url'), '/');

        $urls = collect([
            $this->entry($base.'/', 'daily', '1.0'),
            $this->entry($base.'/berita', 'daily', '0.9'),
            $this->entry($base.'/statistik', 'weekly', '0.6'),
        ]);

        $pages = Page::where('is_published', true)
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at']);

        $pages->each(function (Page $page) use ($base, $urls) {
            $urls->push($this->entry($base.'/'.$page->slug, 'monthly', '0.7', $page->updated_at));
        });

        $pageSlugs = $pages->pluck('slug')->flip();

        Category::whereHas('posts', fn ($query) => $query->where('status', 'published'))
            ->get(['slug', 'updated_at'])
            ->reject(fn (Category $category) => $pageSlugs->has($category->slug))
            ->each(function (Category $category) use ($base, $urls) {
                $urls->push($this->entry($base.'/'.$category->slug, 'weekly', '0.7', $category->updated_at));
            });

        Post::query()
            ->where('status', 'published')
            ->with('category:id,slug')
            ->orderByDesc('published_at')
            ->get(['id', 'slug', 'category_id', 'updated_at'])
            ->each(function (Post $post) use ($base, $urls) {
                if (! $post->category) {
                    return;
                }

                $urls->push($this->entry(
                    $base.'/'.$post->category->slug.'/'.$post->slug,
                    'monthly',
                    '0.8',
                    $post->updated_at,
                ));
            });

        return response()
            ->view('sitemap', ['urls' => $urls->unique('loc')->values()])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    /**
     * @return array<string, string>
     */
    private function entry(string $loc, string $changefreq, string $priority, ?\DateTimeInterface $lastmod = null): array
    {
        return array_filter([
            'loc' => $loc,
            'lastmod' => $lastmod?->format(DATE_ATOM),
            'changefreq' => $changefreq,
            'priority' => $priority,
        ]);
    }
}
