import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useRegister } from '@/features/auth/hooks'
import { getErrorMessage } from '@/lib/errors'

const schema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Konfirmasi password tidak cocok',
  })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const registerAccount = useRegister()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit((values) => {
    registerAccount.mutate(values, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    })
  })

  return (
    <section className="mx-auto max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Daftar</h1>
        <p className="text-sm text-slate-600">Buat akun untuk mulai booking.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="name">
            Nama
          </label>
          <input
            id="name"
            autoComplete="name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            {...register('name')}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

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
            autoComplete="new-password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password_confirmation">
            Konfirmasi Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            {...register('password_confirmation')}
          />
          {errors.password_confirmation && (
            <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
          )}
        </div>

        {registerAccount.isError && (
          <p className="text-sm text-red-600">{getErrorMessage(registerAccount.error)}</p>
        )}

        <button
          type="submit"
          disabled={registerAccount.isPending}
          className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {registerAccount.isPending ? 'Memproses…' : 'Daftar'}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-slate-900 underline">
          Masuk
        </Link>
      </p>
    </section>
  )
}
