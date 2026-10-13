<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVacancyRequest;
use App\Http\Resources\VacancyResource;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VacancyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $vacancies = Vacancy::query()
            ->when($request->query('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return VacancyResource::collection($vacancies);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVacancyRequest $request)
    {
        $validated = $request->validated();
        $logo = $this->storeLogo($request);

        if ($logo !== null) {
            $validated['company_logo'] = $logo;
        }

        $vacancy = Vacancy::create($validated);

        return (new VacancyResource($vacancy))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vacancy $vacancy)
    {
        return new VacancyResource($vacancy);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreVacancyRequest $request, Vacancy $vacancy)
    {
        $validated = $request->validated();

        $logo = $this->storeLogo($request);

        if ($logo !== null) {
            $validated['company_logo'] = $logo;
        }

        $vacancy->update($validated);

        return new VacancyResource($vacancy);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vacancy $vacancy)
    {
        $vacancy->delete();

        return response()->noContent();
    }

    /**
     * Store the uploaded company logo and return its public path, or null if no file was provided.
     */
    private function storeLogo(Request $request): ?string
    {
        if (! $request->hasFile('company_logo')) {
            return null;
        }

        return $request->file('company_logo')->store('company-logos', 'public');
    }
}