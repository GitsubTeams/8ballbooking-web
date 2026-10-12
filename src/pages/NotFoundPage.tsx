import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-slate-600">Halaman tidak ditemukan.</p>
      <Link to="/" className="text-sm font-medium text-slate-900 underline">
        Kembali ke beranda
      </Link>
    </section>
  )
}
