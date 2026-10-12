import { formatTime } from '@/lib/format'
import type { AvailabilitySlot } from '@/types/booking'

export default function SlotGrid({
  slots,
  selected,
  onToggle,
  loading,
}: {
  slots: AvailabilitySlot[]
  selected: number[]
  onToggle: (index: number) => void
  loading?: boolean
}) {
  if (loading) {
    return <p className="text-sm text-slate-500">Memuat slot…</p>
  }

  if (slots.length === 0) {
    return <p className="text-sm text-slate-500">Store tutup pada tanggal ini.</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((slot, index) => {
        const isSelected = selected.includes(index)
        return (
          <button
            key={slot.start_at}
            type="button"
            disabled={!slot.available}
            onClick={() => onToggle(index)}
            className={`rounded-md border px-2 py-2 text-xs ${
              !slot.available
                ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400'
                : isSelected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {formatTime(slot.start_at)}
          </button>
        )
      })}
    </div>
  )
}
