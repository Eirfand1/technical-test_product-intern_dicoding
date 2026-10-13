<?php

use App\Models\Vacancy;

test('model has job types constant', function () {
    expect(Vacancy::JOB_TYPES)->toBe(['full_time', 'part_time', 'contract', 'intern']);
});

test('model has min experiences constant', function () {
    expect(Vacancy::MIN_EXPERIENCES)->toBe(['lt_1', '1_3', '4_5', '6_10', 'gt_10']);
});

test('model casts are defined correctly', function () {
    $vacancy = new Vacancy;
    $casts = $vacancy->getCasts();

    expect($casts)->toHaveKeys(['active_until', 'is_remote', 'show_salary', 'candidates_needed', 'salary_min', 'salary_max']);
    expect($casts['active_until'])->toBe('date');
    expect($casts['is_remote'])->toBe('boolean');
    expect($casts['show_salary'])->toBe('boolean');
    expect($casts['candidates_needed'])->toBe('integer');
    expect($casts['salary_min'])->toBe('integer');
    expect($casts['salary_max'])->toBe('integer');
});

test('model fillable includes all required fields', function () {
    $vacancy = new Vacancy;
    $fillable = $vacancy->getFillable();

    expect($fillable)->toContain('title', 'position', 'job_type', 'candidates_needed', 'active_until', 'location', 'is_remote', 'description', 'salary_min', 'salary_max', 'show_salary', 'min_experience', 'company_name', 'company_sector', 'company_size');
});
