import { Bell, Mail, Hourglass, AlertTriangle, CheckCheck, Trash2 } from 'lucide-react'

function StatCard({ icon: Icon, value, label, subtitle, tone }) {
  const tones = {
    brand: { chip: 'bg-brand-50 text-brand-600' },
    info: { chip: 'bg-info-50 text-info-600' },
    warning: { chip: 'bg-warning-50 text-warning-600' },
    danger: { chip: 'bg-danger-50 text-danger-600' },
  }
  const t = tones[tone]
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.chip}`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-[13px] font-medium text-ink-700">{label}</p>
      <p className="mt-0.5 text-[11.5px] text-ink-400">{subtitle}</p>
    </div>
  )
}

export default function SummaryCards({ counts, onMarkAllRead, onClearAll }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      <StatCard icon={Bell} value={counts.total} label="Total Notifications" subtitle="All Notifications" tone="brand" />
      <StatCard icon={Mail} value={counts.unread} label="Unread Notifications" subtitle="New Notifications" tone="info" />
      <StatCard icon={Hourglass} value={counts.dueToday} label="Due Today" subtitle="Needs Action" tone="warning" />
      <StatCard icon={AlertTriangle} value={counts.overdue} label="Overdue" subtitle="Action Required" tone="danger" />

      <div className="col-span-2 flex flex-col justify-center gap-2 rounded-xl border border-border-subtle bg-surface p-4 shadow-sm lg:col-span-1">
        <button
          onClick={onMarkAllRead}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <CheckCheck className="h-4 w-4" />
          Mark All Read
        </button>
        <button
          onClick={onClearAll}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-[13px] font-semibold text-ink-600 transition-colors hover:bg-app"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>
    </div>
  )
}
