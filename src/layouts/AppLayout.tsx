import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Toaster from '@/components/Toaster'
import NotificationBell from '@/features/notifications/NotificationBell'
import { useRealtimeNotifications } from '@/features/notifications/hooks'
import { useLogout } from '@/features/auth/hooks'
import { useAuthStore } from '@/stores/auth'

export default function AppLayout() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  useRealtimeNotifications()

  const isOwner = Boolean(
    user && (user.roles.includes('store_owner') || user.roles.includes('super_admin')),
  )
  const isAdmin = Boolean(user && user.roles.includes('super_admin'))

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            8BallBooking
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/stores" className="text-slate-600 hover:text-slate-900">
              Cari Meja
            </Link>
            {user && (
              <Link to="/bookings" className="text-slate-600 hover:text-slate-900">
                Booking Saya
              </Link>
            )}
            {user && (
              <Link to="/favorites" className="text-slate-600 hover:text-slate-900">
                Favorit
              </Link>
            )}
            {user && (
              <Link to="/loyalty" className="text-slate-600 hover:text-slate-900">
                Poin
              </Link>
            )}
            {isOwner && (
              <Link to="/owner" className="text-slate-600 hover:text-slate-900">
                Kelola
              </Link>
            )}
            {isOwner && (
              <Link to="/owner/bookings" className="text-slate-600 hover:text-slate-900">
                Booking Masuk
              </Link>
            )}
            {isOwner && (
              <Link to="/owner/wallet" className="text-slate-600 hover:text-slate-900">
                Dompet
              </Link>
            )}
            {isAdmin && (
              <>
                <Link to="/admin" className="text-slate-600 hover:text-slate-900">
                  Admin
                </Link>
                <Link to="/admin/stores" className="text-slate-600 hover:text-slate-900">
                  Tenant
                </Link>
                <Link to="/admin/withdrawals" className="text-slate-600 hover:text-slate-900">
                  Penarikan
                </Link>
                <Link to="/admin/users" className="text-slate-600 hover:text-slate-900">
                  Pengguna
                </Link>
                <Link to="/admin/settings" className="text-slate-600 hover:text-slate-900">
                  Pengaturan
                </Link>
                <Link to="/admin/audit-logs" className="text-slate-600 hover:text-slate-900">
                  Audit
                </Link>
              </>
            )}
            {user && (
              <Link to="/profile" className="text-slate-600 hover:text-slate-900">
                Profil
              </Link>
            )}
            {user && <NotificationBell />}
            {user ? (
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
              >
                {logout.isPending ? 'Keluar…' : 'Logout'}
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Suspense fallback={<p className="text-slate-600">Memuat…</p>}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster />
    </div>
  )
}
