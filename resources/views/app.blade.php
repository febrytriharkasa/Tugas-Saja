@php
    // Meta dirakit di server supaya crawler yang tidak menjalankan JS (WhatsApp,
    // Facebook) tetap menerima judul, deskripsi, dan gambar per halaman.
    $pageProps = $page['props'] ?? [];
    $settings = $pageProps['settings'] ?? [];

    $siteName = data_get($settings, 'site_name') ?: config('app.name', 'SMALISKA');
    $fallbackDescription = data_get($settings, 'footer_about')
        ?: (data_get($settings, 'site_tagline')
        ?: 'Portal resmi SMA Al Islam Krian (SMALISKA): berita sekolah, agenda, prestasi, galeri kegiatan, profil guru, dan informasi PPDB.');

    $component = $page['component'] ?? '';
    $metaTitle = null;
    $metaDescription = $fallbackDescription;
    $metaImage = data_get($settings, 'site_logo');
    $metaType = 'website';
    $metaRobots = 'index, follow';

    if ($component === 'Public/PostDetail') {
        $post = $pageProps['post'] ?? null;
        $metaTitle = data_get($post, 'title');
        $metaDescription = \Illuminate\Support\Str::limit(
            trim(strip_tags(html_entity_decode((string) data_get($post, 'content'), ENT_QUOTES | ENT_HTML5, 'UTF-8'))),
            160,
        ) ?: $fallbackDescription;
        $metaImage = data_get($post, 'featured_image') ?: $metaImage;
        $metaType = 'article';
    } elseif ($component === 'Public/Page') {
        $staticPage = $pageProps['page'] ?? null;
        $metaTitle = data_get($staticPage, 'title');
        $metaDescription = \Illuminate\Support\Str::limit(
            trim(strip_tags(html_entity_decode((string) data_get($staticPage, 'content'), ENT_QUOTES | ENT_HTML5, 'UTF-8'))),
            160,
        ) ?: $fallbackDescription;
        $metaImage = data_get($staticPage, 'image') ?: $metaImage;
        $metaRobots = data_get($pageProps, 'draftPreview') ? 'noindex, nofollow' : $metaRobots;
    } elseif ($component === 'Public/Archive') {
        $metaTitle = $pageProps['title'] ?? null;
        $metaDescription = 'Kumpulan '.\Illuminate\Support\Str::lower((string) $metaTitle).' terbaru dari '.$siteName.', lengkap dengan tanggal dan kategori.';
        $metaImage = data_get($pageProps, 'items.data.0.featured_image') ?: $metaImage;
    } elseif ($component === 'Public/Search') {
        $keyword = $pageProps['keyword'] ?? '';
        $metaTitle = $keyword ? 'Pencarian: '.$keyword : 'Pencarian';
        $metaDescription = 'Cari berita, agenda, prestasi, dan galeri kegiatan sekolah.';
        $metaRobots = 'noindex, follow';
    } elseif ($component === 'Public/Statistics') {
        $metaTitle = 'Statistik Sekolah';
        $metaDescription = 'Data statistik '.$siteName.': jumlah siswa, guru, tenaga kependidikan, berita, prestasi, agenda, dan dokumentasi.';
    } elseif ($component === 'Public/NotFound') {
        $metaTitle = 'Halaman tidak ditemukan';
        $metaRobots = 'noindex, nofollow';
    } elseif ($component === 'Welcome') {
        $metaImage = data_get($settings, 'hero_slide_1_image')
            ?: (data_get($settings, 'hero_background_image') ?: $metaImage);
    }

    $metaFullTitle = $metaTitle ? $metaTitle.' - '.$siteName : $siteName;
    $metaImageUrl = $metaImage ? url($metaImage) : null;
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ $metaFullTitle }}</title>
        <meta name="description" content="{{ $metaDescription }}">
        <meta name="robots" content="{{ $metaRobots }}">
        <meta name="theme-color" content="#065F46">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">

        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:type" content="{{ $metaType }}">
        <meta property="og:title" content="{{ $metaFullTitle }}">
        <meta property="og:description" content="{{ $metaDescription }}">
        @if ($metaImageUrl)
            <meta property="og:image" content="{{ $metaImageUrl }}">
        @endif
        <meta name="twitter:card" content="{{ $metaImageUrl ? 'summary_large_image' : 'summary' }}">
        <meta name="twitter:title" content="{{ $metaFullTitle }}">
        <meta name="twitter:description" content="{{ $metaDescription }}">

        <script>
            (function () {
                var stored = localStorage.getItem('theme') || 'system';
                var dark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (dark) document.documentElement.classList.add('dark');
            })();
        </script>

        <!-- Fonts: dimuat tanpa memblokir render; teks langsung tampil dengan font cadangan. -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap">
        </noscript>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
