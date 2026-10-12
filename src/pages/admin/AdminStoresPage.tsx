import { useState } from 'react'
import { formatDateTime } from '@/lib/format'
import type { AdminStoreAction } from '@/features/admin/api'
import { useAdminStoreMutations, useAdminStores } from '@/features/admin/hooks'
import type { StoreStatus } from '@/types/booking'

interface Filters {
  q: string
  status: string
  city: string
  page: number
}

const emptyFilters: Filters = { q: '', status: '', city: '', page: 1 }

const statusLabels: Record<StoreStatus, string> = {
  active: 'Aktif',
  pending: 'Menunggu',
  suspended: 'Ditangguhkan',
  rejected: 'Ditolak',
}

const statusStyles: Record<StoreStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  suspended: 'bg-slate-200 text-slate-700',
  rejected: 'bg-rose-100 text-rose-800',
}

const actionsFor: Record<StoreStatus, { action: AdminStoreAction; label: string }[]> = {
  pending: [
    { action: 'approve', label: 'Setujui' },
    { action: 'reject', label: 'Tolak' },
  ],
  rejected: [{ action: 'approve', label: 'Setujui' }],
  active: [{ action: 'suspend', label: 'Tangguhkan' }],
  suspended: [
    { action: 'reactivate', label: 'Aktifkan' },
    { action: 'reject', label: 'Tolak' },
  ],
}

export default function AdminStoresPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const { transition } = useAdminStoreMutations()

  const { data, isLoading } = useAdminStores({
    q: filters.q || undefined,
    status: filters.status || undefined,
    city: filters.city || undefined,
    page: filters.page,
  })

  const stores = data?.stores ?? []
  const meta = data?.meta

  const setFilter = (patch: Partial<Filters>) =>
    setFilters((current) => ({ ...current, ...patch, page: 1 }))

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Tenant</h1>

      <div className="flex flex-wrap gap-2">
        <input
          value={filters.q}
          onChange={(event) => setFilter({ q: event.target.value })}
          placeholder="Cari nama / owner…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <input
          value={filters.city}
          onChange={(event) => setFilter({ city: event.target.value })}
          placeholder="Kota"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilter({ status: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Semua status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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

      {!isLoading && stores.length === 0 && (
        <p className="text-sm text-slate-500">Tidak ada store yang cocok.</p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-2">Store</th>
              <th className="px-3 py-2">Kota</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Meja</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Diajukan</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{store.name}</td>
                <td className="px-3 py-2">{store.city ?? '-'}</td>
                <td className="px-3 py-2">
                  <div className="text-slate-700">{store.owner?.name ?? '-'}</div>
                  <div className="text-xs text-slate-500">{store.owner?.email ?? ''}</div>
                </td>
                <td className="px-3 py-2">{store.tables_count}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${statusStyles[store.status]}`}
                  >
                    {statusLabels[store.status]}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-500">{formatDateTime(store.created_at)}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    {actionsFor[store.status].map((item) => (
                      <button
                        key={item.action}
                        type="button"
                        disabled={transition.isPending}
                        onClick={() => transition.mutate({ id: store.id, action: item.action })}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
