<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RichTextContentTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_rich_text_formatting_survives_post_save(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Konten Berformat',
            'category_id' => $category->id,
            'content' => '<p><strong>Tebal</strong> <em>miring</em> <u>garis bawah</u> '
                . '<span style="font-size: 24px;">besar</span></p>'
                . '<ol><li>pertama</li></ol><ul><li>poin</li></ul>',
            'status' => 'published',
        ])->assertRedirect(route('admin.posts.index'));

        $content = Post::where('title', 'Konten Berformat')->value('content');

        $this->assertStringContainsString('<strong>Tebal</strong>', $content);
        $this->assertStringContainsString('<em>miring</em>', $content);
        $this->assertStringContainsString('<u>garis bawah</u>', $content);
        $this->assertStringContainsString('font-size:24px', str_replace(' ', '', $content));
        $this->assertStringContainsString('<ol><li>pertama</li></ol>', $content);
        $this->assertStringContainsString('<ul><li>poin</li></ul>', $content);
    }

    public function test_dangerous_html_is_stripped_from_saved_post(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Konten Berbahaya',
            'category_id' => $category->id,
            'content' => '<p>Aman</p><script>alert(1)</script><img src=x onerror=alert(2)>'
                . '<a href="https://example.com" onclick="evil()" target="_blank">tautan</a>',
            'status' => 'published',
        ])->assertRedirect(route('admin.posts.index'));

        $content = Post::where('title', 'Konten Berbahaya')->value('content');

        $this->assertStringNotContainsString('<script', $content);
        $this->assertStringNotContainsString('onerror', $content);
        $this->assertStringNotContainsString('onclick', $content);
        $this->assertStringNotContainsString('<img', $content);
        $this->assertStringContainsString('<p>Aman</p>', $content);
        $this->assertStringContainsString('href="https://example.com"', $content);
    }

    public function test_page_content_is_sanitized_on_update(): void
    {
        $page = Page::create([
            'title' => 'Laman Uji',
            'slug' => 'laman-uji',
            'content' => 'Isi lama',
            'is_published' => true,
        ]);

        $this->actingAs($this->admin())->put("/admin/pages/{$page->id}", [
            'title' => 'Laman Uji',
            'content' => '<p>Baru <strong>tebal</strong></p><script>alert(1)</script>',
            'is_published' => true,
        ])->assertRedirect(route('admin.pages.index'));

        $content = $page->fresh()->content;

        $this->assertStringContainsString('<strong>tebal</strong>', $content);
        $this->assertStringNotContainsString('<script', $content);
    }

    public function test_plain_text_content_is_served_unchanged_for_the_frontend(): void
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $post = Post::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Berita Lama',
            'slug' => 'berita-lama',
            'content' => "Baris pertama\nBaris kedua",
            'status' => 'published',
            'published_at' => now(),
        ]);

        // Legacy rows never went through the editor: the client is the one that
        // decides between plain text and HTML, so the payload must stay intact.
        $this->get('/berita/berita-lama')
            ->assertOk()
            ->assertInertia(fn ($assert) => $assert
                ->component('Public/PostDetail')
                ->where('post.content', "Baris pertama\nBaris kedua")
            );
    }

    public function test_blockquote_source_is_persisted_with_the_block(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Kutipan',
            'category_id' => $category->id,
            'content' => '<p>Isi berita.</p>',
            'status' => 'published',
            'meta' => [
                'blocks' => [
                    ['type' => 'blockquote', 'content' => 'Belajar hari ini.', 'source' => 'Kepala Sekolah'],
                ],
            ],
        ])->assertRedirect(route('admin.posts.index'));

        $blocks = Post::where('title', 'Kutipan')->value('metadata')['blocks'];

        $this->assertSame('Kepala Sekolah', $blocks[0]['source']);
    }

    public function test_rich_text_formatting_inside_blocks_survives_save(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Blok Berformat',
            'category_id' => $category->id,
            'content' => '<p>Isi berita.</p>',
            'status' => 'published',
            'meta' => [
                'blocks' => [
                    [
                        'type' => 'text',
                        'content' => '<p>Catatan <strong>penting</strong></p><ul><li>poin</li></ul>',
                    ],
                    [
                        'type' => 'callout',
                        'content' => '<p><span style="font-size: 18px;">Info PPDB</span></p>',
                    ],
                ],
            ],
        ])->assertRedirect(route('admin.posts.index'));

        $blocks = Post::where('title', 'Blok Berformat')->value('metadata')['blocks'];

        $this->assertStringContainsString('<strong>penting</strong>', $blocks[0]['content']);
        $this->assertStringContainsString('<ul><li>poin</li></ul>', $blocks[0]['content']);
        $this->assertStringContainsString('font-size:18px', str_replace(' ', '', $blocks[1]['content']));
    }

    public function test_dangerous_html_inside_blocks_is_stripped_and_empty_blocks_dropped(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Blok Berbahaya',
            'category_id' => $category->id,
            'content' => '<p>Isi berita.</p>',
            'status' => 'published',
            'meta' => [
                'blocks' => [
                    ['type' => 'text', 'content' => '<script>alert(1)</script>'],
                    ['type' => 'callout', 'content' => '<p>Aman <em>saja</em></p><img src=x onerror=alert(2)>'],
                ],
            ],
        ])->assertRedirect(route('admin.posts.index'));

        $blocks = Post::where('title', 'Blok Berbahaya')->value('metadata')['blocks'];

        // The script-only block cleans to nothing, so it is dropped entirely.
        $this->assertCount(1, $blocks);
        $this->assertSame('callout', $blocks[0]['type']);
        $this->assertStringNotContainsString('<img', $blocks[0]['content']);
        $this->assertStringContainsString('<em>saja</em>', $blocks[0]['content']);
    }

    public function test_page_text_block_content_is_sanitized(): void
    {
        $page = Page::create([
            'title' => 'Laman Blok',
            'slug' => 'laman-blok',
            'content' => 'Isi laman',
            'is_published' => true,
        ]);

        $this->actingAs($this->admin())->put("/admin/pages/{$page->id}", [
            'title' => 'Laman Blok',
            'content' => '<p>Isi laman</p>',
            'is_published' => true,
            'meta' => [
                'blocks' => [
                    ['type' => 'text', 'content' => '<p>Tebal <strong>sekali</strong></p><script>alert(1)</script>'],
                ],
            ],
        ])->assertRedirect(route('admin.pages.index'));

        $blocks = $page->fresh()->metadata['blocks'];

        $this->assertStringContainsString('<strong>sekali</strong>', $blocks[0]['content']);
        $this->assertStringNotContainsString('<script', $blocks[0]['content']);
    }

    public function test_list_item_marker_styles_survive_sanitising(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Daftar Berformat',
            'category_id' => $category->id,
            'content' => '<ul><li style="font-size: 24px; font-weight: 700; font-style: italic;">Poin besar</li></ul>',
            'status' => 'published',
        ])->assertRedirect(route('admin.posts.index'));

        $content = str_replace(' ', '', Post::where('title', 'Daftar Berformat')->value('content'));

        $this->assertStringContainsString('font-size:24px', $content);
        $this->assertStringContainsString('font-weight:700', $content);
        $this->assertStringContainsString('font-style:italic', $content);
    }

    public function test_style_properties_outside_the_allowlist_are_stripped_from_list_items(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Daftar Tidak Aman',
            'category_id' => $category->id,
            'content' => '<ul><li style="font-size: 24px; position: fixed;">Poin</li></ul>',
            'status' => 'published',
        ])->assertRedirect(route('admin.posts.index'));

        $content = Post::where('title', 'Daftar Tidak Aman')->value('content');

        $this->assertStringContainsString('font-size:24px', str_replace(' ', '', $content));
        $this->assertStringNotContainsString('position', $content);
    }

    public function test_heading_levels_survive_sanitising_but_h1_is_dropped(): void
    {
        $category = Category::create(['name' => 'Berita', 'slug' => 'berita']);

        $this->actingAs($this->admin())->post('/admin/posts', [
            'title' => 'Judul Berjenjang',
            'category_id' => $category->id,
            'content' => '<h2>Bagian utama</h2><h3>Sub-bagian</h3><h4>Poin detail</h4><h1>Di luar skala</h1>',
            'status' => 'published',
        ])->assertRedirect(route('admin.posts.index'));

        $content = Post::where('title', 'Judul Berjenjang')->value('content');

        $this->assertStringContainsString('<h2>Bagian utama</h2>', $content);
        $this->assertStringContainsString('<h3>Sub-bagian</h3>', $content);
        $this->assertStringContainsString('<h4>Poin detail</h4>', $content);
        $this->assertStringNotContainsString('<h1>', $content);
        $this->assertStringContainsString('Di luar skala', $content);
    }
}
