import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '@/lib/errors'
import {
  bookingStatusLabels,
  bookingStatusStyles,
  formatCurrency,
  formatDateTime,
} from '@/lib/format'
import { useCancelBooking, useMyBookings } from '@/features/bookings/hooks'

const statusOptions = [
  { value: '', label: 'Semua status' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'confirmed', label: 'Terkonfirmasi' },
  { value: 'ongoing', label: 'Berjalan' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
  { value: 'no_show', label: 'Tidak hadir' },
]

export default function BookingsPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useMyBookings({
    status: status || undefined,
    page,
    per_page: 10,
  })
  const cancelBooking = useCancelBooking()

  const meta = data?.meta

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Booking Saya</h1>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-slate-600">Memuat…</p>}
      {isError && <p className="text-rose-600">Gagal memuat booking.</p>}
      {data && data.bookings.length === 0 && (
        <p className="text-slate-600">
          Belum ada booking. <Link to="/stores" className="underline">Cari meja</Link>.
        </p>
      )}

      <div className="space-y-3">
        {data?.bookings.map((booking) => {
          const cancellable = ['pending', 'confirmed'].includes(booking.status)
          return (
            <div
              key={booking.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link to={`/bookings/${booking.id}`} className="font-semibold hover:underline">
                    {booking.code}
                  </Link>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      bookingStatusStyles[booking.status] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {bookingStatusLabels[booking.status] ?? booking.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {booking.store?.name ?? '-'} · {booking.table?.name ?? '-'}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDateTime(booking.start_at)} – {formatDateTime(booking.end_at)}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">{formatCurrency(booking.total)}</p>
                {cancellable && (
                  <button
                    type="button"
                    onClick={() =>
                      cancelBooking.mutate({ id: booking.id, reason: 'Dibatalkan oleh pengguna' })
                    }
                    disabled={cancelBooking.isPending}
                    className="mt-1 text-sm text-rose-600 hover:underline disabled:opacity-60"
                  >
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {cancelBooking.isError && (
        <p className="text-sm text-rose-600">{getErrorMessage(cancelBooking.error)}</p>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="text-slate-600">
            Halaman {meta.current_page} / {meta.last_page} · {meta.total} booking
          </span>
          <button
            type="button"
            disabled={page >= meta.last_page}
            onClick={() => setPage((value) => value + 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      )}
    </section>
  )
}
