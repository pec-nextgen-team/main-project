import { Menu, Bell, Mail, ChevronDown } from 'lucide-react'

export default function Header({ onMenuClick, user, unreadCount, messageCount = 4 }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-ink-600 hover:bg-app lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-[15px] font-semibold text-ink-900 sm:text-base">
          Repair & Maintenance Management System
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <button
          className="relative rounded-full p-2 text-ink-600 hover:bg-app"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger-600 px-1 text-[10px] font-bold text-white ring-2 ring-surface">
              {unreadCount}
            </span>
          )}
        </button>

        <button className="relative rounded-full p-2 text-ink-600 hover:bg-app" aria-label={`${messageCount} messages`}>
          <Mail className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-surface">
              {messageCount}
            </span>
          )}
        </button>

        <div className="mx-1 hidden h-8 w-px bg-border-subtle sm:block" />

        <button className="flex items-center gap-2 rounded-lg py-1.5 pl-1 pr-2 hover:bg-app">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {user.initials}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-ink-900">{user.name}</p>
            <p className="text-[11.5px] leading-tight text-ink-500">{user.role}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-ink-400 sm:block" />
        </button>
      </div>
    </header>
  )
}
