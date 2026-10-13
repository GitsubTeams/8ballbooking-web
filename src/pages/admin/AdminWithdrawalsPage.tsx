import { useState } from 'react'
import { formatCurrency, formatDateTime } from '@/lib/format'
import { useAdminWithdrawalMutations, useAdminWithdrawals } from '@/features/admin/hooks'
import type { AdminWithdrawalAction } from '@/features/admin/api'
import type { Withdrawal, WithdrawalStatus } from '@/types/withdrawal'

const statusLabels: Record<WithdrawalStatus, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  paid: 'Dibayar',
}

const statusStyles: Record<WithdrawalStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-sky-100 text-sky-800',
  rejected: 'bg-rose-100 text-rose-800',
  paid: 'bg-emerald-100 text-emerald-800',
}

const actionsFor: Record<WithdrawalStatus, AdminWithdrawalAction[]> = {
  pending: ['approve', 'reject'],
  approved: ['mark-paid'],
  rejected: [],
  paid: [],
}

const actionLabels: Record<AdminWithdrawalAction, string> = {
  approve: 'Setujui',
  reject: 'Tolak',
  'mark-paid': 'Tandai Dibayar',
}

const actionStyles: Record<AdminWithdrawalAction, string> = {
  approve: 'border-sky-300 text-sky-700 hover:bg-sky-50',
  reject: 'border-rose-300 text-rose-700 hover:bg-rose-50',
  'mark-paid': 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
}

interface Filters {
  status: WithdrawalStatus | ''
  page: number
}

const emptyFilters: Filters = { status: '', page: 1 }

export default function AdminWithdrawalsPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const { transition } = useAdminWithdrawalMutations()

  const { data, isLoading } = useAdminWithdrawals({
    status: filters.status || undefined,
    page: filters.page,
  })

  const withdrawals = data?.withdrawals ?? []
  const meta = data?.meta

  const setFilter = (patch: Partial<Filters>) =>
    setFilters((current) => ({ ...current, ...patch, page: 1 }))

  const handleAction = (withdrawal: Withdrawal, action: AdminWithdrawalAction) => {
    transition.mutate({ id: withdrawal.id, action })
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Penarikan Owner</h1>

      <div className="flex flex-wrap gap-2">
        <select
          value={filters.status}
          onChange={(event) =>
            setFilter({ status: event.target.value as WithdrawalStatus | '' })
          }
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="">Semua status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {filters.status !== '' && (
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

      {!isLoading && withdrawals.length === 0 && (
        <p className="text-sm text-slate-500">Tidak ada penarikan yang cocok.</p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-2">Store</th>
              <th className="px-3 py-2">Pemohon</th>
              <th className="px-3 py-2">Rekening</th>
              <th className="px-3 py-2">Jumlah</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Diajukan</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{withdrawal.store?.name ?? '-'}</td>
                <td className="px-3 py-2">{withdrawal.requester?.name ?? '-'}</td>
                <td className="px-3 py-2">
                  <div className="text-slate-700">{withdrawal.bank_name}</div>
                  <div className="text-xs text-slate-500">
                    {withdrawal.account_number} · {withdrawal.account_name}
                  </div>
                </td>
                <td className="px-3 py-2 font-medium">{formatCurrency(withdrawal.amount)}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusStyles[withdrawal.status]}`}>
                    {statusLabels[withdrawal.status]}
                  </span>
                  {withdrawal.note && (
                    <div className="mt-1 text-xs text-slate-500">{withdrawal.note}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-slate-500">
                  {formatDateTime(withdrawal.created_at)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    {actionsFor[withdrawal.status].map((action) => (
                      <button
                        key={action}
                        type="button"
                        disabled={transition.isPending}
                        onClick={() => handleAction(withdrawal, action)}
                        className={`rounded-md border px-3 py-1 text-xs font-medium disabled:opacity-60 ${actionStyles[action]}`}
                      >
                        {actionLabels[action]}
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