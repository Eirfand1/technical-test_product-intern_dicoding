'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchVacancies, type VacancyFilters } from '@/lib/api'
import JobCard from '@/components/JobCard'

export default function VacancyList({ filters }: { filters: VacancyFilters }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vacancies', filters.search, filters.job_type, filters.location, filters.position],
    queryFn: () => fetchVacancies(filters),
    enabled: true,
  })

  const vacancies = data ?? []

  if (isLoading) {
    return <div className="text-center py-8">Memuat lowongan...</div>
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Gagal memuat lowongan. Coba lagi nanti.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {vacancies.length === 0 ? (
        <p>Tidak ada lowongan yang ditemukan.</p>
      ) : (
        vacancies.map((vacancy) => <JobCard key={vacancy.id} vacancy={vacancy} />)
      )}
    </div>
  )
}
