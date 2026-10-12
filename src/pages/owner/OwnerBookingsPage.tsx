import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  bookingStatusLabels,
  bookingStatusStyles,
  formatCurrency,
  formatDateTime,
} from '@/lib/format'
import { ownerLifecycleActions } from '@/features/owner/api'
import { useMyStores, useOwnerBookings, useOwnerBookingTransition } from '@/features/owner/hooks'
import { useMarkBookingPaid } from '@/features/payments/hooks'

interface Filters {
  q: string
  status: string
  store_id: string
  date: string
  page: number
}

const emptyFilters: Filters = { q: '', status: '', store_id: '', date: '', page: 1 }

export default function OwnerBookingsPage() {
  const stores = useMyStores()
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const transition = useOwnerBookingTransition()
  const markPaid = useMarkBookingPaid()

  const { data, isLoading } = useOwnerBookings({
    q: filters.q || undefined,
    status: filters.status || undefined,
    store_id: filters.store_id || undefined,
    date: filters.date || undefined,
    page: filters.page,
  })

  const bookings = data?.bookings ?? []
  const meta = data?.meta

  const setFilter = (patch: Partial<Filters>) =>
    setFilters((current) => ({ ...current, ...patch, page: 1 }))

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Booking Masuk</h1>

      <div className="flex flex-wrap gap-2">
        <input
          value={filters.q}
          onChange={(event) => setFilter({ q: event.target.value })}
          placeholder="Cari kode booking…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilter({ status: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Semua status</option>
          {Object.entries(bookingStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filters.store_id}
          onChange={(event) => setFilter({ store_id: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Semua store</option>
          {(stores.data ?? []).map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(event) => setFilter({ date: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        {Object.values(filters).some((value) => value !== '' && value !== 1) && (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Reset
          </button>
        )}
      </div>

      {isLoading && <p className="text-slate-600">Memuat…</p>}

      {!isLoading && bookings.length === 0 && (
        <p className="text-sm text-slate-500">Tidak ada booking yang cocok.</p>
      )}

      <div className="space-y-2">
        {bookings.map((booking) => {
          const actions = ownerLifecycleActions[booking.status] ?? []
          return (
            <div
              key={booking.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Link to={`/owner/stores/${booking.store_id}`} className="font-medium hover:underline">
                    {booking.code}
                  </Link>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      bookingStatusStyles[booking.status] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {bookingStatusLabels[booking.status] ?? booking.status}
                  </span>
                </div>
                <p className="text-slate-600">
                  {booking.store?.name ?? '-'} · {booking.table?.name ?? '-'} ·{' '}
                  {formatDateTime(booking.start_at)}
                </p>
                <p className="text-xs text-slate-500">{booking.user?.name ?? 'Walk-in'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatCurrency(booking.total)}</span>
                {booking.payment_status !== 'paid' &&
                  ['pending', 'confirmed'].includes(booking.status) && (
                    <button
                      type="button"
                      disabled={markPaid.isPending}
                      onClick={() => markPaid.mutate(booking.id)}
                      className="rounded-md border border-emerald-300 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                    >
                      Tandai Lunas
                    </button>
                  )}
                {actions.map((item) => (
                  <button
                    key={item.action}
                    type="button"
                    disabled={transition.isPending}
                    onClick={() => transition.mutate({ id: booking.id, action: item.action })}
                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() =>
              setFilters((current) => ({ ...current, page: Math.max(1, current.page - 1) }))
            }
            disabled={filters.page <= 1}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="text-slate-500">
            Halaman {meta.current_page} / {meta.last_page}
          </span>
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
            disabled={filters.page >= meta.last_page}
            className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      )}
    </section>
  )
}
