<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminIndexFilterTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_pages_index_filters_by_published_status(): void
    {
        $user = $this->admin();
        Page::create(['title' => 'Halaman Terbit', 'slug' => 'halaman-terbit', 'content' => 'Isi', 'is_published' => true]);
        Page::create(['title' => 'Halaman Draf', 'slug' => 'halaman-draf', 'content' => 'Isi', 'is_published' => false]);

        $this->actingAs($user)->get('/admin/pages?status=published')
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.status', 'published')
                ->where('pages.total', 1)
                ->where('pages.data.0.title', 'Halaman Terbit')
            );
    }

    public function test_pages_index_filters_by_draft_status(): void
    {
        $user = $this->admin();
        Page::create(['title' => 'Halaman Terbit', 'slug' => 'halaman-terbit', 'content' => 'Isi', 'is_published' => true]);
        Page::create(['title' => 'Halaman Draf', 'slug' => 'halaman-draf', 'content' => 'Isi', 'is_published' => false]);

        $this->actingAs($user)->get('/admin/pages?status=draft')
            ->assertInertia(fn (Assert $page) => $page
                ->where('pages.total', 1)
                ->where('pages.data.0.title', 'Halaman Draf')
            );
    }

    public function test_staff_index_filters_by_type(): void
    {
        $user = $this->admin();
        Staff::create(['name' => 'Budi Santoso', 'role' => 'Guru Matematika', 'type' => 'guru']);
        Staff::create(['name' => 'Siti Aminah', 'role' => 'Staf Tata Usaha', 'type' => 'tendik']);

        $this->actingAs($user)->get('/admin/staff?type=tendik')
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.type', 'tendik')
                ->where('staff.total', 1)
                ->where('staff.data.0.name', 'Siti Aminah')
            );
    }

    public function test_categories_index_filters_by_home_display(): void
    {
        $user = $this->admin();
        // Kategori `galeri` dibuat oleh migrasi dan selalu tampil di beranda.
        Category::create(['name' => 'Prestasi', 'slug' => 'prestasi', 'show_on_home' => true]);
        Category::create(['name' => 'Arsip', 'slug' => 'arsip', 'show_on_home' => false]);

        $this->actingAs($user)->get('/admin/categories?show_on_home=shown')
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.show_on_home', 'shown')
                ->where('categories.total', 2)
            );
    }

    public function test_categories_index_filters_hidden_categories(): void
    {
        $user = $this->admin();
        Category::create(['name' => 'Prestasi', 'slug' => 'prestasi', 'show_on_home' => true]);
        Category::create(['name' => 'Arsip', 'slug' => 'arsip', 'show_on_home' => false]);

        $this->actingAs($user)->get('/admin/categories?show_on_home=hidden')
            ->assertInertia(fn (Assert $page) => $page
                ->where('categories.total', 1)
                ->where('categories.data.0.name', 'Arsip')
            );
    }
}
