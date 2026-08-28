import { SlidersHorizontal, MailCheck, MessageSquareText, Smartphone, ChevronRight } from 'lucide-react'

const ROWS = [
  { icon: SlidersHorizontal, title: 'Manage Preferences', subtitle: 'Choose what you want to receive' },
  { icon: MailCheck, title: 'Email Notifications', subtitle: 'Configure email alerts' },
  { icon: MessageSquareText, title: 'SMS Notifications', subtitle: 'Configure SMS alerts' },
  { icon: Smartphone, title: 'In-App Notifications', subtitle: 'Configure in-app alerts' },
]

export default function PreferencesCard({ onOpen }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
      <h3 className="text-sm font-bold text-ink-900">Notification Preferences</h3>
      <div className="mt-3 space-y-1">
        {ROWS.map((row) => {
          const Icon = row.icon
          return (
            <button
              key={row.title}
              onClick={() => onOpen?.(row.title)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-app"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-ink-800">{row.title}</p>
                <p className="text-[12px] text-ink-400">{row.subtitle}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
