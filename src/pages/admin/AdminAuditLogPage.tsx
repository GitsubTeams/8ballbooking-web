import { useState } from 'react'
import { formatDateTime } from '@/lib/format'
import { useAdminAuditLogs } from '@/features/admin/hooks'
import type { AuditLogEntry } from '@/types/admin'

function summarize(entry: AuditLogEntry): string {
  if (!entry.new) return '-'
  return Object.entries(entry.new)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(', ')
}

export default function AdminAuditLogPage() {
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminAuditLogs({
    action: action || undefined,
    page,
  })

  const logs = data?.logs ?? []
  const meta = data?.meta

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Log</h1>

      <input
        value={action}
        onChange={(event) => {
          setAction(event.target.value)
          setPage(1)
        }}
        placeholder="Cari aksi (mis. store.status, user.roles)…"
        className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />

      {isLoading && <p className="text-slate-600">Memuat…</p>}
      {!isLoading && logs.length === 0 && (
        <p className="text-sm text-slate-500">Belum ada aktivitas.</p>
      )}

      <ul className="space-y-2">
        {logs.map((entry) => (
          <li
            key={entry.id}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-medium text-slate-800">{entry.action}</span>
              <span className="text-xs text-slate-500">{formatDateTime(entry.created_at)}</span>
            </div>
            <div className="mt-1 text-slate-600">
              {entry.user ? `${entry.user.name} (${entry.user.email})` : 'Sistem'}
              {entry.model_type && (
                <span className="text-slate-400">
                  {' · '}
                  {entry.model_type.split('\\').pop()}
                  {entry.model_id ? ` #${entry.model_id}` : ''}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500">{summarize(entry)}</div>
            {entry.ip && <div className="mt-0.5 text-xs text-slate-400">IP {entry.ip}</div>}
          </li>
        ))}
      </ul>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center gap-3 text-sm">
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
    </section>
  )
}
