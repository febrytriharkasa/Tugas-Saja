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
            ],
            'settings' => fn () => SiteSetting::all()->pluck('value', 'key'),
            'navItems' => fn () => $this->publicNavItems(),
            'navConfigured' => fn () => $this->navConfigured(),
            'draftPageSlugs' => fn () => Page::where('is_published', false)->orderBy('title')->pluck('slug'),
            'aboutPages' => fn () => [],
            'customPages' => fn () => Page::where('is_published', true)
                ->orderBy('title')
                ->get(['title', 'slug']),
            'archivePages' => fn () => [],
        ];
    }

    /**
     * Entries can be saved half-finished, so anything without a usable label or target is dropped.
     *
     * @return array<int, array<string, mixed>>
     */
    private function publicNavItems(): array
    {
        $items = $this->rawNavItems();

        if (! is_array($items)) {
            return [];
        }

        $drafts = Page::where('is_published', false)
            ->pluck('slug')
            ->map(fn (string $slug) => '/'.$slug)
            ->all();

        $clickable = function ($entry) use ($drafts) {
            if (! is_array($entry)) {
                return false;
            }

            $label = trim((string) ($entry['label'] ?? ''));
            $url = trim((string) ($entry['url'] ?? ''));

            return $label !== '' && $url !== '' && ! in_array(rtrim($url, '/'), $drafts, true);
        };

        $visible = [];

        foreach (array_values($items) as $item) {
            if (! is_array($item)) {
                continue;
            }

            if (($item['type'] ?? 'single') === 'dropdown') {
                $children = array_values(array_filter($item['children'] ?? [], $clickable));

                if ($children === [] || trim((string) ($item['label'] ?? '')) === '') {
                    continue;
                }

                $item['children'] = $children;
            } elseif (! $clickable($item)) {
                continue;
            }

            $visible[] = $item;
        }

        return $visible;
    }

    /**
     * Whether an admin ever built a menu; an empty one falls back to the built-in navbar.
     */
    private function navConfigured(): bool
    {
       return $this->rawNavItems() !== [];
    }

    private function rawNavItems(): array
    {
        return once(function (): array {
            $items = json_decode(
                (string) SiteSetting::where('key', 'nav_items')->value('value'),
                true
            );

            return is_array($items) ? $items : [];
        });
    }
}
