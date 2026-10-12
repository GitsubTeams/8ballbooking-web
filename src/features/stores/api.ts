import { api } from '@/lib/axios'
import type { ApiEnvelope, PaginationMeta } from '@/types/api'
import type { Availability, Review, Store, Table } from '@/types/booking'
import type { VoucherValidation } from '@/types/voucher'

export interface StoreFilters {
  q?: string
  city?: string
  page?: number
  per_page?: number
}

export async function fetchStores(filters: StoreFilters = {}) {
  const { data } = await api.get<ApiEnvelope<Store[]> & { meta: PaginationMeta }>('/stores', {
    params: filters,
  })
  return { stores: data.data, meta: data.meta }
}

export async function fetchStore(id: number | string): Promise<Store> {
  const { data } = await api.get<ApiEnvelope<Store>>(`/stores/${id}`)
  return data.data
}

export async function fetchStoreTables(storeId: number | string): Promise<Table[]> {
  const { data } = await api.get<ApiEnvelope<Table[]>>(`/stores/${storeId}/tables`)
  return data.data
}

export async function fetchAvailability(
  tableId: number | string,
  date: string,
): Promise<Availability> {
  const { data } = await api.get<ApiEnvelope<Availability>>(`/tables/${tableId}/availability`, {
    params: { date },
  })
  return data.data
}

export async function fetchStoreReviews(
  storeId: number | string,
  params: { page?: number; per_page?: number } = {},
) {
  const { data } = await api.get<ApiEnvelope<Review[]> & { meta: PaginationMeta }>(
    `/stores/${storeId}/reviews`,
    { params },
  )
  return { reviews: data.data, meta: data.meta }
}

export async function validateVoucher(
  storeId: number | string,
  code: string,
  subtotal: number,
): Promise<VoucherValidation> {
  const { data } = await api.post<ApiEnvelope<VoucherValidation>>(
    `/stores/${storeId}/vouchers/validate`,
    { code, subtotal },
  )
  return data.data
}
