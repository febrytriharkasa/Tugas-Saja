<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Staff;
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
            ->where('pages', [])
            ->where('staff', [])
        );
    }

    public function test_search_matches_post_content(): void
    {
        $user = User::factory()->create();
        $category = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Kegiatan Semester Ganjil',
            'slug' => 'kegiatan-semester-ganjil',
            'content' => 'Tim robotik sekolah meraih juara provinsi.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/cari?q=robotik');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('items.total', 1)
            ->where('items.data.0.title', 'Kegiatan Semester Ganjil')
        );
    }

    public function test_search_matches_post_metadata_and_category_name(): void
    {
        $user = User::factory()->create();
        $category = Category::firstOrCreate(['slug' => 'prestasi'], ['name' => 'Prestasi Akademik']);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Daftar Juara',
            'slug' => 'daftar-juara',
            'content' => 'Rekap lomba.',
            'metadata' => ['pembimbing' => 'Ustadz Fulan'],
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/cari?q=fulan')->assertInertia(fn (Assert $page) => $page
            ->where('items.total', 1)
        );

        $this->get('/cari?q=akademik')->assertInertia(fn (Assert $page) => $page
            ->where('items.total', 1)
        );
    }

    public function test_search_matches_published_pages_only(): void
    {
        Page::create([
            'title' => 'Pusat Laboratorium',
            'slug' => 'pusat-laboratorium',
            'content' => '<p>Informasi penggunaan laboratorium komputer.</p>',
            'is_published' => true,
        ]);

        Page::create([
            'title' => 'Draf Laboratorium',
            'slug' => 'draf-laboratorium',
            'content' => '<p>Rencana laboratorium baru.</p>',
            'is_published' => false,
        ]);

        $response = $this->get('/cari?q=laboratorium');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('counts.pages', 1)
            ->has('pages', 1)
            ->where('pages.0.title', 'Pusat Laboratorium')
            ->where('pages.0.slug', 'pusat-laboratorium')
        );
    }

    public function test_search_matches_staff(): void
    {
        Staff::create([
            'name' => 'Budi Santoso',
            'role' => 'Guru Matematika',
            'type' => 'guru',
            'email' => 'budi@smaxyz.sch.id',
        ]);

        Staff::create([
            'name' => 'Siti Aminah',
            'role' => 'Kepala Tata Usaha',
            'type' => 'tendik',
        ]);

        $response = $this->get('/cari?q=budi');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('counts.staff', 1)
            ->has('staff', 1)
            ->where('staff.0.name', 'Budi Santoso')
        );
    }
}
