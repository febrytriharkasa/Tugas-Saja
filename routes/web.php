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
Route::get('/berita/{slug}', [HomeController::class, 'showPost'])->name('public.post');
Route::get('/laman/{slug}', [HomeController::class, 'page'])->name('public.page');
Route::get('/arsip/{type}', [HomeController::class, 'archive'])->name('public.archive');
Route::get('/statistik', [HomeController::class, 'statistics'])->name('public.statistics');
Route::post('/api/chat', [ChatBotController::class, 'send'])->name('api.chat');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('posts', PostController::class);
    Route::resource('pages', PageController::class);
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
});

Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
