export type VoucherType = 'fixed' | 'percent'
export type VoucherStatus = 'active' | 'inactive' | 'expired'

export interface Voucher {
  id: number
  store_id: number | null
  code: string
  type: VoucherType
  value: string
  min_transaction: string
  max_discount: string | null
  quota: number | null
  used_count: number
  start_at: string | null
  end_at: string | null
  status: VoucherStatus
  created_at: string
}

export interface VoucherInput {
  code: string
  type: VoucherType
  value: number
  min_transaction?: number | null
  max_discount?: number | null
  quota?: number | null
  start_at?: string | null
  end_at?: string | null
  status?: VoucherStatus
}

export interface VoucherValidation {
  voucher: Voucher
  discount: string
}
