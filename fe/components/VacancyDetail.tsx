'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { fetchVacancy } from '@/lib/api'

/**
 * Decode HTML entities (e.g. &lt;h2&gt; -> <h2>) so that descriptions stored
 * as escaped text still render as real HTML after sanitization.
 */
function decodeHtmlEntities(html: string): string {
  const el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

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

      const decoded = decodeHtmlEntities(data.description)
      const clean = DOMPurify.sanitize(decoded, {
        USE_PROFILES: { html: true },
      })

      containerRef.current.innerHTML = clean
    })

    return () => {
      cancelled = true
    }
  }, [data?.description])

  if (isLoading) {
    return <div className="py-8 text-center">Memuat detail...</div>
  }

  if (isError || !data) {
    return (
      <div className="py-8 text-center text-red-500">Lowongan tidak ditemukan</div>
    )
  }

  return (
    <article className="rounded-lg bg-white p-4 shadow sm:p-6">
      <h1 className="text-2xl font-bold sm:text-3xl">{data.title}</h1>
      <p className="mt-2 text-gray-600">{data.company_name}</p>
      <div ref={containerRef} className="job-description mt-4" aria-label="Deskripsi lowongan" />
    </article>
  )
}
