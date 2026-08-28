const ROWS = [
  { key: 'inStock', label: 'In Stock', color: 'bg-success-500' },
  { key: 'lowStock', label: 'Low Stock', color: 'bg-warning-500' },
  { key: 'outOfStock', label: 'Out of Stock', color: 'bg-danger-500' },
  { key: 'expiringSoon', label: 'Expiring Soon', color: 'bg-violet-500' },
]

export default function StockSummaryCard({ summary }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
      <h3 className="text-sm font-bold text-success-700">Stock Summary (Main Store)</h3>

      <p className="mt-3 text-2xl font-bold text-ink-900">
        {summary.totalItems}
        <span className="ml-1.5 text-[13px] font-medium text-ink-400">Total Items</span>
      </p>

      <div className="mt-4 space-y-3">
        {ROWS.map((row) => {
          const value = summary[row.key]
          const pct = ((value / summary.totalItems) * 100).toFixed(2)
          return (
            <div key={row.key}>
              <div className="mb-1 flex items-center justify-between text-[12.5px]">
                <span className="text-ink-600">{row.label}</span>
                <span className="font-semibold text-ink-800">
                  {value} <span className="font-normal text-ink-400">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-soft">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
