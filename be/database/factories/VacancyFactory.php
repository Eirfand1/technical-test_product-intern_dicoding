<?php

namespace Database\Factories;

use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vacancy>
 */
class VacancyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'position' => fake()->randomElement(['Fullstack', 'Mobile', 'Engineering']),
            'job_type' => fake()->randomElement(Vacancy::JOB_TYPES),
            'candidates_needed' => fake()->numberBetween(1, 5),
            'active_until' => now()->addWeeks(2)->toDateString(),
            'location' => fake()->randomElement(['Bandung', 'Jakarta', 'Yogyakarta']),
            'is_remote' => false,
            'description' => '<h2>Job Description</h2><p>Membangun dan memelihara produk.</p>',
            'salary_min' => 10000000,
            'salary_max' => null,
            'show_salary' => false,
            'min_experience' => fake()->randomElement(Vacancy::MIN_EXPERIENCES),
            'company_name' => 'Dicoding Indonesia',
        ];
    }
}
