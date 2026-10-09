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
        $categories = Category::withCount('posts')->latest()->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'metadata_schema' => 'nullable|array',
            'metadata_schema.*.key' => 'required|string|max:50',
            'metadata_schema.*.label' => 'required|string|max:100',
            'metadata_schema.*.type' => 'required|string|in:text,date,number',
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'metadata_schema' => array_values($validated['metadata_schema'] ?? []),
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,'.$category->id,
            'metadata_schema' => 'nullable|array',
            'metadata_schema.*.key' => 'required|string|max:50',
            'metadata_schema.*.label' => 'required|string|max:100',
            'metadata_schema.*.type' => 'required|string|in:text,date,number',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'metadata_schema' => array_values($validated['metadata_schema'] ?? []),
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}
