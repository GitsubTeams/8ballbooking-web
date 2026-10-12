import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/features/stores/hooks'
import CalendarSection from '@/pages/owner/sections/CalendarSection'
import CatalogSection from '@/pages/owner/sections/CatalogSection'
import PricingSection from '@/pages/owner/sections/PricingSection'
import StoreSettingsSection from '@/pages/owner/sections/StoreSettingsSection'
import VoucherSection from '@/pages/owner/sections/VoucherSection'

const tabs = [
  { key: 'settings', label: 'Pengaturan' },
  { key: 'catalog', label: 'Katalog' },
  { key: 'pricing', label: 'Harga' },
  { key: 'vouchers', label: 'Voucher' },
  { key: 'calendar', label: 'Kalender' },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function OwnerStoreDetailPage() {
  const { id } = useParams()
  const { data: store, isLoading, isError } = useStore(id)
  const [tab, setTab] = useState<TabKey>('settings')

  if (isLoading) {
    return <p className="text-slate-600">Memuat…</p>
  }

  if (isError || !store) {
    return <p className="text-rose-600">Store tidak ditemukan.</p>
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/owner/stores" className="text-sm text-slate-500 hover:text-slate-900">
            ← Store saya
          </Link>
          <h1 className="text-2xl font-bold">{store.name}</h1>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-700">
          {store.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === item.key
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'settings' && <StoreSettingsSection key={store.id} store={store} />}
      {tab === 'catalog' && <CatalogSection store={store} />}
      {tab === 'pricing' && <PricingSection store={store} />}
      {tab === 'vouchers' && <VoucherSection store={store} />}
      {tab === 'calendar' && <CalendarSection store={store} />}
    </section>
  )
}
