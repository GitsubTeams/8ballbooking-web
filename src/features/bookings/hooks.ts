import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as bookingApi from '@/features/bookings/api'
import type { BookingFilters } from '@/features/bookings/api'
import { getErrorMessage } from '@/lib/errors'
import { toast } from '@/stores/toast'
import type { CreateBookingPayload } from '@/types/booking'

export function useMyBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingApi.fetchMyBookings(filters),
  })
}

export function useBooking(id: number | string | undefined) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.fetchBooking(id as number | string),
    enabled: Boolean(id),
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingApi.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking berhasil dibuat.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      bookingApi.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking dibatalkan.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useRescheduleBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      startAt,
      endAt,
    }: {
      id: number | string
      startAt: string
      endAt: string
    }) => bookingApi.rescheduleBooking(id, startAt, endAt),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking', String(booking.id)] })
      toast.success('Jadwal booking diperbarui.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useHoldSlot() {
  return useMutation({
    mutationFn: ({
      tableId,
      startAt,
      endAt,
    }: {
      tableId: number | string
      startAt: string
      endAt: string
    }) => bookingApi.holdSlot(tableId, startAt, endAt),
  })
}

export function useReleaseHold() {
  return useMutation({ mutationFn: (id: number | string) => bookingApi.releaseHold(id) })
}

export function useCreateReview(bookingId: number | string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: bookingApi.ReviewPayload) => bookingApi.createReview(bookingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', String(bookingId)] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Terima kasih atas ulasan Anda.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteReview(bookingId: number | string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: number | string) => bookingApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', String(bookingId)] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Ulasan dihapus.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
