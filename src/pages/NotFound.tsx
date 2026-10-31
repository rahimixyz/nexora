import { Link } from 'react-router-dom'

export default function NotFound({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className={embedded ? 'py-24 text-center' : 'flex min-h-screen flex-col items-center justify-center px-6 text-center'}>
      <p className="font-display text-7xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="muted mt-2 text-sm">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-8">
        Back to dashboard
      </Link>
    </div>
  )
}
