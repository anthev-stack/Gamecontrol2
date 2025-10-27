<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            $table->boolean('suspended_for_billing')->default(false)->after('status');
            $table->integer('failed_payment_attempts')->default(0)->after('suspended_for_billing');
            $table->timestamp('last_payment_attempt')->nullable()->after('failed_payment_attempts');
        });
    }

    public function down(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            $table->dropColumn(['suspended_for_billing', 'failed_payment_attempts', 'last_payment_attempt']);
        });
    }
};

