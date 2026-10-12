import { useState } from 'react'
import { formatDateTime } from '@/lib/format'
import {
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from '@/features/notifications/hooks'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const unread = useUnreadCount()
  const list = useNotifications(open)
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const count = unread.data ?? 0
  const notifications = list.data?.notifications ?? []

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifikasi"
        className="relative text-slate-600 hover:text-slate-900"
      >
        <span className="text-lg">🔔</span>
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <span className="text-sm font-semibold">Notifikasi</span>
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending || count === 0}
              className="text-xs text-slate-500 hover:text-slate-900 disabled:opacity-50"
            >
              Tandai semua dibaca
            </button>
          </div>

          <div className="max-h-80 overflow-auto">
            {list.isLoading && <p className="px-3 py-4 text-sm text-slate-500">Memuat…</p>}
            {!list.isLoading && notifications.length === 0 && (
              <p className="px-3 py-4 text-sm text-slate-500">Belum ada notifikasi.</p>
            )}
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  if (!notification.read_at) {
                    markRead.mutate(notification.id)
                  }
                }}
                className={`block w-full border-b border-slate-50 px-3 py-2 text-left hover:bg-slate-50 ${
                  notification.read_at ? 'opacity-60' : ''
                }`}
              >
                <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                <p className="text-xs text-slate-600">{notification.body}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {formatDateTime(notification.created_at)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
