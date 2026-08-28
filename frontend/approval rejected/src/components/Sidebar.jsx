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
  Wrench,
} from 'lucide-react'
import panimalarLogo from '../assets/panimalar-logo.jpeg'
import years26Badge from '../assets/panimalar-26years.jpeg'

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

const afterApprovalsNav = [
  { label: 'Tickets', to: '/tickets', icon: Ticket },
  { label: 'Requests', to: '/requests', icon: Inbox },
  { label: 'Electrician', to: '/electrician', icon: Zap },
  { label: 'Stock Management', to: '/stock-management', icon: Boxes },
  { label: 'Reports', to: '/reports', icon: BarChart3 },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const quickLinks = [
  { label: 'Add Announcement', icon: Megaphone },
  { label: 'View All Tickets', icon: ListChecks },
  { label: 'SLA Policy', icon: FileText },
  { label: 'Contact Support', icon: Headset },
]

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

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const location = useLocation()
  const approvalsActive = location.pathname.startsWith('/approvals')
  const [approvalsExpanded, setApprovalsExpanded] = useState(true)

  return (
    <aside
      className={`fixed z-40 top-0 left-0 h-screen w-[190px] bg-navy-900 flex flex-col
      transform transition-transform duration-200
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* Branding — Panimalar logo on the left, 26-years badge on the right */}
      <div className="flex items-center justify-between gap-1.5 px-3 py-3 border-b border-white/10">
        <img
          src={panimalarLogo}
          alt="Panimalar Engineering College"
          className="h-9 w-9 object-contain rounded-md bg-white/90 p-0.5 shrink-0"
        />
        <div className="leading-tight flex-1 min-w-0 px-0.5">
          <p className="text-white text-[11px] font-bold truncate">Panimalar</p>
          <p className="text-slate-400 text-[9px] truncate">Engineering College</p>
        </div>
        <img
          src={years26Badge}
          alt="Celebrating 26 years of excellence in education"
          className="h-8 w-8 object-contain rounded-md shrink-0"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onCloseMobile} />
          ))}
        </div>

        {/* Approvals with submenu */}
        <div className="mt-0.5">
          <button
            type="button"
            onClick={() => setApprovalsExpanded((v) => !v)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 mx-2 text-[13px] rounded-md transition-colors ${
              approvalsActive ? 'text-white font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
            style={{ width: 'calc(100% - 16px)' }}
          >
            <span className="flex items-center gap-3">
              <CheckSquare size={16} strokeWidth={2} />
              Approvals
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${approvalsExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {approvalsExpanded && (
            <div className="ml-2 mt-0.5 space-y-0.5 border-l border-white/10 pl-1">
              {approvalsSubNav.map((item) => (
                <NavItem key={item.to} {...item} onNavigate={onCloseMobile} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-0.5 space-y-0.5">
          {afterApprovalsNav.map((item) => (
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
