'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchVacancies } from '@/lib/api'
import DashboardVacancyCard from '@/components/DashboardVacancyCard'

export default function DashboardPage() {
  const { data: vacancies, isLoading, isError } = useQuery({
    queryKey: ['vacancies', 'dashboard'],
    queryFn: () => fetchVacancies(),
  })

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-52 shrink-0">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold text-lg mb-4">Jobs</h2>
          <ul className="space-y-1">
            <li>
              <a
                href="/dashboard"
                className="block px-3 py-2 rounded text-blue-600 bg-blue-50 font-medium"
              >
                Lowongan Saya
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Lowongan Saya</h1>
          <a
            href="/dashboard/jobs/create"
            className="inline-flex items-center gap-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Buat lowongan
          </a>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Memuat...</div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            Gagal memuat lowongan. Coba lagi.
          </div>
        ) : (
          <div className="space-y-3">
            {(vacancies ?? []).map((v) => (
              <DashboardVacancyCard key={v.id} vacancy={v} />
            ))}
            {(vacancies ?? []).length === 0 && (
              <p className="text-gray-500">Belum ada lowongan yang dibuat.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}