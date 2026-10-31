import clsx from 'clsx'
import {
  ArrowLeftRight,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Moon,
  ReceiptText,
  Search,
  Settings,
  Sun,
  Wallet,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { watchAddress } from '../data/mock'
import { shortAddress } from '../lib/format'
import Logo from './Logo'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/markets', label: 'Markets', icon: LineChart },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/swap', label: 'Swap', icon: ArrowLeftRight },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link to="/" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-500'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-white',
              )
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white">
        <p className="font-display text-sm font-semibold">Earn up to 8.5% APY</p>
        <p className="mt-1 text-xs text-white/80">Stake your idle assets and earn rewards every day.</p>
        <Link to="/wallet" onClick={onNavigate} className="mt-3 inline-block rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700">
          Start staking
        </Link>
      </div>
      <Link
        to="/login"
        onClick={onNavigate}
        className="mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-ink-800"
      >
        <LogOut size={19} /> Log out
      </Link>
    </div>
  )
}

export default function Layout() {
  const { mode, toggleMode } = useTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white dark:border-ink-800 dark:bg-ink-900 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-ink-900">
            <button className="absolute right-3 top-4 rounded-lg p-2 text-slate-500" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80 sm:px-6">
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="relative hidden max-w-sm flex-1 md:block">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search coins, transactions…" />
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleMode}
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800"
            aria-label="Toggle dark mode"
          >
            {mode === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-800" aria-label="Notifications">
            <Bell size={19} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white dark:ring-ink-950" />
          </button>
          <button className="hidden items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 text-sm font-medium dark:border-ink-700 sm:flex">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700" />
            {shortAddress(watchAddress)}
            <ChevronDown size={15} className="text-slate-400" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}
