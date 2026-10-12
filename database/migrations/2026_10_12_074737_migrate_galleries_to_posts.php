<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('media_type', ['image', 'video'])->nullable()->after('featured_image');
        });

        $categoryId = DB::table('categories')->where('slug', 'galeri')->value('id');

        if (! $categoryId) {
            $categoryId = DB::table('categories')->insertGetId([
                'name' => 'Galeri',
                'slug' => 'galeri',
                'show_on_home' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $galleryCount = Schema::hasTable('galleries') ? DB::table('galleries')->count() : 0;
        $userId = DB::table('users')->orderBy('id')->value('id');

        if ($galleryCount > 0 && ! $userId) {
            throw new RuntimeException('Data galeri tidak dapat dipindahkan karena belum ada user.');
        }

        if (Schema::hasTable('galleries')) {
            DB::table('galleries')->orderBy('id')->each(function (object $gallery) use ($categoryId, $userId): void {
                $slug = 'galeri-legacy-'.$gallery->id.'-'.Str::limit(Str::slug($gallery->title), 200, '');

                DB::table('posts')->insert([
                    'user_id' => $userId,
                    'category_id' => $categoryId,
                    'title' => $gallery->title,
                    'slug' => $slug,
                    'content' => '',
                    'featured_image' => $gallery->file_path ?: null,
                    'media_type' => $gallery->media_type,
                    'status' => 'published',
                    'published_at' => $gallery->created_at,
                    'created_at' => $gallery->created_at,
                    'updated_at' => $gallery->updated_at,
                ]);
            });
        }

        Schema::dropIfExists('galleries');
    }

    public function down(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('media_type', ['image', 'video'])->default('image');
            $table->string('file_path');
            $table->timestamps();
        });

        $categoryId = DB::table('categories')->where('slug', 'galeri')->value('id');

        if ($categoryId) {
            DB::table('posts')->where('category_id', $categoryId)->orderBy('id')->each(function (object $post): void {
                DB::table('galleries')->insert([
                    'title' => $post->title,
                    'media_type' => $post->media_type ?? 'image',
                    'file_path' => $post->featured_image ?? '',
                    'created_at' => $post->created_at,
                    'updated_at' => $post->updated_at,
                ]);
            });

            DB::table('posts')->where('category_id', $categoryId)->delete();
            DB::table('categories')->where('id', $categoryId)->delete();
        }

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('media_type');
        });
    }
};
