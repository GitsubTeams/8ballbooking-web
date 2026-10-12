import { Link } from 'react-router-dom'
import FavoriteButton from '@/features/favorites/FavoriteButton'
import { useFavorites } from '@/features/favorites/hooks'

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites()
  const stores = data ?? []

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Store Favorit</h1>

      {isLoading && <p className="text-slate-600">Memuat…</p>}

      {!isLoading && stores.length === 0 && (
        <p className="text-slate-600">Belum ada store favorit. Tandai store dengan ikon hati.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <Link
            key={store.id}
            to={`/stores/${store.id}`}
            className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-400 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{store.name}</h2>
              <FavoriteButton storeId={store.id} />
            </div>
            <p className="text-sm text-slate-600">
              {store.city ?? '-'}
              {store.province ? `, ${store.province}` : ''}
            </p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-amber-600">★ {Number(store.rating_avg).toFixed(1)}</span>
              <span className="text-slate-500">{store.rating_count} ulasan</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
