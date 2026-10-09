<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
