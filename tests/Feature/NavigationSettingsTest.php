<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NavigationSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_navigation_settings(): void
    {
        $this->get('/admin/settings/navigation')->assertRedirect('/login');
    }

    public function test_admin_can_save_nav_items(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->post('/admin/settings/navigation', [
            'nav_items' => [
                [
                    'type' => 'single',
                    'label' => 'Beranda',
                    'url' => '/',
                ],
                [
                    'type' => 'dropdown',
                    'label' => 'Tentang',
                    'url' => null,
                    'children' => [
                        ['label' => 'Visi Misi', 'url' => '/visi-misi'],
                        ['label' => 'Sejarah', 'url' => '/sejarah'],
                    ],
                ],
            ],
        ]);

        $response->assertRedirect();

        $saved = json_decode(SiteSetting::where('key', 'nav_items')->first()->value, true);

        $this->assertCount(2, $saved);
        $this->assertSame('single', $saved[0]['type']);
        $this->assertSame('Beranda', $saved[0]['label']);
        $this->assertSame('dropdown', $saved[1]['type']);
        $this->assertCount(2, $saved[1]['children']);
    }

    public function test_nav_items_validation_requires_type_and_label(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->from('/admin/settings/navigation')->post('/admin/settings/navigation', [
            'nav_items' => [
                [
                    'type' => 'single',
                    'label' => '',
                    'url' => '/',
                ],
            ],
        ]);

        $response->assertSessionHasErrors('nav_items.0.label');
    }

    public function test_single_item_requires_url(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->from('/admin/settings/navigation')->post('/admin/settings/navigation', [
            'nav_items' => [
                [
                    'type' => 'single',
                    'label' => 'Beranda',
                    'url' => '',
                ],
            ],
        ]);

        $response->assertSessionHasErrors('nav_items.0.url');
    }

    public function test_dropdown_item_requires_children(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->from('/admin/settings/navigation')->post('/admin/settings/navigation', [
            'nav_items' => [
                [
                    'type' => 'dropdown',
                    'label' => 'Tentang',
                    'url' => null,
                    'children' => [],
                ],
            ],
        ]);

        $response->assertSessionHasErrors('nav_items.0.children');
    }

    public function test_navigation_page_provides_link_options(): void
    {
        Page::create(['title' => 'Visi & Misi', 'slug' => 'visi-misi', 'is_published' => true]);
        Category::create(['name' => 'Kesiswaan', 'slug' => 'kesiswaan']);
        $admin = User::factory()->create();

        $this->actingAs($admin)->get('/admin/settings/navigation')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/Navigation')
                ->where('linkOptions', fn ($all) => collect($all)->contains(
                    fn ($o) => $o['label'] === 'Beranda' && $o['url'] === '/'
                ) && collect($all)->contains(
                    fn ($o) => $o['label'] === 'Laman: Visi & Misi' && $o['url'] === '/visi-misi'
                ) && collect($all)->contains(
                    fn ($o) => $o['label'] === 'Kategori: Kesiswaan' && $o['url'] === '/kesiswaan'
                ))
            );
    }
}
