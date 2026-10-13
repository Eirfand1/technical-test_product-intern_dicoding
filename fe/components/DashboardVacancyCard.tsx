'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Briefcase, Pencil, Trash2 } from 'lucide-react'
import { deleteVacancy } from '@/lib/api'
import type { Vacancy } from '@/lib/api'
import { useToast } from '@/components/Toast'

export default function DashboardVacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [deleting, setDeleting] = useState(false)
  const [logoError, setLogoError] = useState(false)

  async function handleDelete() {
    if (!confirm('Yakin ingin menghapus lowongan ini?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteVacancy(vacancy.id)
      // Invalidasi query vacancies (semua varian halaman) supaya daftar refresh
      await queryClient.invalidateQueries({ queryKey: ['vacancies', 'dashboard'] })
      addToast('success', `Lowongan "${vacancy.title}" berhasil dihapus.`)
    } catch (e) {
      addToast('error', 'Gagal menghapus lowongan. Coba lagi.')
    } finally {
      setDeleting(false)
    }
  }

  const showLogo = vacancy.company_logo && !logoError
  const id = vacancy.id

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-start">
      <div className="flex items-start gap-3 sm:gap-4">
        {showLogo ? (
          <img
            src={vacancy.company_logo!}
            alt={`${vacancy.company_name} logo`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gray-100 object-contain sm:h-16 sm:w-16"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gray-100 sm:h-16 sm:w-16">
            <Briefcase className="h-6 w-6 text-gray-600 sm:h-8 sm:w-8" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <a href={`/jobs/${id}`}>
            <h3 className="text-base font-bold hover:text-blue-600 sm:text-lg">{vacancy.title}</h3>
          </a>
          <p className="text-sm text-gray-600">
            {vacancy.company_name} • {vacancy.job_type.replace('_', ' ')}
          </p>
          <p className="text-sm text-gray-500">{vacancy.location}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:ml-auto sm:items-end">
        <div className="text-left text-xs text-gray-500 sm:text-right sm:text-sm">
          <p>
            Dibuat: {new Date(vacancy.created_at!).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p>
            Aktif hingga: {new Date(vacancy.active_until!).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row">
          <button
            onClick={() => router.push(`/dashboard/jobs/${id}/edit`)}
            className="inline-flex items-center justify-center gap-1 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-1 rounded border border-red-500 px-3 py-1 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}
