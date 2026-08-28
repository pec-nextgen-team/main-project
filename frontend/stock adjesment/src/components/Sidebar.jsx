import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  CheckSquare,
  Ticket,
  Inbox,
  Zap,
  CalendarCheck,
  Boxes,
  BarChart3,
  Bell,
  Settings,
  ChevronUp,
  ChevronDown,
  PackageSearch,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  Truck,
  PackageX,
  CalendarClock,
  FileBarChart2,
  ShoppingCart,
  X,
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Raise Complaint', icon: FilePlus2, path: '/raise-complaint' },
  { label: 'My Complaints', icon: ClipboardList, path: '/my-complaints' },
  { label: 'Approvals', icon: CheckSquare, path: '/approvals', children: [] },
  { label: 'Tickets', icon: Ticket, path: '/tickets' },
  { label: 'Requests', icon: Inbox, path: '/requests' },
  { label: 'Electrician', icon: Zap, path: '/electrician', children: [] },
  {
    label: 'Attendance',
    icon: CalendarCheck,
    path: '/attendance',
    children: [
      { label: 'Leave', path: '/attendance/leave' },
      { label: 'Performance', path: '/attendance/performance' },
    ],
  },
  {
    label: 'Stock Management',
    icon: Boxes,
    path: '/stock',
    children: [
      { label: 'Stock Overview', path: '/stock/overview', icon: PackageSearch },
      { label: 'Inventory', path: '/stock/inventory', icon: Warehouse },
      { label: 'Stock In', path: '/stock/in', icon: ArrowDownToLine },
      { label: 'Stock Out', path: '/stock/out', icon: ArrowUpFromLine },
      { label: 'Adjustments', path: '/stock/adjustments', icon: SlidersHorizontal },
      { label: 'Suppliers', path: '/stock/suppliers', icon: Truck },
    ],
  },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

const QUICK_LINKS = [
  { label: 'Low Stock Items', icon: PackageX },
  { label: 'Expired Items', icon: CalendarClock },
  { label: 'Stock Report', icon: FileBarChart2 },
  { label: 'Purchase Request', icon: ShoppingCart },
]

function isActivePath(pathname, target) {
  return pathname === target
}

function isSectionActive(pathname, item) {
  if (isActivePath(pathname, item.path)) return true
  return item.children?.some((c) => isActivePath(pathname, c.path)) ?? false
}

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(() => {
    const init = {}
    for (const item of NAV) {
      if (item.children) init[item.label] = isSectionActive(pathname, item)
    }
    return init
  })

  const toggle = (label) => setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-950 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 ring-2 ring-brand-500/40">
            <span className="text-[10px] font-black leading-none text-navy-900">PEC</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-extrabold leading-tight tracking-wide">PANIMALAR</p>
            <p className="truncate text-[9.5px] font-semibold leading-tight tracking-wide text-white/55">
              ENGINEERING COLLEGE
            </p>
            <p className="truncate text-[8.5px] font-bold leading-tight tracking-wider text-amber-400">
              JAIGHTHI EDUCATIONAL TRUST
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto shrink-0 rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const ItemIcon = item.icon
              const hasChildren = !!item.children
              const sectionActive = isSectionActive(pathname, item)
              const isOpen = expanded[item.label]

              return (
                <li key={item.label}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggle(item.label)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors ${
                        sectionActive && !isOpen
                          ? 'bg-white/10 font-semibold text-white'
                          : 'text-white/65 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <ItemIcon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
                      <span className="truncate">{item.label}</span>
                      {isOpen ? (
                        <ChevronUp className="ml-auto h-3.5 w-3.5 shrink-0 text-white/40" />
                      ) : (
                        <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-white/40" />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors ${
                        isActivePath(pathname, item.path)
                          ? 'bg-brand-600 font-semibold text-white shadow-sm'
                          : 'text-white/65 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <ItemIcon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )}

                  {hasChildren && isOpen && (
                    <ul className="mt-0.5 space-y-0.5 border-l border-white/10 pl-4">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon
                        const active = isActivePath(pathname, child.path)
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              onClick={onClose}
                              className={`flex items-center gap-2.5 rounded-lg py-2 pl-2.5 pr-3 text-[13px] transition-colors ${
                                active
                                  ? 'border-l-2 border-brand-500 bg-brand-600/15 font-semibold text-white'
                                  : 'text-white/55 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {ChildIcon && <ChildIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />}
                              <span className="truncate">{child.label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-4 rounded-xl bg-white/5 p-3">
            <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
              Quick Links
            </p>
            <ul className="space-y-0.5">
              {QUICK_LINKS.map((ql) => {
                const QlIcon = ql.icon
                return (
                  <li key={ql.label}>
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[12.5px] text-white/60 hover:bg-white/10 hover:text-white">
                      <QlIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                      <span className="truncate">{ql.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        <div className="border-t border-white/10 px-5 py-3.5">
          <p className="text-[10.5px] leading-relaxed text-white/40">
            © 2026 Panimalar Engineering College.
            <br />
            All rights reserved.
          </p>
        </div>
      </aside>
    </>
  )
}
