<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->string('display_type')->default('text')->after('is_published');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete()->after('display_type');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['display_type', 'category_id']);
        });
    }
};
