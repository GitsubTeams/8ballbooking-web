import { useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { formatCurrency } from '@/lib/format'
import { usePricingRuleMutations } from '@/features/owner/hooks'
import type { PricingDayType, Store } from '@/types/booking'

const emptyRule = {
  table_type_id: '',
  day_type: 'weekday' as PricingDayType,
  start_time: '10:00',
  end_time: '22:00',
  price_per_hour: '50000',
}

const dayTypeLabels: Record<PricingDayType, string> = {
  weekday: 'Weekday',
  weekend: 'Weekend',
  holiday: 'Libur',
}

export default function PricingSection({ store }: { store: Store }) {
  const types = store.table_types ?? []
  const rules = store.pricing_rules ?? []
  const { create, remove } = usePricingRuleMutations(store.id)
  const [form, setForm] = useState(emptyRule)

  function add(event: React.FormEvent) {
    event.preventDefault()
    create.mutate(
      {
        table_type_id: form.table_type_id ? Number(form.table_type_id) : null,
        day_type: form.day_type,
        start_time: form.start_time,
        end_time: form.end_time,
        price_per_hour: Number(form.price_per_hour),
      },
      { onSuccess: () => setForm(emptyRule) },
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Aturan harga menimpa harga dasar meja. Tanpa aturan, harga dasar meja dipakai.
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-2">Tipe</th>
              <th className="px-3 py-2">Hari</th>
              <th className="px-3 py-2">Jam</th>
              <th className="px-3 py-2">Harga/Jam</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  {types.find((type) => type.id === rule.table_type_id)?.name ?? 'Semua'}
                </td>
                <td className="px-3 py-2">{dayTypeLabels[rule.day_type]}</td>
                <td className="px-3 py-2">
                  {rule.start_time} – {rule.end_time}
                </td>
                <td className="px-3 py-2">{formatCurrency(rule.price_per_hour)}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => remove.mutate(rule.id)}
                    className="text-rose-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-3 text-slate-500">
                  Belum ada aturan harga.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={add} className="flex flex-wrap items-end gap-2">
        <select
          value={form.table_type_id}
          onChange={(event) => setForm({ ...form, table_type_id: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Semua tipe</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <select
          value={form.day_type}
          onChange={(event) =>
            setForm({ ...form, day_type: event.target.value as PricingDayType })
          }
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="weekday">Weekday</option>
          <option value="weekend">Weekend</option>
          <option value="holiday">Libur</option>
        </select>
        <input
          type="time"
          value={form.start_time}
          onChange={(event) => setForm({ ...form, start_time: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <input
          type="time"
          value={form.end_time}
          onChange={(event) => setForm({ ...form, end_time: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <input
          type="number"
          min={0}
          value={form.price_per_hour}
          onChange={(event) => setForm({ ...form, price_per_hour: event.target.value })}
          className="w-28 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          Tambah Aturan
        </button>
      </form>
      {create.isError && <p className="text-sm text-rose-600">{getErrorMessage(create.error)}</p>}
    </div>
  )
}
