<?php

namespace App\Http\Middleware;

use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'settings' => fn () => SiteSetting::all()->pluck('value', 'key'),
            'aboutPages' => fn () => Page::where('group', 'tentang')
                ->where('is_published', true)
                ->orderByRaw("CASE slug WHEN 'sejarah' THEN 1 WHEN 'visi-misi-tujuan' THEN 2 WHEN 'sambutan' THEN 3 WHEN 'kerjasama' THEN 4 WHEN 'fasilitas' THEN 5 WHEN 'guru-tendik' THEN 6 WHEN 'gtk' THEN 7 WHEN 'struktur-organisasi' THEN 8 ELSE 9 END")
                ->get(['title', 'slug']),
            'customPages' => fn () => Page::where('group', 'laman')
                ->where('is_published', true)
                ->orderBy('title')
                ->get(['title', 'slug']),
        ];
    }
}
