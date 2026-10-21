<?php

namespace App\Services\Chatbot;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiCompatibleClient
{
    private string $baseUrl;

    private string $model;

    private string $apiKey;

    private int $timeout;

    private int $maxTokens;

    private float $temperature;

    public function __construct(
        string $baseUrl,
        string $model,
        string $apiKey,
        int $timeout = 15,
        int $maxTokens = 400,
        float $temperature = 0.3
    ) {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->model = $model;
        $this->apiKey = $apiKey;
        $this->timeout = $timeout;
        $this->maxTokens = $maxTokens;
        $this->temperature = $temperature;
    }

    /**
     * @param  array<array{role: string, content: string}>  $messages
     * @return array{success: bool, content: string|null, error: string|null}
     */
    public function chat(array $messages): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => 'Bearer '.$this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => $this->model,
                    'messages' => $messages,
                    'max_tokens' => $this->maxTokens,
                    'temperature' => $this->temperature,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? null;

                if ($content) {
                    return ['success' => true, 'content' => trim($content), 'error' => null];
                }

                Log::warning('ChatBot: Empty response from provider', ['model' => $this->model]);

                return ['success' => false, 'content' => null, 'error' => 'Empty response'];
            }

            $status = $response->status();
            $body = $response->body();

            if ($status === 429) {
                Log::warning('ChatBot: Rate limit exceeded', ['model' => $this->model, 'body' => $body]);

                return ['success' => false, 'content' => null, 'error' => 'Rate limit'];
            }

            Log::warning('ChatBot: Provider returned error', ['model' => $this->model, 'status' => $status, 'body' => $body]);

            return ['success' => false, 'content' => null, 'error' => "HTTP {$status}"];
        } catch (ConnectionException $e) {
            Log::warning('ChatBot: Connection failed', ['model' => $this->model, 'message' => $e->getMessage()]);

            return ['success' => false, 'content' => null, 'error' => 'Connection failed'];
        } catch (RequestException $e) {
            Log::warning('ChatBot: Request failed', ['model' => $this->model, 'message' => $e->getMessage()]);

            return ['success' => false, 'content' => null, 'error' => 'Request failed'];
        }
    }
}
