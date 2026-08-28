import React, { useState } from 'react'
import { Menu, Bell, Mail, ChevronDown, User } from 'lucide-react'

export default function TopHeader({ onOpenMobileSidebar, user }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden text-slate-500 hover:text-navy-900"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-[15px] sm:text-base font-semibold text-navy-900 truncate">
          Repair &amp; Maintenance Management System
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 shrink-0">
        <button type="button" className="relative text-slate-500 hover:text-navy-900" aria-label="Notifications">
          <Bell size={19} />
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            5
          </span>
        </button>

        <button type="button" className="relative text-slate-500 hover:text-navy-900" aria-label="Mail">
          <Mail size={19} />
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="hidden sm:block w-px h-8 bg-slate-200" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[13px] font-semibold text-navy-900">{user.name}</p>
              <p className="text-[11px] text-slate-500">{user.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-md shadow-card py-1 text-[13px]">
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">
                My Profile
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
