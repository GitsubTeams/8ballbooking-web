export interface LoyaltySummary {
  balance: number
  lifetime_earned: number
  lifetime_redeemed: number
  point_value: number
  earn_per_currency: number
  min_redeem_points: number
  max_redeem_percent: number
}

export type PointTransactionType = 'earn' | 'redeem' | 'adjust'

export interface PointTransaction {
  id: number
  type: PointTransactionType
  type_label: string
  points: number
  balance_after: number
  description: string | null
  booking_id: number | null
  expires_at: string | null
  created_at: string
}