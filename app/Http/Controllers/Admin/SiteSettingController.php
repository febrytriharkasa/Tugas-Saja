<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiteSettingController extends Controller
{
    public function hero()
    {
        $settings = SiteSetting::all()->groupBy('group_name');

        return Inertia::render('Admin/Settings/Hero', [
            'settings' => $settings,
            'linkOptions' => $this->footerLinkOptions(),
        ]);
    }

    public function updateHero(Request $request)
    {
        $fileKeys = ['hero_slide_1_file', 'hero_slide_2_file'];
        $removeKeys = ['remove_hero_slide_1_image', 'remove_hero_slide_2_image'];
        $data = $request->except(array_merge(['_token'], $fileKeys, $removeKeys));

        foreach ([1, 2] as $i) {
            $inputName = "hero_slide_{$i}_file";
            $imageKey = "hero_slide_{$i}_image";

            if ($request->hasFile($inputName)) {
                $request->validate([
                    $inputName => 'image|mimes:jpeg,png,jpg,webp|max:2048',
                ]);
                $existing = SiteSetting::where('key', $imageKey)->first();
                if ($existing) {
                    $this->deleteSettingFile($existing->value);
                }
                $path = $request->file($inputName)->store('settings', 'public');
                $data[$imageKey] = Storage::url($path);
            } elseif ($request->boolean("remove_hero_slide_{$i}_image")) {
                $imageKey = "hero_slide_{$i}_image";
                $fallbackKey = "hero_background_image";
                $existingImage = SiteSetting::where('key', $imageKey)->first();
                $existingFallback = SiteSetting::where('key', $fallbackKey)->first();
                if ($existingImage) {
                    $this->deleteSettingFile($existingImage->value);
                }
                if ($existingFallback) {
                    $this->deleteSettingFile($existingFallback->value);
                }
                $data[$imageKey] = '';
                $data[$fallbackKey] = '';
            }
        }

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'updated_at' => now()]
            );
        }

        return redirect()->back();
    }

    private function deleteSettingFile(?string $url): void
    {
        if (! $url) {
            return;
        }

        $relativePath = str_replace('/storage/', '', $url);

        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    public function contact()
    {
        $settings = SiteSetting::all()->groupBy('group_name');

        return Inertia::render('Admin/Settings/Contact', [
            'settings' => $settings,
        ]);
    }

    public function updateContact(Request $request)
    {
        $data = $request->except(['_token']);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'updated_at' => now()]
            );
        }

        return redirect()->back();
    }

    public function quickLinks()
    {
        $settings = SiteSetting::all()->groupBy('group_name');

        return Inertia::render('Admin/Settings/QuickLinks', [
            'settings' => $settings,
        ]);
    }

    public function updateQuickLinks(Request $request)
    {
        $data = $request->except(['_token']);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'updated_at' => now()]
            );
        }

        return redirect()->back();
    }

    public function socialMedia()
    {
        $settings = SiteSetting::all()->groupBy('group_name');

        return Inertia::render('Admin/Settings/SocialMedia', [
            'settings' => $settings,
        ]);
    }

    public function updateSocialMedia(Request $request)
    {
        $data = $request->except(['_token']);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'updated_at' => now()]
            );
        }

        return redirect()->back();
    }

    public function footer()
    {
        $settings = SiteSetting::all()->groupBy('group_name');

        return Inertia::render('Admin/Settings/Footer', [
            'settings' => $settings,
            'linkOptions' => $this->footerLinkOptions(),
        ]);
    }

    /**
     * Ready-to-pick internal pages so admins never copy URLs by hand.
     */
    public function footerLinkOptions(): array
    {
        $options = [
            ['label' => 'Beranda', 'url' => '/'],
            ['label' => 'Berita', 'url' => '/berita'],
            ['label' => 'Statistik', 'url' => '/statistik'],
        ];

        $ppdbUrl = SiteSetting::where('key', 'ppdb_link')->value('value');
        if ($ppdbUrl) {
            $options[] = ['label' => 'Daftar PPDB', 'url' => $ppdbUrl];
        }

        foreach (Page::where('is_published', true)->orderBy('title')->get(['title', 'slug']) as $page) {
            $options[] = ['label' => 'Laman: '.$page->title, 'url' => '/'.$page->slug];
        }

        foreach (Category::orderBy('name')->get(['name', 'slug']) as $category) {
            $options[] = ['label' => 'Kategori: '.$category->name, 'url' => '/'.$category->slug];
        }

        return $options;
    }

    public function updateFooter(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:100',
            'site_portal_text' => 'nullable|string|max:100',
            'site_logo_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'footer_about' => 'nullable|string|max:500',
            'footer_groups' => 'nullable|array',
            'footer_groups.*.title' => 'required|string|max:100',
            'footer_groups.*.links' => 'required|array|min:1',
            'footer_groups.*.links.*.label' => 'required|string|max:100',
            'footer_groups.*.links.*.url' => 'required|string|max:500',
        ]);

        if ($request->hasFile('site_logo_file')) {
            $existingLogo = SiteSetting::where('key', 'site_logo')->first();
            if ($existingLogo) {
                $this->deleteSettingFile($existingLogo->value);
            }
            $path = $request->file('site_logo_file')->store('settings', 'public');
            SiteSetting::updateOrCreate(
                ['key' => 'site_logo'],
                ['value' => Storage::url($path), 'updated_at' => now()]
            );
        } elseif ($request->boolean('remove_site_logo')) {
            $existingLogo = SiteSetting::where('key', 'site_logo')->first();
            if ($existingLogo) {
                $this->deleteSettingFile($existingLogo->value);
                $existingLogo->delete();
            }
        }

        foreach (['site_name', 'site_portal_text', 'footer_about'] as $key) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $validated[$key] ?? '', 'updated_at' => now()]
            );
        }

        SiteSetting::updateOrCreate(
            ['key' => 'footer_groups'],
            ['value' => json_encode(array_values($validated['footer_groups'] ?? [])), 'updated_at' => now()]
        );

        return redirect()->back();
    }

    public function navigation()
    {
        $settings = SiteSetting::all()->groupBy('group_name');

        return Inertia::render('Admin/Settings/Navigation', [
            'settings' => $settings,
            'linkOptions' => $this->footerLinkOptions(),
        ]);
    }

    public function updateNavigation(Request $request)
    {
        $validated = $request->validate([
            'nav_items' => 'nullable|array',
            'nav_items.*.type' => 'required|in:single,dropdown',
            'nav_items.*.label' => 'required|string|max:100',
            'nav_items.*.url' => 'required_if:nav_items.*.type,single|nullable|string|max:500',
            'nav_items.*.children' => 'required_if:nav_items.*.type,dropdown|array',
            'nav_items.*.children.*.label' => 'required|string|max:100',
            'nav_items.*.children.*.url' => 'required|string|max:500',
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'nav_items'],
            ['value' => json_encode(array_values($validated['nav_items'] ?? [])), 'updated_at' => now()]
        );

        return redirect()->back();
    }

    public function topbar()
    {
        $settings = SiteSetting::all()->groupBy('group_name');

        return Inertia::render('Admin/Settings/Topbar', [
            'settings' => $settings,
            'linkOptions' => $this->footerLinkOptions(),
        ]);
    }

    public function updateTopbar(Request $request)
    {
        $validated = $request->validate([
            'topbar_links' => 'nullable|array',
            'topbar_links.*.label' => 'required|string|max:100',
            'topbar_links.*.url' => 'required|string|max:500',
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'topbar_links'],
            ['value' => json_encode(array_values($validated['topbar_links'] ?? [])), 'updated_at' => now()]
        );

        return redirect()->back();
    }
}
