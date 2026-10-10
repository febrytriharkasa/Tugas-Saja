<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/Form', [
            'page' => null,
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'group' => 'required|in:tentang,laman,arsip',
            'display_type' => 'required|in:text,category',
            'category_id' => 'nullable|required_if:display_type,category|exists:categories,id',
            'content' => 'nullable|required_if:display_type,text|string',
            'is_published' => 'required|boolean',
        ]);
        $data['slug'] = $this->uniqueSlug($data['title']);
        Page::create($data);

        return redirect()->route('admin.pages.index')->with('success', 'Laman berhasil dibuat.');
    }

    public function show(Page $page)
    {
        return Inertia::render('Admin/Pages/Show', [
            'page' => $page->load('category'),
        ]);
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Form', [
            'page' => $page,
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'group' => 'required|in:tentang,laman,arsip',
            'display_type' => 'required|in:text,category',
            'category_id' => 'nullable|required_if:display_type,category|exists:categories,id',
            'content' => 'nullable|required_if:display_type,text|string',
            'is_published' => 'required|boolean',
        ]);
        $page->update($data);

        return redirect()->route('admin.pages.index')->with('success', 'Laman berhasil diperbarui.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.pages.index')->with('success', 'Laman berhasil dihapus.');
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $index = 1;
        while (Page::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$index++;
        }

        return $slug;
    }
}
