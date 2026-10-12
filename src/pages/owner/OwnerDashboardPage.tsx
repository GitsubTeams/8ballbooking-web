import { Link } from 'react-router-dom'
import { formatCurrency } from '@/lib/format'
import { useOwnerSummary } from '@/features/owner/hooks'

export default function OwnerDashboardPage() {
  const { data, isLoading } = useOwnerSummary()

  const cards = [
    { label: 'Store', value: data?.stores ?? 0, to: '/owner/stores' },
    { label: 'Total Meja', value: data?.tables ?? 0, to: '/owner/stores' },
    { label: 'Booking Hari Ini', value: data?.bookings_today ?? 0, to: '' },
    { label: 'Booking Akan Datang', value: data?.upcoming ?? 0, to: '' },
  ]

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ringkasan Owner</h1>
        <Link
          to="/owner/stores"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Kelola Store
        </Link>
      </div>

      {isLoading ? (
        <p className="text-slate-600">Memuat…</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Pendapatan Hari Ini</p>
            <p className="mt-1 text-3xl font-bold">{formatCurrency(data?.revenue_today ?? 0)}</p>
            <p className="mt-1 text-xs text-slate-400">
              Dihitung dari booking berstatus terkonfirmasi, berjalan, dan selesai.
            </p>
          </div>
        </>
      )}
    </section>
  )
}
