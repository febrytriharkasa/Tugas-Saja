<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Prefetch hanya di panel admin. Di halaman publik strategi ini mengunduh
        // seluruh chunk dinamis (termasuk editor blok) yang tidak dipakai pengunjung.
        if (request()->is('admin', 'admin/*')) {
            Vite::prefetch(concurrency: 3);
        }
    }
}
