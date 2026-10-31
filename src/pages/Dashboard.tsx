import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import PortfolioChart from '../components/PortfolioChart'
import { Change, CoinIcon, PageHeader, Segmented, Sparkline, StatusBadge } from '../components/ui'
import { coinById, coins, portfolioHistory, portfolioValue, rangeChangePct, rangeKeys, transactions, type Range } from '../data/mock'
import { dateTime, num, usd } from '../lib/format'

export default function Dashboard() {
  const [range, setRange] = useState<Range>('7D')
  const history = useMemo(() => portfolioHistory(range), [range])
  const holdings = coins.filter((c) => c.holding > 0)
  const allocation = holdings.map((c) => ({ name: c.symbol, value: c.holding * c.price, color: c.color }))
  const dayPnl = holdings.reduce((s, c) => s + (c.holding * c.price * c.change24h) / (100 + c.change24h), 0)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's how your portfolio is doing today."
        actions={
          <>
            <Link to="/wallet" className="btn-ghost">
              <ArrowDownLeft size={16} /> Receive
            </Link>
            <Link to="/swap" className="btn-primary">
              <Plus size={16} /> Buy crypto
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total balance" value={usd(portfolioValue)} change={rangeChangePct('24H')} />
        <Stat label="24h profit / loss" value={usd(dayPnl)} change={(dayPnl / portfolioValue) * 100} />
        <Stat label="Assets held" value={String(holdings.length)} hint="across 3 networks" />
        <Stat label="Staking rewards" value={usd(312.48)} change={4.2} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card card-pad xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="muted text-sm font-medium">Portfolio value</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold">{usd(portfolioValue)}</span>
                <Change value={rangeChangePct(range)} />
              </div>
            </div>
            <Segmented options={rangeKeys} value={range} onChange={setRange} />
          </div>
          <div className="mt-6">
            <PortfolioChart data={history} />
          </div>
        </section>

        <section className="card card-pad">
          <h2 className="font-display text-base font-semibold">Allocation</h2>
          <div className="relative mx-auto mt-4 h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" cx="50%" cy="50%" innerRadius={68} outerRadius={94} paddingAngle={2} stroke="none" isAnimationActive={false}>
                  {allocation.map((a) => (
                    <Cell key={a.name} fill={a.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="muted text-xs">Total</span>
              <span className="font-display text-lg font-bold">{usd(portfolioValue, { compact: true })}</span>
            </div>
          </div>
          <ul className="mt-5 space-y-3">
            {allocation.map((a) => (
              <li key={a.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                  {a.name}
                </span>
                <span className="font-medium">{((a.value / portfolioValue) * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card xl:col-span-2">
          <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
            <h2 className="font-display text-base font-semibold">Top movers</h2>
            <Link to="/markets" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-ink-800">
                  <th className="table-head">Asset</th>
                  <th className="table-head text-right">Price</th>
                  <th className="table-head text-right">24h</th>
                  <th className="table-head hidden w-36 sm:table-cell">Last 24h</th>
                </tr>
              </thead>
              <tbody>
                {[...coins]
                  .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
                  .slice(0, 5)
                  .map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-ink-800 dark:hover:bg-ink-850">
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
                      <td className="table-cell hidden sm:table-cell">
                        <Sparkline data={c.spark} up={c.change24h >= 0} height={34} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card card-pad">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Recent activity</h2>
            <Link to="/transactions" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              See all
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {transactions.slice(0, 6).map((t) => {
              const coin = coinById(t.asset)!
              const out = t.type === 'Sell' || t.type === 'Withdraw'
              const Icon = t.type === 'Swap' ? ArrowLeftRight : out ? ArrowUpRight : ArrowDownLeft
              return (
                <li key={t.id} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-ink-800 dark:text-slate-300">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {t.type} {coin.symbol}
                    </p>
                    <p className="muted text-xs">{dateTime(t.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {out ? '-' : '+'}
                      {num(t.amount)} {coin.symbol}
                    </p>
                    <StatusBadge status={t.status} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </>
  )
}

function Stat({ label, value, change, hint }: { label: string; value: string; change?: number; hint?: string }) {
  return (
    <div className="card card-pad">
      <p className="muted text-sm font-medium">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {change !== undefined && <Change value={change} />}
        <span className="muted">{hint ?? 'vs. yesterday'}</span>
      </div>
    </div>
  )
}
