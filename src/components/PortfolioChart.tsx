import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { usd } from '../lib/format'

interface Point {
  label: string
  value: number
}

export default function PortfolioChart({ data, height = 280 }: { data: Point[]; height?: number }) {
  const { mode } = useTheme()
  const grid = mode === 'dark' ? '#2a2f3a' : '#eef0f3'
  const axis = mode === 'dark' ? '#8b93a3' : '#94a3b8'
  // Pad the Y axis by 10% of the visible range so small and large prices both look good.
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = (max - min) * 0.1 || max * 0.01

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pf-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--brand-500))" stopOpacity={0.28} />
              <stop offset="100%" stopColor="rgb(var(--brand-500))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: axis, fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={40} />
          <YAxis
            tick={{ fill: axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={64}
            domain={[min - pad, max + pad]}
            tickFormatter={(v: number) => (max < 10 ? `$${v.toFixed(max < 1 ? 3 : 2)}` : usd(v, { compact: true }))}
          />
          <Tooltip
            cursor={{ stroke: axis, strokeDasharray: '4 4' }}
            contentStyle={{
              background: mode === 'dark' ? '#161920' : '#fff',
              border: `1px solid ${grid}`,
              borderRadius: 12,
              fontSize: 13,
            }}
            labelStyle={{ color: axis }}
            formatter={(v: number) => [usd(v), 'Value']}
          />
          <Area type="monotone" dataKey="value" stroke="rgb(var(--brand-600))" strokeWidth={2.2} fill="url(#pf-fill)" animationDuration={600} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
