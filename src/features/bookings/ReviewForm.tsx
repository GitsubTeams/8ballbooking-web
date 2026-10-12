import { useState } from 'react'
import StarRating from '@/components/StarRating'
import { useCreateReview, useDeleteReview } from '@/features/bookings/hooks'
import type { Review } from '@/types/booking'

export default function ReviewForm({
  bookingId,
  review,
}: {
  bookingId: number
  review?: Review | null
}) {
  const createReview = useCreateReview(bookingId)
  const deleteReview = useDeleteReview(bookingId)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  if (review) {
    return (
      <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">Ulasan Anda</h2>
        <StarRating value={review.rating} />
        {review.comment && <p className="text-sm text-slate-600">{review.comment}</p>}
        <button
          type="button"
          onClick={() => deleteReview.mutate(review.id)}
          disabled={deleteReview.isPending}
          className="rounded-md border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
        >
          {deleteReview.isPending ? 'Menghapus…' : 'Hapus Ulasan'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="font-semibold">Beri Ulasan</h2>
      <StarRating value={rating} onChange={setRating} size="lg" />
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Bagikan pengalaman Anda (opsional)"
        rows={3}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />
      <button
        type="button"
        onClick={() =>
          createReview.mutate({ rating, comment: comment.trim() || null })
        }
        disabled={createReview.isPending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {createReview.isPending ? 'Mengirim…' : 'Kirim Ulasan'}
      </button>
    </div>
  )
}
