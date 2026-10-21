<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Chatbot Driver
    |--------------------------------------------------------------------------
    |
    | Driver: 'auto' (try providers in order), 'off' (keyword fallback only).
    | When 'auto', providers without API keys are skipped.
    |
    */

    'driver' => env('CHATBOT_DRIVER', 'auto'),

    /*
    |--------------------------------------------------------------------------
    | LLM Providers
    |--------------------------------------------------------------------------
    |
    | Each provider must have 'base_url', 'model', 'api_key'.
    | Providers are tried in order until one succeeds.
    |
    */

    'providers' => [
        'gemini' => [
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta/openai',
            'model'    => env('CHATBOT_GEMINI_MODEL', 'gemini-3.5-flash-lite'),
            'api_key'  => env('GEMINI_API_KEY'),
        ],
        'groq' => [
            'base_url' => 'https://api.groq.com/openai/v1',
            'model'    => env('CHATBOT_GROQ_MODEL', 'openai/gpt-oss-120b'),
            'api_key'  => env('GROQ_API_KEY'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Request Parameters
    |--------------------------------------------------------------------------
    */

    'timeout'     => (int) env('CHATBOT_TIMEOUT', 15),
    'max_tokens'  => (int) env('CHATBOT_MAX_TOKENS', 400),
    'temperature' => (float) env('CHATBOT_TEMPERATURE', 0.3),

    /*
    |--------------------------------------------------------------------------
    | Conversation History
    |--------------------------------------------------------------------------
    |
    | Maximum number of prior messages (user + assistant) to include in context.
    |
    */

    'history_limit' => (int) env('CHATBOT_HISTORY_LIMIT', 8),

    /*
    |--------------------------------------------------------------------------
    | Daily Request Budget
    |--------------------------------------------------------------------------
    |
    | Global daily limit for LLM requests. When exceeded, falls back to
    | keyword matching until midnight UTC. Protects free-tier quotas.
    |
    */

    'daily_limit' => (int) env('CHATBOT_DAILY_LIMIT', 300),
];
