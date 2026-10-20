<?php

namespace App\Support;

use App\Models\Post;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Draws the SVG cover art a post falls back to when nobody uploaded a photo.
 * Covers are generated locally, so no post ever renders an empty thumbnail.
 */
class PostCoverGenerator
{
    private const WIDTH = 1200;

    private const HEIGHT = 675;

    private const PAD = 80;

    private const FONT = "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif";

    /** Gradient pairs taken from DESIGN.md, keyed by category slug. */
    private const PALETTE = [
        'berita' => ['#0891B2', '#06B6D4'],
        'pengumuman' => ['#D97706', '#F59E0B'],
        'agenda' => ['#004532', '#065F46'],
        'prestasi' => ['#5E3000', '#D97706'],
        'kegiatan' => ['#006780', '#0891B2'],
        'ekstrakurikuler' => ['#065F46', '#047857'],
        'fasilitas' => ['#3F4944', '#6F7973'],
        'cerita-alumni' => ['#131B2E', '#283044'],
        'galeri' => ['#006077', '#76DCFF'],
    ];

    private const FALLBACK_PALETTE = ['#283044', '#3F4944'];

    /**
     * Cover every post that has no picture of its own. Video posts are skipped
     * because the public pages show their YouTube thumbnail instead.
     */
    public function generateMissing(bool $force = false): int
    {
        $missing = fn ($query) => $query->whereNull('featured_image')->orWhere('featured_image', '');

        $posts = Post::query()
            ->with('category')
            ->where(fn ($query) => $query->whereNull('media_type')->orWhere('media_type', '!=', 'video'))
            ->when(
                $force,
                fn ($query) => $query->where(fn ($q) => $missing($q)->orWhere('featured_image', 'like', '%/posts/covers/%')),
                $missing,
            )
            ->get();

        foreach ($posts as $post) {
            $this->generate($post);
        }

        PublicCache::forgetHome();

        return $posts->count();
    }

    public function generate(Post $post): string
    {
        $path = 'posts/covers/'.$post->slug.'.svg';

        Storage::disk('public')->put($path, $this->render($post));

        $url = Storage::url($path);

        // Quietly, so the model's saved hook cannot call straight back into us.
        $post->forceFill(['featured_image' => $url])->saveQuietly();

        return $url;
    }

    /**
     * Give the post its default cover unless it already has a picture or a
     * video to fall back on.
     */
    public function ensure(Post $post): bool
    {
        if (filled($post->featured_image) || $post->media_type === 'video') {
            return false;
        }

        $this->generate($post);

        return true;
    }

    public function render(Post $post): string
    {
        [$from, $to] = self::PALETTE[$post->category?->slug] ?? self::FALLBACK_PALETTE;

        $seed = crc32((string) $post->slug);
        $fontSize = $this->fontSize((string) $post->title);
        $lineHeight = (int) round($fontSize * 1.24);
        $lines = $this->wrap((string) $post->title, $fontSize);
        $firstBaseline = (int) round((self::HEIGHT - count($lines) * $lineHeight) / 2) + $fontSize;

        $title = '';
        foreach ($lines as $index => $line) {
            $title .= sprintf(
                '<tspan x="%d" dy="%d">%s</tspan>',
                self::PAD,
                $index === 0 ? 0 : $lineHeight,
                e($line),
            );
        }

        $category = Str::upper((string) ($post->category?->name ?? 'Sekolah'));
        $chipWidth = 56 + Str::length($category) * 15;
        $school = e((string) SiteSetting::getVal('site_name', 'SMA XYZ'));

        $width = self::WIDTH;
        $height = self::HEIGHT;
        $pad = self::PAD;
        $font = self::FONT;
        $circleX = 640 + ($seed % 420);
        $circleY = 90 + (($seed >> 3) % 200);
        $ringX = 200 + ($seed % 900);

        return <<<SVG
        <svg xmlns="http://www.w3.org/2000/svg" width="{$width}" height="{$height}" viewBox="0 0 {$width} {$height}" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="{$from}"/>
                    <stop offset="1" stop-color="{$to}"/>
                </linearGradient>
            </defs>
            <rect width="{$width}" height="{$height}" fill="url(#cover-bg)"/>
            <g fill="#ffffff" opacity="0.10">
                <circle cx="{$circleX}" cy="{$circleY}" r="230"/>
                <circle cx="{$ringX}" cy="620" r="150"/>
            </g>
            <circle cx="{$circleX}" cy="{$circleY}" r="300" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
            <rect x="{$pad}" y="72" rx="23" ry="23" width="{$chipWidth}" height="46" fill="#ffffff" fill-opacity="0.16"/>
            <text x="104" y="103" font-family="{$font}" font-size="20" font-weight="700" letter-spacing="3" fill="#ffffff">{$category}</text>
            <text x="{$pad}" y="{$firstBaseline}" font-family="{$font}" font-size="{$fontSize}" font-weight="800" fill="#ffffff">{$title}</text>
            <line x1="{$pad}" y1="596" x2="260" y2="596" stroke="#ffffff" stroke-opacity="0.55" stroke-width="4"/>
            <text x="{$pad}" y="636" font-family="{$font}" font-size="24" font-weight="600" fill="#ffffff" fill-opacity="0.9">{$school}</text>
        </svg>
        SVG;
    }

    private function fontSize(string $title): int
    {
        return match (true) {
            Str::length($title) > 110 => 40,
            Str::length($title) > 80 => 46,
            Str::length($title) > 55 => 52,
            default => 58,
        };
    }

    /**
     * @return list<string>
     */
    private function wrap(string $title, int $fontSize): array
    {
        $perLine = max(14, (int) floor((self::WIDTH - self::PAD * 2) / ($fontSize * 0.55)));

        $lines = explode("\n", wordwrap($title, $perLine, "\n", true));

        if (count($lines) > 3) {
            $lines = array_slice($lines, 0, 3);
            $lines[2] = rtrim($lines[2], ' ,.;:').'…';
        }

        return $lines;
    }
}
