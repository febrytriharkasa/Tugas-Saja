<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'user'])->latest();

        if ($request->search) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $query->paginate(10)->withQueryString(),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Form', [
            'categories' => Category::all(),
            'post' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePost($request);
        $category = Category::findOrFail($validated['category_id']);

        Post::create([
            'user_id' => auth()->id(),
            'category_id' => $category->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']).'-'.Str::lower(Str::random(5)),
            'content' => $validated['content'],
            'metadata' => $this->metadata($validated, $category->slug),
            'featured_image' => $request->hasFile('featured_image') ? $this->storeImage($request) : null,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Konten berhasil ditambahkan.');
    }

    public function show(Post $post)
    {
        return Inertia::render('Admin/Posts/Show', [
            'post' => $post->load(['category', 'user']),
        ]);
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Form', [
            'categories' => Category::all(),
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $validated = $this->validatePost($request);
        $category = Category::findOrFail($validated['category_id']);

        $post->update([
            'category_id' => $category->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'metadata' => $this->metadata($validated, $category->slug),
            'featured_image' => $request->hasFile('featured_image') ? $this->storeImage($request) : $post->featured_image,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? ($post->published_at ?? now()) : null,
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Konten berhasil dihapus.');
    }

    private function validatePost(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'content' => ['required', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'featured_image' => ['nullable', 'image', 'max:2048'],
            'meta' => ['nullable', 'array'],
            'meta.*' => ['nullable'],
            'meta.blocks' => ['nullable', 'array'],
            'meta.blocks.*.type' => ['required_with:meta.blocks', Rule::in(['text', 'table'])],
            'meta.blocks.*.content' => ['required_if:meta.blocks.*.type,text', 'string'],
            'meta.blocks.*.description' => ['nullable', 'string', 'max:500'],
            'meta.blocks.*.rows' => ['required_if:meta.blocks.*.type,table', 'array'],
            'meta.blocks.*.rows.*.name' => ['required_with:meta.blocks.*.rows', 'string', 'max:255'],
            'meta.blocks.*.rows.*.rank' => ['required_with:meta.blocks.*.rows', 'string', 'max:100'],
            'meta.blocks.*.rows.*.event' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function metadata(array $validated, string $categorySlug): ?array
    {
        $meta = $validated['meta'] ?? [];

        if (empty($meta)) {
            return null;
        }

        $filtered = array_filter($meta, function ($value, $key) {
            if ($key === 'blocks' && is_array($value)) {
                $blocks = array_values(array_filter($value, function ($block) {
                    if (! isset($block['type'])) {
                        return false;
                    }
                    if ($block['type'] === 'text') {
                        return ! empty(trim($block['content'] ?? ''));
                    }
                    if ($block['type'] === 'table') {
                        return ! empty($block['rows']);
                    }

                    return false;
                }));

                return ! empty($blocks);
            }

            return $value !== null && $value !== '';
        }, ARRAY_FILTER_USE_BOTH);

        if (isset($filtered['blocks'])) {
            $filtered['blocks'] = array_values(array_filter(
                $filtered['blocks'],
                function ($block) {
                    if (! isset($block['type'])) {
                        return false;
                    }
                    if ($block['type'] === 'text') {
                        return ! empty(trim($block['content'] ?? ''));
                    }
                    if ($block['type'] === 'table') {
                        return ! empty($block['rows']);
                    }

                    return false;
                },
            ));
        }

        return ! empty($filtered) ? $filtered : null;
    }

    private function storeImage(Request $request): string
    {
        return Storage::url($request->file('featured_image')->store('posts', 'public'));
    }
}
