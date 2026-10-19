<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryMetadataTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_category_with_metadata_schema(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/admin/categories', [
            'name' => 'Fasilitas Lab',
            'metadata_schema' => [
                ['key' => 'kapasitas', 'label' => 'Kapasitas Ruangan', 'type' => 'number'],
                ['key' => 'lokasi', 'label' => 'Lokasi Gedung', 'type' => 'text'],
            ],
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', [
            'name' => 'Fasilitas Lab',
            'slug' => 'fasilitas-lab',
        ]);

        $category = Category::where('slug', 'fasilitas-lab')->first();
        $this->assertEquals([
            ['key' => 'kapasitas', 'label' => 'Kapasitas Ruangan', 'type' => 'number'],
            ['key' => 'lokasi', 'label' => 'Lokasi Gedung', 'type' => 'text'],
        ], $category->metadata_schema);
    }

    public function test_can_create_category_with_media_preview_mode(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/admin/categories', [
            'name' => 'YouTube Sekolah',
            'preview_mode' => 'media',
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', [
            'slug' => 'youtube-sekolah',
            'preview_mode' => 'media',
        ]);
    }

    public function test_category_with_media_preview_mode_sends_preview_mode_to_archive(): void
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Video Dokumentasi', 'slug' => 'video-dokumentasi', 'preview_mode' => 'media']);
        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Profil YouTube Sekolah',
            'slug' => 'profil-youtube-sekolah',
            'content' => 'Video profil.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/video-dokumentasi');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Archive')
            ->where('previewMode', 'media')
            ->has('items.data', 1)
        );
    }

    public function test_default_category_uses_standard_preview_mode(): void
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Kegiatan Siswa', 'slug' => 'kegiatan-siswa']);
        Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Pentas Seni Sekolah',
            'slug' => 'pentas-seni-sekolah',
            'content' => 'Kegiatan pentas seni siswa.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/kegiatan-siswa');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Archive')
            ->where('previewMode', 'standard')
        );
    }
}
