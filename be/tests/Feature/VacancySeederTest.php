<?php

use App\Models\Vacancy;

test('seeder creates exactly 4 vacancies', function () {
    $this->seed();

    expect(Vacancy::count())->toBe(4);
});

test('seeder creates required vacancy titles', function () {
    $this->seed();

    expect(Vacancy::pluck('title')->all())->toEqualCanonicalizing([
        'Android Developer',
        'Code Reviewer',
        'iOS Developer',
        'Product Engineer',
    ]);
});

test('seeded vacancies have valid enum values', function () {
    $this->seed();

    $vacancies = Vacancy::all();

    foreach ($vacancies as $vacancy) {
        expect($vacancy->job_type)->toBeIn(Vacancy::JOB_TYPES);
        expect($vacancy->min_experience)->toBeIn(Vacancy::MIN_EXPERIENCES);
    }
});

test('seeded vacancies have future active_until dates', function () {
    $this->seed();

    $vacancies = Vacancy::all();

    foreach ($vacancies as $vacancy) {
        expect($vacancy->active_until->greaterThanOrEqualTo(now()->startOfDay()))->toBeTrue();
    }
});
