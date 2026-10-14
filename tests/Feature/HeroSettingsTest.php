<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class HeroSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_removing_slide_image_deletes_file_and_clears_setting(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/slide1.jpg', 'fake');
        SiteSetting::create(['key' => 'hero_slide_1_image', 'value' => '/storage/settings/slide1.jpg']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/hero', [
            'hero_background' => '#065F46',
            'remove_hero_slide_1_image' => true,
        ])->assertRedirect();

        $this->assertSame('', SiteSetting::where('key', 'hero_slide_1_image')->value('value'));
        Storage::disk('public')->assertMissing('settings/slide1.jpg');
    }

    public function test_removing_slide_image_also_clears_legacy_background_key(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/legacy.jpg', 'fake');
        SiteSetting::create(['key' => 'hero_background_image', 'value' => '/storage/settings/legacy.jpg']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/hero', [
            'hero_background' => '#065F46',
            'remove_hero_slide_1_image' => true,
        ])->assertRedirect();

        $this->assertSame('', SiteSetting::where('key', 'hero_background_image')->value('value'));
        Storage::disk('public')->assertMissing('settings/legacy.jpg');
    }

    public function test_uploading_new_slide_image_replaces_old_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/old.jpg', 'fake');
        SiteSetting::create(['key' => 'hero_slide_2_image', 'value' => '/storage/settings/old.jpg']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/hero', [
            'hero_background' => '#065F46',
            'hero_slide_2_file' => UploadedFile::fake()->image('new.jpg'),
        ])->assertRedirect();

        Storage::disk('public')->assertMissing('settings/old.jpg');
        $this->assertCount(1, Storage::disk('public')->files('settings'));
    }

    public function test_removal_flags_are_not_persisted_as_settings(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/hero', [
            'hero_background' => '#065F46',
            'remove_hero_slide_1_image' => true,
            'remove_hero_slide_2_image' => true,
        ])->assertRedirect();

        $this->assertNull(SiteSetting::where('key', 'remove_hero_slide_1_image')->first());
        $this->assertNull(SiteSetting::where('key', 'remove_hero_slide_2_image')->first());
    }
}
