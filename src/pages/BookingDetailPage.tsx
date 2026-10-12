import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getErrorMessage } from '@/lib/errors'
import {
  bookingStatusLabels,
  bookingStatusStyles,
  formatCurrency,
  formatDateTime,
  formatTime,
  toDateInput,
} from '@/lib/format'
import SlotGrid from '@/features/bookings/SlotGrid'
import ReviewForm from '@/features/bookings/ReviewForm'
import { toggleSlotSelection } from '@/features/bookings/slotSelection'
import { useBooking, useCancelBooking, useRescheduleBooking } from '@/features/bookings/hooks'
import PaymentSection from '@/features/payments/PaymentSection'
import { useAvailability } from '@/features/stores/hooks'

const TODAY = toDateInput(new Date())

export default function BookingDetailPage() {
  const { id } = useParams()
  const { data: booking, isLoading, isError } = useBooking(id)
  const cancelBooking = useCancelBooking()
  const rescheduleBooking = useRescheduleBooking()

  const [showReschedule, setShowReschedule] = useState(false)
  const [date, setDate] = useState(TODAY)
  const [selected, setSelected] = useState<number[]>([])

  const availability = useAvailability(
    showReschedule ? booking?.table_id : undefined,
    date,
  )
  const slots = availability.data?.slots ?? []

  if (isLoading) {
    return <p className="text-slate-600">Memuat…</p>
  }

  if (isError || !booking) {
    return <p className="text-rose-600">Booking tidak ditemukan.</p>
  }

  const cancellable = ['pending', 'confirmed'].includes(booking.status)

  const bookingId = booking.id

  function submitReschedule() {
    if (selected.length === 0) {
      return
    }

    const sorted = [...selected].sort((a, b) => a - b)
    const start = slots[sorted[0]]
    const end = slots[sorted[sorted.length - 1]]

    rescheduleBooking.mutate(
      { id: bookingId, startAt: start.start_at, endAt: end.end_at },
      {
        onSuccess: () => {
          setShowReschedule(false)
          setSelected([])
        },
      },
    )
  }

  return (
    <section className="space-y-6">
      <Link to="/bookings" className="text-sm text-slate-500 hover:text-slate-900">
        ← Booking saya
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{booking.code}</h1>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            bookingStatusStyles[booking.status] ?? 'bg-slate-100 text-slate-700'
          }`}
        >
          {bookingStatusLabels[booking.status] ?? booking.status}
        </span>
      </div>

      <dl className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <Detail label="Store" value={booking.store?.name ?? '-'} />
        <Detail label="Meja" value={booking.table?.name ?? '-'} />
        <Detail label="Tanggal" value={formatDateTime(booking.start_at)} />
        <Detail
          label="Waktu"
          value={`${formatTime(booking.start_at)} – ${formatTime(booking.end_at)}`}
        />
        <Detail label="Durasi" value={`${booking.duration_minutes} menit`} />
        <Detail label="Subtotal" value={formatCurrency(booking.subtotal)} />
        <Detail label="Diskon" value={formatCurrency(booking.discount)} />
        <Detail label="Pajak" value={formatCurrency(booking.tax)} />
        <Detail label="Total" value={formatCurrency(booking.total)} />
        <Detail label="Status Pembayaran" value={booking.payment_status} />
      </dl>

      {booking.notes && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium">Catatan</p>
          <p className="text-sm text-slate-600">{booking.notes}</p>
        </div>
      )}

      {booking.cancel_reason && (
        <p className="text-sm text-rose-600">Alasan batal: {booking.cancel_reason}</p>
      )}

      <PaymentSection booking={booking} />

      {cancelBooking.isError && (
        <p className="text-sm text-rose-600">{getErrorMessage(cancelBooking.error)}</p>
      )}

      {cancellable && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setShowReschedule((value) => !value)
              setSelected([])
            }}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {showReschedule ? 'Batal Jadwal Ulang' : 'Jadwalkan Ulang'}
          </button>
          <button
            type="button"
            onClick={() =>
              cancelBooking.mutate({ id: booking.id, reason: 'Dibatalkan oleh pengguna' })
            }
            disabled={cancelBooking.isPending}
            className="rounded-md border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
          >
            {cancelBooking.isPending ? 'Memproses…' : 'Batalkan Booking'}
          </button>
        </div>
      )}

      {showReschedule && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Pilih Jadwal Baru</h2>
          <input
            type="date"
            value={date}
            min={TODAY}
            onChange={(event) => {
              setDate(event.target.value)
              setSelected([])
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <SlotGrid
            slots={slots}
            selected={selected}
            loading={availability.isLoading}
            onToggle={(index) => setSelected((current) => toggleSlotSelection(current, index))}
          />

          {rescheduleBooking.isError && (
            <p className="text-sm text-rose-600">{getErrorMessage(rescheduleBooking.error)}</p>
          )}

          <button
            type="button"
            onClick={submitReschedule}
            disabled={selected.length === 0 || rescheduleBooking.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {rescheduleBooking.isPending ? 'Memproses…' : 'Simpan Jadwal Baru'}
          </button>
        </div>
      )}

      {booking.status === 'completed' && (
        <ReviewForm bookingId={booking.id} review={booking.review} />
      )}
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 sm:flex-col sm:justify-start sm:gap-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  )
}
