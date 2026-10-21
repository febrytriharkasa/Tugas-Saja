<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FooterSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_footer_settings(): void
    {
        $this->get('/admin/settings/footer')->assertRedirect('/login');
    }

    public function test_admin_can_save_footer_groups(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->post('/admin/settings/footer', [
            'site_name' => 'SMK Bina Bangsa',
            'site_portal_text' => 'Portal resmi SMK Bina Bangsa',
            'footer_about' => 'Sekolah unggul berwawasan global.',
            'footer_groups' => [
                [
                    'title' => 'Halaman',
                    'links' => [
                        ['label' => 'Visi Misi', 'url' => '/visi-misi'],
                        ['label' => 'Sejarah', 'url' => '/sejarah'],
                    ],
                ],
                [
                    'title' => 'Arsip',
                    'links' => [
                        ['label' => 'Berita', 'url' => '/berita'],
                        ['label' => 'Galeri', 'url' => '/galeri'],
                    ],
                ],
            ],
        ]);

        $response->assertRedirect();

        $name = SiteSetting::where('key', 'site_name')->first();
        $portal = SiteSetting::where('key', 'site_portal_text')->first();
        $about = SiteSetting::where('key', 'footer_about')->first();
        $groups = json_decode(SiteSetting::where('key', 'footer_groups')->first()->value, true);

        $this->assertSame('SMK Bina Bangsa', $name->value);
        $this->assertSame('Portal resmi SMK Bina Bangsa', $portal->value);
        $this->assertSame('Sekolah unggul berwawasan global.', $about->value);
        $this->assertCount(2, $groups);
        $this->assertSame('Halaman', $groups[0]['title']);
        $this->assertCount(2, $groups[0]['links']);
        $this->assertSame('Visi Misi', $groups[0]['links'][0]['label']);
        $this->assertSame('Arsip', $groups[1]['title']);
    }

    public function test_footer_groups_validation_requires_title(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->from('/admin/settings/footer')->post('/admin/settings/footer', [
            'footer_groups' => [
                [
                    'title' => '',
                    'links' => [['label' => 'Test', 'url' => '/test']],
                ],
            ],
        ]);

        $response->assertSessionHasErrors('footer_groups.0.title');
    }

    public function test_footer_groups_validation_requires_at_least_one_link(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->from('/admin/settings/footer')->post('/admin/settings/footer', [
            'footer_groups' => [
                [
                    'title' => 'Test',
                    'links' => [],
                ],
            ],
        ]);

        $response->assertSessionHasErrors('footer_groups.0.links');
    }

    public function test_footer_page_provides_internal_link_options(): void
    {
        Page::create(['title' => 'Visi & Misi', 'slug' => 'visi-misi', 'is_published' => true]);
        Page::create(['title' => 'Draft Rahasia', 'slug' => 'draft', 'is_published' => false]);
        Category::create(['name' => 'Kesiswaan', 'slug' => 'kesiswaan']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->get('/admin/settings/footer')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/Footer')
                ->where('linkOptions.0', ['label' => 'Beranda', 'url' => '/'])
                ->where('linkOptions.1', ['label' => 'Berita', 'url' => '/berita'])
                ->where('linkOptions', fn ($all) => collect($all)->contains(
                    fn ($o) => $o['label'] === 'Laman: Visi & Misi' && $o['url'] === '/visi-misi'
                ) && collect($all)->contains(
                    fn ($o) => $o['label'] === 'Kategori: Kesiswaan' && $o['url'] === '/kesiswaan'
                ) && ! collect($all)->contains(fn ($o) => $o['url'] === '/draft'))
            );
    }

    public function test_link_validation_requires_label_and_url(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->from('/admin/settings/footer')->post('/admin/settings/footer', [
            'footer_groups' => [
                [
                    'title' => 'Test',
                    'links' => [
                        ['label' => '', 'url' => '/test'],
                    ],
                ],
            ],
        ]);

        $response->assertSessionHasErrors('footer_groups.0.links.0.label');
    }

    public function test_saving_without_logo_upload_keeps_existing_logo(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/logo.png', 'fake');
        SiteSetting::create(['key' => 'site_logo', 'value' => '/storage/settings/logo.png']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/footer', [
            'site_name' => 'Sekolah',
            'footer_groups' => [['title' => 'Grup', 'links' => [['label' => 'Beranda', 'url' => '/']]]],
        ])->assertRedirect();

        $this->assertSame('/storage/settings/logo.png', SiteSetting::where('key', 'site_logo')->value('value'));
        Storage::disk('public')->assertExists('settings/logo.png');
    }

    public function test_removing_logo_deletes_file_and_setting(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/logo.png', 'fake');
        SiteSetting::create(['key' => 'site_logo', 'value' => '/storage/settings/logo.png']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/footer', [
            'site_name' => 'Sekolah',
            'remove_site_logo' => true,
            'footer_groups' => [['title' => 'Grup', 'links' => [['label' => 'Beranda', 'url' => '/']]]],
        ])->assertRedirect();

        $this->assertNull(SiteSetting::where('key', 'site_logo')->first());
        Storage::disk('public')->assertMissing('settings/logo.png');
    }

    public function test_uploading_new_logo_replaces_old_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/old-logo.png', 'fake');
        SiteSetting::create(['key' => 'site_logo', 'value' => '/storage/settings/old-logo.png']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/footer', [
            'site_name' => 'Sekolah',
            'site_logo_file' => UploadedFile::fake()->image('new-logo.png'),
            'footer_groups' => [['title' => 'Grup', 'links' => [['label' => 'Beranda', 'url' => '/']]]],
        ])->assertRedirect();

        Storage::disk('public')->assertMissing('settings/old-logo.png');
        $this->assertStringContainsString('/storage/settings/', SiteSetting::where('key', 'site_logo')->value('value'));
        $this->assertCount(1, Storage::disk('public')->files('settings'));
    }

    public function test_website_logo_can_be_uploaded_separately_from_school_logo(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/school.png', 'fake');
        SiteSetting::create(['key' => 'site_logo', 'value' => '/storage/settings/school.png']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/footer', [
            'site_name' => 'Sekolah',
            'site_website_logo_file' => UploadedFile::fake()->image('website.png'),
            'footer_groups' => [['title' => 'Grup', 'links' => [['label' => 'Beranda', 'url' => '/']]]],
        ])->assertRedirect();

        $this->assertSame('/storage/settings/school.png', SiteSetting::where('key', 'site_logo')->value('value'));
        $this->assertStringContainsString('/storage/settings/', SiteSetting::where('key', 'site_website_logo')->value('value'));
        Storage::disk('public')->assertExists('settings/school.png');
    }

    public function test_removing_website_logo_keeps_school_logo(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('settings/school.png', 'fake');
        Storage::disk('public')->put('settings/website.png', 'fake');
        SiteSetting::create(['key' => 'site_logo', 'value' => '/storage/settings/school.png']);
        SiteSetting::create(['key' => 'site_website_logo', 'value' => '/storage/settings/website.png']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/settings/footer', [
            'site_name' => 'Sekolah',
            'remove_site_website_logo' => true,
            'footer_groups' => [['title' => 'Grup', 'links' => [['label' => 'Beranda', 'url' => '/']]]],
        ])->assertRedirect();

        $this->assertNull(SiteSetting::where('key', 'site_website_logo')->first());
        $this->assertSame('/storage/settings/school.png', SiteSetting::where('key', 'site_logo')->value('value'));
        Storage::disk('public')->assertMissing('settings/website.png');
        Storage::disk('public')->assertExists('settings/school.png');
    }

    public function test_public_pages_share_website_logo_setting(): void
    {
        SiteSetting::create(['key' => 'site_website_logo', 'value' => '/storage/settings/website.png']);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('settings.site_website_logo', '/storage/settings/website.png')
        );
    }
}
