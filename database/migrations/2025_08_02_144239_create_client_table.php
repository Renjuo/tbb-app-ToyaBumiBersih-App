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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending'])->default('active');
            $table->text('notes')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->enum('service_level', ['basic', 'standard', 'premium', 'enterprise'])->default('standard');
            $table->text('billing_address')->nullable();
            $table->string('tax_number', 50)->nullable();
            $table->string('client_code', 20)->unique();
            $table->enum('priority_level', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['company_id', 'status']);
            $table->index(['store_id', 'status']);
            $table->index('client_code');
            $table->index('contract_end_date');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};