import { Link } from 'react-router-dom'
import { useStores } from '@/features/stores/hooks'
import { formatCurrency } from '@/lib/format'

export default function HomePage() {
  const { data } = useStores({ per_page: 6 })
  const stores = data?.stores ?? []

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Booking meja biliard jadi lebih mudah
        </h1>
        <p className="max-w-2xl text-slate-600">
          Cari store terdekat, lihat ketersediaan meja secara real-time, dan pesan slot dalam
          hitungan detik.
        </p>
        <div className="flex gap-3">
          <Link
            to="/stores"
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            Cari Meja
          </Link>
          <Link
            to="/register"
            className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>

      {stores.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Store Populer</h2>
            <Link to="/stores" className="text-sm text-slate-500 hover:text-slate-900">
              Lihat semua
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => {
              const cheapest = store.tables?.length
                ? Math.min(...store.tables.map((table) => Number(table.price_per_hour)))
                : null

              return (
                <Link
                  key={store.id}
                  to={`/stores/${store.id}`}
                  className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-400 hover:shadow-sm"
                >
                  <h3 className="font-semibold">{store.name}</h3>
                  <p className="text-sm text-slate-600">{store.city ?? '-'}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-amber-600">★ {Number(store.rating_avg).toFixed(1)}</span>
                    {cheapest !== null ? (
                      <span className="text-slate-500">
                        dari {formatCurrency(cheapest)}/jam
                      </span>
                    ) : (
                      <span className="text-slate-400">Belum ada meja</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
