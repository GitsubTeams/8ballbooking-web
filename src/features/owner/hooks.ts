import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as ownerApi from '@/features/owner/api'
import type {
  PricingRuleInput,
  StoreInput,
  TableInput,
  TableTypeInput,
} from '@/features/owner/api'
import { getErrorMessage } from '@/lib/errors'
import { toast } from '@/stores/toast'
import type { WithdrawalInput } from '@/features/owner/api'
import type { VoucherInput } from '@/types/voucher'

const onError = (error: unknown) => toast.error(getErrorMessage(error))

export function useFacilities() {
  return useQuery({ queryKey: ['facilities'], queryFn: ownerApi.fetchFacilities })
}

export function useOwnerSummary() {
  return useQuery({ queryKey: ['owner', 'summary'], queryFn: ownerApi.fetchSummary })
}

export function useOwnerBookings(filters: ownerApi.OwnerBookingFilters = {}) {
  return useQuery({
    queryKey: ['owner', 'bookings', filters],
    queryFn: () => ownerApi.fetchOwnerBookings(filters),
  })
}

export function useMyStores() {
  return useQuery({ queryKey: ['owner', 'stores'], queryFn: ownerApi.fetchMyStores })
}

export function useCreateStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StoreInput) => ownerApi.createStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'stores'] })
      queryClient.invalidateQueries({ queryKey: ['owner', 'summary'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      toast.success('Store berhasil dibuat.')
    },
    onError,
  })
}

export function useUpdateStore(id: number | string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StoreInput) => ownerApi.updateStore(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'stores'] })
      queryClient.invalidateQueries({ queryKey: ['store', id] })
      toast.success('Store tersimpan.')
    },
    onError,
  })
}

export function useTableTypes(storeId: number | string) {
  return useQuery({
    queryKey: ['owner', 'store', storeId, 'table-types'],
    queryFn: () => ownerApi.fetchTableTypes(storeId),
  })
}

export function useTableTypeMutations(storeId: number | string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['owner', 'store', storeId, 'table-types'] })
    queryClient.invalidateQueries({ queryKey: ['store', storeId] })
    queryClient.invalidateQueries({ queryKey: ['owner', 'summary'] })
  }

  const create = useMutation({
    mutationFn: (payload: TableTypeInput) => ownerApi.createTableType(storeId, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Tipe meja ditambahkan.')
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TableTypeInput }) =>
      ownerApi.updateTableType(storeId, id, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Tipe meja diperbarui.')
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (id: number) => ownerApi.deleteTableType(storeId, id),
    onSuccess: () => {
      invalidate()
      toast.success('Tipe meja dihapus.')
    },
    onError,
  })

  return { create, update, remove }
}

export function useTableMutations(storeId: number | string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['store', storeId] })
    queryClient.invalidateQueries({ queryKey: ['owner', 'summary'] })
  }

  const create = useMutation({
    mutationFn: (payload: TableInput) => ownerApi.createTable(storeId, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Meja ditambahkan.')
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TableInput }) =>
      ownerApi.updateTable(storeId, id, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Meja diperbarui.')
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (id: number) => ownerApi.deleteTable(storeId, id),
    onSuccess: () => {
      invalidate()
      toast.success('Meja dihapus.')
    },
    onError,
  })

  return { create, update, remove }
}

export function usePricingRules(storeId: number | string) {
  return useQuery({
    queryKey: ['owner', 'store', storeId, 'pricing-rules'],
    queryFn: () => ownerApi.fetchPricingRules(storeId),
  })
}

export function usePricingRuleMutations(storeId: number | string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['owner', 'store', storeId, 'pricing-rules'] })
    queryClient.invalidateQueries({ queryKey: ['store', storeId] })
  }

  const create = useMutation({
    mutationFn: (payload: PricingRuleInput) => ownerApi.createPricingRule(storeId, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Aturan harga ditambahkan.')
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PricingRuleInput }) =>
      ownerApi.updatePricingRule(storeId, id, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Aturan harga diperbarui.')
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (id: number) => ownerApi.deletePricingRule(storeId, id),
    onSuccess: () => {
      invalidate()
      toast.success('Aturan harga dihapus.')
    },
    onError,
  })

  return { create, update, remove }
}

export function useVouchers(storeId: number | string) {
  return useQuery({
    queryKey: ['owner', 'store', storeId, 'vouchers'],
    queryFn: () => ownerApi.fetchVouchers(storeId),
  })
}

export function useVoucherMutations(storeId: number | string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['owner', 'store', storeId, 'vouchers'] })
  }

  const create = useMutation({
    mutationFn: (payload: VoucherInput) => ownerApi.createVoucher(storeId, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Voucher ditambahkan.')
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: VoucherInput }) =>
      ownerApi.updateVoucher(storeId, id, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Voucher diperbarui.')
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (id: number) => ownerApi.deleteVoucher(storeId, id),
    onSuccess: () => {
      invalidate()
      toast.success('Voucher dihapus.')
    },
    onError,
  })

  return { create, update, remove }
}

export function useStoreBookings(
  storeId: number | string,
  filters: { date?: string; status?: string; page?: number } = {},
) {
  return useQuery({
    queryKey: ['owner', 'store', storeId, 'bookings', filters],
    queryFn: () => ownerApi.fetchStoreBookings(storeId, filters),
  })
}

export function useCalendarMutations(storeId: number | string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['owner', 'store', storeId, 'bookings'] })
    queryClient.invalidateQueries({ queryKey: ['owner', 'summary'] })
  }

  const walkIn = useMutation({
    mutationFn: (payload: {
      table_id: number
      start_at: string
      end_at: string
      user_id?: number
      notes?: string | null
    }) => ownerApi.createWalkInBooking(storeId, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Booking walk-in dibuat.')
    },
    onError,
  })

  const transition = useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: number
      action: 'confirm' | 'check-in' | 'complete' | 'no-show'
    }) => ownerApi.transitionBooking(id, action),
    onSuccess: () => {
      invalidate()
      toast.success('Status booking diperbarui.')
    },
    onError,
  })

  return { walkIn, transition }
}

export function useOwnerBookingTransition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: ownerApi.LifecycleAction }) =>
      ownerApi.transitionBooking(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['owner', 'summary'] })
      toast.success('Status booking diperbarui.')
    },
    onError,
  })
}

export function useOwnerWithdrawals(filters: ownerApi.OwnerWithdrawalFilters = {}) {
  return useQuery({
    queryKey: ['owner', 'withdrawals', filters],
    queryFn: () => ownerApi.fetchOwnerWithdrawals(filters),
  })
}

export function useOwnerWallet() {
  return useQuery({ queryKey: ['owner', 'wallet'], queryFn: ownerApi.fetchOwnerWallet })
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: WithdrawalInput) => ownerApi.createWithdrawal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'withdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['owner', 'wallet'] })
      toast.success('Penarikan diajukan.')
    },
    onError,
  })
}
