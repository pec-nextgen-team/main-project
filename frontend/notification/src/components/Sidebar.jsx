import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  CheckSquare,
  Ticket,
  Inbox,
  Wrench,
  CalendarCheck,
  Package,
  BarChart3,
  Bell,
  Settings,
  GraduationCap,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Raise Complaint', icon: FilePlus2 },
  { label: 'My Complaints', icon: ClipboardList },
  { label: 'Approvals', icon: CheckSquare },
  { label: 'Tickets', icon: Ticket },
  { label: 'Requests', icon: Inbox },
  { label: 'Technician', icon: Wrench },
  { label: 'Attendance', icon: CalendarCheck },
  { label: 'Stock Management', icon: Package },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-950 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600">
            <GraduationCap className="h-5.5 w-5.5 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold leading-tight tracking-wide">
              PANIMALAR ENGINEERING COLLEGE
            </p>
            <p className="mt-0.5 text-[11px] text-white/50">Repair & Maintenance System</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto shrink-0 rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.label === 'Notifications'
              const ItemIcon = item.icon
              return (
                <li key={item.label}>
                  <button
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? 'bg-brand-600 font-semibold text-white shadow-sm'
                        : 'text-white/65 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ItemIcon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[11px] leading-relaxed text-white/40">
            © 2026 Panimalar Engineering College.
            <br />
            All rights reserved.
          </p>
        </div>
      </aside>
    </>
  )
}
