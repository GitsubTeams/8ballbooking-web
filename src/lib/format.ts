export function formatCurrency(value: string | number): string {
  const amount = typeof value === 'number' ? value : Number(value)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('id-ID', { dateStyle: 'medium' })
}

export function toDateInput(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export function dayName(dayOfWeek: number): string {
  return dayNames[dayOfWeek] ?? '-'
}

export const bookingStatusLabels: Record<string, string> = {
  pending: 'Menunggu',
  confirmed: 'Terkonfirmasi',
  ongoing: 'Berjalan',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  no_show: 'Tidak hadir',
}

export const bookingStatusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-sky-100 text-sky-800',
  ongoing: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-700',
  no_show: 'bg-rose-100 text-rose-800',
}

export const paymentStatusLabels: Record<string, string> = {
  unpaid: 'Belum Bayar',
  dp: 'DP',
  paid: 'Lunas',
  refunded: 'Direfund',
  partial_refund: 'Refund Sebagian',
}

export const paymentStatusStyles: Record<string, string> = {
  unpaid: 'bg-slate-100 text-slate-700',
  dp: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  refunded: 'bg-rose-100 text-rose-800',
  partial_refund: 'bg-rose-100 text-rose-800',
}

export const paymentRecordStatusLabels: Record<string, string> = {
  pending: 'Menunggu',
  success: 'Berhasil',
  failed: 'Gagal',
  expired: 'Kedaluwarsa',
  refunded: 'Direfund',
}

export const paymentMethodLabels: Record<string, string> = {
  va: 'Virtual Account',
  qris: 'QRIS',
  ewallet: 'E-Wallet',
  card: 'Kartu',
  cash: 'Tunai',
}
