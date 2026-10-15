<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HomeContentController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/berita', [HomeController::class, 'news'])->name('public.news');
Route::get('/cari', [HomeController::class, 'search'])->name('public.search');
Route::get('/statistik', [HomeController::class, 'statistics'])->name('public.statistics');
Route::post('/api/chat', [ChatBotController::class, 'send'])->name('api.chat');

Route::get('/{slug}', [HomeController::class, 'pageBySlug'])
    ->where('slug', '^(?!admin|api|login|logout|register|password|email|dashboard|profile|sanctum|_debugbar|berita|cari|statistik|verify-email|confirm-password|forgot-password|reset-password)[a-zA-Z0-9_-]+$')
    ->name('public.page');

Route::get('/{category}/{slug}', [HomeController::class, 'showPost'])
    ->where('category', '^(?!admin|api|login|logout|register|password|email|dashboard|profile|sanctum|_debugbar|reset-password|verify-email).*$')
    ->name('public.post');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('posts', PostController::class);
    Route::patch('/posts/{post}/status', [PostController::class, 'updateStatus'])->name('posts.status');
    Route::resource('pages', PageController::class);
    Route::patch('/pages/{page}/status', [PageController::class, 'updateStatus'])->name('pages.status');
    Route::resource('categories', CategoryController::class);
    Route::get('/home-content', [HomeContentController::class, 'index'])->name('home-content.index');
    Route::put('/home-content', [HomeContentController::class, 'update'])->name('home-content.update');
    Route::get('/galleries', fn () => redirect()->route('admin.posts.index', [
        'category_id' => Category::where('slug', 'galeri')->value('id'),
    ]))->name('galleries.index');
    Route::get('/galleries/create', fn () => redirect()->route('admin.posts.create', [
        'category_id' => Category::where('slug', 'galeri')->value('id'),
    ]))->name('galleries.create');
    Route::resource('staff', StaffController::class)->parameters(['staff' => 'staff']);
    Route::redirect('/content', '/admin/staff');

    Route::get('/settings/hero', [SiteSettingController::class, 'hero'])->name('settings.hero');
    Route::post('/settings/hero', [SiteSettingController::class, 'updateHero'])->name('settings.hero.update');
    Route::get('/settings/contact', [SiteSettingController::class, 'contact'])->name('settings.contact');
    Route::post('/settings/contact', [SiteSettingController::class, 'updateContact'])->name('settings.contact.update');
    Route::get('/settings/quick-links', [SiteSettingController::class, 'quickLinks'])->name('settings.quick-links');
    Route::post('/settings/quick-links', [SiteSettingController::class, 'updateQuickLinks'])->name('settings.quick-links.update');
    Route::get('/settings/social-media', [SiteSettingController::class, 'socialMedia'])->name('settings.social-media');
    Route::post('/settings/social-media', [SiteSettingController::class, 'updateSocialMedia'])->name('settings.social-media.update');
    Route::get('/settings/footer', [SiteSettingController::class, 'footer'])->name('settings.footer');
    Route::post('/settings/footer', [SiteSettingController::class, 'updateFooter'])->name('settings.footer.update');
    Route::get('/settings/navigation', [SiteSettingController::class, 'navigation'])->name('settings.navigation');
    Route::post('/settings/navigation', [SiteSettingController::class, 'updateNavigation'])->name('settings.navigation.update');
    Route::get('/settings/topbar', [SiteSettingController::class, 'topbar'])->name('settings.topbar');
    Route::post('/settings/topbar', [SiteSettingController::class, 'updateTopbar'])->name('settings.topbar.update');
});

Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
