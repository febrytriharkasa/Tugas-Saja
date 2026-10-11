<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('show_on_home')->default(false)->after('metadata_schema');
        });

        // Keep the previously hardcoded home sections visible after the upgrade.
        DB::table('categories')
            ->whereIn('slug', ['pengumuman', 'agenda', 'prestasi', 'fasilitas', 'cerita-alumni'])
            ->update(['show_on_home' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('show_on_home');
        });
    }
};
