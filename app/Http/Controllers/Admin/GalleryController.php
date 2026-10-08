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
        $galleries = Gallery::latest()->paginate(12);
        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => $galleries,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'media_type' => 'required|in:image,video',
            'file' => 'required|file|max:10240',
        ]);

        $path = $request->file('file')->store('galleries', 'public');

        Gallery::create([
            'title' => $validated['title'],
            'media_type' => $validated['media_type'],
            'file_path' => Storage::url($path),
        ]);

        return redirect()->back()->with('success', 'Media galeri berhasil diunggah.');
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return redirect()->back()->with('success', 'Media galeri berhasil dihapus.');
    }
}
