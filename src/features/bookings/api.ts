import { api } from '@/lib/axios'
import type { ApiEnvelope, PaginationMeta } from '@/types/api'
import type { Booking, BookingHold, CreateBookingPayload, Review } from '@/types/booking'

export interface BookingFilters {
  status?: string
  page?: number
  per_page?: number
}

export async function fetchMyBookings(filters: BookingFilters = {}) {
  const { data } = await api.get<ApiEnvelope<Booking[]> & { meta: PaginationMeta }>('/bookings', {
    params: filters,
  })
  return { bookings: data.data, meta: data.meta }
}

export async function fetchBooking(id: number | string): Promise<Booking> {
  const { data } = await api.get<ApiEnvelope<Booking>>(`/bookings/${id}`)
  return data.data
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await api.post<ApiEnvelope<Booking>>('/bookings', payload)
  return data.data
}

export async function cancelBooking(id: number | string, cancelReason?: string): Promise<Booking> {
  const { data } = await api.post<ApiEnvelope<Booking>>(`/bookings/${id}/cancel`, {
    cancel_reason: cancelReason ?? null,
  })
  return data.data
}

export async function rescheduleBooking(
  id: number | string,
  startAt: string,
  endAt: string,
): Promise<Booking> {
  const { data } = await api.post<ApiEnvelope<Booking>>(`/bookings/${id}/reschedule`, {
    start_at: startAt,
    end_at: endAt,
  })
  return data.data
}

export async function holdSlot(
  tableId: number | string,
  startAt: string,
  endAt: string,
): Promise<BookingHold> {
  const { data } = await api.post<ApiEnvelope<BookingHold>>(`/tables/${tableId}/holds`, {
    start_at: startAt,
    end_at: endAt,
  })
  return data.data
}

export async function releaseHold(id: number | string): Promise<void> {
  await api.delete(`/holds/${id}`)
}

export interface ReviewPayload {
  rating: number
  comment?: string | null
}

export async function createReview(
  bookingId: number | string,
  payload: ReviewPayload,
): Promise<Review> {
  const { data } = await api.post<ApiEnvelope<Review>>(`/bookings/${bookingId}/review`, payload)
  return data.data
}

export async function deleteReview(reviewId: number | string): Promise<void> {
  await api.delete(`/reviews/${reviewId}`)
}
