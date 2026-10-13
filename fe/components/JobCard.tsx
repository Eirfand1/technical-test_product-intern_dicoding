'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase } from 'lucide-react'
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
      className="block w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        {/* Logo perusahaan - fallback ke icon Briefcase jika tidak ada */}
        {showLogo ? (
          <img
            src={vacancy.company_logo!}
            alt={`${vacancy.company_name} logo`}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg object-contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <Briefcase className="h-8 w-8 text-gray-600" />
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">{vacancy.title}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            {vacancy.company_name}
            <span className="ml-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
              {jobType}
            </span>
          </p>
          <p className="mt-1 flex items-center gap-4 text-sm text-gray-500">
            <span>{vacancy.location}</span>
            <span>{experience}</span>
          </p>
        </div>

        <div className="text-right text-xs text-gray-500">
          <p>Dibuat pada {formatDate(vacancy.created_at)}</p>
          <p>Lamar sebelum {formatDate(vacancy.active_until)}</p>
        </div>
      </div>
    </Link>
  )
}
