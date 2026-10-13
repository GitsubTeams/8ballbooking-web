import { useState } from 'react'
import { toDateInput } from '@/lib/format'
import * as ownerApi from '@/features/owner/api'
import { useMyStores } from '@/features/owner/hooks'
import { getErrorMessage } from '@/lib/errors'
import { toast } from '@/stores/toast'

function today(): string {
  return toDateInput(new Date())
}

function firstOfMonth(): string {
  const now = new Date()
  return toDateInput(new Date(now.getFullYear(), now.getMonth(), 1))
}

export default function BookingExportCard() {
  const stores = useMyStores()
  const [from, setFrom] = useState(firstOfMonth)
  const [to, setTo] = useState(today)
  const [storeId, setStoreId] = useState('')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!from || !to) {
      toast.error('Isi rentang tanggal export.')
      return
    }

    if (from > to) {
      toast.error('Tanggal awal tidak boleh setelah tanggal akhir.')
      return
    }

    setExporting(true)

    try {
      const blob = await ownerApi.downloadBookingsCsv({
        from,
        to,
        store_id: storeId || undefined,
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `bookings-${from}-${to}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      toast.success('Export CSV siap diunduh.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-700">Export Booking (CSV)</p>
      <p className="mt-0.5 text-xs text-slate-500">
        Unduh daftar booking sesuai rentang tanggal.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Dari</span>
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Sampai</span>
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Store</span>
          <select
            value={storeId}
            onChange={(event) => setStoreId(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            <option value="">Semua store</option>
            {(stores.data ?? []).map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={exporting}
          onClick={handleExport}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {exporting ? 'Menyiapkan…' : 'Unduh CSV'}
        </button>
      </div>
    </div>
  )
}