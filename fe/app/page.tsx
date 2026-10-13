'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Search } from 'lucide-react'
import { JOB_TYPES, POSITIONS, LOCATIONS } from '@/components/constants'
import { type VacancyFilters } from '@/lib/api'
import VacancyList from '@/components/VacancyList'

function VacanciesView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [input, setInput] = useState(searchParams.get('search') ?? '')
  const [jobType, setJobType] = useState(searchParams.get('job_type') ?? '')
  const [location, setLocation] = useState(searchParams.get('location') ?? '')
  const [position, setPosition] = useState(searchParams.get('position') ?? '')

  const filters: VacancyFilters = {
    search: input,
    job_type: jobType,
    location,
    position,
  }

  const hasActiveFilters = Boolean(input || jobType || location || position)

  function updateUrl(nextFilters: Partial<VacancyFilters>) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(nextFilters)) {
      if (value) params.set(key, value)
    }
    const qs = params.toString()
    router.replace(qs ? `/?${qs}` : '/')
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    updateUrl({ ...filters, search: e.target.value })
  }

  const onJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(e.target.value)
    updateUrl({ ...filters, job_type: e.target.value })
  }

  const onLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value)
    updateUrl({ ...filters, location: e.target.value })
  }

  const onPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value)
    updateUrl({ ...filters, position: e.target.value })
  }

  const clearAll = () => {
    setInput('')
    setJobType('')
    setLocation('')
    setPosition('')
    updateUrl({})
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">
        {hasActiveFilters ? 'Hasil Pencarian' : 'Daftar Pekerjaan Terbaru'}
      </h1>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={onSearchChange}
            placeholder="Pekerjaan apa yang sedang kamu cari?"
            className="w-full rounded border border-gray-300 py-2 pl-9 pr-3 text-sm"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tipe pekerjaan</label>
            <select
              value={jobType}
              onChange={onJobTypeChange}
              className="w-full rounded border border-gray-300 p-1.5 text-sm"
            >
              <option value="">Semua tipe</option>
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Lokasi</label>
            <select
              value={location}
              onChange={onLocationChange}
              className="w-full rounded border border-gray-300 p-1.5 text-sm"
            >
              <option value="">Semua lokasi</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Posisi</label>
            <select
              value={position}
              onChange={onPositionChange}
              className="w-full rounded border border-gray-300 p-1.5 text-sm"
            >
              <option value="">Semua posisi</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-blue-600 hover:underline"
          >
            Reset filter
          </button>
        )}
      </div>

      <div className="mt-6">
        <VacancyList filters={filters} />
      </div>
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
