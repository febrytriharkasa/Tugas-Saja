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
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'page_created' => $request->session()->get('page_created'),
                'page_title' => $request->session()->get('page_title'),
            ],
            'settings' => fn () => SiteSetting::all()->pluck('value', 'key'),
            'aboutPages' => fn () => [],
            'customPages' => fn () => Page::where('is_published', true)
                ->orderBy('title')
                ->get(['title', 'slug']),
            'archivePages' => fn () => [],
        ];
    }
}
