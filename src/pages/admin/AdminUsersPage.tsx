import { useState } from 'react'
import { formatDateTime } from '@/lib/format'
import { useAdminUserMutations, useAdminUsers } from '@/features/admin/hooks'
import type { UserStatus } from '@/types/admin'

interface Filters {
  q: string
  role: string
  status: string
  page: number
}

const emptyFilters: Filters = { q: '', role: '', status: '', page: 1 }

const roleOptions = ['user', 'store_staff', 'store_owner', 'super_admin'] as const

const roleLabels: Record<string, string> = {
  user: 'Customer',
  store_staff: 'Staf Toko',
  store_owner: 'Pemilik Toko',
  super_admin: 'Super Admin',
}

const statusLabels: Record<UserStatus, string> = {
  active: 'Aktif',
  inactive: 'Nonaktif',
  banned: 'Diblokir',
}

const statusStyles: Record<UserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-slate-200 text-slate-700',
  banned: 'bg-rose-100 text-rose-800',
}

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const { updateRoles, updateStatus } = useAdminUserMutations()

  const { data, isLoading } = useAdminUsers({
    q: filters.q || undefined,
    role: filters.role || undefined,
    status: filters.status || undefined,
    page: filters.page,
  })

  const users = data?.users ?? []
  const meta = data?.meta
  const busy = updateRoles.isPending || updateStatus.isPending

  const setFilter = (patch: Partial<Filters>) =>
    setFilters((current) => ({ ...current, ...patch, page: 1 }))

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>

      <div className="flex flex-wrap gap-2">
        <input
          value={filters.q}
          onChange={(event) => setFilter({ q: event.target.value })}
          placeholder="Cari nama / email…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <select
          value={filters.role}
          onChange={(event) => setFilter({ role: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Semua role</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>
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

      {!isLoading && users.length === 0 && (
        <p className="text-sm text-slate-500">Tidak ada pengguna yang cocok.</p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-2">Pengguna</th>
              <th className="px-3 py-2">Store</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Terdaftar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-3 py-2">{user.stores_count}</td>
                <td className="px-3 py-2">
                  <select
                    value={user.roles[0] ?? 'user'}
                    disabled={busy}
                    onChange={(event) =>
                      updateRoles.mutate({ id: user.id, roles: [event.target.value] })
                    }
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${statusStyles[user.status]}`}
                    >
                      {statusLabels[user.status]}
                    </span>
                    <select
                      value={user.status}
                      disabled={busy}
                      onChange={(event) =>
                        updateStatus.mutate({
                          id: user.id,
                          status: event.target.value as UserStatus,
                        })
                      }
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-500">{formatDateTime(user.created_at)}</td>
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
