<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SeedDataTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    /**
     * The demo content doubles as the sample data for the editor, so it has to
     * carry real lists and every block type both forms can offer.
     */
    public function test_seeded_content_ships_lists_and_every_block_type(): void
    {
        $this->seed(DatabaseSeeder::class);

        $richText = Page::pluck('content')->merge(Post::pluck('content'))->filter()->implode("\n");

        $this->assertStringContainsString('<ul>', $richText);
        $this->assertStringContainsString('<ol>', $richText);

        // Nowdoc indentation must not leak spaces into the stored HTML.
        $this->assertStringStartsWith('<p>', Page::where('slug', 'sejarah')->value('content'));
        $this->assertStringStartsWith('<p>', Post::where('slug', 'ppdb-2026-2027-dibuka')->value('content'));

        $pageBlocks = Page::pluck('metadata')->flatMap(fn ($metadata) => $metadata['blocks'] ?? []);
        $postBlocks = Post::pluck('metadata')->flatMap(fn ($metadata) => $metadata['blocks'] ?? []);

        foreach (['text', 'table', 'callout', 'blockquote'] as $type) {
            $this->assertTrue($pageBlocks->contains('type', $type), "Blok {$type} tidak ada pada data seeder laman.");
            $this->assertTrue($postBlocks->contains('type', $type), "Blok {$type} tidak ada pada data seeder post.");
        }
    }

    public function test_seeded_pages_render_with_their_blocks(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->get('/petunjuk-ppdb')->assertOk();

        $this->get('/sambutan')
            ->assertOk()
            ->assertInertia(fn ($assert) => $assert
                ->component('Public/Page')
                ->where('page.metadata.blocks.0.type', 'blockquote')
            );
    }

    /**
     * The demo site must look populated on every category archive, so the
     * seeder keeps exactly ten posts per category.
     */
    public function test_every_category_ships_ten_posts(): void
    {
        $this->seed(DatabaseSeeder::class);

        $counts = Post::query()
            ->selectRaw('category_id, count(*) as total')
            ->groupBy('category_id')
            ->pluck('total', 'category_id');

        foreach (Category::all() as $category) {
            $this->assertSame(10, (int) ($counts[$category->id] ?? 0), "Kategori {$category->slug} tidak memiliki 10 post.");
        }
    }
}
