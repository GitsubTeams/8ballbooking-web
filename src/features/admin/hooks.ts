import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as adminApi from '@/features/admin/api'
import type {
  AdminAuditLogFilters,
  AdminStoreAction,
  AdminStoreFilters,
  AdminUserFilters,
} from '@/features/admin/api'
import type { PlatformSettings, UserStatus } from '@/types/admin'
import { getErrorMessage } from '@/lib/errors'
import { toast } from '@/stores/toast'

const onError = (error: unknown) => toast.error(getErrorMessage(error))

export function useAdminOverview() {
  return useQuery({ queryKey: ['admin', 'overview'], queryFn: adminApi.fetchAdminOverview })
}

export function useAdminStores(filters: AdminStoreFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'stores', filters],
    queryFn: () => adminApi.fetchAdminStores(filters),
  })
}

const actionMessages: Record<AdminStoreAction, string> = {
  approve: 'Store disetujui.',
  reject: 'Store ditolak.',
  suspend: 'Store ditangguhkan.',
  reactivate: 'Store diaktifkan kembali.',
}

export function useAdminStoreMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'stores'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] })
  }

  const transition = useMutation({
    mutationFn: ({ id, action }: { id: number; action: AdminStoreAction }) =>
      adminApi.transitionAdminStore(id, action),
    onSuccess: (_store, variables) => {
      invalidate()
      toast.success(actionMessages[variables.action])
    },
    onError,
  })

  return { transition }
}

export function useAdminUsers(filters: AdminUserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.fetchAdminUsers(filters),
  })
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] })
  }

  const updateRoles = useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: string[] }) =>
      adminApi.updateAdminUserRoles(id, roles),
    onSuccess: () => {
      invalidate()
      toast.success('Role pengguna diperbarui.')
    },
    onError,
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      adminApi.updateAdminUserStatus(id, status),
    onSuccess: () => {
      invalidate()
      toast.success('Status pengguna diperbarui.')
    },
    onError,
  })

  return { updateRoles, updateStatus }
}

export function useAdminSettings() {
  return useQuery({ queryKey: ['admin', 'settings'], queryFn: adminApi.fetchAdminSettings })
}

export function useAdminSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<PlatformSettings>) => adminApi.updateAdminSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] })
      toast.success('Pengaturan disimpan.')
    },
    onError,
  })
}

export function useAdminAuditLogs(filters: AdminAuditLogFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: () => adminApi.fetchAdminAuditLogs(filters),
  })
}
