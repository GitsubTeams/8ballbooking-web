import { useQuery } from '@tanstack/react-query'
import * as loyaltyApi from '@/features/loyalty/api'

export function useLoyaltySummary() {
  return useQuery({ queryKey: ['loyalty', 'summary'], queryFn: loyaltyApi.fetchLoyaltySummary })
}

export function useLoyaltyHistory(filters: { page?: number } = {}) {
  return useQuery({
    queryKey: ['loyalty', 'history', filters],
    queryFn: () => loyaltyApi.fetchLoyaltyHistory(filters),
  })
}