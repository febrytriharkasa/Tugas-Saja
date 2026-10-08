<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        return Inertia::render('Admin/Pages/Form', ['page' => null]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'group' => 'required|in:tentang,laman',
            'content' => 'required|string',
            'is_published' => 'required|boolean',
        ]);
        $data['slug'] = $this->uniqueSlug($data['title']);
        Page::create($data);

        return redirect()->route('admin.pages.index')->with('success', 'Laman berhasil dibuat.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Form', compact('page'));
    }

    public function update(Request $request, Page $page)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'group' => 'required|in:tentang,laman',
            'content' => 'required|string',
            'is_published' => 'required|boolean',
        ]);
        $page->update($data);

        return redirect()->route('admin.pages.index')->with('success', 'Laman berhasil diperbarui.');
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return back()->with('success', 'Laman berhasil dihapus.');
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
