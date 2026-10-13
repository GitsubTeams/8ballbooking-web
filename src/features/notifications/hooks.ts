import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as notificationApi from '@/features/notifications/api'
import { destroyEcho, getEcho } from '@/lib/echo'
import { useAuthStore } from '@/stores/auth'

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.fetchNotifications(),
    enabled,
  })
}

export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationApi.fetchUnreadCount,
    enabled,
    refetchInterval: 60_000,
  })
}

export function useRealtimeNotifications() {
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) {
      destroyEcho()
      return
    }

    const echo = getEcho()

    if (!echo) {
      return
    }

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] })
    }

    const channel = echo.private(`user.${user.id}`)

    channel.listen('.booking.created', refresh)
    channel.listen('.booking.status-changed', refresh)
    channel.listen('.payment.paid', refresh)

    return () => {
      channel.stopListening('.booking.created')
      channel.stopListening('.booking.status-changed')
      channel.stopListening('.payment.paid')
      echo.leave(`user.${user.id}`)
    }
  }, [user, queryClient])
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => notificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
