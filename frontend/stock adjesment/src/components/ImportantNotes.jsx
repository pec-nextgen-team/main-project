import NoteCard from './NoteCard'

const NOTES = [
  'Overdue complaints will be escalated automatically.',
  'SLA reminders are sent before the complaint due time.',
  'Verification notifications are generated after repair action.',
  'Closure notifications are generated after successful verification.',
  'Notification preferences can be customized.',
]

export default function ImportantNotes() {
  return <NoteCard title="Important Notes" notes={NOTES} tone="info" />
}
