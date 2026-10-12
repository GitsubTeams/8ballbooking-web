import { useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { formatCurrency } from '@/lib/format'
import { useTableMutations, useTableTypeMutations } from '@/features/owner/hooks'
import type { Store } from '@/types/booking'

const emptyType = { name: '', description: '' }
const emptyTable = {
  table_type_id: '',
  code: '',
  name: '',
  capacity: '4',
  price_per_hour: '50000',
}

export default function CatalogSection({ store }: { store: Store }) {
  const types = store.table_types ?? []
  const tables = store.tables ?? []
  const typeMutations = useTableTypeMutations(store.id)
  const tableMutations = useTableMutations(store.id)

  const [typeForm, setTypeForm] = useState(emptyType)
  const [tableForm, setTableForm] = useState(emptyTable)

  function addType(event: React.FormEvent) {
    event.preventDefault()
    typeMutations.create.mutate(
      { name: typeForm.name, description: typeForm.description || null },
      { onSuccess: () => setTypeForm(emptyType) },
    )
  }

  function addTable(event: React.FormEvent) {
    event.preventDefault()
    tableMutations.create.mutate(
      {
        table_type_id: tableForm.table_type_id ? Number(tableForm.table_type_id) : null,
        code: tableForm.code,
        name: tableForm.name,
        capacity: Number(tableForm.capacity),
        price_per_hour: Number(tableForm.price_per_hour),
      },
      { onSuccess: () => setTableForm(emptyTable) },
    )
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="font-semibold">Tipe Meja</h2>
        <div className="space-y-2">
          {types.length === 0 && <p className="text-sm text-slate-500">Belum ada tipe meja.</p>}
          {types.map((type) => (
            <div
              key={type.id}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium">{type.name}</span>
                {type.description && (
                  <span className="ml-2 text-slate-500">{type.description}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => typeMutations.remove.mutate(type.id)}
                className="text-rose-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={addType} className="flex flex-wrap items-end gap-2">
          <input
            required
            placeholder="Nama tipe"
            value={typeForm.name}
            onChange={(event) => setTypeForm({ ...typeForm, name: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <input
            placeholder="Deskripsi"
            value={typeForm.description}
            onChange={(event) => setTypeForm({ ...typeForm, description: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            disabled={typeMutations.create.isPending}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            Tambah
          </button>
        </form>
        {typeMutations.create.isError && (
          <p className="text-sm text-rose-600">{getErrorMessage(typeMutations.create.error)}</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Meja</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Kode</th>
                <th className="py-2">Nama</th>
                <th className="py-2">Tipe</th>
                <th className="py-2">Kapasitas</th>
                <th className="py-2">Harga/Jam</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.id} className="border-t border-slate-100">
                  <td className="py-2 font-medium">{table.code}</td>
                  <td className="py-2">{table.name}</td>
                  <td className="py-2">{table.type?.name ?? '-'}</td>
                  <td className="py-2">{table.capacity}</td>
                  <td className="py-2">{formatCurrency(table.price_per_hour)}</td>
                  <td className="py-2 capitalize">{table.status}</td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        tableMutations.update.mutate({
                          id: table.id,
                          payload: {
                            table_type_id: table.table_type_id,
                            code: table.code,
                            name: table.name,
                            capacity: table.capacity,
                            price_per_hour: Number(table.price_per_hour),
                            status: table.status === 'available' ? 'maintenance' : 'available',
                          },
                        })
                      }
                      className="text-slate-600 hover:underline"
                    >
                      {table.status === 'available' ? 'Maintenance' : 'Aktifkan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => tableMutations.remove.mutate(table.id)}
                      className="ml-3 text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {tables.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-2 text-slate-500">
                    Belum ada meja.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={addTable} className="flex flex-wrap items-end gap-2">
          <input
            required
            placeholder="Kode"
            value={tableForm.code}
            onChange={(event) => setTableForm({ ...tableForm, code: event.target.value })}
            className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <input
            required
            placeholder="Nama"
            value={tableForm.name}
            onChange={(event) => setTableForm({ ...tableForm, name: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <select
            value={tableForm.table_type_id}
            onChange={(event) => setTableForm({ ...tableForm, table_type_id: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            <option value="">Tanpa tipe</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={tableForm.capacity}
            onChange={(event) => setTableForm({ ...tableForm, capacity: event.target.value })}
            className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <input
            type="number"
            min={0}
            value={tableForm.price_per_hour}
            onChange={(event) => setTableForm({ ...tableForm, price_per_hour: event.target.value })}
            className="w-28 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            disabled={tableMutations.create.isPending}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            Tambah Meja
          </button>
        </form>
        {tableMutations.create.isError && (
          <p className="text-sm text-rose-600">{getErrorMessage(tableMutations.create.error)}</p>
        )}
      </section>
    </div>
  )
}
