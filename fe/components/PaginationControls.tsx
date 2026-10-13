'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationControlsProps = {
  currentPage: number
  lastPage: number
  total: number
  onChange: (page: number) => void
}

export default function PaginationControls({
  currentPage,
  lastPage,
  total,
  onChange,
}: PaginationControlsProps) {
  if (lastPage <= 1) {
    return null
  }

  const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-col items-center gap-2">
      <p className="text-xs text-gray-500">
        Menampilkan {total} lowongan
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === currentPage ? 'page' : undefined}
            className={
              n === currentPage
                ? 'min-w-[2.25rem] rounded bg-blue-600 px-3 py-1 text-sm text-white'
                : 'min-w-[2.25rem] rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50'
            }
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          aria-label="Halaman berikutnya"
          className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}