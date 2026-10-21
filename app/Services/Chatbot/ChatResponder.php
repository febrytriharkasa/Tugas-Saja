<?php

namespace App\Services\Chatbot;

use App\Models\ChatSession;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ChatResponder
{
    private KeywordFallback $fallback;

    public function __construct()
    {
        $this->fallback = new KeywordFallback;
    }

    public function respond(ChatSession $session, string $userMessage): string
    {
        $driver = config('chatbot.driver');

        if ($driver === 'off') {
            return $this->fallback->respond($userMessage);
        }

        if (! $this->withinDailyBudget()) {
            Log::info('ChatBot: Daily budget exhausted, using fallback');

            return $this->fallback->respond($userMessage);
        }

        $systemPrompt = SchoolContext::for($userMessage);
        $history = $this->loadHistory($session, $userMessage);

        $messages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $history,
            [['role' => 'user', 'content' => $userMessage]]
        );

        $providers = config('chatbot.providers', []);

        foreach ($providers as $name => $cfg) {
            if (empty($cfg['api_key'])) {
                continue;
            }

            $client = new OpenAiCompatibleClient(
                $cfg['base_url'],
                $cfg['model'],
                $cfg['api_key'],
                config('chatbot.timeout'),
                config('chatbot.max_tokens'),
                config('chatbot.temperature')
            );

            $result = $client->chat($messages);

            if ($result['success']) {
                $this->incrementDailyCount();

                return $result['content'];
            }

            Log::warning("ChatBot: Provider {$name} failed, trying next", ['error' => $result['error']]);
        }

        Log::warning('ChatBot: All providers failed, using fallback');

        return $this->fallback->respond($userMessage);
    }

    /**
     * @return array<array{role: string, content: string}>
     */
     private function loadHistory(ChatSession $session, string $currentUserMessage): array
    {
        $limit = config('chatbot.history_limit', 8);

        // Ambil riwayat sebelum pesan user saat ini (yang sudah masuk DB).
        // Skip 1 jika rekaman terbaru identik dengan pesan saat ini.
        $messages = $session->messages()
            ->orderBy('id', 'desc')
            ->limit($limit + 1)
            ->get(['id', 'role', 'content']);

        if ($messages->first()?->role === 'user' && $messages->first()?->content === $currentUserMessage) {
            $messages = $messages->slice(1, $limit);
        } else {
            $messages = $messages->take($limit);
        }

        return $messages->reverse()->values()->map(fn ($m) => [
            'role' => $m->role,
            'content' => $m->content,
        ])->toArray();
    }

    private function withinDailyBudget(): bool
    {
        $key = 'chatbot:daily:'.now()->format('Y-m-d');
        $limit = config('chatbot.daily_limit', 300);
        $count = Cache::get($key, 0);

        return $count < $limit;
    }

    private function incrementDailyCount(): void
    {
        $key = 'chatbot:daily:'.now()->format('Y-m-d');
        $midnight = now()->endOfDay()->addSecond();

        Cache::put($key, Cache::get($key, 0) + 1, $midnight);
    }
}
