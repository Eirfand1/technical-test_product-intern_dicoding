<?php

namespace App\Http\Requests;

use App\Models\Vacancy;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreVacancyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:50'],
            'job_type' => ['required', 'string', 'in:'.implode(',', Vacancy::JOB_TYPES)],
            'candidates_needed' => ['required', 'integer', 'min:1'],
            'active_until' => ['required', 'date', 'after_or_equal:today'],
            'location' => ['required', 'string', 'max:50'],
            'is_remote' => ['sometimes', 'boolean'],
            'description' => ['required', 'string'],
            'salary_min' => ['required', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'gte:salary_min'],
            'show_salary' => ['sometimes', 'boolean'],
            'min_experience' => ['required', 'string', 'in:'.implode(',', Vacancy::MIN_EXPERIENCES)],
            'company_name' => ['required', 'string', 'max:100'],
            'company_sector' => ['required', 'string', 'max:50'],
            'company_size' => ['required', 'string', 'max:50'],
        ];
    }
}
