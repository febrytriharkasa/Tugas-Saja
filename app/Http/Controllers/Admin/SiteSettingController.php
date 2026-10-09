<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        ]);
    }

    public function updateHero(Request $request)
    {
        $fileKeys = ['hero_slide_1_file', 'hero_slide_2_file'];
        $data = $request->except(array_merge(['_token'], $fileKeys));

        foreach ([1, 2] as $i) {
            $inputName = "hero_slide_{$i}_file";
            if ($request->hasFile($inputName)) {
                $request->validate([
                    $inputName => 'image|mimes:jpeg,png,jpg,webp|max:2048',
                ]);
                $path = $request->file($inputName)->store('settings', 'public');
                $data["hero_slide_{$i}_image"] = Storage::url($path);
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
}
