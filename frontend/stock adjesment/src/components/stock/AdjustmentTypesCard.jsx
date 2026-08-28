import { SlidersHorizontal } from 'lucide-react'
import { COLOR_STYLES } from '../../lib/notificationMeta'
import { ADJUSTMENT_TYPES } from '../../data/stockAdjustments'

export default function AdjustmentTypesCard({ selected, onSelect }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold text-ink-900">
        <SlidersHorizontal className="h-4 w-4 text-brand-600" />
        Adjustment Types
      </h3>
      <div className="mt-3 space-y-1.5" role="radiogroup" aria-label="Adjustment type">
        {ADJUSTMENT_TYPES.map((type) => {
          const active = selected === type.id
          const colors = COLOR_STYLES[type.color]
          const Icon = type.icon
          return (
            <button
              key={type.id}
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(type.id)}
              className={`flex w-full items-start gap-3 rounded-lg border px-2.5 py-2.5 text-left transition-colors ${
                active ? 'border-brand-200 bg-brand-50/60' : 'border-transparent hover:bg-app'
              }`}
            >
              <span
                className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? 'border-brand-600' : 'border-border-subtle'
                }`}
              >
                {active && <span className="h-2 w-2 rounded-full bg-brand-600" />}
              </span>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${colors.chipBg} ${colors.chipText}`}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-ink-800">{type.label}</span>
                <span className="block text-[11.5px] leading-snug text-ink-400">{type.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
