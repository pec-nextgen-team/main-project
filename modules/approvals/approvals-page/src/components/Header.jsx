import { useState } from "react";
import { Menu, Bell, Mail, ChevronDown, User } from "lucide-react";

/**
 * Header
 * Shared top header. Reused across pages.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden">
          <Menu size={20} />
        </button>
        <h1 className="text-[15px] sm:text-base font-semibold text-[#062B5C]">
          Repair &amp; Maintenance Management System
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-medium">
            6
          </span>
        </button>
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <Mail size={20} />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-medium">
            3
          </span>
        </button>

        <div className="w-px h-8 bg-slate-200 hidden sm:block" />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100"
          >
            <div className="w-9 h-9 rounded-full bg-[#0757D9]/10 text-[#0757D9] flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-medium text-slate-800">Dr. R. Kannan</p>
              <p className="text-[11px] text-slate-500">HOD - IT</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-sm">
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">
                My Profile
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">
                Settings
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-slate-50 text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
