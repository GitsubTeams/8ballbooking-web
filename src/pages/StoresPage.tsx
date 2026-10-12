import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FavoriteButton from '@/features/favorites/FavoriteButton'
import { useStores } from '@/features/stores/hooks'

export default function StoresPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [term, setTerm] = useState(searchParams.get('q') ?? '')
  const q = searchParams.get('q') ?? undefined

  const { data, isLoading, isError } = useStores({ q, per_page: 20 })

  function onSearch(event: React.FormEvent) {
    event.preventDefault()
    setSearchParams(term ? { q: term } : {})
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Temukan Meja</h1>
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Cari nama atau kota…"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Cari
          </button>
        </form>
      </div>

      {isLoading && <p className="text-slate-600">Memuat…</p>}
      {isError && <p className="text-rose-600">Gagal memuat daftar store.</p>}

      {data && data.stores.length === 0 && (
        <p className="text-slate-600">Belum ada store yang cocok.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.stores.map((store) => (
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
