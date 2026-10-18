<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\AccountApprovedNotification;
use App\Notifications\AdminPasswordResetNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class UsersModuleTest extends TestCase
{
    use RefreshDatabase;

    private function superadmin(): User
    {
        return User::factory()->create(['role' => 'superadmin', 'is_active' => true]);
    }

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'is_active' => true]);
    }

    private function staff(): User
    {
        return User::factory()->create(['role' => 'staff', 'is_active' => true]);
    }

    // ─── Access control ───────────────────────────────────────────

    public function test_guest_cannot_access_users_index(): void
    {
        $this->get('/admin/users')->assertRedirect('/login');
    }

    public function test_admin_role_cannot_access_users_module(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/users')
            ->assertForbidden();
    }

    public function test_staff_role_can_access_dashboard(): void
    {
        $this->actingAs($this->staff())
            ->get('/admin/dashboard')
            ->assertOk();
    }

    public function test_staff_role_cannot_access_content_module(): void
    {
        $this->actingAs($this->staff())
            ->get('/admin/posts')
            ->assertForbidden();
    }

    public function test_staff_role_cannot_access_users_module(): void
    {
        $this->actingAs($this->staff())
            ->get('/admin/users')
            ->assertForbidden();
    }

    public function test_staff_role_cannot_toggle_chat(): void
    {
        $this->actingAs($this->staff())
            ->post('/admin/dashboard/toggle-chat')
            ->assertForbidden();
    }

    public function test_admin_role_can_access_content_module(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/posts')
            ->assertOk();
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'is_active' => false,
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_superadmin_can_view_users_index(): void
    {
        User::factory(3)->create();

        $this->actingAs($this->superadmin())
            ->get('/admin/users')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Users/Index'));
    }

    // ─── Register ─────────────────────────────────────────────────

    public function test_register_creates_staff_inactive_user(): void
    {
        $this->post('/register', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::where('email', 'new@example.com')->firstOrFail();
        $this->assertEquals('staff', $user->role);
        $this->assertFalse($user->is_active);
        $this->assertGuest();
    }

    public function test_register_redirects_to_login_with_status(): void
    {
        $response = $this->post('/register', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('login'));
        $response->assertSessionHas('status');
    }

    // ─── Approve ──────────────────────────────────────────────────

    public function test_superadmin_can_activate_user_and_notification_sent(): void
    {
        Notification::fake();

        $target = User::factory()->create(['role' => 'staff', 'is_active' => false]);

        $this->actingAs($this->superadmin())
            ->patch("/admin/users/{$target->id}", ['role' => 'staff', 'is_active' => true])
            ->assertRedirect();

        $this->assertTrue($target->fresh()->is_active);
        Notification::assertSentTo($target, AccountApprovedNotification::class);
    }

    public function test_approval_marks_email_verified(): void
    {
        Notification::fake();

        $target = User::factory()->create([
            'role' => 'staff',
            'is_active' => false,
            'email_verified_at' => null,
        ]);

        $this->actingAs($this->superadmin())
            ->patch("/admin/users/{$target->id}", ['role' => 'staff', 'is_active' => true])
            ->assertRedirect();

        $this->assertNotNull($target->fresh()->email_verified_at);
    }

    public function test_no_notification_when_already_active_user_updated(): void
    {
        Notification::fake();

        $target = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->actingAs($this->superadmin())
            ->patch("/admin/users/{$target->id}", ['role' => 'admin', 'is_active' => true])
            ->assertRedirect();

        Notification::assertNothingSent();
    }

    // ─── Role change ──────────────────────────────────────────────

    public function test_superadmin_can_change_role(): void
    {
        $target = User::factory()->create(['role' => 'staff', 'is_active' => true]);

        $this->actingAs($this->superadmin())
            ->patch("/admin/users/{$target->id}", ['role' => 'admin', 'is_active' => true])
            ->assertRedirect();

        $this->assertEquals('admin', $target->fresh()->role);
    }

    // ─── Last superadmin guard ────────────────────────────────────

    public function test_cannot_demote_last_superadmin(): void
    {
        $sa = $this->superadmin();

        $this->actingAs($sa)
            ->patch("/admin/users/{$sa->id}", ['role' => 'admin', 'is_active' => true])
            ->assertSessionHasErrors('role');
    }

    public function test_can_demote_superadmin_when_another_exists(): void
    {
        $sa1 = $this->superadmin();
        $sa2 = $this->superadmin();

        $this->actingAs($sa1)
            ->patch("/admin/users/{$sa2->id}", ['role' => 'admin', 'is_active' => true])
            ->assertRedirect();

        $this->assertEquals('admin', $sa2->fresh()->role);
    }

    // ─── Delete ───────────────────────────────────────────────────

    public function test_superadmin_can_delete_user(): void
    {
        $target = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->actingAs($this->superadmin())
            ->delete("/admin/users/{$target->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    public function test_superadmin_cannot_delete_own_account(): void
    {
        $sa = $this->superadmin();

        $this->actingAs($sa)
            ->delete("/admin/users/{$sa->id}")
            ->assertSessionHasErrors('user');
    }

    // ─── Reset password ───────────────────────────────────────────

    public function test_superadmin_can_reset_password_and_notification_sent(): void
    {
        Notification::fake();

        $target = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->actingAs($this->superadmin())
            ->post("/admin/users/{$target->id}/reset-password")
            ->assertRedirect();

        Notification::assertSentTo($target, AdminPasswordResetNotification::class);
    }

    public function test_reset_password_clears_pending_request(): void
    {
        Notification::fake();

        $target = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
            'password_reset_requested_at' => now()->subDay(),
        ]);

        $this->actingAs($this->superadmin())
            ->post("/admin/users/{$target->id}/reset-password")
            ->assertRedirect();

        $this->assertNull($target->fresh()->password_reset_requested_at);
    }

    public function test_users_index_filter_by_reset_request(): void
    {
        User::factory()->create(['role' => 'admin', 'is_active' => true, 'password_reset_requested_at' => now()]);
        User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->actingAs($this->superadmin())
            ->get('/admin/users?status=reset_requested')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Users/Index')
                ->where('filters.status', 'reset_requested')
                ->has('users.data', 1)
            );
    }

    public function test_cannot_reset_password_for_inactive_user(): void
    {
        $target = User::factory()->create(['role' => 'staff', 'is_active' => false]);

        $this->actingAs($this->superadmin())
            ->post("/admin/users/{$target->id}/reset-password")
            ->assertSessionHasErrors('user');
    }

    // ─── Filter ───────────────────────────────────────────────────

    public function test_users_index_filter_by_role(): void
    {
        User::factory()->create(['role' => 'staff', 'is_active' => true]);
        User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->actingAs($this->superadmin())
            ->get('/admin/users?role=staff')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Users/Index')
                ->where('filters.role', 'staff')
            );
    }

    public function test_users_index_filter_by_pending_status(): void
    {
        User::factory()->create(['role' => 'staff', 'is_active' => false]);

        $this->actingAs($this->superadmin())
            ->get('/admin/users?status=pending')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('filters.status', 'pending'));
    }

    // ─── Forgot password flow ─────────────────────────────────────

    public function test_inactive_user_cannot_request_password_reset(): void
    {
        $user = User::factory()->create(['role' => 'staff', 'is_active' => false]);

        $response = $this->post('/forgot-password', ['email' => $user->email]);

        $response->assertSessionHas('status');
        $this->assertNull($user->fresh()->password_reset_requested_at);
    }

    public function test_active_user_password_reset_request_stored(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->post('/forgot-password', ['email' => $user->email])
            ->assertRedirect();

        $this->assertNotNull($user->fresh()->password_reset_requested_at);
    }
}
