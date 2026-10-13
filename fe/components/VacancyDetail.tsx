'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { fetchVacancy } from '@/lib/api'

export default function VacancyDetail({ id }: { id: number | string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => fetchVacancy(id),
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!data?.description || !containerRef.current) {
      return
    }

    let cancelled = false

    void import('dompurify').then(({ default: DOMPurify }) => {
      if (cancelled || !containerRef.current) {
        return
      }

      const clean = DOMPurify.sanitize(data.description, {
        USE_PROFILES: { html: true },
      })

      containerRef.current.innerHTML = clean
    })

    return () => {
      cancelled = true
    }
  }, [data?.description])

  if (isLoading) {
    return <div className="text-center py-8">Memuat detail...</div>
  }

  if (isError || !data) {
    return (
      <div className="text-center py-8 text-red-500">Lowongan tidak ditemukan</div>
    )
  }

  return (
    <article className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-gray-600 mt-2">{data.company_name}</p>
      <div ref={containerRef} className="mt-4 prose" aria-label="Deskripsi lowongan" />
    </article>
  )
}
