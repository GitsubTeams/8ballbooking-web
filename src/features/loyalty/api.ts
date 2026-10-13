import { api } from '@/lib/axios'
import type { ApiEnvelope, PaginationMeta } from '@/types/api'
import type { LoyaltySummary, PointTransaction } from '@/types/loyalty'

export async function fetchLoyaltySummary(): Promise<LoyaltySummary> {
  const { data } = await api.get<ApiEnvelope<LoyaltySummary>>('/loyalty')
  return data.data
}

export async function fetchLoyaltyHistory(filters: { page?: number } = {}) {
  const { data } = await api.get<ApiEnvelope<PointTransaction[]> & { meta: PaginationMeta }>(
    '/loyalty/history',
    { params: filters },
  )
  return { transactions: data.data, meta: data.meta }
}