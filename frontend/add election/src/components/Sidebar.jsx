import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  CheckSquare,
  ChevronDown,
  Clock3,
  CheckCircle2,
  XCircle,
  Ticket,
  Inbox,
  Zap,
  Boxes,
  BarChart3,
  Bell,
  Settings,
  Megaphone,
  ListChecks,
  FileText,
  Headset,
  UserPlus,
  Award,
  CalendarCheck,
  CalendarOff,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import panimalarLogo from '../assets/panimalar-logo.jpeg'

const mainNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Raise Complaint', to: '/raise-complaint', icon: FilePlus2 },
  { label: 'My Complaints', to: '/my-complaints', icon: ClipboardList },
]

const approvalsSubNav = [
  { label: 'Pending Approvals', to: '/approvals/pending', icon: Clock3 },
  { label: 'Approved', to: '/approvals/approved', icon: CheckCircle2 },
  { label: 'Rejected', to: '/approvals/rejected', icon: XCircle },
]

const midNav = [
  { label: 'Tickets', to: '/tickets', icon: Ticket },
  { label: 'Requests', to: '/requests', icon: Inbox },
]

const electricianSubNav = [
  { label: 'Electrician List', to: '/electrician/list', icon: ListChecks },
  { label: 'Add Electrician', to: '/electrician/add', icon: UserPlus },
  { label: 'Skills / Certification', to: '/electrician/skills', icon: Award },
  { label: 'Attendance', to: '/electrician/attendance', icon: CalendarCheck },
  { label: 'Leave', to: '/electrician/leave', icon: CalendarOff },
  { label: 'Performance', to: '/electrician/performance', icon: TrendingUp },
]

const afterElectricianNav = [
  { label: 'Stock Management', to: '/stock-management', icon: Boxes },
  { label: 'Reports', to: '/reports', icon: BarChart3 },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const quickLinksByRoute = {
  electrician: [
    { label: 'Assign Electrician', icon: UserPlus },
    { label: 'View Tickets', icon: ListChecks },
    { label: 'Bulk Update Status', icon: RefreshCw },
  ],
  default: [
    { label: 'Add Announcement', icon: Megaphone },
    { label: 'View All Tickets', icon: ListChecks },
    { label: 'SLA Policy', icon: FileText },
    { label: 'Contact Support', icon: Headset },
  ],
}

function NavItem({ to, icon: Icon, label, className = '', onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-md mx-2 transition-colors ${
          isActive
            ? 'bg-brand-blue text-white font-semibold shadow-sm'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        } ${className}`
      }
    >
      <Icon size={16} strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  )
}

function ExpandableSection({ label, icon: Icon, active, expanded, onToggle, children }) {
  return (
    <div className="mt-0.5">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center justify-between gap-3 px-4 py-2.5 mx-2 text-[13px] rounded-md transition-colors ${
          active ? 'text-white font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
        style={{ width: 'calc(100% - 16px)' }}
      >
        <span className="flex items-center gap-3">
          <Icon size={16} strokeWidth={2} />
          {label}
        </span>
        <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="ml-2 mt-0.5 space-y-0.5 border-l border-white/10 pl-1">{children}</div>
      )}
    </div>
  )
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const location = useLocation()
  const approvalsActive = location.pathname.startsWith('/approvals')
  const electricianActive = location.pathname.startsWith('/electrician')

  const [approvalsExpanded, setApprovalsExpanded] = useState(approvalsActive)
  const [electricianExpanded, setElectricianExpanded] = useState(true)

  const quickLinks = electricianActive ? quickLinksByRoute.electrician : quickLinksByRoute.default

  return (
    <aside
      className={`fixed z-40 top-0 left-0 h-screen w-[200px] bg-navy-900 flex flex-col
      transform transition-transform duration-200
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
        <img
          src={panimalarLogo}
          alt="Panimalar Engineering College"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="leading-tight min-w-0">
          <p className="text-white text-[11px] font-extrabold tracking-wide">PANIMALAR</p>
          <p className="text-slate-300 text-[9px] font-semibold tracking-wide">ENGINEERING COLLEGE</p>
          <p className="text-slate-500 text-[7.5px] mt-0.5 truncate">JAINANTH EDUCATIONAL TRUST</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onCloseMobile} />
          ))}
        </div>

        <ExpandableSection
          label="Approvals"
          icon={CheckSquare}
          active={approvalsActive}
          expanded={approvalsExpanded}
          onToggle={() => setApprovalsExpanded((v) => !v)}
        >
          {approvalsSubNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onCloseMobile} />
          ))}
        </ExpandableSection>

        <div className="mt-0.5 space-y-0.5">
          {midNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onCloseMobile} />
          ))}
        </div>

        <ExpandableSection
          label="Electrician"
          icon={Zap}
          active={electricianActive}
          expanded={electricianExpanded}
          onToggle={() => setElectricianExpanded((v) => !v)}
        >
          {electricianSubNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onCloseMobile} />
          ))}
        </ExpandableSection>

        <div className="mt-0.5 space-y-0.5">
          {afterElectricianNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onCloseMobile} />
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-6 px-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">
            Quick Links
          </p>
          <div className="space-y-1.5">
            {quickLinks.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="w-full flex items-center gap-2 text-[11.5px] text-slate-400 hover:text-white transition-colors"
              >
                <Icon size={13} />
                <span className="text-left">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[9.5px] text-slate-500 leading-snug">
          © 2026 Panimalar Engineering College.
          <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  )
}
