import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-navy-950 px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />
      {message}
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white" aria-label="Dismiss">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
