import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useAuthStore } from '@/stores/auth'

const appKey = import.meta.env.VITE_REVERB_APP_KEY
const host = import.meta.env.VITE_REVERB_HOST ?? 'localhost'
const port = Number(import.meta.env.VITE_REVERB_PORT ?? 8080)
const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http'
const forceTLS = scheme === 'https'

const apiBase = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/api\/v1\/?$/, '')

let echo: Echo<'reverb'> | null = null

export function getEcho(): Echo<'reverb'> | null {
  const token = useAuthStore.getState().token

  if (!token) {
    return null
  }

  if (echo) {
    return echo
  }

  echo = new Echo<'reverb'>({
    broadcaster: 'reverb',
    key: appKey,
    Pusher,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${apiBase}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  return echo
}

export function destroyEcho(): void {
  echo?.disconnect()
  echo = null
}