import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export default function RequireRole({ roles }: { roles: string[] }) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user && !roles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
