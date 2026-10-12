import { useMutation, useQuery } from '@tanstack/react-query'
import * as storeApi from '@/features/stores/api'
import type { StoreFilters } from '@/features/stores/api'

export function useStores(filters: StoreFilters = {}) {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: () => storeApi.fetchStores(filters),
  })
}

export function useStore(id: number | string | undefined) {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => storeApi.fetchStore(id as number | string),
    enabled: Boolean(id),
  })
}

export function useStoreTables(storeId: number | string | undefined) {
  return useQuery({
    queryKey: ['store', storeId, 'tables'],
    queryFn: () => storeApi.fetchStoreTables(storeId as number | string),
    enabled: Boolean(storeId),
  })
}

export function useAvailability(tableId: number | string | undefined, date: string) {
  return useQuery({
    queryKey: ['availability', tableId, date],
    queryFn: () => storeApi.fetchAvailability(tableId as number | string, date),
    enabled: Boolean(tableId) && Boolean(date),
  })
}

export function useStoreReviews(
  storeId: number | string | undefined,
  params: { page?: number; per_page?: number } = {},
) {
  return useQuery({
    queryKey: ['store', storeId, 'reviews', params],
    queryFn: () => storeApi.fetchStoreReviews(storeId as number | string, params),
    enabled: Boolean(storeId),
  })
}

export function useValidateVoucher(storeId: number | string | undefined) {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      storeApi.validateVoucher(storeId as number | string, code, subtotal),
  })
}
