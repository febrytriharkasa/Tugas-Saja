<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Once;

class PublicCache
{
    public const HOME_CONTENT = 'site:home:content:v1';

    public const PAGE_LISTS = 'site:pages:lists:v1';

    public const SETTINGS = 'site:settings:all:v1';

    public const FOOTER_LINKS = 'site:footer-links:v1';

    public const FOOTER_LINKS_WITH_DRAFTS = 'site:footer-links:drafts:v1';

    public const HOME_TTL_MINUTES = 10;

    public const SHELL_TTL_MINUTES = 60;

    public static function forgetHome(): void
    {
        Cache::forget(self::HOME_CONTENT);
    }

    public static function forgetPages(): void
    {
        Cache::forget(self::PAGE_LISTS);
        Once::flush();
    }

    public static function forgetSettings(): void
    {
        Cache::forget(self::SETTINGS);
        Once::flush();
    }

    public static function forgetFooterLinks(): void
    {
        Cache::forget(self::FOOTER_LINKS);
        Cache::forget(self::FOOTER_LINKS_WITH_DRAFTS);
    }
}
