<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SearchRouteTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_page_accessible(): void
    {
        $response = $this->get('/cari');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Search')
            ->has('items.data')
        );
    }

    public function test_search_finds_posts_by_title(): void
    {
        $user = User::factory()->create();
        $category = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Pendaftaran PPDB 2026',
            'slug' => 'pendaftaran-ppdb-2026',
            'content' => 'Info pendaftaran',
            'status' => 'published',
            'published_at' => now(),
        ]);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Upacara Bendera',
            'slug' => 'upacara-bendera',
            'content' => 'Kegiatan upacara',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/cari?q=pendaftaran');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Search')
            ->where('keyword', 'pendaftaran')
            ->where('items.data.0.title', 'Pendaftaran PPDB 2026')
            ->where('items.total', 1)
        );
    }

    public function test_search_works_across_categories(): void
    {
        $user = User::factory()->create();
        $berita = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);
        $pengumuman = Category::firstOrCreate(['slug' => 'pengumuman'], ['name' => 'Pengumuman']);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $berita->id,
            'title' => 'Info Pendaftaran Beasiswa',
            'slug' => 'info-pendaftaran-beasiswa',
            'content' => 'Konten berita',
            'status' => 'published',
            'published_at' => now(),
        ]);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $pengumuman->id,
            'title' => 'Jadwal Pendaftaran Ulang',
            'slug' => 'jadwal-pendaftaran-ulang',
            'content' => 'Konten pengumuman',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/cari?q=pendaftaran');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Search')
            ->where('items.total', 2)
        );
    }

    public function test_search_returns_empty_for_no_matches(): void
    {
        $response = $this->get('/cari?q=tidak-ada-hasil');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Search')
            ->where('items.total', 0)
        );
    }
}
