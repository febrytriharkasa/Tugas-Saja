<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ManagesNavMenu;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use ManagesNavMenu;

    public function index(Request $request)
    {
        $query = Category::withCount('posts')->latest();

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->show_on_home === 'shown') {
            $query->where(fn ($q) => $q->where('show_on_home', true)->orWhereIn('slug', Category::FIXED_HOME_SLUGS));
        }

        if ($request->show_on_home === 'hidden') {
            $query->where('show_on_home', false)->whereNotIn('slug', Category::FIXED_HOME_SLUGS);
        }

        $navUrls = $this->navUrls();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $query->paginate(10)->withQueryString()
                ->through(fn (Category $category) => [
                    ...$category->toArray(),
                    'is_fixed_on_home' => $category->isFixedOnHome(),
                    'in_nav' => in_array('/'.$category->slug, $navUrls, true),
                ]),
            'filters' => $request->only(['search', 'show_on_home']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => null,
            'navDropdowns' => $this->navDropdowns(),
            'navPlacement' => ['placement' => 'none', 'label' => '', 'parent_label' => null],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateCategory($request);
        $nav = $this->navInput($request);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'metadata_schema' => array_values($validated['metadata_schema'] ?? []),
            'show_on_home' => $validated['show_on_home'] ?? false,
        ]);

        $this->syncNavPlacement('/'.$category->slug, $category->name, $nav);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function show(Category $category)
    {
        return Inertia::render('Admin/Categories/Show', [
            'category' => [...$category->loadCount('posts')->toArray(), 'is_fixed_on_home' => $category->isFixedOnHome()],
            'navPlacement' => $this->navPlacement('/'.$category->slug),
        ]);
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => [...$category->toArray(), 'is_fixed_on_home' => $category->isFixedOnHome()],
            'navDropdowns' => $this->navDropdowns(),
            'navPlacement' => $this->navPlacement('/'.$category->slug),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $this->validateCategory($request, $category);
        $nav = $this->navInput($request);
        $oldUrl = '/'.$category->slug;

        $category->update([
            'name' => $validated['name'],
            'slug' => $category->isFixedOnHome() ? $category->slug : Str::slug($validated['name']),
            'metadata_schema' => array_values($validated['metadata_schema'] ?? []),
            'show_on_home' => $category->isFixedOnHome() || ($validated['show_on_home'] ?? $category->show_on_home),
        ]);

        // A renamed category changes its public URL; the menu entry must follow it.
        if ('/'.$category->slug !== $oldUrl) {
            $this->removeNavEntry($oldUrl);
        }

        $this->syncNavPlacement('/'.$category->slug, $category->name, $nav);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category)
    {
        if ($category->isFixedOnHome()) {
            return redirect()->route('admin.categories.index')->with('error', 'Kategori tetap tidak dapat dihapus.');
        }

        $this->removeNavEntry('/'.$category->slug);
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
            'show_on_home' => 'nullable|boolean',
        ]);
    }
}
