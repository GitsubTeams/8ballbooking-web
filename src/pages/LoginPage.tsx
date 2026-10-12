import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useLogin } from '@/features/auth/hooks'
import { getErrorMessage } from '@/lib/errors'

const schema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => navigate(from, { replace: true }),
    })
  })

  return (
    <section className="mx-auto max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Masuk</h1>
        <p className="text-sm text-slate-600">Masuk untuk mengelola booking kamu.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {login.isError && <p className="text-sm text-red-600">{getErrorMessage(login.error)}</p>}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {login.isPending ? 'Memproses…' : 'Masuk'}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-slate-900 underline">
          Daftar
        </Link>
      </p>
    </section>
  )
}
