'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Briefcase } from 'lucide-react'
import { deleteVacancy } from '@/lib/api'
import type { Vacancy } from '@/lib/api'

export default function DashboardVacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState(false)
  const [logoError, setLogoError] = useState(false)

  async function handleDelete() {
    if (!confirm('Yakin ingin menghapus lowongan ini?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteVacancy(vacancy.id)
      // Invalidasi query vacancies di queryClient, lalu load ulang
      await queryClient.invalidateQueries({ queryKey: ['vacancies', 'dashboard'] })
    } catch (e) {
      alert('Gagal menghapus lowongan')
    } finally {
      setDeleting(false)
    }
  }

  const showLogo = vacancy.company_logo && !logoError

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white flex items-start gap-4 shadow-sm">
      {/* Logo perusahaan - fallback ke icon Briefcase jika tidak ada */}
      {showLogo ? (
        <img
          src={vacancy.company_logo!}
          alt={`${vacancy.company_name} logo`}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-gray-100 object-contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-gray-100">
          <Briefcase className="h-8 w-8 text-gray-600" />
        </div>
      )}

      <div className="flex-1">
        <a href={`/jobs/${vacancy.id}`}>
          <h3 className="font-bold text-lg hover:text-blue-600">{vacancy.title}</h3>
        </a>
        <p className="text-sm text-gray-600">
          {vacancy.company_name} • {vacancy.job_type.replace('_', ' ')}
        </p>
        <p className="text-sm text-gray-500">{vacancy.location}</p>
      </div>

      <div className="text-right text-sm">
        <p className="text-gray-500">
          Dibuat: {new Date(vacancy.created_at!).toLocaleDateString('id-ID')}
        </p>
        <p className="text-gray-500">
          Aktif hingga: {new Date(vacancy.active_until!).toLocaleDateString('id-ID')}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <button
          onClick={() => router.push(`/dashboard/jobs/${vacancy.id}/edit`)}
          className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="rounded border border-red-500 px-3 py-1 text-sm text-red-500 hover:bg-red-50"
        >
          {deleting ? 'Menghapus...' : 'Hapus'}
        </button>
      </div>
    </div>
  )
}
