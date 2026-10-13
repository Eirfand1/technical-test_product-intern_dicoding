'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Briefcase, Building2, Clock, MapPin, Users, Wallet } from 'lucide-react'
import { fetchVacancy } from '@/lib/api'
import { decodeHtmlEntities } from '@/lib/html'
import { JOB_TYPES, EXPERIENCES } from '@/components/constants'

const jobTypeLabels: Record<string, string> = Object.fromEntries(
  JOB_TYPES.map((t) => [t.value, t.label])
)
const experienceLabels: Record<string, string> = Object.fromEntries(
  EXPERIENCES.map((x) => [x.value, x.label])
)

function formatDate(value: string | null): string {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatSalary(value: number | null): string {
  if (value == null) {
    return '-'
  }
  return 'Rp ' + value.toLocaleString('id-ID')
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

      const clean = DOMPurify.sanitize(decodeHtmlEntities(data.description), {
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

  const jobType = jobTypeLabels[data.job_type] ?? data.job_type
  const experience = experienceLabels[data.min_experience] ?? data.min_experience

  const infoItems = [
    { icon: MapPin, label: 'Lokasi', value: data.location },
    { icon: Clock, label: 'Tipe pekerjaan', value: jobType },
    { icon: Briefcase, label: 'Posisi', value: data.position },
    { icon: Briefcase, label: 'Pengalaman kerja', value: experience },
    { icon: Users, label: 'Kandidat dibutuhkan', value: `${data.candidates_needed} kandidat` },
  ]

  return (
    <article className="space-y-6">
      {/* Header: logo + judul + perusahaan */}
      <div className="rounded-lg bg-white p-4 shadow sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {data.company_logo ? (
            <img
              src={data.company_logo}
              alt={`${data.company_name} logo`}
              className="h-16 w-16 shrink-0 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Building2 className="h-8 w-8 text-gray-500" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{data.title}</h1>
            <p className="mt-1 text-gray-600">{data.company_name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700">
                {jobType}
              </span>
              {data.is_remote && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">
                  Bisa remote
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Informasi tambahan */}
      <div className="rounded-lg bg-white p-4 shadow sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Informasi Lowongan</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {infoItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-900">{value}</dd>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500">Rentang gaji per bulan</dt>
              <dd className="text-sm font-medium text-gray-900">
                {data.show_salary
                  ? `${formatSalary(data.salary_min)} – ${formatSalary(data.salary_max)}`
                  : 'Sesuai negosiasi'}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500">Lamar sebelum</dt>
              <dd className="text-sm font-medium text-gray-900">{formatDate(data.active_until)}</dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Deskripsi HTML */}
      <div className="rounded-lg bg-white p-4 shadow sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Deskripsi</h2>
        <div ref={containerRef} className="job-description" aria-label="Deskripsi lowongan" />
      </div>
    </article>
  )
}
