const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export type Vacancy = {
  id: number
  title: string
  position: string
  job_type: string
  candidates_needed: number
  active_until: string | null
  location: string
  is_remote: boolean
  description: string
  salary_min: number
  salary_max: number | null
  show_salary: boolean
  min_experience: string
  company_name: string
  company_logo: string | null
  created_at: string | null
}

export type VacancyPayload = {
  title: string
  position: string
  job_type: string
  candidates_needed: number
  active_until: string
  location: string
  is_remote?: boolean
  description: string
  salary_min: number
  salary_max?: number | null
  show_salary?: boolean
  min_experience: string
  company_name: string
  company_logo?: File | null
}

export class ApiValidationError extends Error {
  validationErrors: Record<string, string[]>
  constructor(errors: Record<string, string[]>) {
    super('Validasi gagal')
    this.name = 'ApiValidationError'
    this.validationErrors = errors
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 422) {
    const body = (await response.json()) as { errors?: Record<string, string[]> }
    if (body.errors) {
      throw new ApiValidationError(body.errors)
    }
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message ?? 'Terjadi kesalahan pada server')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function toFormData(payload: VacancyPayload): FormData {
  const fd = new FormData()
  fd.append('title', payload.title)
  fd.append('position', payload.position)
  fd.append('job_type', payload.job_type)
  fd.append('candidates_needed', String(payload.candidates_needed))
  fd.append('active_until', payload.active_until)
  fd.append('location', payload.location)
  if (payload.is_remote !== undefined) {
    fd.append('is_remote', payload.is_remote ? '1' : '0')
  }
  fd.append('description', payload.description)
  fd.append('salary_min', String(payload.salary_min))
  if (payload.salary_max !== null && payload.salary_max !== undefined) {
    fd.append('salary_max', String(payload.salary_max))
  }
  if (payload.show_salary !== undefined) {
    fd.append('show_salary', payload.show_salary ? '1' : '0')
  }
  fd.append('min_experience', payload.min_experience)
  fd.append('company_name', payload.company_name)
  if (payload.company_logo) {
    fd.append('company_logo', payload.company_logo)
  }
  return fd
}

export async function fetchVacancies(search?: string): Promise<Vacancy[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const response = await fetch(`${API_URL}/api/vacancies${query}`)

  const body = await handleResponse<{ data: Vacancy[] }>(response)

  return body.data
}

export async function fetchVacancy(id: number | string): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/api/vacancies/${id}`)

  const body = await handleResponse<{ data: Vacancy }>(response)

  return body.data
}

export async function createVacancy(payload: VacancyPayload): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/api/vacancies`, {
    method: 'POST',
    body: toFormData(payload),
  })

  const body = await handleResponse<{ data: Vacancy }>(response)

  return body.data
}

export async function updateVacancy(id: number | string, payload: VacancyPayload): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/api/vacancies/${id}`, {
    method: 'PUT',
    body: toFormData(payload),
  })

  const body = await handleResponse<{ data: Vacancy }>(response)

  return body.data
}

export async function deleteVacancy(id: number | string): Promise<void> {
  const response = await fetch(`${API_URL}/api/vacancies/${id}`, {
    method: 'DELETE',
  })

  await handleResponse<void>(response)
}
