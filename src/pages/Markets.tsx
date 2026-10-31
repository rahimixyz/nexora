import clsx from 'clsx'
import { Search, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Change, CoinIcon, PageHeader, Segmented, Sparkline } from '../components/ui'
import { coins } from '../data/mock'
import { usd } from '../lib/format'

const tabs = ['All', 'Gainers', 'Losers', 'Watchlist'] as const
type Tab = (typeof tabs)[number]

export default function Markets() {
  const [tab, setTab] = useState<Tab>('All')
  const [query, setQuery] = useState('')
  const [watch, setWatch] = useState<string[]>(['btc', 'eth', 'sol'])

  const list = useMemo(() => {
    let l = coins.filter((c) => `${c.name} ${c.symbol}`.toLowerCase().includes(query.toLowerCase()))
    if (tab === 'Gainers') l = l.filter((c) => c.change24h > 0).sort((a, b) => b.change24h - a.change24h)
    if (tab === 'Losers') l = l.filter((c) => c.change24h < 0).sort((a, b) => a.change24h - b.change24h)
    if (tab === 'Watchlist') l = l.filter((c) => watch.includes(c.id))
    return l
  }, [tab, query, watch])

  const toggleWatch = (id: string) => setWatch((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
  const totalCap = coins.reduce((s, c) => s + c.marketCap, 0)
  const totalVol = coins.reduce((s, c) => s + c.volume24h, 0)

  return (
    <>
      <PageHeader title="Markets" subtitle="Live prices, market cap and 24h performance." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Highlight label="Market cap" value={usd(totalCap, { compact: true })} change={1.42} />
        <Highlight label="24h volume" value={usd(totalVol, { compact: true })} change={-3.18} />
        <Highlight label="BTC dominance" value={`${((coins[0].marketCap / totalCap) * 100).toFixed(1)}%`} change={0.35} />
      </div>

      <section className="card mt-6">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <Segmented options={tabs} value={tab} onChange={setTab} />
          <div className="relative sm:w-64">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search asset" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-slate-100 dark:border-ink-800">
                <th className="table-head w-10" />
                <th className="table-head">#</th>
                <th className="table-head">Asset</th>
                <th className="table-head text-right">Price</th>
                <th className="table-head text-right">24h</th>
                <th className="table-head hidden text-right md:table-cell">Market cap</th>
                <th className="table-head hidden text-right lg:table-cell">Volume (24h)</th>
                <th className="table-head hidden w-40 md:table-cell">Last 24h</th>
                <th className="table-head" />
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-ink-800 dark:hover:bg-ink-850">
                  <td className="table-cell">
                    <button onClick={() => toggleWatch(c.id)} aria-label={`Add ${c.name} to watchlist`}>
                      <Star
                        size={17}
                        className={clsx(watch.includes(c.id) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600')}
                      />
                    </button>
                  </td>
                  <td className="table-cell muted">{coins.indexOf(c) + 1}</td>
                  <td className="table-cell">
                    <Link to={`/markets/${c.id}`} className="flex items-center gap-3">
                      <CoinIcon coin={c} size={32} />
                      <span>
                        <span className="block font-semibold">{c.name}</span>
                        <span className="muted text-xs">{c.symbol}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="table-cell text-right font-medium">{usd(c.price)}</td>
                  <td className="table-cell text-right">
                    <Change value={c.change24h} />
                  </td>
                  <td className="table-cell hidden text-right md:table-cell">{usd(c.marketCap, { compact: true })}</td>
                  <td className="table-cell hidden text-right lg:table-cell">{usd(c.volume24h, { compact: true })}</td>
                  <td className="table-cell hidden md:table-cell">
                    <Sparkline data={c.spark} up={c.change24h >= 0} height={36} />
                  </td>
                  <td className="table-cell text-right">
                    <Link to="/swap" className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-500">
                      Trade
                    </Link>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={9} className="muted py-12 text-center text-sm">
                    No assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Highlight({ label, value, change }: { label: string; value: string; change: number }) {
  return (
    <div className="card card-pad flex items-center justify-between">
      <div>
        <p className="muted text-sm font-medium">{label}</p>
        <p className="mt-1 font-display text-xl font-bold">{value}</p>
      </div>
      <Change value={change} />
    </div>
  )
}
