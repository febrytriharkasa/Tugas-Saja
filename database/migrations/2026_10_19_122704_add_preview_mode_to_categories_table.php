<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('preview_mode', 20)->default('standard')->after('show_on_home');
        });

        DB::table('categories')->where('slug', 'galeri')->update(['preview_mode' => 'media']);
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('preview_mode');
        });
    }
};
