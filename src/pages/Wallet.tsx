import { ArrowDownLeft, ArrowUpRight, Check, Copy, QrCode } from 'lucide-react'
import { useState } from 'react'
import { Change, CoinIcon, PageHeader, Segmented } from '../components/ui'
import { coins, portfolioValue, watchAddress } from '../data/mock'
import { num, shortAddress, usd } from '../lib/format'

const networks = ['Ethereum', 'BNB Chain', 'Polygon'] as const

export default function WalletPage() {
  const [network, setNetwork] = useState<(typeof networks)[number]>('Ethereum')
  const [copied, setCopied] = useState(false)
  const holdings = coins.filter((c) => c.holding > 0)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(watchAddress)
    } catch {
      /* clipboard may be blocked; the address is still visible */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <>
      <PageHeader title="Wallet" subtitle="Manage your assets, deposit and withdraw." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white lg:col-span-2">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-sm text-white/80">Total balance</p>
            <p className="mt-1 font-display text-4xl font-bold">{usd(portfolioValue)}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg bg-white/15 px-3 py-1.5 font-mono">{shortAddress(watchAddress)}</span>
              <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 hover:bg-white/25">
                {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#deposit" className="btn bg-white text-brand-700 hover:bg-white/90">
                <ArrowDownLeft size={16} /> Deposit
              </a>
              <a href="#withdraw" className="btn bg-white/15 text-white hover:bg-white/25">
                <ArrowUpRight size={16} /> Withdraw
              </a>
            </div>
          </div>
        </section>

        <section id="deposit" className="card card-pad">
          <h2 className="font-display text-base font-semibold">Deposit</h2>
          <div className="mt-4">
            <Segmented options={networks} value={network} onChange={setNetwork} />
          </div>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-ink-700">
              <QrCode size={56} className="text-slate-700 dark:text-slate-300" />
            </div>
            <div className="min-w-0 text-sm">
              <p className="muted">Your {network} address</p>
              <p className="mt-1 break-all font-mono text-xs">{watchAddress}</p>
            </div>
          </div>
          <p className="muted mt-4 text-xs">Only send assets on the {network} network to this address.</p>
        </section>
      </div>

      <section className="card mt-6">
        <h2 className="px-5 pt-5 font-display text-base font-semibold sm:px-6">Your assets</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-ink-800">
                <th className="table-head">Asset</th>
                <th className="table-head text-right">Balance</th>
                <th className="table-head text-right">Price</th>
                <th className="table-head hidden text-right sm:table-cell">24h</th>
                <th className="table-head text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 dark:border-ink-800">
                  <td className="table-cell">
                    <span className="flex items-center gap-3">
                      <CoinIcon coin={c} size={32} />
                      <span>
                        <span className="block font-semibold">{c.name}</span>
                        <span className="muted text-xs">{c.symbol}</span>
                      </span>
                    </span>
                  </td>
                  <td className="table-cell text-right font-medium">
                    {num(c.holding)} {c.symbol}
                  </td>
                  <td className="table-cell text-right">{usd(c.price)}</td>
                  <td className="table-cell hidden text-right sm:table-cell">
                    <Change value={c.change24h} />
                  </td>
                  <td className="table-cell text-right font-semibold">{usd(c.holding * c.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="withdraw" className="card card-pad mt-6">
        <h2 className="font-display text-base font-semibold">Withdraw</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="label" htmlFor="w-asset">
              Asset
            </label>
            <select id="w-asset" className="input">
              {holdings.map((c) => (
                <option key={c.id}>{c.symbol}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="w-amount">
              Amount
            </label>
            <input id="w-amount" className="input" placeholder="0.00" inputMode="decimal" />
          </div>
          <div>
            <label className="label" htmlFor="w-to">
              Recipient address
            </label>
            <input id="w-to" className="input font-mono" placeholder="0x…" />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="btn-primary">Review withdrawal</button>
          </div>
        </form>
      </section>
    </>
  )
}
