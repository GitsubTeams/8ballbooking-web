import { api } from '@/lib/axios'
import type { ApiEnvelope } from '@/types/api'
import type { Store } from '@/types/booking'

export async function fetchFavorites(): Promise<Store[]> {
  const { data } = await api.get<ApiEnvelope<Store[]>>('/favorites')
  return data.data
}

export async function addFavorite(storeId: number | string): Promise<void> {
  await api.post(`/stores/${storeId}/favorite`)
}

export async function removeFavorite(storeId: number | string): Promise<void> {
  await api.delete(`/stores/${storeId}/favorite`)
}
