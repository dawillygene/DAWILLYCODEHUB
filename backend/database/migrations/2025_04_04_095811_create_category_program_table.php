<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('category_program', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->primary(['category_id', 'program_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_program');
    }
};
