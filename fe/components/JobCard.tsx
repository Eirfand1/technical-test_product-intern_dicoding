'use client'

import { useState } from 'react'
import { Briefcase, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { Vacancy } from '@/lib/api'

const experienceLabels: Record<string, string> = {
  lt_1: 'Kurang dari 1 tahun',
  '1_3': '1-3 tahun',
  '4_5': '4-5 tahun',
  '6_10': '6-10 tahun',
  gt_10: 'Lebih dari 10 tahun',
}

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Kontrak',
  intern: 'Intern',
}

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

export default function JobCard({ vacancy }: { vacancy: Vacancy }) {
  const experience = experienceLabels[vacancy.min_experience] ?? vacancy.min_experience
  const jobType = jobTypeLabels[vacancy.job_type] ?? vacancy.job_type
  const [logoError, setLogoError] = useState(false)

  const showLogo = vacancy.company_logo && !logoError

  return (
    <Link
      href={`/jobs/${vacancy.id}`}
      className="block w-full rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      {/* Header: logo + judul + meta (tumpuk di mobile) */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Logo perusahaan - fallback ke icon Briefcase jika tidak ada */}
        {showLogo ? (
          <img
            src={vacancy.company_logo!}
            alt={`${vacancy.company_name} logo`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg object-contain sm:h-16 sm:w-16"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 sm:h-16 sm:w-16">
            <Briefcase className="h-6 w-6 text-gray-600 sm:h-8 sm:w-8" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-gray-900 sm:text-lg">{vacancy.title}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            {vacancy.company_name}
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
              {jobType}
            </span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {vacancy.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {experience}
            </span>
          </div>
        </div>
      </div>

      {/* Tanggal: ke bawah penuh di mobile, kanan di desktop */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 sm:mt-0 sm:border-0 sm:pt-0">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Dibuat {formatDate(vacancy.created_at)}
        </span>
        <span className="text-right">
          Lamar sebelum {formatDate(vacancy.active_until)}
        </span>
      </div>
    </Link>
  )
}
