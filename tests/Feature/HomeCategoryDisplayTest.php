<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeCategoryDisplayTest extends TestCase
{
    use RefreshDatabase;

    private function publishedPost(Category $category, string $title): Post
    {
        return Post::create([
            'user_id' => User::factory()->create()->id,
            'category_id' => $category->id,
            'title' => $title,
            'slug' => str($title)->slug().'-'.uniqid(),
            'content' => 'Isi konten.',
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    public function test_home_lists_categories_marked_to_show_and_their_posts(): void
    {
        $shown = Category::create(['name' => 'Pengumuman', 'slug' => 'pengumuman', 'show_on_home' => true]);
        $hidden = Category::create(['name' => 'Ekstrakurikuler', 'slug' => 'ekstrakurikuler', 'show_on_home' => false]);
        $this->publishedPost($shown, 'Pengumuman Ujian');
        $this->publishedPost($hidden, 'Latihan Paskibra');

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('homeSections', 1)
            ->where('homeSections.0.slug', 'pengumuman')
            ->has('homeSections.0.posts', 1)
            ->where('homeSections.0.posts.0.title', 'Pengumuman Ujian')
        );
    }

    public function test_berita_stays_fixed_and_is_not_duplicated_as_an_adjustable_section(): void
    {
        $berita = Category::create(['name' => 'Berita', 'slug' => 'berita', 'show_on_home' => true]);
        $this->publishedPost($berita, 'Kabar Sekolah');

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('posts', 1)
            ->has('homeSections', 0)
        );
    }

    public function test_berita_category_cannot_be_deleted(): void
    {
        $berita = Category::create(['name' => 'Berita', 'slug' => 'berita']);
        $user = User::factory()->create();

        $this->actingAs($user)->delete("/admin/categories/{$berita->id}")
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', ['id' => $berita->id]);
    }

    public function test_other_categories_can_be_deleted(): void
    {
        $category = Category::create(['name' => 'Ekstrakurikuler', 'slug' => 'ekstrakurikuler']);
        $user = User::factory()->create();

        $this->actingAs($user)->delete("/admin/categories/{$category->id}")
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_show_on_home_can_be_set_from_category_form(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/admin/categories', [
            'name' => 'Kegiatan Sekolah',
            'show_on_home' => true,
        ])->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', ['slug' => 'kegiatan-sekolah', 'show_on_home' => true]);
    }

    public function test_berita_cannot_be_hidden_from_home(): void
    {
        $berita = Category::create(['name' => 'Berita', 'slug' => 'berita', 'show_on_home' => true]);
        $user = User::factory()->create();

        $this->actingAs($user)->put("/admin/categories/{$berita->id}", [
            'name' => 'Berita Sekolah',
            'show_on_home' => false,
        ])->assertRedirect(route('admin.categories.index'));

        $berita->refresh();
        $this->assertTrue($berita->show_on_home);
        $this->assertSame('berita', $berita->slug);
    }

    public function test_category_edit_page_flags_the_fixed_home_category(): void
    {
        $berita = Category::create(['name' => 'Berita', 'slug' => 'berita']);
        $other = Category::create(['name' => 'Prestasi', 'slug' => 'prestasi']);
        $user = User::factory()->create();

        $this->actingAs($user)->get("/admin/categories/{$berita->id}/edit")
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Categories/Form')
                ->where('category.is_fixed_on_home', true)
            );

        $this->actingAs($user)->get("/admin/categories/{$other->id}/edit")
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Categories/Form')
                ->where('category.is_fixed_on_home', false)
            );
    }
}
