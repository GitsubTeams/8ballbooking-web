import { useState, type FormEvent } from 'react'
import { formatCurrency, formatDateTime } from '@/lib/format'
import { useCreateWithdrawal, useMyStores, useOwnerWallet, useOwnerWithdrawals } from '@/features/owner/hooks'
import type { WithdrawalStatus } from '@/types/withdrawal'

const withdrawalStatusLabels: Record<WithdrawalStatus, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  paid: 'Dibayar',
}

const withdrawalStatusStyles: Record<WithdrawalStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-sky-100 text-sky-800',
  rejected: 'bg-rose-100 text-rose-800',
  paid: 'bg-emerald-100 text-emerald-800',
}

interface FormState {
  store_id: string
  amount: string
  bank_name: string
  account_number: string
  account_name: string
  note: string
}

const emptyForm: FormState = {
  store_id: '',
  amount: '',
  bank_name: '',
  account_number: '',
  account_name: '',
  note: '',
}

export default function OwnerWalletPage() {
  const wallet = useOwnerWallet()
  const stores = useMyStores()
  const [status, setStatus] = useState<WithdrawalStatus | ''>('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useOwnerWithdrawals({ status: status || undefined, page })
  const create = useCreateWithdrawal()
  const [form, setForm] = useState<FormState>(emptyForm)

  const meta = data?.meta

  const storeOptions = (stores.data ?? []).filter(
    (store) => store.status === 'active',
  )

  const selectedStore = wallet.data?.stores.find(
    (item) => item.id === Number(form.store_id),
  )

  const setField = (patch: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...patch }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    create.mutate({
      store_id: Number(form.store_id),
      amount: Number(form.amount),
      bank_name: form.bank_name.trim(),
      account_number: form.account_number.trim(),
      account_name: form.account_name.trim(),
      note: form.note.trim() || null,
    })

    if (!create.isPending) {
      setForm(emptyForm)
    }
  }

  const withdrawals = data?.withdrawals ?? []

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Dompet Owner</h1>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-sm text-emerald-600">Saldo Tersedia</p>
          <p className="mt-1 text-3xl font-bold">
            {formatCurrency(wallet.data?.totals.available_balance ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-4">
          <p className="text-sm text-amber-600">Saldo Pending</p>
          <p className="mt-1 text-3xl font-bold">
            {formatCurrency(wallet.data?.totals.pending_balance ?? 0)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-2">Store</th>
              <th className="px-3 py-2">Tersedia</th>
              <th className="px-3 py-2">Pending</th>
            </tr>
          </thead>
          <tbody>
            {(wallet.data?.stores ?? []).map((store) => (
              <tr key={store.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{store.name}</td>
                <td className="px-3 py-2">{formatCurrency(store.available_balance)}</td>
                <td className="px-3 py-2">{formatCurrency(store.pending_balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {wallet.isLoading && <p className="text-slate-600">Memuat…</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
      >
        <p className="text-sm font-medium text-slate-700">Ajukan Penarikan</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-500">Store</span>
            <select
              required
              value={form.store_id}
              onChange={(event) => setField({ store_id: event.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              <option value="">Pilih store…</option>
              {storeOptions.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-500">Jumlah (Rp)</span>
            <input
              required
              type="number"
              min={1}
              value={form.amount}
              onChange={(event) => setField({ amount: event.target.value })}
              placeholder="100000"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
            {selectedStore && (
              <span className="mt-1 block text-xs text-slate-500">
                Tersedia {formatCurrency(selectedStore.available_balance)}
              </span>
            )}
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-500">Nama Bank</span>
            <input
              required
              value={form.bank_name}
              onChange={(event) => setField({ bank_name: event.target.value })}
              placeholder="BCA"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-500">Nomor Rekening</span>
            <input
              required
              value={form.account_number}
              onChange={(event) => setField({ account_number: event.target.value })}
              placeholder="1234567890"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-500">Atas Nama</span>
            <input
              required
              value={form.account_name}
              onChange={(event) => setField({ account_name: event.target.value })}
              placeholder="Nama Pemilik Rekening"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-500">Catatan (opsional)</span>
            <input
              value={form.note}
              onChange={(event) => setField({ note: event.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={create.isPending || storeOptions.length === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {create.isPending ? 'Mengajukan…' : 'Ajukan Penarikan'}
        </button>
      </form>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Riwayat Penarikan</h2>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as WithdrawalStatus | '')
                setPage(1)
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-900"
            >
              <option value="">Semua status</option>
              {Object.entries(withdrawalStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && <p className="text-slate-600">Memuat…</p>}

        {!isLoading && withdrawals.length === 0 && (
          <p className="text-sm text-slate-500">Belum ada penarikan.</p>
        )}

        <div className="space-y-2">
          {withdrawals.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.store?.name ?? '-'}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      withdrawalStatusStyles[item.status] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {withdrawalStatusLabels[item.status]}
                  </span>
                </div>
                <p className="text-slate-600">
                  {item.bank_name} · {item.account_number} · {item.account_name}
                </p>
                <p className="text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
              </div>
              <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        {meta && meta.last_page > 1 && (
          <div className="mt-4 flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-slate-500">
              Halaman {meta.current_page} / {meta.last_page}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= meta.last_page}
              className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>
    </section>
  )
}