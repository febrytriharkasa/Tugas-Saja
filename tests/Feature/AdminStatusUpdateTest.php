<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminStatusUpdateTest extends TestCase
{
    use RefreshDatabase;

    private function makePost(User $admin): Post
    {
        return Post::create([
            'title' => 'Konten Uji',
            'slug' => 'konten-uji',
            'content' => 'Isi',
            'category_id' => Category::create(['name' => 'Berita', 'slug' => 'berita'])->id,
            'user_id' => $admin->id,
            'status' => 'draft',
        ]);
    }

    public function test_guest_cannot_update_post_status(): void
    {
        $admin = User::factory()->create();
        $post = $this->makePost($admin);

        $this->patch("/admin/posts/{$post->id}/status", ['status' => 'published'])
            ->assertRedirect('/login');

        $this->assertSame('draft', $post->fresh()->status);
    }

    public function test_post_status_can_be_published_and_unpublished(): void
    {
        $admin = User::factory()->create();
        $post = $this->makePost($admin);

        $this->actingAs($admin)
            ->patch("/admin/posts/{$post->id}/status", ['status' => 'published'])
            ->assertRedirect();

        $post->refresh();
        $this->assertSame('published', $post->status);
        $this->assertNotNull($post->published_at);

        $this->actingAs($admin)
            ->patch("/admin/posts/{$post->id}/status", ['status' => 'draft'])
            ->assertRedirect();

        $this->assertSame('draft', $post->fresh()->status);
        $this->assertNull($post->fresh()->published_at);
    }

    public function test_post_status_rejects_invalid_value(): void
    {
        $admin = User::factory()->create();
        $post = $this->makePost($admin);

        $this->actingAs($admin)
            ->patch("/admin/posts/{$post->id}/status", ['status' => 'archived'])
            ->assertSessionHasErrors('status');

        $this->assertSame('draft', $post->fresh()->status);
    }

    public function test_page_status_can_be_toggled(): void
    {
        $admin = User::factory()->create();
        $page = Page::create([
            'title' => 'Laman Uji',
            'slug' => 'laman-uji',
            'content' => 'Isi',
            'is_published' => false,
        ]);

        $this->actingAs($admin)
            ->patch("/admin/pages/{$page->id}/status", ['is_published' => true])
            ->assertRedirect();

        $this->assertTrue($page->fresh()->is_published);

        $this->actingAs($admin)
            ->patch("/admin/pages/{$page->id}/status", ['is_published' => false])
            ->assertRedirect();

        $this->assertFalse($page->fresh()->is_published);
    }
}
