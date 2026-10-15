<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutCategoryPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_about_slug_renders_static_page(): void
    {
        Page::create([
            'title' => 'Sejarah Sekolah',
            'slug' => 'sejarah',
            'content' => 'Isi sejarah sekolah',
            'is_published' => true,
        ]);

        $response = $this->get('/sejarah');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Page')
            ->where('page.slug', 'sejarah')
        );
    }

    public function test_archive_page_renders_and_is_shared_with_public_navigation(): void
    {
        Page::create([
            'title' => 'Kalender Akademik',
            'slug' => 'kalender-akademik',
            'content' => 'Jadwal akademik sekolah',
            'is_published' => true,
        ]);

        $response = $this->get('/kalender-akademik');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Page')
            ->where('page.slug', 'kalender-akademik')
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

        $response = $this->get('/kegiatan-siswa');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Archive')
            ->where('title', 'Kegiatan Siswa')
            ->where('type', 'kegiatan-siswa')
            ->has('items.data', 1)
        );
    }

    public function test_static_page_stores_image_and_blocks_metadata(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user)->post('/admin/pages', [
            'title' => 'Sejarah Sekolah',
            'content' => 'Isi sejarah sekolah.',
            'is_published' => true,
            'image' => UploadedFile::fake()->image('sejarah.jpg'),
            'meta' => [
                'blocks' => [
                    [
                        'type' => 'table',
                        'title' => 'Periode Kepemimpinan',
                        'description' => 'Daftar kepala sekolah.',
                        'columns' => ['Nama', 'Tahun'],
                        'rows' => [['Ahmad', '1990-2000']],
                    ],
                    [
                        'type' => 'text',
                        'content' => 'Catatan tambahan sejarah.',
                    ],
                ],
            ],
        ])->assertRedirect(route('admin.pages.index'));

        $page = Page::where('title', 'Sejarah Sekolah')->first();
        $this->assertNotNull($page);
        $this->assertNotNull($page->image);
        $this->assertCount(2, $page->metadata['blocks']);
        $this->assertSame('Periode Kepemimpinan', $page->metadata['blocks'][0]['title']);
        $this->assertCount(1, Storage::disk('public')->allFiles('pages'));
    }

    public function test_static_page_update_replaces_image_and_drops_empty_blocks(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $page = Page::create([
            'title' => 'Visi Misi',
            'slug' => 'visi-misi',
            'content' => 'Visi misi sekolah.',
            'is_published' => true,
        ]);

        $this->actingAs($user)->put("/admin/pages/{$page->id}", [
            'title' => 'Visi Misi',
            'content' => 'Visi misi sekolah diperbarui.',
            'is_published' => true,
            'image' => UploadedFile::fake()->image('visi.jpg'),
            'meta' => [
                'blocks' => [
                    ['type' => 'text', 'content' => '   '],
                ],
            ],
        ])->assertRedirect(route('admin.pages.index'));

        $page->refresh();
        $this->assertNotNull($page->image);
        $this->assertNull($page->metadata);
        $this->assertSame('Visi misi sekolah diperbarui.', $page->content);
    }

    public function test_public_static_page_receives_image_and_metadata(): void
    {
        $page = Page::create([
            'title' => 'Sejarah Sekolah',
            'slug' => 'sejarah',
            'content' => 'Isi sejarah sekolah.',
            'image' => '/storage/pages/sejarah.jpg',
            'metadata' => [
                'blocks' => [
                    ['type' => 'text', 'content' => 'Catatan sejarah.'],
                ],
            ],
            'is_published' => true,
        ]);

        $this->get('/sejarah')->assertOk()->assertInertia(fn (Assert $assert) => $assert
            ->component('Public/Page')
            ->where('page.image', '/storage/pages/sejarah.jpg')
            ->where('page.metadata.blocks.0.content', 'Catatan sejarah.')
        );
    }
}
