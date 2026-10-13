'use client'

import { use, useEffect, useState } from 'react'
import { fetchVacancy } from '@/lib/api'
import VacancyForm from '@/components/VacancyForm'
import type { Vacancy } from '@/lib/api'

export default function EditVacancyClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [vacancy, setVacancy] = useState<Vacancy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void fetchVacancy(id)
      .then((data) => {
        if (!cancelled) {
          setVacancy(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Lowongan tidak ditemukan')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>
  }

  if (error || !vacancy) {
    return <div className="text-center py-8 text-red-500">{error || 'Lowongan tidak ditemukan'}</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Lowongan</h1>
      <VacancyForm vacancy={vacancy} />
    </div>
  )
}
