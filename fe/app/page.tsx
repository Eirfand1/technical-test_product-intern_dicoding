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
  const [page, setPage] = useState(() => {
    const raw = searchParams.get('page')
    const parsed = raw ? parseInt(raw, 10) : 1
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1
  })
  const [perPage] = useState(10)

  const filters: VacancyFilters = {
    search: input,
    job_type: jobType,
    location,
    position,
  }

  const hasActiveFilters = Boolean(input || jobType || location || position)

  function updateUrl(next: { filters?: Partial<VacancyFilters>; page?: number }) {
    const mergedFilters: Partial<VacancyFilters> = next.filters ?? filters
    const nextFilters = {
      search: mergedFilters.search ?? '',
      job_type: mergedFilters.job_type ?? '',
      location: mergedFilters.location ?? '',
      position: mergedFilters.position ?? '',
    }
    const nextPage = next.page ?? 1

    const params = new URLSearchParams()
    if (nextFilters.search) params.set('search', nextFilters.search)
    if (nextFilters.job_type) params.set('job_type', nextFilters.job_type)
    if (nextFilters.location) params.set('location', nextFilters.location)
    if (nextFilters.position) params.set('position', nextFilters.position)
    if (nextPage > 1) params.set('page', String(nextPage))
    params.set('per_page', String(perPage))
    const qs = params.toString()
    router.replace(qs ? `/?${qs}` : '/')
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    updateUrl({ filters: { ...filters, search: value }, page: 1 })
  }

  const onJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(e.target.value)
    updateUrl({ filters: { ...filters, job_type: e.target.value }, page: 1 })
  }

  const onLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value)
    updateUrl({ filters: { ...filters, location: e.target.value }, page: 1 })
  }

  const onPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value)
    updateUrl({ filters: { ...filters, position: e.target.value }, page: 1 })
  }

  const clearAll = () => {
    setInput('')
    setJobType('')
    setLocation('')
    setPosition('')
    setPage(1)
    updateUrl({ filters: {}, page: 1 })
  }

  const onPaginate = (nextPage: number) => {
    setPage(nextPage)
    updateUrl({ page: nextPage })
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
        <VacancyList filters={filters} page={page} perPage={perPage} onPaginate={onPaginate} />
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
