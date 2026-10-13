import { api } from '@/lib/axios'
import type { ApiEnvelope } from '@/types/api'
import type { Payment, PaymentMethod, PaymentType, Refund } from '@/types/payment'

export async function fetchPayments(bookingId: number | string): Promise<Payment[]> {
  const { data } = await api.get<ApiEnvelope<Payment[]>>(`/bookings/${bookingId}/payments`)
  return data.data
}

export async function createPayment(
  bookingId: number | string,
  payload: { type: PaymentType; method: PaymentMethod; idempotency_key?: string },
): Promise<Payment> {
  const { data } = await api.post<ApiEnvelope<Payment>>(`/bookings/${bookingId}/payments`, {
    ...payload,
    idempotency_key: payload.idempotency_key ?? crypto.randomUUID(),
  })
  return data.data
}

export async function confirmPayment(paymentId: number | string): Promise<Payment> {
  const { data } = await api.post<ApiEnvelope<Payment>>(`/payments/${paymentId}/confirm`)
  return data.data
}

export async function markBookingPaid(bookingId: number | string): Promise<Payment> {
  const { data } = await api.post<ApiEnvelope<Payment>>(`/bookings/${bookingId}/mark-paid`)
  return data.data
}

export async function refundPayment(
  paymentId: number | string,
  reason?: string,
): Promise<Refund> {
  const { data } = await api.post<ApiEnvelope<Refund>>(`/payments/${paymentId}/refund`, {
    reason: reason ?? null,
  })
  return data.data
}
