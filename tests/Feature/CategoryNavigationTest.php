<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryNavigationTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_can_be_placed_as_top_level_nav_item(): void
    {
        $this->seedNav([['type' => 'single', 'label' => 'Beranda', 'url' => '/']]);

        $this->actingAs(User::factory()->create())->post('/admin/categories', [
            'name' => 'Prestasi',
            'nav_placement' => 'top',
        ])->assertRedirect(route('admin.categories.index'));

        $items = $this->navItems();

        $this->assertCount(2, $items);
        $this->assertSame('single', $items[1]['type']);
        $this->assertSame('Prestasi', $items[1]['label']);
        $this->assertSame('/prestasi', $items[1]['url']);
    }

    public function test_category_can_be_placed_inside_existing_dropdown(): void
    {
        $this->seedNav([
            ['type' => 'dropdown', 'label' => 'Arsip', 'children' => []],
        ]);

        $this->actingAs(User::factory()->create())->post('/admin/categories', [
            'name' => 'Agenda Sekolah',
            'nav_placement' => 'dropdown',
            'nav_parent_label' => 'Arsip',
            'nav_label' => 'Agenda',
        ])->assertRedirect(route('admin.categories.index'));

        $this->assertSame(
            ['label' => 'Agenda', 'url' => '/agenda-sekolah'],
            $this->navItems()[0]['children'][0],
        );
    }

    public function test_category_placement_requires_existing_dropdown_target(): void
    {
        $this->seedNav([
            ['type' => 'dropdown', 'label' => 'Arsip', 'children' => []],
        ]);

        $this->actingAs(User::factory()->create())->post('/admin/categories', [
            'name' => 'Agenda',
            'nav_placement' => 'dropdown',
            'nav_parent_label' => 'Tidak Ada',
        ])->assertSessionHasErrors('nav_parent_label');

        $this->assertSame([], $this->navItems()[0]['children']);
    }

    public function test_renaming_category_moves_its_nav_entry(): void
    {
        $this->seedNav([['type' => 'single', 'label' => 'Ekskul', 'url' => '/ekskul']]);

        $category = $this->category('Ekskul', 'ekskul');

        $this->actingAs(User::factory()->create())->put("/admin/categories/{$category->id}", [
            'name' => 'Ekstrakurikuler',
            'nav_placement' => 'top',
            'nav_label' => 'Ekskul',
        ])->assertRedirect(route('admin.categories.index'));

        $items = $this->navItems();

        $this->assertCount(1, $items);
        $this->assertSame('Ekskul', $items[0]['label']);
        $this->assertSame('/ekstrakurikuler', $items[0]['url']);
    }

    public function test_moving_category_out_of_nav_removes_its_entry(): void
    {
        $this->seedNav([['type' => 'single', 'label' => 'Agenda', 'url' => '/agenda']]);

        $category = $this->category('Agenda', 'agenda');

        $this->actingAs(User::factory()->create())->put("/admin/categories/{$category->id}", [
            'name' => 'Agenda',
            'nav_placement' => 'none',
        ])->assertRedirect(route('admin.categories.index'));

        $this->assertSame([], $this->navItems());
    }

    public function test_deleting_category_removes_its_nav_entry(): void
    {
        $this->seedNav([
            [
                'type' => 'dropdown',
                'label' => 'Arsip',
                'children' => [['label' => 'Agenda', 'url' => '/agenda']],
            ],
        ]);

        $category = $this->category('Agenda', 'agenda');

        $this->actingAs(User::factory()->create())
            ->delete("/admin/categories/{$category->id}")
            ->assertRedirect(route('admin.categories.index'));

        $this->assertSame([], $this->navItems()[0]['children']);
    }

    public function test_create_form_receives_dropdowns(): void
    {
        $this->seedNav([
            ['type' => 'dropdown', 'label' => 'Arsip', 'children' => []],
        ]);

        $this->actingAs(User::factory()->create())
            ->get('/admin/categories/create')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Admin/Categories/Form')
                ->has('navDropdowns', 1)
                ->where('navDropdowns.0.label', 'Arsip')
                ->where('navPlacement.placement', 'none')
            );
    }

    public function test_edit_form_receives_dropdowns_and_current_placement(): void
    {
        $this->seedNav([
            [
                'type' => 'dropdown',
                'label' => 'Arsip',
                'children' => [['label' => 'Agenda', 'url' => '/agenda']],
            ],
        ]);

        $category = $this->category('Agenda', 'agenda');

        $this->actingAs(User::factory()->create())
            ->get("/admin/categories/{$category->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Admin/Categories/Form')
                ->where('navPlacement.placement', 'dropdown')
                ->where('navPlacement.parent_label', 'Arsip')
                ->where('navPlacement.label', 'Agenda')
                ->has('navDropdowns', 1)
            );
    }

    public function test_show_page_reports_nav_placement(): void
    {
        $this->seedNav([['type' => 'single', 'label' => 'Agenda', 'url' => '/agenda']]);

        $category = $this->category('Agenda', 'agenda');

        $this->actingAs(User::factory()->create())
            ->get("/admin/categories/{$category->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Admin/Categories/Show')
                ->where('navPlacement.placement', 'top')
                ->where('navPlacement.label', 'Agenda')
            );
    }

    public function test_index_marks_categories_already_in_navbar(): void
    {
        $this->seedNav([
            [
                'type' => 'dropdown',
                'label' => 'Arsip',
                'children' => [['label' => 'Agenda', 'url' => '/agenda']],
            ],
            ['type' => 'single', 'label' => 'Prestasi', 'url' => '/prestasi'],
        ]);

        $this->category('Agenda', 'agenda');
        $this->category('Prestasi', 'prestasi');
        $this->category('Ekstrakurikuler', 'ekstrakurikuler');

        $this->actingAs(User::factory()->create())
            ->get('/admin/categories')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('Admin/Categories/Index')
                ->where('categories.data', function ($categories) {
                    $bySlug = collect($categories)->keyBy('slug');

                    return $bySlug['agenda']['in_nav'] === true
                        && $bySlug['prestasi']['in_nav'] === true
                        && $bySlug['ekstrakurikuler']['in_nav'] === false;
                })
            );
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function seedNav(array $items): void
    {
        SiteSetting::create([
            'key' => 'nav_items',
            'value' => json_encode($items),
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function navItems(): array
    {
        return json_decode((string) SiteSetting::where('key', 'nav_items')->value('value'), true) ?? [];
    }

    private function category(string $name, string $slug): Category
    {
        return Category::create([
            'name' => $name,
            'slug' => $slug,
            'metadata_schema' => [],
            'show_on_home' => false,
        ]);
    }
}
