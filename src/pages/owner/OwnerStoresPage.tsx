import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '@/lib/errors'
import { useCreateStore, useFacilities, useMyStores } from '@/features/owner/hooks'

const emptyForm = {
  name: '',
  address: '',
  city: '',
  province: '',
  phone: '',
  email: '',
  description: '',
}

export default function OwnerStoresPage() {
  const navigate = useNavigate()
  const { data: stores, isLoading } = useMyStores()
  const { data: facilities } = useFacilities()
  const createStore = useCreateStore()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [facilityIds, setFacilityIds] = useState<number[]>([])

  function toggleFacility(id: number) {
    setFacilityIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    createStore.mutate(
      {
        ...form,
        province: form.province || null,
        phone: form.phone || null,
        email: form.email || null,
        description: form.description || null,
        facility_ids: facilityIds,
      },
      {
        onSuccess: (store) => navigate(`/owner/stores/${store.id}`),
      },
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Store Saya</h1>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {showForm ? 'Tutup' : 'Tambah Store'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nama" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Kota" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="Provinsi" value={form.province} onChange={(v) => setForm({ ...form, province: v })} />
            <Field label="Telepon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium">Alamat</label>
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Deskripsi</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <p className="text-sm font-medium">Fasilitas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {facilities?.map((facility) => (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() => toggleFacility(facility.id)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    facilityIds.includes(facility.id)
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 text-slate-700'
                  }`}
                >
                  {facility.name}
                </button>
              ))}
            </div>
          </div>

          {createStore.isError && (
            <p className="text-sm text-rose-600">{getErrorMessage(createStore.error)}</p>
          )}

          <button
            type="submit"
            disabled={createStore.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {createStore.isPending ? 'Menyimpan…' : 'Simpan Store'}
          </button>
        </form>
      )}

      {isLoading && <p className="text-slate-600">Memuat…</p>}
      {stores && stores.length === 0 && !showForm && (
        <p className="text-slate-600">Belum ada store. Tambahkan store pertama Anda.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {stores?.map((store) => (
          <Link
            key={store.id}
            to={`/owner/stores/${store.id}`}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{store.name}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700">
                {store.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {store.city ?? '-'} · {store.tables?.length ?? 0} meja
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />
    </div>
  )
}
