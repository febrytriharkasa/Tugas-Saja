<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('posts')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateCategory($request);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'metadata_schema' => array_values($validated['metadata_schema'] ?? []),
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function show(Category $category)
    {
        return Inertia::render('Admin/Categories/Show', [
            'category' => $category->loadCount('posts'),
        ]);
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $this->validateCategory($request, $category);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'metadata_schema' => array_values($validated['metadata_schema'] ?? []),
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dihapus.');
    }

    private function validateCategory(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => $category
                ? 'required|string|max:100|unique:categories,name,'.$category->id
                : 'required|string|max:100|unique:categories,name',
            'metadata_schema' => 'nullable|array',
            'metadata_schema.*.key' => 'required|string|max:50',
            'metadata_schema.*.label' => 'required|string|max:100',
            'metadata_schema.*.type' => 'required|string|in:text,date,number',
        ]);
    }
}
