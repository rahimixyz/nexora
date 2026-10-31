import { Eye, EyeOff, ShieldCheck, Zap, Globe2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          <p className="muted mt-2 text-sm">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 to-brand-700 p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute bottom-40 -left-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">Your crypto, all in one clean dashboard.</h2>
          <ul className="mt-8 space-y-4 text-white/90">
            <li className="flex items-center gap-3">
              <ShieldCheck size={20} /> Non-custodial and secure by design
            </li>
            <li className="flex items-center gap-3">
              <Zap size={20} /> Instant swaps at the best rates
            </li>
            <li className="flex items-center gap-3">
              <Globe2 size={20} /> Multi-chain portfolio tracking
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Password({ id }: { id: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" required minLength={8} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Show password">
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  return (
    <Shell title="Welcome back" subtitle="Log in to manage your portfolio.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/')
        }}
      >
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" className="input" placeholder="you@example.com" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Password
            </label>
            <a href="#/login" className="mb-1.5 text-sm font-semibold text-brand-600">
              Forgot?
            </a>
          </div>
          <Password id="password" />
        </div>
        <button className="btn-primary w-full py-3">Log in</button>
        <div className="relative py-2 text-center text-xs">
          <span className="absolute inset-x-0 top-1/2 border-t border-slate-200 dark:border-ink-700" />
          <span className="muted relative bg-slate-50 px-3 dark:bg-ink-950">or</span>
        </div>
        <button type="button" onClick={() => navigate('/')} className="btn-ghost w-full py-3">
          Connect wallet
        </button>
      </form>
      <p className="muted mt-6 text-center text-sm">
        New here?{' '}
        <Link to="/register" className="font-semibold text-brand-600">
          Create an account
        </Link>
      </p>
    </Shell>
  )
}

export function Register() {
  const navigate = useNavigate()
  return (
    <Shell title="Create your account" subtitle="Start tracking and trading in minutes.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/')
        }}
      >
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input id="name" className="input" placeholder="Alex Morgan" required />
        </div>
        <div>
          <label className="label" htmlFor="r-email">
            Email
          </label>
          <input id="r-email" type="email" className="input" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label" htmlFor="r-password">
            Password
          </label>
          <Password id="r-password" />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[rgb(var(--brand-600))]" />
          <span className="muted">I agree to the Terms of Service and Privacy Policy.</span>
        </label>
        <button className="btn-primary w-full py-3">Create account</button>
      </form>
      <p className="muted mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600">
          Log in
        </Link>
      </p>
    </Shell>
  )
}
