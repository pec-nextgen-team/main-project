import { Info } from 'lucide-react'

const NOTES = [
  'Overdue complaints will be escalated automatically.',
  'SLA reminders are sent before the complaint due time.',
  'Verification notifications are generated after repair action.',
  'Closure notifications are generated after successful verification.',
  'Notification preferences can be customized.',
]

export default function ImportantNotes() {
  return (
    <div className="rounded-xl border border-info-100 bg-info-50/50 p-4">
      <div className="flex items-center gap-2">
        <Info className="h-4.5 w-4.5 text-info-600" />
        <h3 className="text-sm font-bold text-ink-900">Important Notes</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {NOTES.map((note) => (
          <li key={note} className="flex gap-2 text-[12.5px] leading-snug text-ink-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-info-500" />
            {note}
          </li>
        ))}
      </ul>
    </div>
  )
}
