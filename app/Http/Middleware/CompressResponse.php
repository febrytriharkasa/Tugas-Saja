<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Gzip responses from PHP itself.
 *
 * Apache gets this from `public/.htaccess` (mod_deflate), but `php artisan serve`
 * and plenty of shared hosts ship without it, which leaves a ~140 KB Inertia
 * document and its JSON payload on the wire uncompressed. Responses that already
 * carry a Content-Encoding (for example when mod_deflate ran first) are skipped,
 * so this never double-compresses.
 */
class CompressResponse
{
    private const MIN_BYTES = 1024;

    private const COMPRESSIBLE = [
        'text/html',
        'text/plain',
        'text/css',
        'text/xml',
        'text/javascript',
        'application/javascript',
        'application/json',
        'application/xml',
        'application/rss+xml',
        'image/svg+xml',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $this->shouldCompress($request, $response)) {
            return $response;
        }

        $content = $response->getContent();

        if ($content === false || $content === null || strlen($content) < self::MIN_BYTES) {
            return $response;
        }

        $encoded = gzencode($content, 6);

        if ($encoded === false) {
            return $response;
        }

        $response->setContent($encoded);
        $response->headers->set('Content-Encoding', 'gzip');
        $response->headers->set('Content-Length', (string) strlen($encoded));
        $response->headers->set('Vary', 'Accept-Encoding', false);

        return $response;
    }

    private function shouldCompress(Request $request, Response $response): bool
    {
        if ($this->debugbarIsCollecting()) {
            return false;
        }

        if ($response instanceof StreamedResponse || $response instanceof BinaryFileResponse) {
            return false;
        }

        if (! $response->isSuccessful() || $response->headers->has('Content-Encoding')) {
            return false;
        }

        if (! $request->isMethodCacheable() && ! $request->isMethod('POST')) {
            return false;
        }

        $accepts = (string) $request->headers->get('Accept-Encoding', '');

        if (! preg_match('/(^|,)\s*gzip\s*(;|,|$)/i', $accepts)) {
            return false;
        }

        $contentType = $response->headers->get('Content-Type', '');

        foreach (self::COMPRESSIBLE as $type) {
            if (stripos($contentType, $type) === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Debugbar appends its toolbar on the RequestHandled event, after this
     * middleware has already gzipped the body. Clients drop those trailing
     * bytes as garbage, so the bar silently disappears. Debugbar is dev-only,
     * so skipping compression while it runs costs nothing in production.
     */
    private function debugbarIsCollecting(): bool
    {
        return app()->bound('debugbar') && app('debugbar')->isEnabled();
    }
}
