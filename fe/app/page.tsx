'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Search } from 'lucide-react'
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
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">
        {urlSearch ? 'Hasil Pencarian' : 'Daftar Pekerjaan Terbaru'}
      </h1>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={onSearchChange}
          placeholder="Pekerjaan apa yang sedang kamu cari?"
          className="w-full rounded border border-gray-300 py-2 pl-9 pr-3 text-sm"
        />
      </div>
      <VacancyList search={urlSearch}/>
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
