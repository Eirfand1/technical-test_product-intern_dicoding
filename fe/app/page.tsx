'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import VacancyList from '@/components/VacancyList'

function VacanciesView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') ?? ''
  const [input, setInput] = useState(urlSearch)

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    router.replace(value ? `/?search=${encodeURIComponent(value)}` : '/')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">
        {urlSearch ? 'Hasil Pencarian' : 'Daftar Pekerjaan Terbaru'}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={onSearchChange}
          placeholder="Pekerjaan apa yang sedang kamu cari?"
          className="w-full md:w-80 px-4 py-2 border rounded"
        />
      </div>
      <VacancyList search={urlSearch} />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Memuat lowongan...</div>}>
      <VacanciesView />
    </Suspense>
  )
}
