<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VacancyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'position' => $this->position,
            'job_type' => $this->job_type,
            'candidates_needed' => $this->candidates_needed,
            'active_until' => $this->active_until ? $this->active_until->toDateString() : null,
            'location' => $this->location,
            'is_remote' => $this->is_remote,
            'description' => $this->description,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'show_salary' => $this->show_salary,
            'min_experience' => $this->min_experience,
            'company_name' => $this->company_name,
            'company_sector' => $this->company_sector,
            'company_size' => $this->company_size,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
