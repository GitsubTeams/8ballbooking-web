import { useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { dayName } from '@/lib/format'
import { emptyOperatingHours, type OperatingHourInput } from '@/features/owner/api'
import { useFacilities, useUpdateStore } from '@/features/owner/hooks'
import type { OperatingHour, Store } from '@/types/booking'

export default function StoreSettingsSection({ store }: { store: Store }) {
  const { data: facilities } = useFacilities()
  const updateStore = useUpdateStore(store.id)

  const [form, setForm] = useState({
    name: store.name,
    address: store.address ?? '',
    city: store.city ?? '',
    province: store.province ?? '',
    phone: store.phone ?? '',
    email: store.email ?? '',
    description: store.description ?? '',
    status: store.status === 'active' ? 'active' : 'pending',
  })
  const [facilityIds, setFacilityIds] = useState<number[]>(
    () => store.facilities?.map((facility) => facility.id) ?? [],
  )
  const [hours, setHours] = useState<OperatingHour[]>(() => withDefaultHours(store))

  function toggleFacility(id: number) {
    setFacilityIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function updateHour(day: number, patch: Partial<OperatingHour>) {
    setHours((current) =>
      current.map((row) => (row.day_of_week === day ? { ...row, ...patch } : row)),
    )
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()

    const operatingHours: OperatingHourInput[] = hours.map((row) => ({
      day_of_week: row.day_of_week,
      open_time: row.open_time,
      close_time: row.close_time,
      is_closed: row.is_closed,
    }))

    updateStore.mutate(
      {
        ...form,
        province: form.province || null,
        phone: form.phone || null,
        email: form.email || null,
        description: form.description || null,
        status: form.status as 'active' | 'pending',
        facility_ids: facilityIds,
        operating_hours: operatingHours,
      },
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <Field label="Nama" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Kota" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        <Field label="Provinsi" value={form.province} onChange={(v) => setForm({ ...form, province: v })} />
        <Field label="Telepon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            <option value="pending">Draft (belum tayang)</option>
            <option value="active">Aktif (tayang)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Alamat</label>
          <textarea
            rows={2}
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Deskripsi</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium">Fasilitas</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {facilities?.map((facility) => (
            <button
              key={facility.id}
              type="button"
              onClick={() => toggleFacility(facility.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                facilityIds.includes(facility.id)
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 text-slate-700'
              }`}
            >
              {facility.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium">Jam Operasional</p>
        <div className="mt-2 space-y-2">
          {hours.map((row) => (
            <div key={row.day_of_week} className="flex flex-wrap items-center gap-3 text-sm">
              <span className="w-20 text-slate-700">{dayName(row.day_of_week)}</span>
              <input
                type="time"
                value={row.open_time ?? ''}
                disabled={row.is_closed}
                onChange={(event) => updateHour(row.day_of_week, { open_time: event.target.value })}
                className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-50"
              />
              <span className="text-slate-400">–</span>
              <input
                type="time"
                value={row.close_time ?? ''}
                disabled={row.is_closed}
                onChange={(event) => updateHour(row.day_of_week, { close_time: event.target.value })}
                className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-50"
              />
              <label className="flex items-center gap-1 text-slate-600">
                <input
                  type="checkbox"
                  checked={row.is_closed}
                  onChange={(event) => updateHour(row.day_of_week, { is_closed: event.target.checked })}
                />
                Tutup
              </label>
            </div>
          ))}
        </div>
      </div>

      {updateStore.isError && (
        <p className="text-sm text-rose-600">{getErrorMessage(updateStore.error)}</p>
      )}
      {updateStore.isSuccess && <p className="text-sm text-emerald-600">Perubahan tersimpan.</p>}

      <button
        type="submit"
        disabled={updateStore.isPending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {updateStore.isPending ? 'Menyimpan…' : 'Simpan Perubahan'}
      </button>
    </form>
  )
}

function withDefaultHours(store: Store): OperatingHour[] {
  const defaults = () =>
    emptyOperatingHours().map((row) => ({ ...row }))

  if (!store.operating_hours || store.operating_hours.length === 0) {
    return defaults()
  }

  return defaults().map((row) => {
    const existing = store.operating_hours?.find((hour) => hour.day_of_week === row.day_of_week)
    return existing ? { ...row, ...existing } : row
  })
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />
    </div>
  )
}
