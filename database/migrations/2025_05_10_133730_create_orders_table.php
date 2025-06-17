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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->onDelete('set null');
            $table->string('lokasi_jemput');
            $table->string('lokasi_tujuan');
            $table->decimal('jarak', 8, 2)->nullable();
            $table->decimal('tarif', 10, 2)->nullable();
            $table->enum('status', ['menunggu', 'dijemput', 'dalam_perjalanan', 'selesai'])->default('menunggu');
            $table->timestamp('waktu_pesan')->nullable();
            $table->timestamp('waktu_selesai')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
