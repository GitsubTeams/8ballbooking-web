import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from '@/lib/errors'
import { dayName, formatCurrency, toDateInput } from '@/lib/format'
import SlotGrid from '@/features/bookings/SlotGrid'
import { toggleSlotSelection } from '@/features/bookings/slotSelection'
import { useCreateBooking } from '@/features/bookings/hooks'
import FavoriteButton from '@/features/favorites/FavoriteButton'
import ReviewSection from '@/features/stores/ReviewSection'
import { useAvailability, useStore, useValidateVoucher } from '@/features/stores/hooks'
import { useAuthStore } from '@/stores/auth'
import type { VoucherValidation } from '@/types/voucher'

const TODAY = toDateInput(new Date())

export default function StoreDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)

  const { data: store, isLoading, isError } = useStore(id)
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [date, setDate] = useState(TODAY)
  const [selected, setSelected] = useState<number[]>([])
  const [notes, setNotes] = useState('')
  const [voucherCode, setVoucherCode] = useState('')
  const [applied, setApplied] = useState<VoucherValidation | null>(null)

  const tables = useMemo(
    () => (store?.tables ?? []).filter((table) => table.status === 'available'),
    [store],
  )

  const tableId = selectedTableId ?? tables[0]?.id ?? null
  const availability = useAvailability(tableId ?? undefined, date)
  const slots = availability.data?.slots ?? []
  const slotMinutes = availability.data?.slot_minutes ?? 60

  const createBooking = useCreateBooking()
  const validateVoucher = useValidateVoucher(store?.id)

  const estimate = selected.reduce((total, index) => {
    const slot = slots[index]
    return slot ? total + Number(slot.price_per_hour) * (slotMinutes / 60) : total
  }, 0)

  const discount = applied ? Math.min(Number(applied.discount), estimate) : 0
  const total = Math.max(0, estimate - discount)

  function resetVoucher() {
    setApplied(null)
  }

  function applyVoucher() {
    if (!voucherCode.trim()) {
      return
    }

    validateVoucher.mutate(
      { code: voucherCode.trim(), subtotal: estimate },
      {
        onSuccess: (data) => setApplied(data),
        onError: () => setApplied(null),
      },
    )
  }

  function submit() {
    if (!tableId || selected.length === 0) {
      return
    }

    const sorted = [...selected].sort((a, b) => a - b)
    const start = slots[sorted[0]]
    const end = slots[sorted[sorted.length - 1]]

    createBooking.mutate(
      {
        table_id: tableId,
        start_at: start.start_at,
        end_at: end.end_at,
        notes: notes || null,
        voucher_code: applied?.voucher.code ?? null,
      },
      { onSuccess: (booking) => navigate(`/bookings/${booking.id}`) },
    )
  }

  if (isLoading) {
    return <p className="text-slate-600">Memuat…</p>
  }

  if (isError || !store) {
    return <p className="text-rose-600">Store tidak ditemukan.</p>
  }

  return (
    <section className="space-y-6">
      <Link to="/stores" className="text-sm text-slate-500 hover:text-slate-900">
        ← Kembali
      </Link>

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <FavoriteButton storeId={store.id} />
        </div>
        <p className="text-slate-600">
          {store.address ?? '-'} · {store.city ?? '-'}
        </p>
        <p className="text-sm text-slate-500">
          ★ {Number(store.rating_avg).toFixed(1)} ({store.rating_count} ulasan)
          {store.phone ? ` · ${store.phone}` : ''}
        </p>
        {store.description && <p className="text-sm text-slate-500">{store.description}</p>}
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-semibold">Pilih Meja</h2>
            {tables.length === 0 && <p className="text-sm text-slate-500">Tidak ada meja tersedia.</p>}
            <div className="flex flex-wrap gap-2">
              {tables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => {
                    setSelectedTableId(table.id)
                    setSelected([])
                    resetVoucher()
                  }}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    tableId === table.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {table.name} · {formatCurrency(table.price_per_hour)}/jam
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="date">
              Tanggal
            </label>
            <input
              id="date"
              type="date"
              value={date}
              min={TODAY}
              onChange={(event) => {
                setDate(event.target.value)
                setSelected([])
                resetVoucher()
              }}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
            <p className="text-xs text-slate-500">{dayName(new Date(`${date}T00:00:00`).getDay())}</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Pilih Slot</h2>
            <SlotGrid
              slots={slots}
              selected={selected}
              loading={availability.isLoading}
              onToggle={(index) => {
                setSelected((current) => toggleSlotSelection(current, index))
                resetVoucher()
              }}
            />
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Ringkasan</h2>
          <div className="space-y-1 text-sm text-slate-600">
            <p>Meja: {tables.find((table) => table.id === tableId)?.name ?? '-'}</p>
            <p>Slot terpilih: {selected.length}</p>
            <p>Durasi: {(selected.length * slotMinutes) / 60} jam</p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                value={voucherCode}
                onChange={(event) => {
                  setVoucherCode(event.target.value.toUpperCase())
                  resetVoucher()
                }}
                placeholder="Kode voucher"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase outline-none focus:border-slate-900"
              />
              <button
                type="button"
                onClick={applyVoucher}
                disabled={!voucherCode.trim() || estimate === 0 || validateVoucher.isPending}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-60"
              >
                Terapkan
              </button>
            </div>
            {validateVoucher.isError && (
              <p className="text-sm text-rose-600">{getErrorMessage(validateVoucher.error)}</p>
            )}
            {applied && (
              <p className="text-sm text-emerald-600">
                Voucher {applied.voucher.code} diterapkan.
              </p>
            )}
          </div>

          <div className="space-y-1 border-t border-slate-200 pt-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Estimasi</span>
              <span>{formatCurrency(estimate)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-600">
                <span>Diskon</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total</span>
              <span className="text-lg font-semibold text-slate-900">{formatCurrency(total)}</span>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Catatan (opsional)"
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />

          {createBooking.isError && (
            <p className="text-sm text-rose-600">{getErrorMessage(createBooking.error)}</p>
          )}

          {token ? (
            <button
              type="button"
              onClick={submit}
              disabled={selected.length === 0 || createBooking.isPending}
              className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {createBooking.isPending ? 'Memproses…' : 'Booking Sekarang'}
            </button>
          ) : (
            <Link
              to="/login"
              className="block w-full rounded-md bg-slate-900 px-4 py-2 text-center font-medium text-white hover:bg-slate-700"
            >
              Masuk untuk booking
            </Link>
          )}
        </aside>
      </div>

      {store.facilities && store.facilities.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">Fasilitas</h2>
          <div className="flex flex-wrap gap-2">
            {store.facilities.map((facility) => (
              <span
                key={facility.id}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
              >
                {facility.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {store.operating_hours && store.operating_hours.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">Jam Operasional</h2>
          <div className="grid gap-1 text-sm sm:grid-cols-2">
            {store.operating_hours
              .slice()
              .sort((a, b) => a.day_of_week - b.day_of_week)
              .map((hour) => (
                <div
                  key={hour.day_of_week}
                  className="flex justify-between border-b border-slate-100 py-1"
                >
                  <span className="text-slate-600">{dayName(hour.day_of_week)}</span>
                  <span className="text-slate-900">
                    {hour.is_closed
                      ? 'Tutup'
                      : `${hour.open_time.slice(0, 5)} – ${hour.close_time.slice(0, 5)}`}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      <ReviewSection storeId={store.id} />
    </section>
  )
}
