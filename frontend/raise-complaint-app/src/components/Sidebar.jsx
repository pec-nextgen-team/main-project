import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardPlus,
  ClipboardList,
  CheckCircle2,
  Ticket,
  Inbox,
  Wrench,
  Boxes,
  BarChart3,
  Bell,
  Settings,
  Phone,
  Mail,
  X,
  GraduationCap,
} from 'lucide-react';

export const MENU_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Raise Complaint', path: '/raise-complaint', icon: ClipboardPlus },
  { label: 'My Complaints', path: '/my-complaints', icon: ClipboardList },
  { label: 'Approvals', path: '/approvals', icon: CheckCircle2 },
  { label: 'Tickets', path: '/tickets', icon: Ticket },
  { label: 'Requests', path: '/requests', icon: Inbox },
  { label: 'Technician', path: '/technician', icon: Wrench },
  { label: 'Stock Management', path: '/stock-management', icon: Boxes },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  return (
    <>
      {/* Mobile scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 bg-navy-900 text-slate-200 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold tracking-wide text-white">
              PANIMALAR ENGINEERING COLLEGE
            </p>
            <p className="text-[11px] text-slate-400">Repair &amp; Maintenance System</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto thin-scrollbar px-3 py-4 space-y-1">
          {MENU_ITEMS.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={label}
                to={path}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    active
                      ? 'bg-brand-600 text-white shadow-card'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Need Help + footer */}
        <div className="border-t border-white/10 px-5 py-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Need Help?
          </p>
          <div className="space-y-1.5 text-sm text-slate-300">
            <a href="tel:04426491113" className="flex items-center gap-2 hover:text-white">
              <Phone className="h-3.5 w-3.5 text-brand-500" />
              044 - 2649 1113
            </a>
            <a
              href="mailto:support@panimalar.ac.in"
              className="flex items-center gap-2 hover:text-white break-all"
            >
              <Mail className="h-3.5 w-3.5 text-brand-500" />
              support@panimalar.ac.in
            </a>
          </div>
          <p className="pt-2 text-[11px] leading-relaxed text-slate-500">
            © 2026 Panimalar Engineering College.
            <br />
            All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
}
