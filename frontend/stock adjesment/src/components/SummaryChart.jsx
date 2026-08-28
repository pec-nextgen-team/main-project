import { COLOR_STYLES } from '../lib/notificationMeta'

const SEGMENTS = [
  { key: 'alerts', label: 'Alerts', color: COLOR_STYLES.danger.chart },
  { key: 'reminders', label: 'Reminders', color: COLOR_STYLES.warning.chart },
  { key: 'updates', label: 'Updates', color: COLOR_STYLES.info.chart },
  { key: 'system', label: 'System', color: COLOR_STYLES.violet.chart },
]

const SIZE = 140
const STROKE = 18
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function SummaryChart({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1
  let offsetAcc = 0

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
      <h3 className="text-sm font-bold text-ink-900">Notification Summary</h3>
      <p className="text-[12px] text-ink-400">This Month</p>

      <div className="relative mt-4 flex items-center justify-center">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-border-soft)"
            strokeWidth={STROKE}
          />
          {SEGMENTS.map((seg) => {
            const value = data[seg.key] ?? 0
            const fraction = value / total
            const dash = fraction * CIRCUMFERENCE
            const gap = CIRCUMFERENCE - dash
            const dashoffset = -offsetAcc * CIRCUMFERENCE
            offsetAcc += fraction
            if (value === 0) return null
            return (
              <circle
                key={seg.key}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={dashoffset}
                strokeLinecap="butt"
              />
            )
          })}
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-ink-900">{total}</span>
          <span className="text-[11px] text-ink-400">Total</span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {SEGMENTS.map((seg) => (
          <li key={seg.key} className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2 text-ink-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="font-semibold text-ink-900">{data[seg.key] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
