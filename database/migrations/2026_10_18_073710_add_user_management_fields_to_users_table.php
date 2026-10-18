<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('staff')->change();
            $table->boolean('is_active')->default(true)->after('role');
            $table->timestamp('password_reset_requested_at')->nullable()->after('remember_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'password_reset_requested_at']);
            $table->enum('role', ['admin', 'superadmin'])->default('admin')->change();
        });
    }
};
