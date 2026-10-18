<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_active_user_can_request_password_reset(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $this->post('/forgot-password', ['email' => $user->email])
            ->assertRedirect();

        $this->assertNotNull($user->fresh()->password_reset_requested_at);
    }

    public function test_inactive_user_cannot_request_password_reset(): void
    {
        $user = User::factory()->create(['is_active' => false]);

        $this->post('/forgot-password', ['email' => $user->email])
            ->assertRedirect();

        $this->assertNull($user->fresh()->password_reset_requested_at);
    }

    public function test_unknown_email_does_not_leak_existence(): void
    {
        $response = $this->post('/forgot-password', ['email' => 'nonexistent@example.com']);

        $response->assertRedirect();
    }
}
