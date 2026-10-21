<?php

namespace Tests\Feature;

use App\Models\ChatSession;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class ChatBotTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        SiteSetting::updateOrCreate(['key' => 'chat_enabled'], ['value' => '1']);
    }

    public function test_chat_disabled_returns_403(): void
    {
        SiteSetting::where('key', 'chat_enabled')->update(['value' => '0']);

        $response = $this->postJson('/api/chat', ['message' => 'Halo']);

        $response->assertForbidden();
    }

    public function test_message_is_validated(): void
    {
        $this->postJson('/api/chat', [])->assertUnprocessable();
        $this->postJson('/api/chat', ['message' => str_repeat('a', 1001)])->assertUnprocessable();
        $this->postJson('/api/chat', ['session_token' => 'bukan-uuid', 'message' => 'Halo'])->assertUnprocessable();
    }

    public function test_ai_reply_is_saved_and_returned(): void
    {
        config(['chatbot.driver' => 'auto']);
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'choices' => [['message' => ['content' => 'Jawaban dari AI.']]],
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', ['message' => 'Kapan PPDB dibuka?']);

        $response->assertOk()->assertJson(['reply' => 'Jawaban dari AI.']);

        $session = ChatSession::where('session_token', $response->json('session_token'))->first();
        $this->assertNotNull($session);
        $this->assertCount(2, $session->messages);

        Http::assertSent(function ($request) {
            $messages = $request->data()['messages'] ?? [];

            return collect($messages)->contains(fn ($m) => $m['role'] === 'system'
                && str_contains($m['content'], 'SMA'));
        });
    }

    public function test_provider_failure_falls_back_to_keyword_answer(): void
    {
        config(['chatbot.driver' => 'auto']);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([], 500)]);

        $response = $this->postJson('/api/chat', ['message' => 'Informasi PPDB']);

        $response->assertOk();
        $this->assertStringContainsString('PPDB', $response->json('reply'));
    }

    public function test_missing_api_key_uses_fallback(): void
    {
        config([
            'chatbot.driver' => 'auto',
            'chatbot.providers' => [
                'gemini' => ['base_url' => 'https://example.test', 'model' => 'x', 'api_key' => null],
                'groq' => ['base_url' => 'https://example.test', 'model' => 'y', 'api_key' => ''],
            ],
        ]);

        $response = $this->postJson('/api/chat', ['message' => 'Lokasi sekolah']);

        $response->assertOk();
        $this->assertStringContainsString('Krian', $response->json('reply'));

        Http::assertSentCount(0);
    }

    public function test_driver_off_disables_llm_calls(): void
    {
        config(['chatbot.driver' => 'off']);

        $response = $this->postJson('/api/chat', ['message' => 'Info kontak']);

        $response->assertOk();
        $this->assertStringContainsString('sekretariat', $response->json('reply'));

        Http::assertSentCount(0);
    }

    public function test_rate_limit_blocks_flood(): void
    {
        config(['chatbot.driver' => 'off']);

        for ($i = 0; $i < 8; $i++) {
            $this->postJson('/api/chat', ['message' => 'Halo']);
        }

        $this->postJson('/api/chat', ['message' => 'Halo'])->assertTooManyRequests();
    }

    public function test_history_is_limited_to_config(): void
    {
        config(['chatbot.driver' => 'auto']);
        config(['chatbot.history_limit' => 8]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'choices' => [['message' => ['content' => 'ok']]],
            ], 200),
        ]);

        $token = (string) Str::uuid();
        $session = ChatSession::create(['session_token' => $token, 'created_at' => now()]);

        for ($i = 0; $i < 12; $i++) {
            $session->messages()->create(['role' => 'user', 'content' => "Pesan {$i}", 'created_at' => now()]);
            $session->messages()->create(['role' => 'assistant', 'content' => "Balasan {$i}", 'created_at' => now()]);
        }

        $this->postJson('/api/chat', ['session_token' => $token, 'message' => 'Halo']);

        Http::assertSent(function ($request) {
            $nonSystem = collect($request->data()['messages'] ?? [])
                ->reject(fn ($m) => $m['role'] === 'system');

            return $nonSystem->count() === 9; // 8 history + pesan baru
        });
    }

    public function test_daily_budget_exhausted_uses_fallback(): void
    {
        config(['chatbot.driver' => 'auto']);
        config(['chatbot.daily_limit' => 0]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'choices' => [['message' => ['content' => 'ok']]],
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', ['message' => 'Halo']);

        $response->assertOk();

        Http::assertSentCount(0);
    }

    public function test_fallback_response_is_saved_when_all_providers_fail(): void
    {
        config(['chatbot.driver' => 'auto']);
        Http::fake(['*' => Http::response([], 500)]);

        $response = $this->postJson('/api/chat', ['message' => 'aduhai']);

        $response->assertOk();

        $session = ChatSession::where('session_token', $response->json('session_token'))->first();
        $this->assertCount(2, $session->messages);
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}
