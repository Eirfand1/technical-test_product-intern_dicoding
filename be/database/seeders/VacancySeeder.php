<?php

namespace Database\Seeders;

use App\Models\Vacancy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $base = [
            'active_until' => now()->addDays(30)->toDateString(),
            'location' => 'Bandung',
            'is_remote' => false,
            'company_name' => 'Dicoding Indonesia',
        ];

        Vacancy::factory()->create([
            ...$base,
            'title' => 'Product Engineer',
            'position' => 'Fullstack',
            'job_type' => 'full_time',
            'candidates_needed' => 1,
            'salary_min' => 15000000,
            'salary_max' => 20000000,
            'show_salary' => false,
            'min_experience' => '1_3',
            'description' => '<h2>Job Description</h2><p>Bertanggung jawab merancang, membangun, dan memelihara produk engineering.</p><h2>Responsibilities</h2><ul><li>Menulis kode yang clean dan teruji</li><li>Bekerja sama dengan tim desain dan produk</li></ul><h2>Requirements</h2><ul><li>Pengalaman 1-3 tahun sebagai Product Engineer</li><li>Memahami framework JavaScript modern</li></ul>',
        ]);

        Vacancy::factory()->create([
            ...$base,
            'title' => 'Android Developer',
            'position' => 'Mobile',
            'job_type' => 'full_time',
            'candidates_needed' => 1,
            'salary_min' => 12000000,
            'salary_max' => 18000000,
            'show_salary' => false,
            'min_experience' => '1_3',
            'description' => '<h2>Job Description</h2><p>Memiliki tanggung jawab membangun aplikasi mobile Android yang digunakan jutaan pengguna.</p><h2>Responsibilities</h2><ul><li>Merancang dan mengembangkan fitur Android dengan Kotlin</li><li>Melakukan code review dan memperbaiki kualitas kode</li></ul><h2>Requirements</h2><ul><li>Pengalaman 1-3 tahun sebagai Android Developer</li><li>Memahami arsitektur aplikasi modern</li></ul>',
        ]);

        Vacancy::factory()->create([
            ...$base,
            'title' => 'iOS Developer',
            'position' => 'Mobile',
            'job_type' => 'full_time',
            'candidates_needed' => 1,
            'salary_min' => 12000000,
            'salary_max' => 18000000,
            'show_salary' => false,
            'min_experience' => '1_3',
            'description' => '<h2>Job Description</h2><p>Memiliki tanggung jawab membangun aplikasi mobile iOS yang digunakan jutaan pengguna.</p><h2>Responsibilities</h2><ul><li>Merancang dan mengembangkan fitur iOS dengan Swift</li><li>Melakukan code review dan memperbaiki kualitas kode</li></ul><h2>Requirements</h2><ul><li>Pengalaman 1-3 tahun sebagai iOS Developer</li><li>Memahami ekosistem Apple</li></ul>',
        ]);

        Vacancy::factory()->create([
            ...$base,
            'title' => 'Code Reviewer',
            'position' => 'Engineering',
            'job_type' => 'part_time',
            'candidates_needed' => 2,
            'location' => 'Jakarta',
            'salary_min' => 15000000,
            'salary_max' => 20000000,
            'show_salary' => true,
            'min_experience' => '4_5',
            'description' => '<h2>Job Description</h2><p>Melakukan review kode untuk memastikan kualitas dan standar engineering terpenuhi.</p><h2>Responsibilities</h2><ul><li>Meninjau pull request dan memberikan feedback konstruktif</li><li>Membantu menjaga kualitas arsitektur kode</li></ul><h2>Requirements</h2><ul><li>Pengalaman 4-5 tahun</li><li>Memiliki kemampuan komunikasi yang baik</li></ul>',
        ]);
    }
}
