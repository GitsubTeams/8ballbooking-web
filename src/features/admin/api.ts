import { api } from '@/lib/axios'
import type { ApiEnvelope, PaginationMeta } from '@/types/api'
import type {
  AdminOverview,
  AdminStore,
  AdminUser,
  AuditLogEntry,
  PlatformSettings,
  UserStatus,
} from '@/types/admin'
import type { Withdrawal, WithdrawalStatus } from '@/types/withdrawal'

export interface AdminStoreFilters {
  status?: string
  q?: string
  city?: string
  page?: number
}

export type AdminStoreAction = 'approve' | 'reject' | 'suspend' | 'reactivate'

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const { data } = await api.get<ApiEnvelope<AdminOverview>>('/admin/overview')
  return data.data
}

export async function fetchAdminStores(filters: AdminStoreFilters = {}) {
  const { data } = await api.get<ApiEnvelope<AdminStore[]> & { meta: PaginationMeta }>(
    '/admin/stores',
    { params: filters },
  )
  return { stores: data.data, meta: data.meta }
}

export async function transitionAdminStore(
  id: number | string,
  action: AdminStoreAction,
): Promise<AdminStore> {
  const { data } = await api.post<ApiEnvelope<AdminStore>>(`/admin/stores/${id}/${action}`)
  return data.data
}

export interface AdminUserFilters {
  role?: string
  status?: string
  q?: string
  page?: number
}

export async function fetchAdminUsers(filters: AdminUserFilters = {}) {
  const { data } = await api.get<ApiEnvelope<AdminUser[]> & { meta: PaginationMeta }>('/admin/users', {
    params: filters,
  })
  return { users: data.data, meta: data.meta }
}

export async function updateAdminUserRoles(
  id: number | string,
  roles: string[],
): Promise<AdminUser> {
  const { data } = await api.patch<ApiEnvelope<AdminUser>>(`/admin/users/${id}/roles`, { roles })
  return data.data
}

export async function updateAdminUserStatus(
  id: number | string,
  status: UserStatus,
): Promise<AdminUser> {
  const { data } = await api.patch<ApiEnvelope<AdminUser>>(`/admin/users/${id}/status`, { status })
  return data.data
}

export async function fetchAdminSettings(): Promise<PlatformSettings> {
  const { data } = await api.get<ApiEnvelope<PlatformSettings>>('/admin/settings')
  return data.data
}

export async function updateAdminSettings(
  payload: Partial<PlatformSettings>,
): Promise<PlatformSettings> {
  const { data } = await api.put<ApiEnvelope<PlatformSettings>>('/admin/settings', payload)
  return data.data
}

export interface AdminAuditLogFilters {
  action?: string
  page?: number
}

export async function fetchAdminAuditLogs(filters: AdminAuditLogFilters = {}) {
  const { data } = await api.get<ApiEnvelope<AuditLogEntry[]> & { meta: PaginationMeta }>(
    '/admin/audit-logs',
    { params: filters },
  )
  return { logs: data.data, meta: data.meta }
}

export interface AdminWithdrawalFilters {
  status?: WithdrawalStatus | ''
  store_id?: number | string
  page?: number
}

export type AdminWithdrawalAction = 'approve' | 'reject' | 'mark-paid'

export async function fetchAdminWithdrawals(filters: AdminWithdrawalFilters = {}) {
  const { data } = await api.get<ApiEnvelope<Withdrawal[]> & { meta: PaginationMeta }>(
    '/admin/withdrawals',
    { params: filters },
  )
  return { withdrawals: data.data, meta: data.meta }
}

export async function transitionAdminWithdrawal(
  id: number | string,
  action: AdminWithdrawalAction,
): Promise<Withdrawal> {
  const { data } = await api.post<ApiEnvelope<Withdrawal>>(
    `/admin/withdrawals/${id}/${action}`,
  )
  return data.data
}
