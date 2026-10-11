<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeContentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_users_cannot_access_home_content_management(): void
    {
        $this->get('/admin/home-content')->assertRedirect(route('login'));
    }

    public function test_home_content_page_lists_all_categories_with_published_count(): void
    {
        $user = User::factory()->create();
        $shown = Category::create(['name' => 'Pengumuman', 'slug' => 'pengumuman', 'show_on_home' => true]);
        $hidden = Category::create(['name' => 'Prestasi', 'slug' => 'prestasi', 'show_on_home' => false]);

        $this->actingAs($user)->get('/admin/home-content')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/HomeContent/Index')
                ->has('categories', 2)
                ->where('categories.0.name', 'Pengumuman')
                ->where('categories.0.show_on_home', true)
                ->where('categories.0.published_posts_count', 0)
                ->where('categories.1.name', 'Prestasi')
                ->where('categories.1.show_on_home', false)
            );
    }

    public function test_updating_home_content_changes_category_visibility(): void
    {
        $user = User::factory()->create();
        $cat1 = Category::create(['name' => 'Pengumuman', 'slug' => 'pengumuman', 'show_on_home' => false]);
        $cat2 = Category::create(['name' => 'Prestasi', 'slug' => 'prestasi', 'show_on_home' => true]);

        $this->actingAs($user)->put('/admin/home-content', [
            'categories' => [
                ['id' => $cat1->id, 'show_on_home' => true],
                ['id' => $cat2->id, 'show_on_home' => false],
            ],
        ])->assertRedirect(route('admin.home-content.index'));

        $this->assertDatabaseHas('categories', ['id' => $cat1->id, 'show_on_home' => true]);
        $this->assertDatabaseHas('categories', ['id' => $cat2->id, 'show_on_home' => false]);
    }

    public function test_fixed_categories_cannot_be_hidden(): void
    {
        $user = User::factory()->create();
        $berita = Category::create(['name' => 'Berita', 'slug' => 'berita', 'show_on_home' => true]);

        $this->actingAs($user)->put('/admin/home-content', [
            'categories' => [
                ['id' => $berita->id, 'show_on_home' => false],
            ],
        ])->assertRedirect(route('admin.home-content.index'));

        $berita->refresh();
        $this->assertTrue($berita->show_on_home);
    }

    public function test_updating_home_content_requires_valid_category_ids(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/admin/home-content', [
            'categories' => [
                ['id' => 9999, 'show_on_home' => true],
            ],
        ])->assertSessionHasErrors('categories.0.id');
    }

    public function test_updating_home_content_requires_boolean_show_on_home(): void
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Pengumuman', 'slug' => 'pengumuman', 'show_on_home' => false]);

        $this->actingAs($user)->put('/admin/home-content', [
            'categories' => [
                ['id' => $category->id, 'show_on_home' => 'invalid'],
            ],
        ])->assertSessionHasErrors('categories.0.show_on_home');
    }
}
