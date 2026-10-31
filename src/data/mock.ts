// Demo data for the template. Replace these with calls to your own API or a market data provider.

/** Small seeded random generator so demo charts look the same on every load. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Builds a price series that drifts toward the given change percentage. */
export function series(seed: number, points: number, start: number, changePct: number) {
  const rnd = seeded(seed)
  const end = start * (1 + changePct / 100)
  const out: number[] = []
  let v = start
  for (let i = 0; i < points; i++) {
    const target = start + ((end - start) * i) / (points - 1)
    v = v + (target - v) * 0.35 + (rnd() - 0.5) * start * 0.025
    out.push(Number(v.toFixed(4)))
  }
  out[points - 1] = end
  return out
}

export interface Coin {
  id: string
  name: string
  symbol: string
  color: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  holding: number
  spark: number[]
}

const base: Omit<Coin, 'spark'>[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: '#f7931a', price: 68420.15, change24h: 2.34, marketCap: 1.35e12, volume24h: 31.2e9, holding: 0.4821 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627eea', price: 3512.88, change24h: -1.12, marketCap: 4.22e11, volume24h: 15.8e9, holding: 4.215 },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', color: '#f3ba2f', price: 588.4, change24h: 0.86, marketCap: 8.7e10, volume24h: 1.9e9, holding: 12.5 },
  { id: 'sol', name: 'Solana', symbol: 'SOL', color: '#14b8a6', price: 162.73, change24h: 5.41, marketCap: 7.4e10, volume24h: 3.4e9, holding: 38.2 },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', color: '#26a17b', price: 1.0, change24h: 0.01, marketCap: 1.1e11, volume24h: 52.1e9, holding: 4250 },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', color: '#64748b', price: 0.5821, change24h: -2.48, marketCap: 3.2e10, volume24h: 1.2e9, holding: 0 },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', color: '#2563eb', price: 0.4612, change24h: 1.73, marketCap: 1.6e10, volume24h: 0.42e9, holding: 0 },
  { id: 'avax', name: 'Avalanche', symbol: 'AVAX', color: '#e84142', price: 36.18, change24h: -0.64, marketCap: 1.4e10, volume24h: 0.51e9, holding: 0 },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', color: '#e6007a', price: 7.12, change24h: 3.05, marketCap: 1.0e10, volume24h: 0.28e9, holding: 0 },
  { id: 'link', name: 'Chainlink', symbol: 'LINK', color: '#375bd2', price: 17.94, change24h: -3.21, marketCap: 1.05e10, volume24h: 0.61e9, holding: 0 },
  { id: 'matic', name: 'Polygon', symbol: 'POL', color: '#8247e5', price: 0.7231, change24h: 2.11, marketCap: 6.9e9, volume24h: 0.33e9, holding: 0 },
  { id: 'arb', name: 'Arbitrum', symbol: 'ARB', color: '#28a0f0', price: 1.08, change24h: -1.87, marketCap: 3.1e9, volume24h: 0.29e9, holding: 0 },
]

export const coins: Coin[] = base.map((c, i) => ({
  ...c,
  spark: series(i + 7, 24, c.price / (1 + c.change24h / 100), c.change24h),
}))

export const coinById = (id: string) => coins.find((c) => c.id === id)

export const portfolioValue = coins.reduce((sum, c) => sum + c.holding * c.price, 0)

const RANGES = { '24H': 24, '7D': 28, '1M': 30, '1Y': 52 } as const
export type Range = keyof typeof RANGES
export const rangeKeys = Object.keys(RANGES) as Range[]

const rangeChange: Record<Range, number> = { '24H': 1.86, '7D': 6.4, '1M': 12.9, '1Y': 84.2 }

export function portfolioHistory(range: Range) {
  const n = RANGES[range]
  const startValue = portfolioValue / (1 + rangeChange[range] / 100)
  const values = series(range.length * 13 + n, n, startValue, rangeChange[range])
  return values.map((value, i) => ({ label: labelFor(range, i, n), value: Math.round(value) }))
}
export const rangeChangePct = (r: Range) => rangeChange[r]

export function labelFor(range: Range, i: number, n: number) {
  const now = new Date(2026, 9, 31, 16)
  if (range === '24H') {
    const d = new Date(now.getTime() - (n - 1 - i) * 3600e3)
    return `${String(d.getHours()).padStart(2, '0')}:00`
  }
  const step = range === '1Y' ? 7 : range === '7D' ? 0.25 : 1
  const d = new Date(now.getTime() - (n - 1 - i) * step * 86400e3)
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return range === '7D' ? `${day}, ${String(d.getHours()).padStart(2, '0')}:00` : day
}

export type TxType = 'Buy' | 'Sell' | 'Swap' | 'Deposit' | 'Withdraw'
export type TxStatus = 'Completed' | 'Pending' | 'Failed'

export interface Transaction {
  id: string
  type: TxType
  asset: string
  amount: number
  usd: number
  date: string
  status: TxStatus
  hash: string
}

const txTypes: TxType[] = ['Buy', 'Sell', 'Swap', 'Deposit', 'Withdraw']
const txStatus: TxStatus[] = ['Completed', 'Completed', 'Completed', 'Pending', 'Failed']

export const transactions: Transaction[] = Array.from({ length: 36 }, (_, i) => {
  const rnd = seeded(100 + i)
  const coin = coins[(i * 7 + 3) % 6]
  const amount = Number(((rnd() * 2000 + 50) / coin.price).toFixed(coin.price > 100 ? 4 : 2))
  const d = new Date(2026, 9, 31 - Math.floor(i * 0.9), 9 + (i % 10), (i * 7) % 60)
  const hex = Array.from({ length: 8 }, () => Math.floor(rnd() * 16).toString(16)).join('')
  return {
    id: `TX-${(10480 - i).toString()}`,
    type: txTypes[(i * 3 + Math.floor(rnd() * 2)) % txTypes.length],
    asset: coin.id,
    amount,
    usd: amount * coin.price,
    date: d.toISOString(),
    status: txStatus[Math.floor(rnd() * txStatus.length)],
    hash: `0x${hex}…${hex.slice(0, 4)}`,
  }
})

export const watchAddress = '0x7a3B9cE21d4F0a8C5e6D2b1F9c0E3a4B5d6C8e91'
