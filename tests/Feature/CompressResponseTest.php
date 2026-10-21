<?php

namespace Tests\Feature;

use App\Http\Middleware\CompressResponse;
use Illuminate\Http\Request;
use Tests\TestCase;

class CompressResponseTest extends TestCase
{
    private function callMiddleware(Request $request, string $body, string $contentType = 'text/html'): \Symfony\Component\HttpFoundation\Response
    {
        $middleware = new CompressResponse();

        return $middleware->handle(
            $request,
            fn () => response($body, 200, ['Content-Type' => $contentType]),
        );
    }

    public function test_it_compresses_large_html_when_the_client_accepts_gzip(): void
    {
        $body = str_repeat('a', 4096);
        $request = Request::create('/', 'GET', server: ['HTTP_ACCEPT_ENCODING' => 'gzip, deflate']);

        $response = $this->callMiddleware($request, $body);

        $this->assertSame('gzip', $response->headers->get('Content-Encoding'));
        $this->assertSame($body, gzdecode($response->getContent()));
    }

    public function test_it_leaves_the_response_alone_without_gzip_support(): void
    {
        $body = str_repeat('a', 4096);

        $response = $this->callMiddleware(Request::create('/', 'GET'), $body);

        $this->assertNull($response->headers->get('Content-Encoding'));
        $this->assertSame($body, $response->getContent());
    }

    public function test_it_skips_small_bodies(): void
    {
        $request = Request::create('/', 'GET', server: ['HTTP_ACCEPT_ENCODING' => 'gzip']);

        $response = $this->callMiddleware($request, 'tiny');

        $this->assertNull($response->headers->get('Content-Encoding'));
    }

    public function test_it_skips_already_encoded_responses(): void
    {
        $request = Request::create('/', 'GET', server: ['HTTP_ACCEPT_ENCODING' => 'gzip']);

        $response = (new CompressResponse())->handle(
            $request,
            fn () => response(str_repeat('a', 4096), 200, [
                'Content-Type' => 'text/html',
                'Content-Encoding' => 'gzip',
            ]),
        );

        $this->assertSame('gzip', $response->headers->get('Content-Encoding'));
        $this->assertSame(str_repeat('a', 4096), $response->getContent());
    }

    public function test_it_skips_compression_while_the_debugbar_is_collecting(): void
    {
        $this->mock('debugbar', fn ($mock) => $mock->shouldReceive('isEnabled')->andReturn(true));

        $body = str_repeat('a', 4096);
        $request = Request::create('/', 'GET', server: ['HTTP_ACCEPT_ENCODING' => 'gzip']);

        $response = $this->callMiddleware($request, $body);

        $this->assertNull($response->headers->get('Content-Encoding'));
        $this->assertSame($body, $response->getContent());
    }

    public function test_it_compresses_again_once_the_debugbar_is_idle(): void
    {
        $this->mock('debugbar', fn ($mock) => $mock->shouldReceive('isEnabled')->andReturn(false));

        $request = Request::create('/', 'GET', server: ['HTTP_ACCEPT_ENCODING' => 'gzip']);

        $response = $this->callMiddleware($request, str_repeat('a', 4096));

        $this->assertSame('gzip', $response->headers->get('Content-Encoding'));
    }

    public function test_it_skips_binary_content_types(): void
    {
        $request = Request::create('/', 'GET', server: ['HTTP_ACCEPT_ENCODING' => 'gzip']);

        $response = $this->callMiddleware($request, str_repeat('a', 4096), 'image/webp');

        $this->assertNull($response->headers->get('Content-Encoding'));
    }
}
