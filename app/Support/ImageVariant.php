<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * URL varian gambar responsif.
 *
 * Hero diunggah sekali pada lebar maksimum (1920px, ~160 KB) lalu ditampilkan
 * pada layar 412px. Route /img/{lebar}/{path} memperkecil gambar sesuai
 * permintaan dan menyimpannya di disk "public", jadi setiap lebar hanya
 * diproses sekali.
 */
class ImageVariant
{
    public const WIDTHS = [640, 800, 960, 1280];

    /** Hanya format raster yang bisa diperkecil GD. */
    private const RASTER = ['webp', 'jpg', 'jpeg', 'png'];

    public static function storagePath(?string $url): ?string
    {
        if (! is_string($url) || ! str_starts_with($url, '/storage/')) {
            return null;
        }

        $path = ltrim(substr($url, strlen('/storage/')), '/');

        if ($path === '' || str_contains($path, '..')) {
            return null;
        }

        if (! in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), self::RASTER, true)) {
            return null;
        }

        return $path;
    }

    /**
     * srcset: varian lebih kecil dulu, gambar asli sebagai kandidat terbesar.
     * Null kalau gambar tidak bisa diperkecil (SVG, URL eksternal).
     */
    public static function srcset(?string $url, array $widths = self::WIDTHS): ?string
    {
        $path = self::storagePath($url);

        if ($path === null) {
            return null;
        }

        $parts = [];

        foreach ($widths as $width) {
            $parts[] = "/img/{$width}/{$path} {$width}w";
        }

        $parts[] = $url.' 1920w';

        return implode(', ', $parts);
    }

    public static function cachePath(string $path, int $width): string
    {
        return '.variants/'.$width.'-'.md5($path).'.webp';
    }

    public static function cacheUrl(string $path, int $width): string
    {
        return Storage::url(self::cachePath($path, $width));
    }
}
