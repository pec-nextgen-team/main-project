import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Volume2,
  Search,
  ShieldCheck,
  LifeBuoy,
  ChevronDown,
} from 'lucide-react';

// Menu items may be a direct route ("path") or a group of sub-routes
// ("children"). Only items with a real path are wired to a route today —
// the rest render for context but aren't part of this build yet.
const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: null },
  { label: 'Raise Complaint', icon: ClipboardPlus, path: '/' },
  { label: 'My Complaints', icon: ClipboardList, path: '/my-complaints' },
  { label: 'Approvals', icon: CheckCircle2, path: null },
  { label: 'Tickets', icon: Ticket, path: null },
  { label: 'Requests', icon: Inbox, path: null },
  {
    label: 'Electrician',
    icon: Wrench,
    children: [
      { label: 'Electrician List', path: null },
      { label: 'Add Electrician', path: null },
      { label: 'Skills / Certification', path: null },
      { label: 'Attendance', path: null },
      { label: 'Leave', path: null },
      { label: 'Performance', path: null },
    ],
  },
  {
    label: 'Stock Management',
    icon: Boxes,
    children: [
      { label: 'Stock Overview', path: null },
      { label: 'Inventory', path: null },
      { label: 'Stock In', path: '/stock-management/stock-in' },
      { label: 'Stock Out', path: null },
      { label: 'Adjustments', path: null },
      { label: 'Suppliers', path: null },
    ],
  },
  { label: 'Reports', icon: BarChart3, path: null },
  { label: 'Notifications', icon: Bell, path: null },
  { label: 'Settings', icon: Settings, path: null },
];

const QUICK_LINKS = [
  { label: 'Noise Complaint', icon: Volume2 },
  { label: 'Track Ticket', icon: Search },
  { label: 'SLA Policy', icon: ShieldCheck },
  { label: 'Contact Support', icon: LifeBuoy },
];

function groupContainsPath(item, pathname) {
  return item.children?.some((child) => child.path === pathname);
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  // A group starts expanded if the current route lives inside it.
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    MENU_ITEMS.forEach((item) => {
      if (item.children) initial[item.label] = groupContainsPath(item, location.pathname);
    });
    return initial;
  });

  function toggleGroup(label) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
      ${isActive ? 'bg-brand-600 text-white shadow-card' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`;

  const disabledClasses =
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white';

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
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-navy-900 text-slate-200 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-[12px] font-bold tracking-wide text-white">
              PANIMALAR ENGINEERING COLLEGE
            </p>
            <p className="text-[10px] text-slate-400">Repair &amp; Maintenance System</p>
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
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const isOpenGroup = openGroups[item.label];
              const groupActive = groupContainsPath(item, location.pathname);
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    aria-expanded={isOpenGroup}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                      ${groupActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${isOpenGroup ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpenGroup && (
                    <div className="mt-1 space-y-0.5 border-l border-white/10 pl-6">
                      {item.children.map((child) =>
                        child.path ? (
                          <NavLink key={child.label} to={child.path} onClick={onClose} className={linkClasses}>
                            <span className="truncate text-[13px]">{child.label}</span>
                          </NavLink>
                        ) : (
                          <a
                            key={child.label}
                            href="#"
                            aria-disabled="true"
                            className="flex items-center rounded-lg px-3 py-2 text-[13px] text-slate-400 hover:bg-white/5 hover:text-white"
                          >
                            <span className="truncate">{child.label}</span>
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            }

            if (item.path) {
              return (
                <NavLink key={item.label} to={item.path} onClick={onClose} className={linkClasses} end={item.path === '/'}>
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            }

            return (
              <a key={item.label} href="#" className={disabledClasses} aria-disabled="true">
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Quick Links */}
        <div className="border-t border-white/10 px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Quick Links
          </p>
          <div className="space-y-1.5">
            {QUICK_LINKS.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                className="flex items-center gap-2 py-0.5 text-sm text-slate-300 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5 text-brand-500" />
                {label}
              </a>
            ))}
          </div>
        </div>

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
