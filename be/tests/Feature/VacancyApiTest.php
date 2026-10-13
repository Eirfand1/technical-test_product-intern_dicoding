<?php

use App\Models\Vacancy;

test('GET /api/vacancies returns a collection of vacancies', function () {
    Vacancy::factory()->count(3)->create();

    $response = $this->getJson('/api/vacancies');

    $response
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [[
                'id',
                'title',
                'position',
                'job_type',
                'candidates_needed',
                'active_until',
                'location',
                'is_remote',
                'description',
                'salary_min',
                'salary_max',
                'show_salary',
                'min_experience',
                'company_name',
                'company_sector',
                'company_size',
                'created_at',
            ]],
        ]);
});

test('GET /api/vacancies returns the newest vacancy first', function () {
    Vacancy::factory()->create(['title' => 'Old Role', 'created_at' => now()->subDay()]);
    Vacancy::factory()->create(['title' => 'New Role', 'created_at' => now()]);

    $response = $this->getJson('/api/vacancies');

    $response
        ->assertOk()
        ->assertJsonPath('data.0.title', 'New Role');
});

test('GET /api/vacancies returns an empty collection when there are no vacancies', function () {
    $response = $this->getJson('/api/vacancies');

    $response
        ->assertOk()
        ->assertJson(['data' => []]);
});

test('GET /api/vacancies/{id} returns the vacancy detail', function () {
    $vacancy = Vacancy::factory()->create([
        'title' => 'Android Developer',
        'active_until' => '2030-12-30',
    ]);

    $response = $this->getJson("/api/vacancies/{$vacancy->id}");

    $response
        ->assertOk()
        ->assertJsonPath('data.id', $vacancy->id)
        ->assertJsonPath('data.title', 'Android Developer')
        ->assertJsonPath('data.active_until', '2030-12-30')
        ->assertJsonPath('data.company_name', 'Dicoding Indonesia');
});

test('GET /api/vacancies/{id} returns 404 for a missing vacancy', function () {
    $response = $this->getJson('/api/vacancies/999999');

    $response->assertNotFound();
});