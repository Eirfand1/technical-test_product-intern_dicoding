'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { fetchVacancies } from '@/lib/api'

export default function VacancyList({ search }: { search?: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vacancies', search],
    queryFn: () => fetchVacancies(search),
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
        vacancies.map((v) => (
          <Link
            key={v.id}
            href={`/jobs/${v.id}`}
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-bold">{v.title}</h2>
            <p className="text-gray-600">{v.position}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {v.job_type}
            </span>
          </Link>
        ))
      )}
    </div>
  )
}
