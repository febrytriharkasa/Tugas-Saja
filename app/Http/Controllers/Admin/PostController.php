<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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

    public function create(Request $request)
    {
        return Inertia::render('Admin/Posts/Form', [
            'categories' => Category::all(),
            'post' => null,
            'initialCategoryId' => $request->integer('category_id') ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePost($request);
        $category = Category::findOrFail($validated['category_id']);
        $mediaType = $validated['media_type'] ?? 'image';

        Post::create([
            'user_id' => auth()->id(),
            'category_id' => $category->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'content' => $validated['content'] ?? '',
            'metadata' => $this->metadata($validated, $category->slug),
            'featured_image' => $request->hasFile('featured_image') ? $this->storeMedia($request) : null,
            'media_type' => $mediaType,
            'video_url' => $mediaType === 'video' ? ($validated['video_url'] ?? null) : null,
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
        $mediaType = $validated['media_type'] ?? 'image';
        $featuredImage = $post->featured_image;

        if ($request->hasFile('featured_image')) {
            $this->deleteStoredMedia($post->featured_image);
            $featuredImage = $this->storeMedia($request);
        } elseif ($mediaType === 'video' || $mediaType !== $post->media_type) {
            $this->deleteStoredMedia($post->featured_image);
            $featuredImage = null;
        }

        $post->update([
            'category_id' => $category->id,
            'title' => $validated['title'],
            'content' => $validated['content'] ?? '',
            'metadata' => $this->metadata($validated, $category->slug),
            'featured_image' => $featuredImage,
            'media_type' => $mediaType,
            'video_url' => $mediaType === 'video' ? ($validated['video_url'] ?? null) : null,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? ($post->published_at ?? now()) : null,
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroy(Post $post)
    {
        $this->deleteStoredMedia($post->featured_image);
        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Konten berhasil dihapus.');
    }

    private function validatePost(Request $request): array
    {
        $isGallery = Category::whereKey($request->input('category_id'))->where('slug', 'galeri')->exists();
        $mediaType = $request->input('media_type', 'image');
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'content' => [$isGallery ? 'nullable' : 'required', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'media_type' => ['nullable', Rule::in(['image', 'video'])],
            'video_url' => [Rule::requiredIf($mediaType === 'video'), 'nullable', 'url:http,https', 'max:500'],
            'featured_image' => [
                Rule::prohibitedIf($mediaType === 'video'),
                'nullable',
                'image',
                'max:2048',
            ],
            'meta' => ['nullable', 'array'],
            'meta.*' => ['nullable'],
            'meta.blocks' => ['nullable', 'array'],
            'meta.blocks.*.type' => ['required_with:meta.blocks', Rule::in(['text', 'table', 'callout', 'blockquote'])],
            'meta.blocks.*.content' => ['nullable', 'string'],
            'meta.blocks.*.title' => ['nullable', 'string', 'max:255'],
            'meta.blocks.*.description' => ['nullable', 'string', 'max:500'],
            'meta.blocks.*.columns' => ['nullable', 'array'],
            'meta.blocks.*.columns.*' => ['nullable', 'string', 'max:100'],
            'meta.blocks.*.rows' => ['required_if:meta.blocks.*.type,table', 'array'],
            'meta.blocks.*.rows.*' => ['nullable'],
            'meta.blocks.*.rows.*.*' => ['nullable', 'string', 'max:1000'],
        ], [
            'video_url.required' => 'Link video YouTube wajib diisi.',
            'featured_image.prohibited' => 'File video tidak dapat diunggah. Masukkan link YouTube.',
        ]);

        if ($mediaType === 'video' && ! $this->isYoutubeUrl($validated['video_url'])) {
            throw ValidationException::withMessages([
                'video_url' => 'Link video harus berasal dari YouTube.',
            ]);
        }

        return $validated;
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
                    if (in_array($block['type'], ['text', 'callout', 'blockquote'])) {
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
                    if (in_array($block['type'], ['text', 'callout', 'blockquote'])) {
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

    private function storeMedia(Request $request): string
    {
        return Storage::url($request->file('featured_image')->store('posts', 'public'));
    }

    private function deleteStoredMedia(?string $path): void
    {
        if (! $path) {
            return;
        }

        $relativePath = str_replace('/storage/', '', $path);

        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    private function isYoutubeUrl(string $url): bool
    {
        return (bool) preg_match('/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/', $url);
    }
}
