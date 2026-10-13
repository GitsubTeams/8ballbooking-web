export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export interface Withdrawal {
  id: number
  store_id: number
  amount: number
  fee: number
  net_amount: number
  status: WithdrawalStatus
  bank_name: string
  account_number: string
  account_name: string
  note: string | null
  processed_at: string | null
  store?: { id: number; name: string }
  requester?: { id: number; name: string }
  created_at: string
}

export interface WalletStore {
  id: number
  name: string
  slug: string
  status: string
  available_balance: number
  pending_balance: number
}

export interface Wallet {
  stores: WalletStore[]
  totals: {
    available_balance: number
    pending_balance: number
  }
}