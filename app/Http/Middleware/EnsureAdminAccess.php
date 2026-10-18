<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAccess
{
    /**
     * Batasi modul pengelolaan konten untuk role admin/superadmin; staff hanya dashboard.
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->canManageContent(), 403);

        return $next($request);
    }
}
