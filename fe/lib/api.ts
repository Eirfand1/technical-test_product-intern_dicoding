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
  company_sector: string
  company_size: string
  created_at: string | null
}

export async function fetchVacancies(search?: string): Promise<Vacancy[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const response = await fetch(`${API_URL}/api/vacancies${query}`)

  if (!response.ok) {
    throw new Error('Gagal memuat daftar lowongan')
  }

  const body = (await response.json()) as { data: Vacancy[] }

  return body.data
}

export async function fetchVacancy(id: number | string): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/api/vacancies/${id}`)

  if (!response.ok) {
    throw new Error('Gagal memuat detail lowongan')
  }

  const body = (await response.json()) as { data: Vacancy }

  return body.data
}
