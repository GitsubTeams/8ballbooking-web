import { useState } from 'react'
import StarRating from '@/components/StarRating'
import { formatDateTime } from '@/lib/format'
import { useStoreReviews } from '@/features/stores/hooks'

export default function ReviewSection({ storeId }: { storeId: number }) {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useStoreReviews(storeId, { page })
  const reviews = data?.reviews ?? []
  const meta = data?.meta

  return (
    <section className="space-y-3">
      <h2 className="font-semibold">Ulasan Pelanggan</h2>

      {isLoading && <p className="text-sm text-slate-500">Memuat ulasan…</p>}

      {!isLoading && reviews.length === 0 && (
        <p className="text-sm text-slate-500">Belum ada ulasan untuk store ini.</p>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">
                {review.user?.name ?? 'Pengguna'}
              </span>
              <StarRating value={review.rating} />
            </div>
            {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
            <p className="mt-1 text-xs text-slate-400">{formatDateTime(review.created_at)}</p>
          </article>
        ))}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="text-slate-500">
            Halaman {meta.current_page} / {meta.last_page}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= meta.last_page}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      )}
    </section>
  )
}
