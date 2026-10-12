import { bookingStatusLabels, formatCurrency, formatDateTime } from '@/lib/format'
import { useAdminOverview } from '@/features/admin/hooks'

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminOverview()

  if (isLoading) {
    return <p className="text-slate-600">Memuat…</p>
  }

  if (isError || !data) {
    return <p className="text-rose-600">Gagal memuat data.</p>
  }

  const cards = [
    { label: 'GMV', value: formatCurrency(data.gmv) },
    { label: 'Revenue Platform', value: formatCurrency(data.platform_revenue) },
    { label: 'Total Booking', value: data.bookings_total },
    { label: 'Booking Hari Ini', value: data.bookings_today },
    { label: 'Store Aktif', value: data.stores.active },
    { label: 'Store Pending', value: data.stores.pending },
    { label: 'Total User', value: data.users_total },
    { label: 'Store Owner', value: data.owners_total },
  ]

  const maxTrend = Math.max(1, ...data.trend.map((item) => item.bookings))

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Platform</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className="mt-1 text-xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Store Teratas (GMV)</h2>
          <div className="space-y-2 text-sm">
            {data.top_stores.map((store) => (
              <div key={store.id} className="flex items-center justify-between">
                <span className="text-slate-700">{store.name}</span>
                <span className="font-medium">{formatCurrency(store.gmv)}</span>
              </div>
            ))}
            {data.top_stores.length === 0 && (
              <p className="text-slate-500">Belum ada transaksi.</p>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Booking 14 Hari Terakhir</h2>
          <div className="flex h-32 items-end gap-1">
            {data.trend.map((item) => (
              <div key={item.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-slate-900"
                  style={{ height: `${(item.bookings / maxTrend) * 100}%` }}
                  title={`${item.date}: ${item.bookings}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{data.trend[0]?.date}</span>
            <span>{data.trend[data.trend.length - 1]?.date}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">Booking Terbaru</h2>
        <div className="space-y-2 text-sm">
          {data.recent_bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{booking.code}</span>
                <span className="text-slate-500"> · {booking.store?.name ?? '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span>{formatDateTime(booking.start_at)}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  {bookingStatusLabels[booking.status] ?? booking.status}
                </span>
              </div>
            </div>
          ))}
          {data.recent_bookings.length === 0 && <p className="text-slate-500">Belum ada booking.</p>}
        </div>
      </div>
    </section>
  )
}
