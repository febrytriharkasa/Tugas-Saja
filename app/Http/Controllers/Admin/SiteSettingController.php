<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->groupBy('group_name');
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->except(['_token', 'hero_background_file']);

        if ($request->hasFile('hero_background_file')) {
            $request->validate([
                'hero_background_file' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
            $path = $request->file('hero_background_file')->store('settings', 'public');
            $data['hero_background_image'] = Storage::url($path);
        }

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'updated_at' => now()]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan tampilan berhasil diperbarui.');
    }
}
