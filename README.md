# Dicoding Jobs — Job Vacancy System

Full-stack job vacancy system for the Dicoding technical exercise. Recruiters can create vacancies; job seekers can search by title and view details.

## Overview

| Layer | Stack |
|-------|-------|
| Backend (`be/`) | Laravel 13 (PHP 8.4), REST API, SQLite by default (MySQL supported via `.env`) |
| Frontend (`fe/`) | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, TanStack Query |
| Tests | Pest (Laravel unit + feature), Playwright (e2e in `fe/`) |

### Architecture

```
be/    Laravel REST API  →  http://localhost:8000/api/vacancies
fe/    Next.js frontend  →  http://localhost:3000
```

The frontend reads the API base URL from `NEXT_PUBLIC_API_URL` (`.env.local`), never hardcoded.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/vacancies?search=` | List vacancies; `search` filters by title (case-insensitive, partial) |
| `GET` | `/api/vacancies/{id}` | Detail of a single vacancy (404 if missing) |
| `POST` | `/api/vacancies` | Create a vacancy (422 on validation failure) |

### Create a vacancy

```bash
curl -X POST http://localhost:8000/api/vacancies \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "title": "Backend Engineer",
    "position": "Engineering",
    "job_type": "full_time",
    "candidates_needed": 2,
    "active_until": "2030-12-31",
    "location": "Bandung",
    "is_remote": false,
    "description": "<h2>Job Description</h2><p>Build APIs.</p>",
    "salary_min": 15000000,
    "salary_max": 25000000,
    "show_salary": true,
    "min_experience": "1_3",
    "company_name": "Acme Corp",
    "company_sector": "Technology",
    "company_size": "50-100 Karyawan"
  }'
```

Valid enum values:
- `job_type`: `full_time`, `part_time`, `contract`, `intern`
- `min_experience`: `lt_1`, `1_3`, `4_5`, `6_10`, `gt_10`

## Setup

Prerequisites: PHP 8.4, Composer, Node.js 20+, npm.

```bash
# clone the repo, then work from the repo root
git clone <your-repo-url>
cd job-vacan
```

### Backend (`be/`)

```bash
cd be
composer install
cp .env.example .env
php artisan key:generate

# SQLite: touch the database file if it does not exist
touch database/database.sqlite

php artisan migrate --seed
php artisan serve          # serves http://localhost:8000
```

The `.env` shipped for local dev already uses `DB_CONNECTION=sqlite` and `FRONTEND_URL=http://localhost:3000`.

### Frontend (`fe/`)

```bash
cd fe
npm install
cp .env.local.example .env.local   # if present, otherwise create with NEXT_PUBLIC_API_URL

# ensure .env.local contains:
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev               # serves http://localhost:3000
```

Run both servers at the same time, then open http://localhost:3000.

## Running all tests

### Backend (Pest: unit + feature)

```bash
cd be
php artisan test
```

Covers: model constants/casts/fillable, seeder output, and every API endpoint
(list, detail, create with validation, search).

### Frontend e2e (Playwright)

Playwright starts both servers automatically via `webServer` in `playwright.config.ts`.

```bash
cd fe
npm install
npx playwright install --with-deps   # first time only, installs browsers
npx playwright test
```

Covers: open vacancies list, search by title, empty state, and view vacancy detail.

### One-shot (backend + frontend e2e)

```bash
# from the repo root
(cd be && php artisan test) && (cd fe && npx playwright test)
```

## Switching to MySQL

Only `.env` changes are needed; no code changes.

```bash
# be/.env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_vacan
DB_USERNAME=root
DB_PASSWORD=
```

Create the database first:

```bash
# mysql -u root -p
CREATE DATABASE job_vacan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then re-run migrations:

```bash
php artisan migrate:fresh --seed
```

## Project structure

```
be/
  app/Http/Controllers/Api/VacancyController.php   # index, store, show
  app/Http/Requests/StoreVacancyRequest.php        # validation rules
  app/Http/Resources/VacancyResource.php           # JSON shape
  app/Models/Vacancy.php                           # fillable, casts, enum constants
  database/migrations/…_create_vacancies_table.php
  database/factories/VacancyFactory.php
  database/seeders/VacancySeeder.php
  config/cors.php                                 # allows FRONTEND_URL from .env
  routes/api.php

fe/
  app/page.tsx                    # list + search (query-param driven)
  app/jobs/[id]/page.tsx          # vacancy detail
  app/layout.tsx                  # navbar/footer, wraps Providers
  components/VacancyList.tsx
  components/JobCard.tsx          # reusable card component
  components/VacancyDetail.tsx    # sanitizes description HTML
  components/providers.tsx        # TanStack Query provider
  lib/api.ts                      # fetch helpers, reads NEXT_PUBLIC_API_URL
  lib/types.ts                    # Vacancy type
  e2e/vacancies.spec.ts           # Playwright e2e
  playwright.config.ts
```

## Notes

- Search is driven by a URL query param (`/?search=`) so results are shareable.
- Vacancy description is HTML; it is sanitized before rendering on the frontend.
- CORS is configured through `FRONTEND_URL` in `be/.env`.
- Company info is stored per vacancy (each recruiter posts for their own company).
