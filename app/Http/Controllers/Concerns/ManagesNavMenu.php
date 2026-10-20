<?php

namespace App\Http\Controllers\Concerns;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Navbar wiring shared by admin modules that place their URLs into the
 * `nav_items` setting (pages, categories): reading the menu, applying a form's
 * placement input, and cleaning entries up when a record is renamed or deleted.
 */
trait ManagesNavMenu
{
    /**
     * Menu placement from a form; null means the form did not touch the menu.
     */
    protected function navInput(Request $request): ?array
    {
        if (! $request->has('nav_placement')) {
            return null;
        }

        $validated = $request->validate([
            'nav_placement' => ['required', Rule::in(['none', 'top', 'dropdown'])],
            'nav_parent_label' => ['nullable', 'string', 'max:255', 'required_if:nav_placement,dropdown'],
            'nav_label' => ['nullable', 'string', 'max:255'],
        ], [
            'nav_parent_label.required_if' => 'Pilih dropdown tujuan untuk menu ini.',
        ]);

        return [
            'placement' => $validated['nav_placement'],
            'parent_label' => $validated['nav_parent_label'] ?? null,
            'label' => trim((string) ($validated['nav_label'] ?? '')),
        ];
    }

    /**
     * Move the URL to its new spot in the menu, or drop it when the placement is "none".
     */
    protected function syncNavPlacement(string $url, string $fallbackLabel, ?array $nav): void
    {
        if ($nav === null) {
            return;
        }

        $items = $this->withoutNavUrl($this->navItems(), $url);

        if ($nav['placement'] === 'none') {
            $this->saveNavItems($items);

            return;
        }

        $label = $nav['label'] !== '' ? $nav['label'] : $fallbackLabel;
        $entry = ['label' => $label, 'url' => $url];

        if ($nav['placement'] === 'top') {
            $items[] = ['type' => 'single', ...$entry];
            $this->saveNavItems($items);

            return;
        }

        $target = $this->findDropdownIndex($items, $nav['parent_label']);

        if ($target === null) {
            throw ValidationException::withMessages([
                'nav_parent_label' => 'Dropdown "'.$nav['parent_label'].'" tidak ditemukan lagi. Muat ulang form ini.',
            ]);
        }

        $items[$target]['children'] = array_values($items[$target]['children'] ?? []);
        $items[$target]['children'][] = $entry;
        $this->saveNavItems($items);
    }

    protected function removeNavEntry(string $url): void
    {
        $this->saveNavItems($this->withoutNavUrl($this->navItems(), $url));
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<int, array<string, mixed>>
     */
    protected function withoutNavUrl(array $items, string $url): array
    {
        $items = array_values(array_filter(
            $items,
            fn ($item) => ! (($item['type'] ?? 'single') === 'single' && ($item['url'] ?? null) === $url),
        ));

        foreach ($items as $index => $item) {
            if (($item['type'] ?? null) !== 'dropdown') {
                continue;
            }

            $items[$index]['children'] = array_values(array_filter(
                $item['children'] ?? [],
                fn ($child) => ($child['url'] ?? null) !== $url,
            ));
        }

        return $items;
    }

    /**
     * @return array{placement: string, label: string, parent_label: string|null}
     */
    protected function navPlacement(string $url): array
    {
        foreach ($this->navItems() as $item) {
            if (($item['type'] ?? 'single') === 'single' && ($item['url'] ?? null) === $url) {
                return [
                    'placement' => 'top',
                    'label' => (string) ($item['label'] ?? ''),
                    'parent_label' => null,
                ];
            }

            foreach ($item['children'] ?? [] as $child) {
                if (($child['url'] ?? null) === $url) {
                    return [
                        'placement' => 'dropdown',
                        'label' => (string) ($child['label'] ?? ''),
                        'parent_label' => (string) ($item['label'] ?? ''),
                    ];
                }
            }
        }

        return ['placement' => 'none', 'label' => '', 'parent_label' => null];
    }

    /**
     * Navbar URLs of both top-level items and dropdown children.
     *
     * @return array<int, string>
     */
    protected function navUrls(): array
    {
        $urls = [];

        foreach ($this->navItems() as $item) {
            if (($item['type'] ?? 'single') === 'single') {
                if (is_string($item['url'] ?? null) && $item['url'] !== '') {
                    $urls[] = $item['url'];
                }

                continue;
            }

            foreach ($item['children'] ?? [] as $child) {
                if (is_string($child['url'] ?? null) && $child['url'] !== '') {
                    $urls[] = $child['url'];
                }
            }
        }

        return $urls;
    }

    /**
     * @return array<int, array{label: string}>
     */
    protected function navDropdowns(): array
    {
        $dropdowns = [];

        foreach ($this->navItems() as $item) {
            $label = trim((string) ($item['label'] ?? ''));

            // A label-less dropdown cannot be picked or found again, so it is not offered here.
            if (($item['type'] ?? null) === 'dropdown' && $label !== '') {
                $dropdowns[] = ['label' => $label];
            }
        }

        return $dropdowns;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function navItems(): array
    {
        return array_values(SiteSetting::getNavItems());
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function saveNavItems(array $items): void
    {
        SiteSetting::saveNavItems($items);
    }

    private function findDropdownIndex(array $items, ?string $label): ?int
    {
        $needle = Str::lower(trim((string) $label));

        if ($needle === '') {
            return null;
        }

        foreach ($items as $index => $item) {
            if (($item['type'] ?? null) !== 'dropdown') {
                continue;
            }

            if (Str::lower(trim((string) ($item['label'] ?? ''))) === $needle) {
                return $index;
            }
        }

        return null;
    }
}
