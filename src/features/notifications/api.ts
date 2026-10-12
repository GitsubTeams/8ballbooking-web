import { api } from '@/lib/axios'
import type { ApiEnvelope, PaginationMeta } from '@/types/api'
import type { AppNotification } from '@/types/notification'

export async function fetchNotifications(page = 1) {
  const { data } = await api.get<ApiEnvelope<AppNotification[]> & { meta: PaginationMeta }>(
    '/notifications',
    { params: { page } },
  )
  return { notifications: data.data, meta: data.meta }
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await api.get<ApiEnvelope<{ count: number }>>('/notifications/unread-count')
  return data.data.count
}

export async function markRead(id: number | string): Promise<void> {
  await api.post(`/notifications/${id}/read`)
}

export async function markAllRead(): Promise<void> {
  await api.post('/notifications/read-all')
}
