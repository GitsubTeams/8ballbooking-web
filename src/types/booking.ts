import type { User } from '@/types/auth'

export type StoreStatus = 'active' | 'rejected' | 'suspended' | 'pending'
export type TableStatus = 'available' | 'maintenance' | 'inactive'

export interface Facility {
  id: number
  name: string
  icon: string | null
}

export interface OperatingHour {
  id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface TableType {
  id: number
  store_id: number
  name: string
  description: string | null
  image: string | null
}

export type PricingDayType = 'weekday' | 'weekend' | 'holiday'

export interface PricingRule {
  id: number
  store_id: number
  table_type_id: number | null
  day_type: PricingDayType
  start_time: string
  end_time: string
  price_per_hour: string
}

export interface Table {
  id: number
  store_id: number
  table_type_id: number
  code: string
  name: string
  capacity: number
  price_per_hour: string
  status: TableStatus
  type?: TableType
}

export interface Store {
  id: number
  owner_id: number
  name: string
  slug: string
  description: string | null
  address: string | null
  city: string | null
  province: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  email: string | null
  logo: string | null
  cover: string | null
  status: StoreStatus
  commission_rate: string
  rating_avg: string
  rating_count: number
  facilities?: Facility[]
  operating_hours?: OperatingHour[]
  table_types?: TableType[]
  tables?: Table[]
  pricing_rules?: PricingRule[]
  created_at: string
  updated_at: string
}

export interface AvailabilitySlot {
  start_at: string
  end_at: string
  price_per_hour: string
  available: boolean
}

export interface Availability {
  table_id: number
  date: string
  slot_minutes: number
  slots: AvailabilitySlot[]
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'ongoing'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type BookingPaymentStatus = 'unpaid' | 'dp' | 'paid' | 'refunded' | 'partial_refund'
export type BookingSource = 'online' | 'walk_in'

export interface Booking {
  id: number
  code: string
  user_id: number
  store_id: number
  table_id: number
  booking_date: string
  start_at: string
  end_at: string
  duration_minutes: number
  price_per_hour: string
  subtotal: string
  discount: string
  tax: string
  total: string
  paid_amount: string
  payment_status: BookingPaymentStatus
  status: BookingStatus
  source: BookingSource
  notes: string | null
  checked_in_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancel_reason: string | null
  user?: User
  store?: Store
  table?: Table
  review?: Review | null
  created_at: string
}

export interface BookingHold {
  id: number
  table_id: number
  user_id: number
  start_at: string
  end_at: string
  expired_at: string
  created_at: string
}

export interface Review {
  id: number
  booking_id: number
  store_id: number
  user_id: number
  rating: number
  comment: string | null
  user?: User
  created_at: string
}

export interface CreateBookingPayload {
  table_id: number
  start_at: string
  end_at: string
  notes?: string | null
  voucher_code?: string | null
}
