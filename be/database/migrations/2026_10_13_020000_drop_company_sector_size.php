<?php

use App\Models\Vacancy;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends \Illuminate\Database\Migrations\Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn(['company_sector', 'company_size']);
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->string('company_sector', 50)->nullable()->default('Technology')->after('company_logo');
            $table->string('company_size', 50)->nullable()->default('50-100 Karyawan')->after('company_sector');
        });
    }
};
