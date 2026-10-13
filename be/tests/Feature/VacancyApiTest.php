<?php

use App\Models\Vacancy;

test('GET /api/vacancies returns a paginated collection of vacancies', function () {
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
                'company_logo',
                'created_at',
            ]],
            'current_page',
            'links',
            'per_page',
            'total',
            'last_page',
        ]);
});

test('GET /api/vacancies supports pagination with per_page and page', function () {
    Vacancy::factory()->count(15)->create(['title' => 'Base Role']);

    $page1 = $this->getJson('/api/vacancies?per_page=10&page=1');
    $page2 = $this->getJson('/api/vacancies?per_page=10&page=2');

    $page1
        ->assertOk()
        ->assertJsonCount(10, 'data')
        ->assertJsonPath('per_page', 10)
        ->assertJsonPath('current_page', 1)
        ->assertJsonPath('total', 15);

    $page2
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('current_page', 2)
        ->assertJsonPath('last_page', 2);
});

test('GET /api/vacancies clamps per_page to max 100 and page to min 1', function () {
    Vacancy::factory()->count(2)->create();

    $response = $this->getJson('/api/vacancies?per_page=9999&page=0');

    $response->assertOk();
});

test('GET /api/vacancies combines search and filters', function () {
    Vacancy::factory()->create([
        'title' => 'Senior Backend Engineer',
        'job_type' => 'full_time',
        'location' => 'Jakarta',
        'position' => 'Engineering',
    ]);
    Vacancy::factory()->create([
        'title' => 'Junior Frontend Developer',
        'job_type' => 'part_time',
        'location' => 'Bandung',
        'position' => 'Engineering',
    ]);

    $response = $this->getJson('/api/vacancies?search=Backend&job_type=full_time&location=Jakarta');

    $response->assertOk()->assertJsonCount(1, 'data');
    expect($response->json('data.0.title'))->toBe('Senior Backend Engineer');
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

test('POST /api/vacancies creates a vacancy with valid data', function () {
    $payload = [
        'title' => 'Senior Backend Engineer',
        'position' => 'Engineering',
        'job_type' => 'full_time',
        'candidates_needed' => 2,
        'active_until' => '2030-12-31',
        'location' => 'Jakarta',
        'is_remote' => false,
        'description' => '<h2>Job Description</h2><p>Bangun backend.</p>',
        'salary_min' => 15000000,
        'salary_max' => 25000000,
        'show_salary' => true,
        'min_experience' => '4_5',
        'company_name' => 'Acme Corp',
        'company_sector' => 'Technology',
        'company_size' => '50-100 Karyawan',
    ];

    $response = $this->postJson('/api/vacancies', $payload);

    $response
        ->assertCreated()
        ->assertJsonStructure(['data' => ['id', 'title', 'job_type', 'company_name', 'company_logo']])
        ->assertJsonPath('data.title', 'Senior Backend Engineer')
        ->assertJsonPath('data.job_type', 'full_time')
        ->assertJsonPath('data.company_name', 'Acme Corp');

    $this->assertDatabaseHas('vacancies', [
        'title' => 'Senior Backend Engineer',
        'company_name' => 'Acme Corp',
        'job_type' => 'full_time',
    ]);
});

test('POST /api/vacancies accepts a null salary_max', function () {
    $payload = validPayload([
        'title' => 'Intern',
        'job_type' => 'intern',
        'min_experience' => 'lt_1',
        'salary_min' => 3000000,
        'salary_max' => null,
    ]);

    $response = $this->postJson('/api/vacancies', $payload);

    $response->assertCreated();
    $this->assertDatabaseHas('vacancies', [
        'title' => 'Intern',
        'salary_max' => null,
    ]);
});

test('POST /api/vacancies returns 422 when required fields are missing', function () {
    $response = $this->postJson('/api/vacancies', []);

    $response->assertStatus(422);
});

test('POST /api/vacancies returns 422 for an invalid job_type enum', function () {
    $payload = validPayload(['job_type' => 'invalid_enum']);

    $response = $this->postJson('/api/vacancies', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors('job_type');
});

test('POST /api/vacancies returns 422 for an invalid min_experience enum', function () {
    $payload = validPayload(['min_experience' => 'invalid_enum']);

    $response = $this->postJson('/api/vacancies', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors('min_experience');
});

test('POST /api/vacancies returns 422 when active_until is in the past', function () {
    $payload = validPayload(['active_until' => '2000-01-01']);

    $response = $this->postJson('/api/vacancies', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors('active_until');
});

test('POST /api/vacancies returns 422 when candidates_needed is below minimum', function () {
    $payload = validPayload(['candidates_needed' => 0]);

    $response = $this->postJson('/api/vacancies', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors('candidates_needed');
});

test('POST /api/vacancies returns 422 when salary_max is below salary_min', function () {
    $payload = validPayload([
        'salary_min' => 20000000,
        'salary_max' => 10000000,
    ]);

    $response = $this->postJson('/api/vacancies', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors('salary_max');
});

test('GET /api/vacancies?search= returns all vacancies when search is empty', function () {
    Vacancy::factory()->count(2)->create();

    $response = $this->getJson('/api/vacancies?search=');

    $response->assertOk()->assertJsonCount(2, 'data');
});

test('GET /api/vacancies?search= filters by title case-insensitively', function () {
    Vacancy::factory()->create(['title' => 'Android Developer']);
    Vacancy::factory()->create(['title' => 'iOS Developer']);
    Vacancy::factory()->create(['title' => 'Product Manager']);

    $response = $this->getJson('/api/vacancies?search=developer');

    $titles = $response
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->json('data');

    $titles = array_column($titles, 'title');
    sort($titles);

    expect($titles)->toBe(['Android Developer', 'iOS Developer']);
});

test('GET /api/vacancies?search= performs partial title matching', function () {
    Vacancy::factory()->create(['title' => 'Android Developer']);
    Vacancy::factory()->create(['title' => 'iOS Developer']);

    $response = $this->getJson('/api/vacancies?search=Android');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Android Developer');
});

test('GET /api/vacancies?search= returns an empty collection when no match', function () {
    Vacancy::factory()->create(['title' => 'Android Developer']);

    $response = $this->getJson('/api/vacancies?search=nonexistent');

    $response->assertOk()->assertJson(['data' => []]);
});

test('GET /api/vacancies?job_type= filters by job type', function () {
    Vacancy::factory()->create(['title' => 'A', 'job_type' => 'full_time']);
    Vacancy::factory()->create(['title' => 'B', 'job_type' => 'part_time']);
    Vacancy::factory()->create(['title' => 'C', 'job_type' => 'full_time']);

    $response = $this->getJson('/api/vacancies?job_type=full_time');

    $response->assertOk()->assertJsonCount(2, 'data');
    $titles = array_column($response->json('data'), 'title');
    sort($titles);
    expect($titles)->toBe(['A', 'C']);
});

test('GET /api/vacancies?location= filters by location', function () {
    Vacancy::factory()->create(['title' => 'A', 'location' => 'Bandung']);
    Vacancy::factory()->create(['title' => 'B', 'location' => 'Jakarta']);
    Vacancy::factory()->create(['title' => 'C', 'location' => 'Bandung']);

    $response = $this->getJson('/api/vacancies?location=Jakarta');

    $response->assertOk()->assertJsonCount(1, 'data');
    expect($response->json('data.0.title'))->toBe('B');
});

test('GET /api/vacancies?position= filters by position', function () {
    Vacancy::factory()->create(['title' => 'A', 'position' => 'Mobile']);
    Vacancy::factory()->create(['title' => 'B', 'position' => 'QA']);
    Vacancy::factory()->create(['title' => 'C', 'position' => 'Mobile']);

    $response = $this->getJson('/api/vacancies?position=Mobile');

    $response->assertOk()->assertJsonCount(2, 'data');
});

test('GET /api/vacancies can combine search and filters', function () {
    Vacancy::factory()->create(['title' => 'Android Developer', 'job_type' => 'full_time', 'location' => 'Bandung']);
    Vacancy::factory()->create(['title' => 'Android Designer', 'job_type' => 'part_time', 'location' => 'Jakarta']);
    Vacancy::factory()->create(['title' => 'iOS Developer', 'job_type' => 'full_time', 'location' => 'Jakarta']);

    $response = $this->getJson('/api/vacancies?search=Developer&job_type=full_time&location=Bandung');

    $response->assertOk()->assertJsonCount(1, 'data');
    expect($response->json('data.0.title'))->toBe('Android Developer');
});

test('PUT /api/vacancies/{id} updates a vacancy with valid data', function () {
    $vacancy = Vacancy::factory()->create([
        'title' => 'Old Title',
        'company_name' => 'Old Corp',
    ]);

    $payload = validPayload([
        'title' => 'Updated Title',
        'company_name' => 'Updated Corp',
    ]);

    $response = $this->putJson("/api/vacancies/{$vacancy->id}", $payload);

    $response
        ->assertOk()
        ->assertJsonPath('data.title', 'Updated Title')
        ->assertJsonPath('data.company_name', 'Updated Corp');

    $this->assertDatabaseHas('vacancies', [
        'id' => $vacancy->id,
        'title' => 'Updated Title',
        'company_name' => 'Updated Corp',
    ]);
});

test('PUT /api/vacancies/{id} returns 404 for a missing vacancy', function () {
    $payload = validPayload();

    $response = $this->putJson('/api/vacancies/999999', $payload);

    $response->assertNotFound();
});

test('DELETE /api/vacancies/{id} removes a vacancy', function () {
    $vacancy = Vacancy::factory()->create();

    $response = $this->deleteJson("/api/vacancies/{$vacancy->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('vacancies', ['id' => $vacancy->id]);
});

test('DELETE /api/vacancies/{id} returns 404 for a missing vacancy', function () {
    $response = $this->deleteJson('/api/vacancies/999999');

    $response->assertNotFound();
});

function validPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Test Role',
        'position' => 'Engineering',
        'job_type' => 'full_time',
        'candidates_needed' => 1,
        'active_until' => '2030-12-31',
        'location' => 'Jakarta',
        'is_remote' => false,
        'description' => '<p>Test</p>',
        'salary_min' => 15000000,
        'salary_max' => 20000000,
        'show_salary' => true,
        'min_experience' => '1_3',
        'company_name' => 'Acme Corp',
    ], $overrides);
}
