import clsx from 'clsx'
import { Check, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { PageHeader, Toggle } from '../components/ui'
import { ACCENTS, useTheme } from '../context/ThemeContext'

export default function SettingsPage() {
  const { mode, setMode, accent, setAccent } = useTheme()
  const [prefs, setPrefs] = useState({ price: true, tx: true, news: false, twofa: true })
  const [saved, setSaved] = useState(false)

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Profile, appearance, notifications and security." />
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={save} className="card card-pad lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Profile</h2>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700" />
            <button type="button" className="btn-ghost">
              Change avatar
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input id="name" className="input" defaultValue="Alex Morgan" />
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" className="input" defaultValue="alex@example.com" />
            </div>
            <div>
              <label className="label" htmlFor="currency">
                Display currency
              </label>
              <select id="currency" className="input" defaultValue="USD">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="lang">
                Language
              </label>
              <select id="lang" className="input" defaultValue="English">
                <option>English</option>
                <option>Español</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                <Check size={16} /> Saved
              </span>
            )}
            <button className="btn-primary">Save changes</button>
          </div>
        </form>

        <section className="card card-pad">
          <h2 className="font-display text-base font-semibold">Appearance</h2>
          <p className="label mt-5">Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx(
                  'flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold capitalize transition',
                  mode === m ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-500' : 'border-slate-200 dark:border-ink-700',
                )}
              >
                {m === 'light' ? <Sun size={16} /> : <Moon size={16} />} {m}
              </button>
            ))}
          </div>
          <p className="label mt-6">Accent color</p>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAccent(a.id)}
                title={a.label}
                aria-label={`${a.label} accent`}
                className={clsx('flex h-10 w-10 items-center justify-center rounded-full ring-offset-2 transition dark:ring-offset-ink-900', accent === a.id && 'ring-2 ring-slate-900 dark:ring-white')}
                style={{ background: a.swatch }}
              >
                {accent === a.id && <Check size={18} className="text-white" />}
              </button>
            ))}
          </div>
        </section>

        <section className="card card-pad lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Notifications</h2>
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-ink-800">
            {[
              ['price', 'Price alerts', 'Get notified when assets on your watchlist move more than 5%.'],
              ['tx', 'Transaction updates', 'Deposits, withdrawals and completed swaps.'],
              ['news', 'Product news', 'New features, listings and promotions.'],
            ].map(([key, title, desc]) => (
              <li key={key} className="flex items-center justify-between gap-6 py-4">
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="muted text-sm">{desc}</p>
                </div>
                <Toggle
                  label={title}
                  checked={prefs[key as keyof typeof prefs]}
                  onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="card card-pad">
          <h2 className="font-display text-base font-semibold">Security</h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Two-factor authentication</p>
              <p className="muted text-sm">Protect withdrawals with a one-time code.</p>
            </div>
            <Toggle label="Two-factor authentication" checked={prefs.twofa} onChange={(v) => setPrefs((p) => ({ ...p, twofa: v }))} />
          </div>
          <button className="btn-ghost mt-5 w-full">Change password</button>
        </section>
      </div>
    </>
  )
}
