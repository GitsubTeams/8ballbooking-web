import { useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { useUpdatePassword, useUpdateProfile } from '@/features/auth/hooks'
import { useAuthStore } from '@/stores/auth'

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const updateProfile = useUpdateProfile()
  const updatePassword = useUpdatePassword()

  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
  })
  const [password, setPassword] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  function submitProfile(event: React.FormEvent) {
    event.preventDefault()
    updateProfile.mutate(profile, { onSuccess: () => undefined })
  }

  function submitPassword(event: React.FormEvent) {
    event.preventDefault()
    updatePassword.mutate(password, {
      onSuccess: () => setPassword({ current_password: '', password: '', password_confirmation: '' }),
    })
  }

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold">Profil</h1>

      <form
        onSubmit={submitProfile}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-4"
      >
        <h2 className="font-semibold">Informasi Akun</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
        </div>
        {updateProfile.isError && (
          <p className="text-sm text-rose-600">{getErrorMessage(updateProfile.error)}</p>
        )}
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {updateProfile.isPending ? 'Menyimpan…' : 'Simpan Profil'}
        </button>
      </form>

      <form
        onSubmit={submitPassword}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-4"
      >
        <h2 className="font-semibold">Ganti Password</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">Password Saat Ini</label>
            <input
              type="password"
              value={password.current_password}
              onChange={(event) => setPassword({ ...password, current_password: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password Baru</label>
            <input
              type="password"
              value={password.password}
              onChange={(event) => setPassword({ ...password, password: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Konfirmasi</label>
            <input
              type="password"
              value={password.password_confirmation}
              onChange={(event) =>
                setPassword({ ...password, password_confirmation: event.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
        </div>
        {updatePassword.isError && (
          <p className="text-sm text-rose-600">{getErrorMessage(updatePassword.error)}</p>
        )}
        <button
          type="submit"
          disabled={updatePassword.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {updatePassword.isPending ? 'Menyimpan…' : 'Ganti Password'}
        </button>
      </form>
    </section>
  )
}
