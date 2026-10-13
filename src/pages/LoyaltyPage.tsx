import { useState } from 'react'
import { formatDateTime } from '@/lib/format'
import { useLoyaltyHistory, useLoyaltySummary } from '@/features/loyalty/hooks'
import type { PointTransaction } from '@/types/loyalty'

const pointTypeStyles: Record<PointTransaction['type'], string> = {
  earn: 'bg-emerald-100 text-emerald-800',
  redeem: 'bg-rose-100 text-rose-800',
  adjust: 'bg-sky-100 text-sky-800',
}

const pointTypeLabel = (transaction: PointTransaction) => {
  if (transaction.points > 0) {
    return `+${transaction.points}`
  }
  return `${transaction.points}`
}

export default function LoyaltyPage() {
  const [page, setPage] = useState(1)
  const summary = useLoyaltySummary()
  const { data, isLoading } = useLoyaltyHistory({ page })

  const meta = data?.meta
  const transactions = data?.transactions ?? []

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Poin Saya</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-violet-200 bg-white p-4">
          <p className="text-sm text-violet-600">Saldo Poin</p>
          <p className="mt-1 text-3xl font-bold">{summary.data?.balance ?? 0}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-sm text-emerald-600">Poin Didapat</p>
          <p className="mt-1 text-3xl font-bold">{summary.data?.lifetime_earned ?? 0}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-4">
          <p className="text-sm text-amber-600">Poin Ditukar</p>
          <p className="mt-1 text-3xl font-bold">{summary.data?.lifetime_redeemed ?? 0}</p>
        </div>
      </div>

      {summary.data && (
        <p className="text-sm text-slate-500">
          Dapatkan {summary.data.point_value} poin per Rp{summary.data.earn_per_currency.toLocaleString('id-ID')}{' '}
          pembayaran. Tukarkan minimal {summary.data.min_redeem_points} poin untuk potongan harga maksimal{' '}
          {summary.data.max_redeem_percent}% dari subtotal saat booking.
        </p>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Riwayat Poin</h2>

        {isLoading && <p className="text-slate-600">Memuat…</p>}

        {!isLoading && transactions.length === 0 && (
          <p className="text-sm text-slate-500">Belum ada transaksi poin.</p>
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2">Jenis</th>
                <th className="px-3 py-2">Deskripsi</th>
                <th className="px-3 py-2">Poin</th>
                <th className="px-3 py-2">Saldo Setelah</th>
                <th className="px-3 py-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        pointTypeStyles[transaction.type] ?? 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {transaction.type_label}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{transaction.description ?? '-'}</td>
                  <td
                    className={`px-3 py-2 font-medium ${
                      transaction.points > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {pointTypeLabel(transaction)}
                  </td>
                  <td className="px-3 py-2">{transaction.balance_after}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">
                    {formatDateTime(transaction.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="mt-4 flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-slate-500">
              Halaman {meta.current_page} / {meta.last_page}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= meta.last_page}
              className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>
    </section>
  )
}