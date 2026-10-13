'use client'

import { use } from 'react'
import VacancyDetail from '@/components/VacancyDetail'
import { Suspense } from 'react'

function JobDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <VacancyDetail id={Number(id)} />
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-8">Memuat detail...</div>}>
      <JobDetailContent params={params} />
    </Suspense>
  )
}