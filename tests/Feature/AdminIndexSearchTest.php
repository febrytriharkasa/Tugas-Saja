<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminIndexSearchTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_pages_index_filters_by_title(): void
    {
        $user = $this->admin();
        Page::create(['title' => 'Sambutan Kepala Sekolah', 'slug' => 'sambutan', 'content' => 'Selamat datang', 'is_published' => true]);
        Page::create(['title' => 'Visi dan Misi', 'slug' => 'visi-misi', 'content' => 'Visi sekolah', 'is_published' => true]);

        $this->actingAs($user)->get('/admin/pages?search=sambutan')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Pages/Index')
                ->where('filters.search', 'sambutan')
                ->where('pages.total', 1)
                ->where('pages.data.0.title', 'Sambutan Kepala Sekolah')
            );
    }

    public function test_staff_index_filters_by_name(): void
    {
        $user = $this->admin();
        Staff::create(['name' => 'Budi Santoso', 'role' => 'Guru Matematika', 'type' => 'guru']);
        Staff::create(['name' => 'Siti Aminah', 'role' => 'Kepala Sekolah', 'type' => 'guru']);

        $this->actingAs($user)->get('/admin/staff?search=Budi')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Staff/Index')
                ->where('filters.search', 'Budi')
                ->where('staff.total', 1)
                ->where('staff.data.0.name', 'Budi Santoso')
            );
    }

    public function test_staff_index_filters_by_role(): void
    {
        $user = $this->admin();
        Staff::create(['name' => 'Budi Santoso', 'role' => 'Guru Matematika', 'type' => 'guru']);
        Staff::create(['name' => 'Siti Aminah', 'role' => 'Kepala Sekolah', 'type' => 'guru']);

        $this->actingAs($user)->get('/admin/staff?search=Matematika')
            ->assertInertia(fn (Assert $page) => $page
                ->where('staff.total', 1)
                ->where('staff.data.0.name', 'Budi Santoso')
            );
    }

    public function test_categories_index_filters_by_name(): void
    {
        $user = $this->admin();
        Category::create(['name' => 'Berita', 'slug' => 'berita']);
        Category::create(['name' => 'Agenda', 'slug' => 'agenda']);

        $this->actingAs($user)->get('/admin/categories?search=Agenda')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Categories/Index')
                ->where('filters.search', 'Agenda')
                ->where('categories.total', 1)
                ->where('categories.data.0.name', 'Agenda')
            );
    }

    public function test_index_search_without_matches_returns_empty_result(): void
    {
        $user = $this->admin();
        Page::create(['title' => 'Visi dan Misi', 'slug' => 'visi-misi', 'content' => 'Visi sekolah', 'is_published' => true]);

        $this->actingAs($user)->get('/admin/pages?search=tidak-ada')
            ->assertInertia(fn (Assert $page) => $page
                ->where('pages.total', 0)
            );
    }
}
