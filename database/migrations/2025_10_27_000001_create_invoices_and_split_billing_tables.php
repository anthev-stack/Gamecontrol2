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
        // Invoices table
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('server_id')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('credits_used', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->timestamp('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('server_id')->references('id')->on('servers')->onDelete('set null');
        });

        // Invoice items table
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->string('description');
            $table->decimal('unit_price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('total', 10, 2);
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('cascade');
        });

        // Split billing table
        Schema::create('server_splits', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('server_id');
            $table->unsignedInteger('user_id')->comment('User who shares this server');
            $table->unsignedInteger('invited_by')->comment('User who sent the invitation');
            $table->decimal('split_percentage', 5, 2)->comment('Percentage of cost this user pays');
            $table->enum('status', ['pending', 'active', 'declined', 'removed'])->default('pending');
            $table->string('invitation_token')->nullable()->unique();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            $table->foreign('server_id')->references('id')->on('servers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('invited_by')->references('id')->on('users')->onDelete('cascade');
        });

        // Payment methods table
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->string('type')->comment('card, paypal, etc');
            $table->string('provider_id')->nullable()->comment('Stripe payment method ID');
            $table->string('last_four')->nullable();
            $table->string('brand')->nullable();
            $table->string('exp_month')->nullable();
            $table->string('exp_year')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // User billing preferences
        Schema::create('user_billing_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id')->unique();
            $table->boolean('auto_use_credits')->default(true)->comment('Automatically apply credits to invoices');
            $table->boolean('email_invoices')->default(true);
            $table->boolean('email_payment_reminders')->default(true);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_billing_preferences');
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('server_splits');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
    }
};

