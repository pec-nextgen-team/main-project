import { useState } from 'react'
import { History, AlarmClockOff, MoonStar, Trash2 } from 'lucide-react'

export default function QuickActions({ dnd, onToggleDnd, onSnooze, onClearAll, onViewHistory }) {
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
      <h3 className="text-sm font-bold text-ink-900">Quick Actions</h3>

      <div className="mt-3 space-y-1">
        <button
          onClick={onViewHistory}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-app"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-info-50 text-info-600">
            <History className="h-4.5 w-4.5" />
          </div>
          <p className="text-[13.5px] font-semibold text-ink-800">View Notification History</p>
        </button>

        <button
          onClick={onSnooze}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-app"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-600">
            <AlarmClockOff className="h-4.5 w-4.5" />
          </div>
          <p className="text-[13.5px] font-semibold text-ink-800">Snooze Notifications</p>
        </button>

        <div className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <MoonStar className="h-4.5 w-4.5" />
          </div>
          <p className="flex-1 text-[13.5px] font-semibold text-ink-800">Do Not Disturb</p>
          <button
            onClick={onToggleDnd}
            role="switch"
            aria-checked={dnd}
            className={`relative h-5.5 w-10 shrink-0 rounded-full transition-colors ${dnd ? 'bg-brand-600' : 'bg-border-subtle'}`}
          >
            <span
              className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform ${
                dnd ? 'translate-x-[18px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {confirmClear ? (
          <div className="rounded-lg bg-danger-50 p-3">
            <p className="text-[12.5px] text-danger-700">Clear all notifications? This can&apos;t be undone.</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  onClearAll()
                  setConfirmClear(false)
                }}
                className="rounded-md bg-danger-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-danger-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink-600 hover:bg-app"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-app"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-600">
              <Trash2 className="h-4.5 w-4.5" />
            </div>
            <p className="text-[13.5px] font-semibold text-ink-800">Clear All Notifications</p>
          </button>
        )}
      </div>
    </div>
  )
}
