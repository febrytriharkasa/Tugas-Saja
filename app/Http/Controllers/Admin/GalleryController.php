<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => Gallery::latest()->paginate(12),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Galleries/Form', [
            'gallery' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateGallery($request, true);

        Gallery::create([
            'title' => $validated['title'],
            'media_type' => $validated['media_type'],
            'file_path' => $this->storeFile($request),
        ]);

        return redirect()->route('admin.galleries.index')->with('success', 'Media galeri berhasil diunggah.');
    }

    public function show(Gallery $gallery)
    {
        return Inertia::render('Admin/Galleries/Show', [
            'gallery' => $gallery,
        ]);
    }

    public function edit(Gallery $gallery)
    {
        return Inertia::render('Admin/Galleries/Form', [
            'gallery' => $gallery,
        ]);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $this->validateGallery($request, false);

        $gallery->update([
            'title' => $validated['title'],
            'media_type' => $validated['media_type'],
            'file_path' => $request->hasFile('file') ? $this->storeFile($request) : $gallery->file_path,
        ]);

        return redirect()->route('admin.galleries.index')->with('success', 'Media galeri berhasil diperbarui.');
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();

        return redirect()->route('admin.galleries.index')->with('success', 'Media galeri berhasil dihapus.');
    }

    private function validateGallery(Request $request, bool $fileRequired): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'media_type' => 'required|in:image,video',
            'file' => [$fileRequired ? 'required' : 'nullable', 'file', 'max:10240'],
        ]);
    }

    private function storeFile(Request $request): string
    {
        return Storage::url($request->file('file')->store('galleries', 'public'));
    }
}
