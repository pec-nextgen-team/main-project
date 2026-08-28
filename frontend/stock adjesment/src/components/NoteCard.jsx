import { Info, AlertTriangle } from 'lucide-react'

const TONES = {
  info: {
    wrap: 'border-info-100 bg-info-50/50',
    icon: 'text-info-600',
    dot: 'bg-info-500',
    Icon: Info,
  },
  warning: {
    wrap: 'border-warning-100 bg-warning-50/60',
    icon: 'text-warning-600',
    dot: 'bg-warning-500',
    Icon: AlertTriangle,
  },
}

export default function NoteCard({ title = 'Notes', notes, tone = 'info' }) {
  const t = TONES[tone]
  const { Icon } = t

  return (
    <div className={`rounded-xl border p-4 ${t.wrap}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4.5 w-4.5 ${t.icon}`} />
        <h3 className="text-sm font-bold text-ink-900">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {notes.map((note) => (
          <li key={note} className="flex gap-2 text-[12.5px] leading-snug text-ink-600">
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${t.dot}`} />
            {note}
          </li>
        ))}
      </ul>
    </div>
  )
}
