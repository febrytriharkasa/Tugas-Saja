<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
                        ['label' => 'Visi Misi', 'url' => '/laman/visi-misi'],
                        ['label' => 'Sejarah', 'url' => '/laman/sejarah'],
                    ],
                ],
                [
                    'title' => 'Arsip',
                    'links' => [
                        ['label' => 'Berita', 'url' => '/berita'],
                        ['label' => 'Galeri', 'url' => '/arsip/galeri'],
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
        Page::create(['title' => 'Visi & Misi', 'slug' => 'visi-misi', 'group' => 'laman', 'is_published' => true]);
        Page::create(['title' => 'Draft Rahasia', 'slug' => 'draft', 'group' => 'laman', 'is_published' => false]);
        Category::create(['name' => 'Kesiswaan', 'slug' => 'kesiswaan']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->get('/admin/settings/footer')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/Footer')
                ->where('linkOptions.0', ['label' => 'Beranda', 'url' => '/'])
                ->where('linkOptions.1', ['label' => 'Berita', 'url' => '/berita'])
                ->where('linkOptions', fn ($all) => collect($all)->contains(
                    fn ($o) => $o['label'] === 'Laman: Visi & Misi' && $o['url'] === '/laman/visi-misi'
                ) && collect($all)->contains(
                    fn ($o) => $o['label'] === 'Kategori: Kesiswaan' && $o['url'] === '/arsip/kesiswaan'
                ) && ! collect($all)->contains(fn ($o) => $o['url'] === '/laman/draft'))
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
}
