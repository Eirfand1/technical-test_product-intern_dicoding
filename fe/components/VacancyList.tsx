'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchVacancies, type VacancyFilters } from '@/lib/api'
import JobCard from '@/components/JobCard'
import PaginationControls from '@/components/PaginationControls'

type VacancyListProps = {
  filters: VacancyFilters
  page: number
  perPage: number
  onPaginate: (page: number) => void
}

export default function VacancyList({ filters, page, perPage, onPaginate }: VacancyListProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'vacancies',
      filters.search,
      filters.job_type,
      filters.location,
      filters.position,
      page,
      perPage,
    ],
    queryFn: () => fetchVacancies(filters, page, perPage),
    enabled: true,
  })

  const vacancies = data?.data ?? []
  const meta = data?.meta

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
      {meta && (
        <PaginationControls
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          onChange={onPaginate}
        />
      )}
    </div>
  )
}
