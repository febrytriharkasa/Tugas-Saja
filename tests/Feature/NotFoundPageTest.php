<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NotFoundPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_missing_page_slug_renders_public_not_found_page(): void
    {
        $this->get('/halaman-yang-tidak-ada')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page->component('Public/NotFound'));
    }

    public function test_missing_post_renders_public_not_found_page(): void
    {
        $this->get('/berita/tidak-ada')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page->component('Public/NotFound'));
    }

    public function test_unknown_admin_url_renders_admin_not_found_page(): void
    {
        $this->get('/admin/halaman-yang-tidak-ada')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/NotFound'));
    }

    public function test_unknown_admin_url_keeps_shared_props_for_logged_in_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/admin/halaman-yang-tidak-ada')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/NotFound')
                ->where('auth.user.id', $user->id)
            );
    }

    public function test_unknown_api_url_still_returns_json(): void
    {
        $this->getJson('/api/tidak-ada')
            ->assertNotFound()
            ->assertHeader('Content-Type', 'application/json');
    }

    public function test_inertia_visit_to_missing_page_returns_the_not_found_page(): void
    {
        config(['app.asset_url' => 'https://assets.test']);

        $response = $this->get('/halaman-yang-tidak-ada', [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => hash('xxh128', 'https://assets.test'),
        ]);

        $response->assertNotFound();
        $response->assertHeader('X-Inertia', 'true');
        $this->assertSame('Public/NotFound', $response->json('component'));
    }
}
