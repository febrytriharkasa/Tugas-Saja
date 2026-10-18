<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use App\Support\PostCoverGenerator;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostCoverTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_post_without_media_gets_a_default_cover(): void
    {
        Storage::fake('public');

        $post = $this->makePost(['title' => 'ANBK 2026 di SMA XYZ', 'slug' => 'anbk-2026']);

        $this->assertSame(Storage::url('posts/covers/anbk-2026.svg'), $post->featured_image);
        Storage::disk('public')->assertExists('posts/covers/anbk-2026.svg');
    }

    public function test_cover_carries_the_title_with_xml_escaped_characters(): void
    {
        Storage::fake('public');

        $this->makePost(['title' => 'Bazar & Pesta Siswa', 'slug' => 'bazar-pesta']);

        $svg = Storage::disk('public')->get('posts/covers/bazar-pesta.svg');

        $this->assertStringContainsString('Bazar &amp; Pesta Siswa', $svg);
        $this->assertStringNotContainsString('Bazar & Pesta', $svg);
    }

    public function test_video_posts_keep_using_their_video_link(): void
    {
        Storage::fake('public');

        $post = $this->makePost([
            'title' => 'Dokumentasi Video Pesantren Kilat',
            'slug' => 'dokumentasi-video',
            'media_type' => 'video',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ]);

        $this->assertNull($post->featured_image);
        Storage::disk('public')->assertMissing('posts/covers/dokumentasi-video.svg');
    }

    public function test_uploaded_pictures_are_never_replaced(): void
    {
        Storage::fake('public');

        $post = $this->makePost([
            'title' => 'Foto Asli Sekolah',
            'slug' => 'foto-asli',
            'featured_image' => '/storage/posts/foto-asli.jpg',
        ]);

        $this->artisan('posts:covers --force')->assertSuccessful();

        $this->assertSame('/storage/posts/foto-asli.jpg', $post->refresh()->featured_image);
        Storage::disk('public')->assertMissing('posts/covers/foto-asli.svg');
    }

    public function test_removing_the_picture_falls_back_to_the_cover(): void
    {
        Storage::fake('public');

        $post = $this->makePost(['title' => 'Berita Dengan Foto', 'slug' => 'berita-foto']);

        $post->update(['featured_image' => '/storage/posts/berita-foto.jpg']);
        $this->assertSame('/storage/posts/berita-foto.jpg', $post->featured_image);

        $post->update(['featured_image' => null]);

        $this->assertSame(Storage::url('posts/covers/berita-foto.svg'), $post->featured_image);
        Storage::disk('public')->assertExists('posts/covers/berita-foto.svg');
    }

    public function test_command_skips_posts_that_already_have_a_cover(): void
    {
        Storage::fake('public');

        $this->makePost(['title' => 'Berita Pertama', 'slug' => 'berita-pertama']);

        $this->assertSame(0, app(PostCoverGenerator::class)->generateMissing());
    }

    public function test_command_backfills_posts_that_skipped_the_model_hook(): void
    {
        Storage::fake('public');

        $post = $this->makePost(['title' => 'Post Lama', 'slug' => 'post-lama']);

        // Simulate a row written before the generator existed.
        $post->forceFill(['featured_image' => null])->saveQuietly();

        $this->artisan('posts:covers')->assertSuccessful();

        $this->assertSame(Storage::url('posts/covers/post-lama.svg'), $post->refresh()->featured_image);
    }

    public function test_force_rebuilds_a_generated_cover(): void
    {
        Storage::fake('public');

        $this->makePost(['title' => 'Berita Kedua', 'slug' => 'berita-kedua']);

        Storage::disk('public')->delete('posts/covers/berita-kedua.svg');

        $this->assertSame(1, app(PostCoverGenerator::class)->generateMissing(true));
        Storage::disk('public')->assertExists('posts/covers/berita-kedua.svg');
    }

    public function test_seeder_gives_every_picture_post_a_cover(): void
    {
        Storage::fake('public');

        $this->seed(DatabaseSeeder::class);

        $withoutCover = Post::query()
            ->where(fn ($query) => $query->whereNull('media_type')->orWhere('media_type', '!=', 'video'))
            ->where(fn ($query) => $query->whereNull('featured_image')->orWhere('featured_image', ''))
            ->count();

        $this->assertSame(0, $withoutCover);
        $this->assertNull(Post::where('media_type', 'video')->firstOrFail()->featured_image);
    }

    public function test_admin_created_post_gets_the_default_cover(): void
    {
        Storage::fake('public');

        $category = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);

        $this->actingAs(User::factory()->create())
            ->post('/admin/posts', [
                'title' => 'Kegiatan Pramuka Pekan Ini',
                'category_id' => $category->id,
                'content' => '<p>Isi post.</p>',
                'media_type' => 'image',
                'status' => 'published',
            ])
            ->assertRedirect(route('admin.posts.index'));

        $post = Post::where('slug', 'kegiatan-pramuka-pekan-ini')->firstOrFail();

        $this->assertSame(Storage::url('posts/covers/kegiatan-pramuka-pekan-ini.svg'), $post->featured_image);
        Storage::disk('public')->assertExists('posts/covers/kegiatan-pramuka-pekan-ini.svg');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makePost(array $attributes): Post
    {
        $category = Category::firstOrCreate(['slug' => 'berita'], ['name' => 'Berita']);

        return Post::create(array_merge([
            'user_id' => User::factory()->create()->id,
            'category_id' => $category->id,
            'title' => 'Judul Post',
            'slug' => 'judul-post',
            'content' => '<p>Isi post.</p>',
            'status' => 'published',
            'published_at' => now(),
        ], $attributes));
    }
}
