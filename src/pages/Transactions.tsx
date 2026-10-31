import { Download, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CoinIcon, PageHeader, StatusBadge } from '../components/ui'
import { coinById, transactions, type TxStatus, type TxType } from '../data/mock'
import { dateTime, num, usd } from '../lib/format'

const PAGE = 10
const types: ('All' | TxType)[] = ['All', 'Buy', 'Sell', 'Swap', 'Deposit', 'Withdraw']
const statuses: ('All' | TxStatus)[] = ['All', 'Completed', 'Pending', 'Failed']

export default function Transactions() {
  const [type, setType] = useState<(typeof types)[number]>('All')
  const [status, setStatus] = useState<(typeof statuses)[number]>('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (type === 'All' || t.type === type) &&
          (status === 'All' || t.status === status) &&
          `${t.id} ${t.hash} ${t.asset}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [type, status, query],
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PAGE, current * PAGE)

  const exportCsv = () => {
    const head = 'ID,Type,Asset,Amount,USD,Date,Status,Hash'
    const body = filtered.map((t) => [t.id, t.type, t.asset.toUpperCase(), t.amount, t.usd.toFixed(2), t.date, t.status, t.hash].join(','))
    const blob = new Blob([[head, ...body].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="All your deposits, withdrawals, trades and swaps."
        actions={
          <button onClick={exportCsv} className="btn-ghost">
            <Download size={16} /> Export CSV
          </button>
        }
      />
      <section className="card">
        <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search ID or hash"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <select
            className="input"
            value={type}
            onChange={(e) => {
              setType(e.target.value as typeof type)
              setPage(1)
            }}
            aria-label="Filter by type"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All types' : t}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as typeof status)
              setPage(1)
            }}
            aria-label="Filter by status"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All statuses' : s}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-slate-100 dark:border-ink-800">
                <th className="table-head">Transaction</th>
                <th className="table-head">Asset</th>
                <th className="table-head text-right">Amount</th>
                <th className="table-head hidden text-right md:table-cell">Value</th>
                <th className="table-head hidden lg:table-cell">Hash</th>
                <th className="table-head hidden sm:table-cell">Date</th>
                <th className="table-head">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const c = coinById(t.asset)!
                return (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-ink-800 dark:hover:bg-ink-850">
                    <td className="table-cell">
                      <span className="block font-semibold">{t.type}</span>
                      <span className="muted text-xs">{t.id}</span>
                    </td>
                    <td className="table-cell">
                      <span className="flex items-center gap-2">
                        <CoinIcon coin={c} size={26} />
                        {c.symbol}
                      </span>
                    </td>
                    <td className="table-cell text-right font-medium">{num(t.amount)}</td>
                    <td className="table-cell hidden text-right md:table-cell">{usd(t.usd)}</td>
                    <td className="table-cell muted hidden font-mono text-xs lg:table-cell">{t.hash}</td>
                    <td className="table-cell muted hidden sm:table-cell">{dateTime(t.date)}</td>
                    <td className="table-cell">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted py-12 text-center text-sm">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm dark:border-ink-800 sm:px-6">
          <span className="muted">
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <button className="btn-ghost px-3 py-1.5" disabled={current === 1} onClick={() => setPage(current - 1)}>
              Previous
            </button>
            <span className="muted px-1">
              {current} / {pages}
            </span>
            <button className="btn-ghost px-3 py-1.5" disabled={current === pages} onClick={() => setPage(current + 1)}>
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
