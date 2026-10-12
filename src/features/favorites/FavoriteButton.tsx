import { useFavorites, useToggleFavorite } from '@/features/favorites/hooks'
import { useAuthStore } from '@/stores/auth'

export default function FavoriteButton({ storeId }: { storeId: number }) {
  const token = useAuthStore((state) => state.token)
  const favorites = useFavorites(Boolean(token))
  const toggle = useToggleFavorite()

  if (!token) {
    return null
  }

  const isFavorite = (favorites.data ?? []).some((store) => store.id === storeId)

  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle.mutate({ storeId, isFavorite })
      }}
      disabled={toggle.isPending}
      className={`text-lg leading-none transition-colors disabled:opacity-60 ${
        isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'
      }`}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}
