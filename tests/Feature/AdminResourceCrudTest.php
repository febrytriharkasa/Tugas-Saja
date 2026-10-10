<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Gallery;
use App\Models\Post;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminResourceCrudTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_staff_resource_pages_render(): void
    {
        $staff = Staff::create(['name' => 'Budi', 'role' => 'Guru Matematika', 'type' => 'guru']);
        $user = $this->admin();

        $this->actingAs($user)->get('/admin/staff')
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Staff/Index'));
        $this->actingAs($user)->get('/admin/staff/create')
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Staff/Form'));
        $this->actingAs($user)->get("/admin/staff/{$staff->id}")
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Staff/Show')->where('staffMember.id', $staff->id));
        $this->actingAs($user)->get("/admin/staff/{$staff->id}/edit")
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Staff/Form')->where('staffMember.id', $staff->id));
    }

    public function test_staff_can_be_created_updated_and_deleted(): void
    {
        $user = $this->admin();

        $this->actingAs($user)->post('/admin/staff', [
            'name' => 'Siti',
            'role' => 'Guru IPA',
            'type' => 'guru',
        ])->assertRedirect(route('admin.staff.index'));

        $staff = Staff::firstWhere('name', 'Siti');
        $this->assertNotNull($staff);

        $this->actingAs($user)->put("/admin/staff/{$staff->id}", [
            'name' => 'Siti Aminah',
            'role' => 'Guru IPA',
            'type' => 'tendik',
        ])->assertRedirect(route('admin.staff.index'));

        $this->assertDatabaseHas('staff', ['id' => $staff->id, 'name' => 'Siti Aminah', 'type' => 'tendik']);

        $this->actingAs($user)->delete("/admin/staff/{$staff->id}")
            ->assertRedirect(route('admin.staff.index'));
        $this->assertDatabaseMissing('staff', ['id' => $staff->id]);
    }

    public function test_category_update_persists_metadata_schema(): void
    {
        $user = $this->admin();
        $category = Category::create(['name' => 'Agenda', 'slug' => 'agenda']);

        $this->actingAs($user)->put("/admin/categories/{$category->id}", [
            'name' => 'Agenda Sekolah',
            'metadata_schema' => [
                ['key' => 'lokasi', 'label' => 'Lokasi', 'type' => 'text'],
            ],
        ])->assertRedirect(route('admin.categories.index'));

        $category->refresh();
        $this->assertSame('agenda-sekolah', $category->slug);
        $this->assertSame([['key' => 'lokasi', 'label' => 'Lokasi', 'type' => 'text']], $category->metadata_schema);
    }

    public function test_gallery_update_keeps_existing_file_when_none_uploaded(): void
    {
        Storage::fake('public');
        $user = $this->admin();
        $gallery = Gallery::create(['title' => 'Lama', 'media_type' => 'image', 'file_path' => '/storage/galleries/old.jpg']);

        $this->actingAs($user)->put("/admin/galleries/{$gallery->id}", [
            'title' => 'Judul Baru',
            'media_type' => 'image',
        ])->assertRedirect(route('admin.galleries.index'));

        $this->assertDatabaseHas('galleries', [
            'id' => $gallery->id,
            'title' => 'Judul Baru',
            'file_path' => '/storage/galleries/old.jpg',
        ]);
    }

    public function test_gallery_store_saves_uploaded_file(): void
    {
        Storage::fake('public');
        $user = $this->admin();

        $this->actingAs($user)->post('/admin/galleries', [
            'title' => 'Upacara',
            'media_type' => 'image',
            'file' => UploadedFile::fake()->image('foto.jpg'),
        ])->assertRedirect(route('admin.galleries.index'));

        $this->assertDatabaseHas('galleries', ['title' => 'Upacara']);
        $this->assertCount(1, Storage::disk('public')->allFiles('galleries'));
    }

    public function test_post_can_be_created_with_achievement_table_metadata(): void
    {
        $user = $this->admin();
        $category = Category::create(['name' => 'Prestasi', 'slug' => 'prestasi']);

        $response = $this->actingAs($user)->post('/admin/posts', [
            'title' => 'Juara Olimpiade Sains',
            'category_id' => $category->id,
            'content' => 'Selamat kepada para pemenang.',
            'status' => 'published',
            'meta' => [
                'achievement_table' => [
                    ['name' => 'Ahmad', 'rank' => 'Juara 1', 'event' => 'OSN Fisika'],
                    ['name' => 'Budi', 'rank' => 'Juara 2', 'event' => 'OSN Kimia'],
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $post = Post::where('title', 'Juara Olimpiade Sains')->first();
        $this->assertNotNull($post);
        $this->assertIsArray($post->metadata);
        $this->assertArrayHasKey('achievement_table', $post->metadata);
        $this->assertCount(2, $post->metadata['achievement_table']);
        $this->assertEquals('Ahmad', $post->metadata['achievement_table'][0]['name']);
    }
}
