import { Suspense } from 'react'
import EditVacancyClient from '@/components/EditVacancyClient'

export default function EditVacancyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<div className="text-center py-8">Memuat...</div>}>
      <EditVacancyClient params={params} />
    </Suspense>
  )
}
