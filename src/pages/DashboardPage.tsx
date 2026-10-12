import { useMe } from '@/features/auth/hooks'
import { useAuthStore } from '@/stores/auth'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { isLoading } = useMe()

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {isLoading ? (
        <p className="text-slate-600">Memuat…</p>
      ) : (
        <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-4">
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-slate-600">{user?.email}</p>
          <p className="text-sm text-slate-500">Role: {user?.roles.join(', ') || '-'}</p>
        </div>
      )}
    </section>
  )
}
