/** Template logo. Replace the SVG and the name with your own brand. */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 80 80" aria-hidden>
        <rect width="80" height="80" rx="20" className="fill-brand-600" />
        <path d="M24 56 V24 L56 56 V24" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && <span className="font-display text-lg font-bold tracking-tight">Nexora</span>}
    </span>
  )
}
