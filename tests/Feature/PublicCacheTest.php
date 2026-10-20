<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\User;
use App\Support\PublicCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicCacheTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_content_is_cached_and_invalidated_by_post_changes(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $post = Post::create([
            'user_id' => User::factory()->create()->id,
            'category_id' => $category->id,
            'title' => 'Judul Lama',
            'slug' => 'judul-lama',
            'content' => 'Isi konten.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->where('posts.0.title', 'Judul Lama')
            );

        $this->assertTrue(Cache::has(PublicCache::HOME_CONTENT));

        $post->update(['title' => 'Judul Baru']);

        $this->assertFalse(Cache::has(PublicCache::HOME_CONTENT));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('posts.0.title', 'Judul Baru')
            );
    }

    public function test_settings_cache_refreshes_without_touching_cached_home_content(): void
    {
        $setting = SiteSetting::create([
            'key' => 'site_name',
            'value' => 'Nama Lama',
            'group_name' => 'identity',
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('settings.site_name', 'Nama Lama')
            );

        $this->assertTrue(Cache::has(PublicCache::SETTINGS));
        $this->assertTrue(Cache::has(PublicCache::HOME_CONTENT));

        $setting->update(['value' => 'Nama Baru']);

        $this->assertFalse(Cache::has(PublicCache::SETTINGS));
        $this->assertTrue(Cache::has(PublicCache::HOME_CONTENT));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('settings.site_name', 'Nama Baru')
            );
    }

    public function test_page_lists_cache_refreshes_after_a_page_is_published(): void
    {
        $page = Page::create([
            'title' => 'Visi Misi',
            'slug' => 'visi-misi',
            'content' => 'Isi halaman.',
            'is_published' => false,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('draftPageSlugs', ['visi-misi'])
                ->has('customPages', 0)
            );

        $this->assertTrue(Cache::has(PublicCache::PAGE_LISTS));

        $page->update(['is_published' => true]);

        $this->assertFalse(Cache::has(PublicCache::PAGE_LISTS));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('draftPageSlugs', [])
                ->has('customPages', 1)
                ->where('customPages.0.slug', 'visi-misi')
            );
    }

    public function test_home_cache_prevents_content_queries_on_the_second_request(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        Post::create([
            'user_id' => User::factory()->create()->id,
            'category_id' => $category->id,
            'title' => 'Judul',
            'slug' => 'judul',
            'content' => 'Isi konten.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        SiteSetting::create(['key' => 'site_name', 'value' => 'Sekolah']);
        Page::create(['title' => 'Profil', 'slug' => 'profil', 'content' => 'Isi halaman.', 'is_published' => true]);

        $this->get('/')->assertOk();

        DB::flushQueryLog();
        DB::enableQueryLog();

        try {
            $this->get('/')->assertOk();

            $queries = collect(DB::getQueryLog())->pluck('query');
        } finally {
            DB::disableQueryLog();
        }

        $this->assertCount(0, $queries);
    }

    public function test_footer_link_options_cache_refreshes_after_a_page_is_published(): void
    {
        $admin = User::factory()->create();
        $page = Page::create([
            'title' => 'Visi Misi',
            'slug' => 'visi-misi',
            'content' => 'Isi halaman.',
            'is_published' => false,
        ]);

        $this->actingAs($admin)
            ->get('/admin/settings/footer')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->where('linkOptions', fn ($options) => ! in_array(
                    'Laman: Visi Misi (draf)',
                    collect($options)->pluck('label')->all(),
                    true,
                ))
            );

        $this->assertTrue(Cache::has(PublicCache::FOOTER_LINKS));

        $page->update(['is_published' => true]);

        $this->assertFalse(Cache::has(PublicCache::FOOTER_LINKS));

        $this->actingAs($admin)
            ->get('/admin/settings/footer')
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->where('linkOptions', fn ($options) => in_array(
                    'Laman: Visi Misi',
                    collect($options)->pluck('label')->all(),
                    true,
                ))
            );
    }
}
