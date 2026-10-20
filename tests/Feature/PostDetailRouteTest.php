<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostDetailRouteTest extends TestCase
{
    use RefreshDatabase;

    public function test_news_post_accessible_via_category_slug_url(): void
    {
        $user = User::factory()->create();
        $category = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);

        $post = Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Judul Berita Terbaru',
            'slug' => 'judul-berita-terbaru',
            'content' => 'Isi berita lengkap.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/berita/judul-berita-terbaru');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/PostDetail')
            ->where('post.title', 'Judul Berita Terbaru')
            ->where('post.slug', 'judul-berita-terbaru')
            ->where('post.user.name', $user->name)
        );
    }

    public function test_gallery_post_accessible_via_galeri_slug_url(): void
    {
        $user = User::factory()->create();
        $category = Category::firstOrCreate(['slug' => 'galeri'], ['name' => 'Galeri']);

        $post = Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Upacara Hari Kemerdekaan',
            'slug' => 'upacara-hari-kemerdekaan',
            'content' => 'Dokumentasi upacara.',
            'status' => 'published',
            'media_type' => 'image',
            'published_at' => now(),
        ]);

        $response = $this->get('/galeri/upacara-hari-kemerdekaan');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/PostDetail')
            ->where('post.title', 'Upacara Hari Kemerdekaan')
            ->where('post.category.slug', 'galeri')
        );
    }

    public function test_category_slug_mismatch_returns_404(): void
    {
        $user = User::factory()->create();
        $category = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Berita Mismatch',
            'slug' => 'berita-mismatch',
            'content' => 'Konten berita.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/galeri/berita-mismatch')->assertNotFound();
    }

    public function test_post_detail_provides_prev_and_next_posts(): void
    {
        $user = User::factory()->create();
        $category = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);

        $prev = Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Post Pertama',
            'slug' => 'post-pertama',
            'content' => 'Konten pertama',
            'status' => 'published',
            'published_at' => now()->subDays(2),
        ]);

        $current = Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Post Kedua',
            'slug' => 'post-kedua',
            'content' => 'Konten kedua',
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);

        $next = Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Post Ketiga',
            'slug' => 'post-ketiga',
            'content' => 'Konten ketiga',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/berita/post-kedua');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/PostDetail')
            ->where('post.slug', 'post-kedua')
            ->where('prevPost.slug', 'post-pertama')
            ->where('prevPost.category.slug', 'berita')
            ->where('nextPost.slug', 'post-ketiga')
            ->where('nextPost.category.slug', 'berita')
        );
    }
}
