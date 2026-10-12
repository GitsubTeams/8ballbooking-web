import { useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import {
  bookingStatusLabels,
  bookingStatusStyles,
  formatCurrency,
  formatTime,
  toDateInput,
} from '@/lib/format'
import { useCalendarMutations, useStoreBookings } from '@/features/owner/hooks'
import { ownerLifecycleActions } from '@/features/owner/api'
import type { LifecycleAction } from '@/features/owner/api'
import type { Booking, Store } from '@/types/booking'

export default function CalendarSection({ store }: { store: Store }) {
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const { data, isLoading } = useStoreBookings(store.id, { date })
  const { walkIn, transition } = useCalendarMutations(store.id)

  const [walkForm, setWalkForm] = useState({ table_id: '', start_at: '', end_at: '' })

  function submitWalkIn(event: React.FormEvent) {
    event.preventDefault()
    walkIn.mutate(
      {
        table_id: Number(walkForm.table_id),
        start_at: toDateTime(walkForm.start_at),
        end_at: toDateTime(walkForm.end_at),
      },
      { onSuccess: () => setWalkForm({ table_id: '', start_at: '', end_at: '' }) },
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Kalender Booking</h2>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
      </div>

      <div className="space-y-2">
        {isLoading && <p className="text-sm text-slate-500">Memuat…</p>}
        {data?.bookings.length === 0 && !isLoading && (
          <p className="text-sm text-slate-500">Tidak ada booking pada tanggal ini.</p>
        )}
        {data?.bookings.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            onAction={(action) => transition.mutate({ id: booking.id, action })}
            pending={transition.isPending}
          />
        ))}
      </div>

      <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Buat Booking Walk-in</h3>
        <form onSubmit={submitWalkIn} className="flex flex-wrap items-end gap-2">
          <select
            required
            value={walkForm.table_id}
            onChange={(event) => setWalkForm({ ...walkForm, table_id: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            <option value="">Pilih meja</option>
            {(store.tables ?? []).map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            required
            value={walkForm.start_at}
            onChange={(event) => setWalkForm({ ...walkForm, start_at: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <input
            type="datetime-local"
            required
            value={walkForm.end_at}
            onChange={(event) => setWalkForm({ ...walkForm, end_at: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            disabled={walkIn.isPending}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            Buat
          </button>
        </form>
        {walkIn.isError && <p className="text-sm text-rose-600">{getErrorMessage(walkIn.error)}</p>}
      </section>
    </div>
  )
}

function BookingRow({
  booking,
  onAction,
  pending,
}: {
  booking: Booking
  onAction: (action: LifecycleAction) => void
  pending: boolean
}) {
  const actions = ownerLifecycleActions[booking.status] ?? []

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">{booking.code}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              bookingStatusStyles[booking.status] ?? 'bg-slate-100 text-slate-700'
            }`}
          >
            {bookingStatusLabels[booking.status] ?? booking.status}
          </span>
        </div>
        <p className="text-slate-600">
          {booking.table?.name ?? '-'} · {formatTime(booking.start_at)}–{formatTime(booking.end_at)}
          {' · '}
          {booking.user?.name ?? 'Walk-in'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{formatCurrency(booking.total)}</span>
        {actions.map((item) => (
          <button
            key={item.action}
            type="button"
            disabled={pending}
            onClick={() => onAction(item.action)}
            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function toDateTime(value: string): string {
  return value.replace('T', ' ') + ':00'
}
