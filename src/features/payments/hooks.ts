import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as paymentApi from '@/features/payments/api'
import { getErrorMessage } from '@/lib/errors'
import { toast } from '@/stores/toast'
import type { PaymentMethod, PaymentType } from '@/types/payment'

const onError = (error: unknown) => toast.error(getErrorMessage(error))

export function usePayments(bookingId: number | string | undefined) {
  return useQuery({
    queryKey: ['payments', bookingId],
    queryFn: () => paymentApi.fetchPayments(bookingId as number | string),
    enabled: Boolean(bookingId),
  })
}

export function useCreatePayment(bookingId: number | string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['payments', bookingId] })
    queryClient.invalidateQueries({ queryKey: ['booking', String(bookingId)] })
  }

  return useMutation({
    mutationFn: (payload: { type: PaymentType; method: PaymentMethod }) =>
      paymentApi.createPayment(bookingId, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Instruksi pembayaran dibuat.')
    },
    onError,
  })
}

export function useConfirmPayment(bookingId: number | string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (paymentId: number | string) => paymentApi.confirmPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['booking', String(bookingId)] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Pembayaran dikonfirmasi.')
    },
    onError,
  })
}

export function useMarkBookingPaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: number | string) => paymentApi.markBookingPaid(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['owner', 'summary'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking ditandai lunas.')
    },
    onError,
  })
}

export function useRefundPayment(bookingId: number | string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: number | string; reason?: string }) =>
      paymentApi.refundPayment(paymentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['booking', String(bookingId)] })
      toast.success('Refund diproses.')
    },
    onError,
  })
}
