import { useState } from 'react'
import { ChevronDown, ListFilter, CheckCheck } from 'lucide-react'
import { CATEGORY_LABELS, TYPE_GROUP_LABELS } from '../lib/notificationMeta'

const TABS = ['all', 'unread', 'alerts', 'reminders', 'updates', 'system']
const TYPE_GROUPS = ['all', 'complaint', 'assignment', 'sla', 'verification', 'closure', 'system']

export default function FilterBar({ activeTab, onTabChange, counts, typeGroup, onTypeChange, onMarkAllRead }) {
  const [typeOpen, setTypeOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-2 shadow-sm sm:p-2.5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-thin flex gap-1 overflow-x-auto pb-1 lg:pb-0">
          {TABS.map((tab) => {
            const active = activeTab === tab
            const count = counts[tab]
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-ink-600 hover:bg-app'
                }`}
              >
                {CATEGORY_LABELS[tab]}
                {(tab === 'unread' || count > 0) && (
                  <span className={active ? 'ml-1.5 text-white/80' : 'ml-1.5 text-ink-400'}>
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setTypeOpen((v) => !v)}
              onBlur={() => setTimeout(() => setTypeOpen(false), 120)}
              className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-[13px] font-medium text-ink-700 hover:bg-app"
            >
              {TYPE_GROUP_LABELS[typeGroup]}
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            </button>
            {typeOpen && (
              <div className="absolute right-0 z-10 mt-1.5 w-44 overflow-hidden rounded-lg border border-border-subtle bg-surface py-1 shadow-lg">
                {TYPE_GROUPS.map((g) => (
                  <button
                    key={g}
                    onMouseDown={() => {
                      onTypeChange(g)
                      setTypeOpen(false)
                    }}
                    className={`block w-full px-3 py-2 text-left text-[13px] hover:bg-app ${
                      g === typeGroup ? 'font-semibold text-brand-600' : 'text-ink-700'
                    }`}
                  >
                    {TYPE_GROUP_LABELS[g]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-[13px] font-medium text-ink-700 hover:bg-app">
            <ListFilter className="h-3.5 w-3.5" />
            Filter
          </button>

          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-[13px] font-semibold text-brand-700 hover:bg-brand-100"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mark All Read</span>
          </button>
        </div>
      </div>
    </div>
  )
}
