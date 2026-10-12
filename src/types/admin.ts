import type { User } from '@/types/auth'
import type { Booking, StoreStatus } from '@/types/booking'

export type UserStatus = 'active' | 'inactive' | 'banned'

export interface AdminUser {
  id: number
  name: string
  email: string
  roles: string[]
  status: UserStatus
  stores_count: number
  created_at: string
}

export interface PlatformSettings {
  platform_commission_default: number
  payment_gateway: string
  tax_rate: number
  refund_policy: string
}

export interface AuditLogEntry {
  id: number
  action: string
  model_type: string | null
  model_id: number | null
  old: Record<string, unknown> | null
  new: Record<string, unknown> | null
  ip: string | null
  user: User | null
  created_at: string
}

export interface AdminStore {
  id: number
  owner_id: number
  name: string
  slug: string
  city: string | null
  province: string | null
  status: StoreStatus
  commission_rate: string
  rating_avg: string
  rating_count: number
  tables_count: number
  owner?: User
  created_at: string
}

export interface AdminTopStore {
  id: number
  name: string
  gmv: number
}

export interface AdminOverview {
  gmv: number
  platform_revenue: number
  bookings_total: number
  bookings_today: number
  stores: Record<StoreStatus, number>
  users_total: number
  owners_total: number
  top_stores: AdminTopStore[]
  recent_bookings: Booking[]
  trend: { date: string; bookings: number }[]
}
