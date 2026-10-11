<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeContentController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->select(['id', 'name', 'slug', 'show_on_home'])
            ->withCount([
                'posts as published_posts_count' => fn ($query) => $query->where('status', 'published'),
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'show_on_home' => (bool) $category->show_on_home,
                'is_fixed_on_home' => $category->isFixedOnHome(),
                'published_posts_count' => $category->published_posts_count,
            ]);

        return Inertia::render('Admin/HomeContent/Index', [
            'categories' => $categories,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'categories' => ['required', 'array'],
            'categories.*' => ['required', 'array:id,show_on_home'],
            'categories.*.id' => ['required', 'integer', 'distinct', 'exists:categories,id'],
            'categories.*.show_on_home' => ['required', 'boolean'],
        ]);

        $categories = Category::query()
            ->whereKey(collect($validated['categories'])->pluck('id'))
            ->get()
            ->keyBy('id');

        DB::transaction(function () use ($categories, $validated): void {
            foreach ($validated['categories'] as $item) {
                $category = $categories->get($item['id']);

                if (! $category->isFixedOnHome()) {
                    $category->update(['show_on_home' => $item['show_on_home']]);
                }
            }
        });

        return redirect()
            ->route('admin.home-content.index')
            ->with('success', 'Tampilan konten beranda berhasil disimpan.');
    }
}
