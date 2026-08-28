import { ArrowRight } from 'lucide-react'
import { formatINR } from '../../lib/formatCurrency'

export default function RecentAdjustmentsCard({ adjustments, onViewAll }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
      <h3 className="text-sm font-bold text-ink-900">Recent Adjustments</h3>

      <ul className="mt-3 space-y-3">
        {adjustments.map((adj) => (
          <li key={adj.id} className="border-b border-border-soft pb-3 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink-800">{adj.id}</span>
              <span className={`text-[13px] font-semibold tabular-nums ${adj.value < 0 ? 'text-danger-600' : 'text-ink-800'}`}>
                {formatINR(adj.value)}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-ink-400">
              {adj.date} · {adj.type}
            </p>
          </li>
        ))}
      </ul>

      <button
        onClick={onViewAll}
        className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-brand-600 hover:text-brand-700"
      >
        View All Adjustments
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
