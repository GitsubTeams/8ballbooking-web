import { useState } from 'react'
import { useAdminSettings, useAdminSettingsMutation } from '@/features/admin/hooks'
import type { PlatformSettings } from '@/types/admin'

const gatewayOptions = [
  { value: 'manual', label: 'Manual (VA lokal)' },
  { value: 'midtrans', label: 'Midtrans' },
  { value: 'xendit', label: 'Xendit' },
]

function SettingsForm({ settings }: { settings: PlatformSettings }) {
  const [form, setForm] = useState(settings)
  const mutation = useAdminSettingsMutation()

  const patch = (next: Partial<PlatformSettings>) =>
    setForm((current) => ({ ...current, ...next }))

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate({
          platform_commission_default: Number(form.platform_commission_default),
          payment_gateway: form.payment_gateway,
          tax_rate: Number(form.tax_rate),
          refund_policy: form.refund_policy,
        })
      }}
      className="grid max-w-xl gap-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Komisi platform default (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          step="0.5"
          value={form.platform_commission_default}
          onChange={(event) => patch({ platform_commission_default: Number(event.target.value) })}
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium">Gateway pembayaran</span>
        <select
          value={form.payment_gateway}
          onChange={(event) => patch({ payment_gateway: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        >
          {gatewayOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium">Pajak (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          step="0.5"
          value={form.tax_rate}
          onChange={(event) => patch({ tax_rate: Number(event.target.value) })}
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium">Kebijakan refund</span>
        <textarea
          rows={3}
          value={form.refund_policy}
          onChange={(event) => patch({ refund_policy: event.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
      </label>

      <div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {mutation.isPending ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

export default function AdminSettingsPage() {
  const { data, isLoading } = useAdminSettings()

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Pengaturan Platform</h1>

      {isLoading && <p className="text-slate-600">Memuat…</p>}
      {data && <SettingsForm key={JSON.stringify(data)} settings={data} />}
    </section>
  )
}
