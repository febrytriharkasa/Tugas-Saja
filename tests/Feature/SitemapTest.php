<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_lists_only_published_pages_and_posts(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->makePost($user, $category, [
            'title' => 'Berita Terbit',
            'slug' => 'berita-terbit',
            'status' => 'published',
        ]);

        $this->makePost($user, $category, [
            'title' => 'Berita Draf',
            'slug' => 'berita-draf',
            'status' => 'draft',
        ]);

        Page::create([
            'title' => 'Profil Sekolah',
            'slug' => 'profil',
            'content' => '<p>Profil</p>',
            'is_published' => true,
        ]);

        Page::create([
            'title' => 'Laman Draf',
            'slug' => 'laman-draf',
            'content' => '<p>Draf</p>',
            'is_published' => false,
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk()->assertHeader('Content-Type', 'application/xml; charset=UTF-8');

        $body = $response->getContent();

        $this->assertStringContainsString('/berita/berita-terbit', $body);
        $this->assertStringContainsString('/profil', $body);
        $this->assertStringContainsString('/berita', $body);
        $this->assertStringNotContainsString('/berita-draf', $body);
        $this->assertStringNotContainsString('/laman-draf', $body);
    }

    public function test_robots_txt_points_to_the_sitemap(): void
    {
        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('User-agent: *', false)
            ->assertSee('Disallow: /admin', false)
            ->assertSee('Sitemap: '.rtrim((string) config('app.url'), '/').'/sitemap.xml', false);
    }

    private function makePost(User $user, Category $category, array $attributes): Post
    {
        return Post::create(array_merge([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Judul Post',
            'slug' => 'judul-post',
            'content' => '<p>Isi post.</p>',
            'status' => 'published',
            'published_at' => now(),
        ], $attributes));
    }
}
