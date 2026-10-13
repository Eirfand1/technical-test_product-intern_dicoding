'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVacancy, updateVacancy, ApiValidationError, type VacancyPayload } from '@/lib/api'
import type { Vacancy } from '@/lib/api'
import { useToast } from '@/components/Toast'
import SimpleWysiwyg from 'react-simple-wysiwyg'

const POSITIONS = ['Engineering', 'Mobile', 'Fullstack', 'Frontend', 'Backend', 'Product', 'QA']
const LOCATIONS = ['Bandung', 'Jakarta', 'Yogyakarta', 'Remote', 'Surabaya', 'Bali']
const JOB_TYPES = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'intern', label: 'Intern' },
]
const EXPERIENCES = [
  { value: 'lt_1', label: 'Kurang dari 1 tahun' },
  { value: '1_3', label: '1-3 tahun' },
  { value: '4_5', label: '4-5 tahun' },
  { value: '6_10', label: '6-10 tahun' },
  { value: 'gt_10', label: 'Lebih dari 10 tahun' },
]

type FormState = {
  title: string
  position: string
  job_type: string
  candidates_needed: number
  active_until: string
  location: string
  is_remote: boolean
  description: string
  salary_min: number
  salary_max: number | null
  show_salary: boolean
  min_experience: string
  company_name: string
  company_logo: File | null
}

function toFormState(vacancy?: Vacancy): FormState {
  return {
    title: vacancy?.title ?? '',
    position: vacancy?.position ?? '',
    job_type: vacancy?.job_type ?? 'full_time',
    candidates_needed: vacancy?.candidates_needed ?? 1,
    active_until: vacancy?.active_until
      ? new Date(vacancy.active_until).toISOString().split('T')[0]
      : '',
    location: vacancy?.location ?? '',
    is_remote: vacancy?.is_remote ?? false,
    description: vacancy?.description ?? '',
    salary_min: vacancy?.salary_min ?? 0,
    salary_max: vacancy?.salary_max ?? null,
    show_salary: vacancy?.show_salary ?? false,
    min_experience: vacancy?.min_experience ?? '1_3',
    company_name: vacancy?.company_name ?? 'Dicoding Indonesia',
    company_logo: null,
  }
}

export default function VacancyForm({ vacancy }: { vacancy?: Vacancy }) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormState>(() => toFormState(vacancy))

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy[field]
      return copy
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    try {
      const payload: VacancyPayload = { ...formData }

      if (vacancy) {
        await updateVacancy(vacancy.id, payload)
        addToast('success', `Lowongan "${payload.title}" berhasil diperbarui.`)
      } else {
        await createVacancy(payload)
        addToast('success', `Lowongan "${payload.title}" berhasil dibuat.`)
      }

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof ApiValidationError) {
        const flat: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.validationErrors)) {
          flat[key] = msgs[0]
        }
        setErrors(flat)
      } else {
        console.error('Submit failed:', err)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isEdit = !!vacancy

  return (
    <div className="max-w-3xl space-y-6">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        <div>
          <label className="block font-medium">Judul lowongan</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Masukkan judul lowongan"
            className={`w-full rounded border px-3 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          <p className="text-xs text-gray-500 mt-1">Contoh: Android Native Developer</p>
        </div>

        <div>
          <label className="block font-medium">Posisi</label>
          <select
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            className={`w-full rounded border px-3 py-2 ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Pilih posisi yang dicari</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
        </div>

        <div>
          <label className="block font-medium">Tipe pekerjaan</label>
          <div className="flex gap-4">
            {JOB_TYPES.map((t) => (
              <label key={t.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="job_type"
                  value={t.value}
                  checked={formData.job_type === t.value}
                  onChange={() => handleChange('job_type', t.value)}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium">Kandidat yang dibutuhkan</label>
          <input
            type="number"
            min={1}
            value={formData.candidates_needed}
            onChange={(e) => handleChange('candidates_needed', parseInt(e.target.value, 10) || 1)}
            placeholder="Masukkan jumlah kandidat yang dibutuhkan"
            className={`w-full rounded border px-3 py-2 ${errors.candidates_needed ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.candidates_needed && <p className="text-red-500 text-sm">{errors.candidates_needed}</p>}
        </div>

        <div>
          <label className="block font-medium">Aktif hingga</label>
          <input
            type="date"
            value={formData.active_until}
            onChange={(e) => handleChange('active_until', e.target.value)}
            className={`w-full rounded border px-3 py-2 ${errors.active_until ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.active_until && <p className="text-red-500 text-sm">{errors.active_until}</p>}
        </div>

        <div>
          <label className="block font-medium">Lokasi</label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className={`w-full rounded border px-3 py-2 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Pilih lokasi</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.is_remote}
              onChange={(e) => handleChange('is_remote', e.target.checked)}
            />
            Bisa remote
          </label>
        </div>

        <div>
          <label className="block font-medium">Deskripsi</label>
          <SimpleWysiwyg
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Masukkan deskripsi pekerjaan"
            className={`w-full rounded border px-3 py-2 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Format teks: tebal, miring, garis bawah, daftar, tautan
          </p>
        </div>

        <fieldset className="space-y-2">
          <legend className="block font-medium">Rentang gaji per bulan</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={formData.salary_min}
                onChange={(e) => handleChange('salary_min', parseInt(e.target.value, 10) || 0)}
                placeholder="Rp Minimum"
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <input
                type="number"
                value={formData.salary_max ?? ''}
                onChange={(e) =>
                  handleChange('salary_max', e.target.value ? parseInt(e.target.value, 10) : null)
                }
                placeholder="Rp Maksimum (opsional)"
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Anda tidak perlu mengisi kolom Maksimum jika yang dimasukkan adalah gaji pokok.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.show_salary}
              onChange={(e) => handleChange('show_salary', e.target.checked)}
            />
            Tampilkan gaji
          </label>
        </fieldset>

        <div>
          <label className="block font-medium">Minimum pengalaman bekerja</label>
          <div className="flex flex-col gap-1">
            {EXPERIENCES.map((x) => (
              <label key={x.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="min_experience"
                  value={x.value}
                  checked={formData.min_experience === x.value}
                  onChange={() => handleChange('min_experience', x.value)}
                />
                {x.label}
              </label>
            ))}
          </div>
        </div>

        <fieldset className="space-y-2 border-t pt-4">
          <legend className="block font-medium">Informasi Perusahaan</legend>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            placeholder="Nama perusahaan"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <div>
            <label className="block font-medium text-sm">Logo perusahaan (opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange('company_logo', e.target.files?.[0] ?? null)}
              className="w-full text-sm rounded border border-gray-300 p-2"
            />
            {vacancy?.company_logo && (
              <p className="text-xs text-gray-500 mt-1">
                Logo saat ini:{' '}
                <a
                  href={vacancy.company_logo}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  lihat
                </a>
              </p>
            )}
          </div>
        </fieldset>

        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : isEdit ? 'Perbarui lowongan' : 'Buat lowongan'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
