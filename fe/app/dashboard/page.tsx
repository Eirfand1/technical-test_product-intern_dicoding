'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchVacancies } from '@/lib/api'
import DashboardVacancyCard from '@/components/DashboardVacancyCard'
import PaginationControls from '@/components/PaginationControls'

const PER_PAGE = 5

export default function DashboardPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vacancies', 'dashboard', page],
    queryFn: () => fetchVacancies({}, page, PER_PAGE),
  })

  const vacancies = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      {/* Sidebar */}
      <aside className="w-full shrink-0 sm:w-52">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-bold">Jobs</h2>
          <ul className="space-y-1">
            <li>
              <a
                href="/dashboard"
                className="block rounded bg-blue-50 px-3 py-2 font-medium"
              >
                Lowongan Saya
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Lowongan Saya</h1>
          <a
            href="/dashboard/jobs/create"
            className="inline-flex items-center justify-center gap-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:justify-start"
          >
            + Buat lowongan
          </a>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">Memuat...</div>
        ) : isError ? (
          <div className="py-8 text-center text-red-500">
            Gagal memuat lowongan. Coba lagi.
          </div>
        ) : (
          <div className="space-y-3">
            {vacancies.map((v) => (
              <DashboardVacancyCard key={v.id} vacancy={v} />
            ))}
            {vacancies.length === 0 && (
              <p className="text-gray-500">Belum ada lowongan yang dibuat.</p>
            )}
            {meta && (
              <PaginationControls
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                total={meta.total}
                perPage={PER_PAGE}
                onChange={setPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
