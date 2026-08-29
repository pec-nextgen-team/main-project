import React from 'react';
import { 
  FileEdit, 
  UserCheck, 
  TicketCheck, 
  Wrench, 
  LogOut,
  ShieldCheck,
  Building2
} from 'lucide-react';
import PanimalarLogo from '../branding/PanimalarLogo';
import AnniversaryBadge from '../branding/AnniversaryBadge';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ currentRoute, onNavigate, isMobileOpen, onCloseMobile }) {
  const { user, role, logout } = useAuth();

  const navItems = [
    {
      id: 'raise-complaint',
      label: 'Raise Complaint',
      icon: FileEdit,
      description: 'Register maintenance issue',
    },
    {
      id: 'hod-approvals',
      label: 'HOD Approvals',
      icon: UserCheck,
      description: 'Department verification',
    },
    {
      id: 'assign-electrician',
      label: 'Assign Electrician',
      icon: TicketCheck,
      description: 'Maintenance allocation',
    },
    {
      id: 'my-jobs',
      label: 'My Jobs / Work Orders',
      icon: Wrench,
      description: 'Technician task execution',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0A1930] text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header — Single Horizontal Line */}
        <div className="px-4 py-3.5 border-b border-slate-800/80 bg-[#071324]">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Panimalar Engineering College branding */}
            <div className="flex items-center gap-2 min-w-0">
              <PanimalarLogo className="w-10 h-12 shrink-0 drop-shadow-md" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black tracking-wider text-amber-400 uppercase leading-none">
                  PANIMALAR
                </span>
                <span className="text-[10px] font-bold text-white tracking-tight leading-tight mt-0.5">
                  ENGINEERING COLLEGE
                </span>
                <span className="text-[8.5px] text-slate-400 font-medium tracking-wider uppercase mt-0.5 whitespace-nowrap">
                  An Autonomous Institution
                </span>
              </div>
            </div>

            {/* Right: EXACT 26 Years Logo side-by-side on same row */}
            <div className="shrink-0 flex items-center">
              <AnniversaryBadge className="w-12 h-14 drop-shadow-md" />
            </div>
          </div>
        </div>

        {/* System Subtitle */}
        <div className="px-5 py-2.5 bg-blue-950/40 border-b border-slate-800 text-[11px] font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Institutional Core Flow</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm ring-1 ring-blue-400'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-blue-300 group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm leading-tight truncate">{item.label}</span>
                  <span
                    className={`text-[11px] truncate leading-normal ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Account / Role & Footer */}
        <div className="p-4 border-t border-slate-800/90 bg-[#071324] space-y-3">
          {user ? (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {user.identifier || 'Account'}
                </span>
                <span className="text-[11px] text-blue-400 font-medium truncate">
                  {role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Staff / Student Portal Login</span>
            </button>
          )}

          <div className="text-[10px] text-slate-400 text-center leading-tight">
            © {new Date().getFullYear()} Panimalar Engineering College
            <br />
            <span className="text-slate-400 font-medium">Jai Sakthi Educational Trust</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
