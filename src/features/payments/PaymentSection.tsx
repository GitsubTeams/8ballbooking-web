import { useState } from 'react'
import {
  formatCurrency,
  paymentMethodLabels,
  paymentRecordStatusLabels,
  paymentStatusLabels,
  paymentStatusStyles,
} from '@/lib/format'
import {
  useConfirmPayment,
  useCreatePayment,
  usePayments,
} from '@/features/payments/hooks'
import type { Booking } from '@/types/booking'
import type { PaymentMethod, PaymentType } from '@/types/payment'

export default function PaymentSection({ booking }: { booking: Booking }) {
  const { data: payments = [], isLoading } = usePayments(booking.id)
  const createPayment = useCreatePayment(booking.id)
  const confirmPayment = useConfirmPayment(booking.id)

  const [type, setType] = useState<PaymentType>('full')
  const [method, setMethod] = useState<PaymentMethod>('va')

  const payable =
    ['pending', 'confirmed'].includes(booking.status) && booking.payment_status !== 'paid'
  const active = payments.find((payment) => payment.status === 'pending')

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Pembayaran</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            paymentStatusStyles[booking.payment_status] ?? 'bg-slate-100 text-slate-700'
          }`}
        >
          {paymentStatusLabels[booking.payment_status] ?? booking.payment_status}
        </span>
      </div>

      {payable && !active && (
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Jenis</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as PaymentType)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              <option value="full">Lunas</option>
              <option value="dp">DP 50%</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Metode</span>
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value as PaymentMethod)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              <option value="va">Virtual Account</option>
              <option value="qris">QRIS</option>
              <option value="ewallet">E-Wallet</option>
              <option value="card">Kartu</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => createPayment.mutate({ type, method })}
            disabled={createPayment.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {createPayment.isPending ? 'Memproses…' : 'Bayar Sekarang'}
          </button>
        </div>
      )}

      {active && (
        <div className="space-y-2 rounded-md bg-slate-50 p-3 text-sm">
          <p className="text-slate-600">
            {paymentMethodLabels[active.method] ?? active.method} ·{' '}
            {formatCurrency(active.amount)} ({active.type === 'dp' ? 'DP' : 'Lunas'})
          </p>
          {active.va_number && (
            <p className="font-mono text-base font-semibold">{active.va_number}</p>
          )}
          {active.instructions && <p className="text-slate-500">{active.instructions}</p>}
          {active.gateway === 'manual' && (
            <button
              type="button"
              onClick={() => confirmPayment.mutate(active.id)}
              disabled={confirmPayment.isPending}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {confirmPayment.isPending ? 'Memproses…' : 'Konfirmasi Pembayaran'}
            </button>
          )}
        </div>
      )}

      {!isLoading && payments.length > 0 && (
        <ul className="space-y-1 border-t border-slate-100 pt-2 text-sm">
          {payments.map((payment) => (
            <li key={payment.id} className="flex justify-between text-slate-600">
              <span>
                {formatCurrency(payment.amount)} · {paymentMethodLabels[payment.method] ?? payment.method}
              </span>
              <span>{paymentRecordStatusLabels[payment.status] ?? payment.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
