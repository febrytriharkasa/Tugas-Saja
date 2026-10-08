<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SchoolContentController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
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
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
    Route::resource('galleries', GalleryController::class)->only(['index', 'store', 'destroy']);

    Route::get('/content', [SchoolContentController::class, 'index'])->name('content.index');
    Route::post('/content/staff', [SchoolContentController::class, 'storeStaff'])->name('content.staff.store');
    Route::delete('/content/{type}/{id}', [SchoolContentController::class, 'destroy'])->name('content.destroy');

    Route::get('/settings', [SiteSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SiteSettingController::class, 'update'])->name('settings.update');
});

Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
