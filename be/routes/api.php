<?php

use App\Http\Controllers\Api\VacancyController;
use Illuminate\Support\Facades\Route;

Route::apiResource('vacancies', VacancyController::class)
    ->only(['index', 'show', 'store', 'update', 'destroy']);