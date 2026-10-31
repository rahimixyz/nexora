import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PortfolioChart from '../components/PortfolioChart'
import { Change, CoinIcon, Segmented } from '../components/ui'
import { coinById, labelFor, rangeKeys, series, type Range } from '../data/mock'
import { num, usd } from '../lib/format'
import NotFound from './NotFound'

const points: Record<Range, number> = { '24H': 24, '7D': 28, '1M': 30, '1Y': 52 }
const moves: Record<Range, number> = { '24H': 1, '7D': 4.5, '1M': 9, '1Y': 61 }

export default function CoinDetail() {
  const { id = '' } = useParams()
  const coin = coinById(id)
  const [range, setRange] = useState<Range>('24H')
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy')
  const [amount, setAmount] = useState('500')

  const data = useMemo(() => {
    if (!coin) return []
    const change = range === '24H' ? coin.change24h : coin.change24h * moves[range]
    return series(id.length * 31 + points[range], points[range], coin.price / (1 + change / 100), change).map((v, i) => ({
      label: labelFor(range, i, points[range]),
      value: v,
    }))
  }, [coin, id, range])

  if (!coin) return <NotFound embedded />

  const receive = Number(amount || 0) / coin.price

  return (
    <>
      <Link to="/markets" className="muted mb-4 inline-flex items-center gap-1.5 text-sm font-medium hover:text-slate-900 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to markets
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <CoinIcon coin={coin} size={48} />
        <div>
          <h1 className="font-display text-2xl font-bold">
            {coin.name} <span className="muted text-lg font-semibold">{coin.symbol}</span>
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-display text-xl font-bold">{usd(coin.price)}</span>
            <Change value={coin.change24h} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card card-pad xl:col-span-2">
          <div className="flex justify-end">
            <Segmented options={rangeKeys} value={range} onChange={setRange} />
          </div>
          <div className="mt-4">
            <PortfolioChart data={data} height={320} />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 dark:border-ink-800 md:grid-cols-4">
            {[
              ['Market cap', usd(coin.marketCap, { compact: true })],
              ['Volume (24h)', usd(coin.volume24h, { compact: true })],
              ['24h high', usd(coin.price * 1.021)],
              ['24h low', usd(coin.price * 0.968)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="muted text-xs font-medium">{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card card-pad">
          <Segmented options={['Buy', 'Sell'] as const} value={side} onChange={setSide} />
          <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="label" htmlFor="amount">
                Amount (USD)
              </label>
              <input id="amount" className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} />
            </div>
            <div className="flex gap-2">
              {[100, 250, 500, 1000].map((v) => (
                <button key={v} type="button" onClick={() => setAmount(String(v))} className="btn-ghost flex-1 px-2 py-1.5 text-xs">
                  ${v}
                </button>
              ))}
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-ink-850">
              <div className="flex justify-between">
                <span className="muted">You {side === 'Buy' ? 'receive' : 'sell'}</span>
                <span className="font-semibold">
                  {num(receive, 6)} {coin.symbol}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="muted">Fee (0.25%)</span>
                <span className="font-semibold">{usd(Number(amount || 0) * 0.0025)}</span>
              </div>
            </div>
            <button className="btn-primary w-full" disabled={!Number(amount)}>
              {side} {coin.symbol}
            </button>
            <p className="muted text-center text-xs">You currently hold {num(coin.holding)} {coin.symbol}</p>
          </form>
        </section>
      </div>
    </>
  )
}
