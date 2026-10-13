<?php

namespace App\Models;

use Database\Factories\VacancyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
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
])]
class Vacancy extends Model
{
    /** @use HasFactory<VacancyFactory> */
    use HasFactory;

    /** @var list<string> */
    public const JOB_TYPES = ['full_time', 'part_time', 'contract', 'intern'];

    /** @var list<string> */
    public const MIN_EXPERIENCES = ['lt_1', '1_3', '4_5', '6_10', 'gt_10'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'candidates_needed' => 'integer',
            'active_until' => 'date',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'is_remote' => 'boolean',
            'show_salary' => 'boolean',
        ];
    }
}
