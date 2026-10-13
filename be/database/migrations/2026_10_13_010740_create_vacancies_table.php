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
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index();
            $table->string('position', 50);
            $table->string('job_type', 20);
            $table->unsignedInteger('candidates_needed');
            $table->date('active_until');
            $table->string('location', 50);
            $table->boolean('is_remote')->default(false);
            $table->longText('description');
            $table->unsignedBigInteger('salary_min');
            $table->unsignedBigInteger('salary_max')->nullable();
            $table->boolean('show_salary')->default(false);
            $table->string('min_experience', 30);
            $table->string('company_name', 100);
            $table->string('company_logo', 255)->nullable();
            $table->string('company_sector', 50)->nullable()->default('Technology');
            $table->string('company_size', 50)->nullable()->default('50-100 Karyawan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
