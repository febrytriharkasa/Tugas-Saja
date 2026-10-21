<?php

namespace App\Http\Controllers;

use App\Support\ImageOptimizer;
use App\Support\ImageVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Menyajikan varian hero yang diperkecil (lihat ImageVariant::srcset).
 *
 * Hasil resize disimpan di disk "public" sehingga setiap kombinasi gambar+lebar
 * hanya diproses sekali; permintaan berikutnya langsung mengirim file cache.
 */
class ImageVariantController extends Controller
{
    public function __invoke(Request $request, int $width, string $path): BinaryFileResponse
    {
        abort_unless(in_array($width, ImageVariant::WIDTHS, true), 404);
        abort_unless(ImageVariant::storagePath('/storage/'.$path) !== null, 404);

        $disk = Storage::disk('public');
        abort_unless($disk->exists($path), 404);

        $cachePath = ImageVariant::cachePath($path, $width);
        $absoluteCache = $disk->path($cachePath);

        if (! $disk->exists($cachePath)) {
            $encoded = ImageOptimizer::downscale($disk->path($path), $width);

            abort_if($encoded === null, 404);

            $disk->put($cachePath, $encoded);
        }

        return response()->file($absoluteCache, [
            'Content-Type' => 'image/webp',
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
