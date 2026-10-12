import { useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { formatCurrency } from '@/lib/format'
import { useVoucherMutations, useVouchers } from '@/features/owner/hooks'
import type { Store } from '@/types/booking'
import type { Voucher, VoucherType } from '@/types/voucher'

const emptyVoucher = {
  code: '',
  type: 'fixed' as VoucherType,
  value: '10000',
  min_transaction: '0',
  max_discount: '',
  quota: '',
  start_at: '',
  end_at: '',
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-slate-100 text-slate-700',
  expired: 'bg-rose-100 text-rose-800',
}

function valueLabel(voucher: Voucher): string {
  return voucher.type === 'fixed' ? formatCurrency(voucher.value) : `${Number(voucher.value)}%`
}

export default function VoucherSection({ store }: { store: Store }) {
  const { data: vouchers = [] } = useVouchers(store.id)
  const { create, remove } = useVoucherMutations(store.id)
  const [form, setForm] = useState(emptyVoucher)

  function add(event: React.FormEvent) {
    event.preventDefault()
    create.mutate(
      {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        min_transaction: form.min_transaction ? Number(form.min_transaction) : 0,
        max_discount: form.max_discount ? Number(form.max_discount) : null,
        quota: form.quota ? Number(form.quota) : null,
        start_at: form.start_at || null,
        end_at: form.end_at || null,
      },
      { onSuccess: () => setForm(emptyVoucher) },
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Voucher memberi potongan saat booking. Tipe persen dibatasi oleh maksimal diskon (opsional).
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-2">Kode</th>
              <th className="px-3 py-2">Diskon</th>
              <th className="px-3 py-2">Min. Transaksi</th>
              <th className="px-3 py-2">Kuota</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-mono">{voucher.code}</td>
                <td className="px-3 py-2">{valueLabel(voucher)}</td>
                <td className="px-3 py-2">{formatCurrency(voucher.min_transaction)}</td>
                <td className="px-3 py-2">
                  {voucher.quota === null ? '∞' : `${voucher.used_count}/${voucher.quota}`}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusStyles[voucher.status]}`}
                  >
                    {voucher.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => remove.mutate(voucher.id)}
                    className="text-rose-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-3 text-slate-500">
                  Belum ada voucher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={add} className="flex flex-wrap items-end gap-2">
        <input
          placeholder="Kode"
          value={form.code}
          onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
          className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm uppercase outline-none focus:border-slate-900"
          required
        />
        <select
          value={form.type}
          onChange={(event) => setForm({ ...form, type: event.target.value as VoucherType })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="fixed">Nominal</option>
          <option value="percent">Persen</option>
        </select>
        <input
          type="number"
          min={0}
          value={form.value}
          onChange={(event) => setForm({ ...form, value: event.target.value })}
          className="w-28 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="Nilai"
        />
        <input
          type="number"
          min={0}
          value={form.min_transaction}
          onChange={(event) => setForm({ ...form, min_transaction: event.target.value })}
          className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="Min. transaksi"
        />
        <input
          type="number"
          min={0}
          value={form.max_discount}
          onChange={(event) => setForm({ ...form, max_discount: event.target.value })}
          className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="Maks. diskon"
        />
        <input
          type="number"
          min={0}
          value={form.quota}
          onChange={(event) => setForm({ ...form, quota: event.target.value })}
          className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="Kuota"
        />
        <input
          type="datetime-local"
          value={form.start_at}
          onChange={(event) => setForm({ ...form, start_at: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <input
          type="datetime-local"
          value={form.end_at}
          onChange={(event) => setForm({ ...form, end_at: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          Tambah Voucher
        </button>
      </form>
      {create.isError && <p className="text-sm text-rose-600">{getErrorMessage(create.error)}</p>}
    </div>
  )
}
