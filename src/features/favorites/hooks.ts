import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as favoriteApi from '@/features/favorites/api'
import { getErrorMessage } from '@/lib/errors'
import { toast } from '@/stores/toast'

export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteApi.fetchFavorites,
    enabled,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ storeId, isFavorite }: { storeId: number; isFavorite: boolean }) =>
      isFavorite ? favoriteApi.removeFavorite(storeId) : favoriteApi.addFavorite(storeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast.success(variables.isFavorite ? 'Dihapus dari favorit.' : 'Ditambahkan ke favorit.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
