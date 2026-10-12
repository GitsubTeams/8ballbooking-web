export type PaymentGateway = 'manual' | 'midtrans' | 'xendit'
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired' | 'refunded'
export type PaymentMethod = 'va' | 'qris' | 'ewallet' | 'card' | 'cash'
export type PaymentType = 'full' | 'dp'

export interface Payment {
  id: number
  booking_id: number
  user_id: number
  store_id: number
  gateway: PaymentGateway
  gateway_ref: string | null
  method: PaymentMethod
  type: PaymentType
  amount: string
  status: PaymentStatus
  va_number: string | null
  expired_at: string | null
  paid_at: string | null
  instructions: string | null
  created_at: string
}

export interface Refund {
  id: number
  payment_id: number
  booking_id: number
  amount: string
  reason: string | null
  status: string
  gateway_ref: string | null
  processed_at: string | null
  created_at: string
}
