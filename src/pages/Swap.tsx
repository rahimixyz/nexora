import { ArrowDownUp, ChevronDown, Info, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { CoinIcon, PageHeader } from '../components/ui'
import { coinById, coins, type Coin } from '../data/mock'
import { num, usd } from '../lib/format'

const FEE = 0.003 // 0.3% platform fee, change this to your own value
const slippages = ['0.1', '0.5', '1.0']

export default function Swap() {
  const [from, setFrom] = useState<Coin>(coinById('eth')!)
  const [to, setTo] = useState<Coin>(coinById('usdt')!)
  const [amount, setAmount] = useState('1')
  const [slippage, setSlippage] = useState('0.5')

  const value = Number(amount || 0) * from.price
  const out = (value * (1 - FEE)) / to.price
  const rate = from.price / to.price

  const flip = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <>
      <PageHeader title="Swap" subtitle="Exchange tokens instantly at the best available rate." />
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card card-pad lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Swap tokens</h2>
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-ink-800" aria-label="Swap settings">
              <Settings2 size={18} />
            </button>
          </div>

          <div className="mt-5 space-y-1">
            <TokenBox label="You pay" coin={from} onCoin={setFrom} exclude={to.id}>
              <input
                className="w-full min-w-0 bg-transparent font-display text-2xl font-bold outline-none sm:text-3xl"
                value={amount}
                inputMode="decimal"
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                aria-label="Amount to pay"
              />
              <p className="muted mt-1 text-xs">
                ≈ {usd(value)} · Balance {num(from.holding)} {from.symbol}
              </p>
            </TokenBox>

            <div className="relative z-10 -my-3 flex justify-center">
              <button
                onClick={flip}
                className="rounded-xl border-4 border-white bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 dark:border-ink-900 dark:bg-ink-800 dark:text-slate-200"
                aria-label="Switch tokens"
              >
                <ArrowDownUp size={18} />
              </button>
            </div>

            <TokenBox label="You receive" coin={to} onCoin={setTo} exclude={from.id}>
              <p className="truncate font-display text-2xl font-bold sm:text-3xl">{num(out, 6)}</p>
              <p className="muted mt-1 text-xs">≈ {usd(out * to.price)}</p>
            </TokenBox>
          </div>

          <div className="mt-5 space-y-2.5 rounded-xl bg-slate-50 p-4 text-sm dark:bg-ink-850">
            <Row k="Rate" v={`1 ${from.symbol} = ${num(rate, 6)} ${to.symbol}`} />
            <Row k={`Platform fee (${FEE * 100}%)`} v={usd(value * FEE)} />
            <Row k="Network fee" v="~ $1.84" />
            <Row k="Minimum received" v={`${num(out * (1 - Number(slippage) / 100), 6)} ${to.symbol}`} />
          </div>

          <button className="btn-primary mt-5 w-full py-3.5 text-base" disabled={!Number(amount) || Number(amount) > from.holding}>
            {Number(amount) > from.holding ? `Insufficient ${from.symbol} balance` : 'Swap'}
          </button>
        </section>

        <aside className="space-y-6 lg:col-span-2">
          <section className="card card-pad">
            <h3 className="font-display text-sm font-semibold">Slippage tolerance</h3>
            <div className="mt-3 flex gap-2">
              {slippages.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={
                    slippage === s
                      ? 'btn flex-1 bg-brand-600 py-2 text-white'
                      : 'btn-ghost flex-1 py-2'
                  }
                >
                  {s}%
                </button>
              ))}
            </div>
            <p className="muted mt-3 flex gap-2 text-xs">
              <Info size={14} className="mt-0.5 shrink-0" />
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>
          </section>
          <section className="card card-pad">
            <h3 className="font-display text-sm font-semibold">Popular pairs</h3>
            <ul className="mt-3 space-y-2">
              {[
                ['eth', 'usdt'],
                ['btc', 'usdt'],
                ['sol', 'usdt'],
                ['bnb', 'eth'],
              ].map(([a, b]) => {
                const ca = coinById(a)!
                const cb = coinById(b)!
                return (
                  <li key={a + b}>
                    <button
                      onClick={() => {
                        setFrom(ca)
                        setTo(cb)
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-ink-850"
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        <span className="flex -space-x-2">
                          <CoinIcon coin={ca} size={24} />
                          <CoinIcon coin={cb} size={24} />
                        </span>
                        {ca.symbol}/{cb.symbol}
                      </span>
                      <span className="muted">{num(ca.price / cb.price, 4)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </aside>
      </div>
    </>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="muted">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  )
}

function TokenBox({
  label,
  coin,
  onCoin,
  exclude,
  children,
}: {
  label: string
  coin: Coin
  onCoin: (c: Coin) => void
  exclude: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-ink-700">
      <p className="muted text-xs font-medium">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="min-w-0 flex-1">{children}</div>
        <label className="relative flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-slate-100 py-2 pl-2 pr-8 font-semibold dark:bg-ink-800">
          <CoinIcon coin={coin} size={26} />
          {coin.symbol}
          <ChevronDown size={16} className="pointer-events-none absolute right-2.5 text-slate-500" />
          <select
            className="absolute inset-0 cursor-pointer opacity-0"
            value={coin.id}
            onChange={(e) => onCoin(coinById(e.target.value)!)}
            aria-label={`${label} token`}
          >
            {coins
              .filter((c) => c.id !== exclude)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.symbol} - {c.name}
                </option>
              ))}
          </select>
        </label>
      </div>
    </div>
  )
}
