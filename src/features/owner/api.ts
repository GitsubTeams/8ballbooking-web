import { api } from '@/lib/axios'
import type { ApiEnvelope, PaginationMeta } from '@/types/api'
import type {
  Booking,
  Facility,
  OperatingHour,
  PricingRule,
  Store,
  Table,
  TableType,
} from '@/types/booking'
import type { Voucher, VoucherInput } from '@/types/voucher'

export interface OperatingHourInput {
  day_of_week: number
  open_time?: string | null
  close_time?: string | null
  is_closed?: boolean
}

export interface StoreInput {
  name?: string
  description?: string | null
  address?: string
  city?: string
  province?: string | null
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
  email?: string | null
  logo?: string | null
  cover?: string | null
  status?: 'active' | 'pending'
  facility_ids?: number[]
  operating_hours?: OperatingHourInput[]
}

export interface TableTypeInput {
  name: string
  description?: string | null
  image?: string | null
}

export interface TableInput {
  table_type_id?: number | null
  code: string
  name: string
  capacity: number
  price_per_hour: number
  status?: 'available' | 'maintenance' | 'inactive'
}

export interface PricingRuleInput {
  table_type_id?: number | null
  day_type: 'weekday' | 'weekend' | 'holiday'
  start_time: string
  end_time: string
  price_per_hour: number
}

export async function fetchFacilities(): Promise<Facility[]> {
  const { data } = await api.get<ApiEnvelope<Facility[]>>('/facilities')
  return data.data
}

export async function fetchMyStores(): Promise<Store[]> {
  const { data } = await api.get<ApiEnvelope<Store[]>>('/my/stores')
  return data.data
}

export async function createStore(payload: StoreInput): Promise<Store> {
  const { data } = await api.post<ApiEnvelope<Store>>('/stores', payload)
  return data.data
}

export async function updateStore(id: number | string, payload: StoreInput): Promise<Store> {
  const { data } = await api.patch<ApiEnvelope<Store>>(`/stores/${id}`, payload)
  return data.data
}

export async function fetchTableTypes(storeId: number | string): Promise<TableType[]> {
  const { data } = await api.get<ApiEnvelope<TableType[]>>(`/stores/${storeId}/table-types`)
  return data.data
}

export async function createTableType(
  storeId: number | string,
  payload: TableTypeInput,
): Promise<TableType> {
  const { data } = await api.post<ApiEnvelope<TableType>>(
    `/stores/${storeId}/table-types`,
    payload,
  )
  return data.data
}

export async function updateTableType(
  storeId: number | string,
  id: number,
  payload: TableTypeInput,
): Promise<TableType> {
  const { data } = await api.patch<ApiEnvelope<TableType>>(
    `/stores/${storeId}/table-types/${id}`,
    payload,
  )
  return data.data
}

export async function deleteTableType(storeId: number | string, id: number): Promise<void> {
  await api.delete(`/stores/${storeId}/table-types/${id}`)
}

export async function createTable(storeId: number | string, payload: TableInput): Promise<Table> {
  const { data } = await api.post<ApiEnvelope<Table>>(`/stores/${storeId}/tables`, payload)
  return data.data
}

export async function updateTable(
  storeId: number | string,
  id: number,
  payload: TableInput,
): Promise<Table> {
  const { data } = await api.patch<ApiEnvelope<Table>>(`/stores/${storeId}/tables/${id}`, payload)
  return data.data
}

export async function deleteTable(storeId: number | string, id: number): Promise<void> {
  await api.delete(`/stores/${storeId}/tables/${id}`)
}

export async function fetchPricingRules(storeId: number | string): Promise<PricingRule[]> {
  const { data } = await api.get<ApiEnvelope<PricingRule[]>>(`/stores/${storeId}/pricing-rules`)
  return data.data
}

export async function createPricingRule(
  storeId: number | string,
  payload: PricingRuleInput,
): Promise<PricingRule> {
  const { data } = await api.post<ApiEnvelope<PricingRule>>(
    `/stores/${storeId}/pricing-rules`,
    payload,
  )
  return data.data
}

export async function updatePricingRule(
  storeId: number | string,
  id: number,
  payload: PricingRuleInput,
): Promise<PricingRule> {
  const { data } = await api.patch<ApiEnvelope<PricingRule>>(
    `/stores/${storeId}/pricing-rules/${id}`,
    payload,
  )
  return data.data
}

export async function deletePricingRule(storeId: number | string, id: number): Promise<void> {
  await api.delete(`/stores/${storeId}/pricing-rules/${id}`)
}

export async function fetchVouchers(storeId: number | string): Promise<Voucher[]> {
  const { data } = await api.get<ApiEnvelope<Voucher[]>>(`/stores/${storeId}/vouchers`)
  return data.data
}

export async function createVoucher(
  storeId: number | string,
  payload: VoucherInput,
): Promise<Voucher> {
  const { data } = await api.post<ApiEnvelope<Voucher>>(`/stores/${storeId}/vouchers`, payload)
  return data.data
}

export async function updateVoucher(
  storeId: number | string,
  id: number,
  payload: VoucherInput,
): Promise<Voucher> {
  const { data } = await api.patch<ApiEnvelope<Voucher>>(
    `/stores/${storeId}/vouchers/${id}`,
    payload,
  )
  return data.data
}

export async function deleteVoucher(storeId: number | string, id: number): Promise<void> {
  await api.delete(`/stores/${storeId}/vouchers/${id}`)
}

export async function fetchStoreBookings(
  storeId: number | string,
  filters: { date?: string; status?: string; page?: number } = {},
) {
  const { data } = await api.get<ApiEnvelope<Booking[]> & { meta: PaginationMeta }>(
    `/stores/${storeId}/bookings`,
    { params: filters },
  )
  return { bookings: data.data, meta: data.meta }
}

export async function createWalkInBooking(
  storeId: number | string,
  payload: { table_id: number; start_at: string; end_at: string; user_id?: number; notes?: string | null },
): Promise<Booking> {
  const { data } = await api.post<ApiEnvelope<Booking>>(
    `/stores/${storeId}/bookings`,
    payload,
  )
  return data.data
}

export async function transitionBooking(
  id: number | string,
  action: 'confirm' | 'check-in' | 'complete' | 'no-show',
): Promise<Booking> {
  const { data } = await api.post<ApiEnvelope<Booking>>(`/bookings/${id}/${action}`)
  return data.data
}

export const emptyOperatingHours = (): OperatingHour[] =>
  Array.from({ length: 7 }, (_, day) => ({
    id: 0,
    day_of_week: day,
    open_time: '10:00',
    close_time: '22:00',
    is_closed: false,
  }))

export interface OwnerSummary {
  stores: number
  tables: number
  bookings_today: number
  upcoming: number
  revenue_today: number
}

export async function fetchSummary(): Promise<OwnerSummary> {
  const { data } = await api.get<ApiEnvelope<OwnerSummary>>('/owner/summary')
  return data.data
}

export interface OwnerBookingFilters {
  q?: string
  status?: string
  store_id?: number | string
  date?: string
  page?: number
}

export async function fetchOwnerBookings(filters: OwnerBookingFilters = {}) {
  const { data } = await api.get<ApiEnvelope<Booking[]> & { meta: PaginationMeta }>(
    '/owner/bookings',
    { params: filters },
  )
  return { bookings: data.data, meta: data.meta }
}

export type LifecycleAction = 'confirm' | 'check-in' | 'complete' | 'no-show'

export const ownerLifecycleActions: Record<
  string,
  { action: LifecycleAction; label: string }[]
> = {
  pending: [
    { action: 'confirm', label: 'Konfirmasi' },
    { action: 'no-show', label: 'No-show' },
  ],
  confirmed: [
    { action: 'check-in', label: 'Check-in' },
    { action: 'no-show', label: 'No-show' },
  ],
  ongoing: [{ action: 'complete', label: 'Selesai' }],
}
