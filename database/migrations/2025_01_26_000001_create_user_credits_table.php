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
        Schema::create('user_credits', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->integer('credits')->default(0)->comment('Credits amount (1 credit = $0.10)');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique('user_id');
        });

        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->integer('amount')->comment('Positive for additions, negative for deductions');
            $table->decimal('dollar_value', 10, 2)->comment('Dollar value of transaction');
            $table->string('type')->comment('referral, giveaway, admin_grant, payment, purchase, admin_removal');
            $table->text('description')->nullable();
            $table->unsignedInteger('admin_id')->nullable()->comment('Admin who granted/deducted credits');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_transactions');
        Schema::dropIfExists('user_credits');
    }
};

