<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutCategoryPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_based_about_slug_renders_archive_with_posts(): void
    {
        $user = User::factory()->create();
        $category = Category::create([
            'name' => 'Fasilitas',
            'slug' => 'fasilitas',
        ]);

        Page::create([
            'title' => 'Fasilitas',
            'slug' => 'fasilitas',
            'group' => 'tentang',
            'display_type' => 'category',
            'category_id' => $category->id,
            'is_published' => true,
        ]);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Laboratorium Komputer',
            'slug' => 'laboratorium-komputer',
            'content' => 'Fasilitas lab komputer lengkap.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/laman/fasilitas');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Archive')
            ->where('title', 'Fasilitas')
            ->where('type', 'fasilitas')
            ->has('items.data', 1)
        );
    }

    public function test_regular_about_slug_renders_static_page(): void
    {
        Page::create([
            'title' => 'Sejarah Sekolah',
            'slug' => 'sejarah',
            'content' => 'Isi sejarah sekolah',
            'group' => 'tentang',
            'is_published' => true,
        ]);

        $response = $this->get('/laman/sejarah');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Page')
            ->where('page.slug', 'sejarah')
        );
    }

    public function test_archive_group_page_renders_and_is_shared_with_public_navigation(): void
    {
        Page::create([
            'title' => 'Kalender Akademik',
            'slug' => 'kalender-akademik',
            'content' => 'Jadwal akademik sekolah',
            'group' => 'arsip',
            'is_published' => true,
        ]);

        $response = $this->get('/laman/kalender-akademik');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Page')
            ->where('page.group', 'arsip')
            ->where('archivePages.0.slug', 'kalender-akademik')
        );
    }

    public function test_new_category_renders_archive_without_frontend_type_whitelist(): void
    {
        $user = User::factory()->create();
        $category = Category::create([
            'name' => 'Kegiatan Siswa',
            'slug' => 'kegiatan-siswa',
        ]);

        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Pentas Seni Sekolah',
            'slug' => 'pentas-seni-sekolah',
            'content' => 'Kegiatan pentas seni siswa.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/arsip/kegiatan-siswa');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Archive')
            ->where('title', 'Kegiatan Siswa')
            ->where('type', 'kegiatan-siswa')
            ->has('items.data', 1)
        );
    }
}
