import { useState } from "react";
import {
  Menu,
  Bell,
  Mail,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  CheckSquare,
  Ticket,
  Inbox,
  Wrench,
  Users,
  UserPlus,
  Award,
  CalendarCheck,
  CalendarDays,
  TrendingUp,
  Boxes,
  BarChart3,
  Settings,
  User,
  FileClock,
  Wallet,
  FileBarChart2,
} from "lucide-react";

/**
 * Layout
 * Shared shell for every authenticated screen in the Repair & Maintenance
 * Management System: dark navy sidebar + white top header.
 *
 * Usage:
 *   <Layout active="leave" breadcrumb={["Home", "Electrician", "Leave Management"]}>
 *     ...page content...
 *   </Layout>
 */

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "raise-complaint", label: "Raise Complaint", icon: FilePlus2 },
  { key: "my-complaints", label: "My Complaints", icon: ClipboardList },
  { key: "approvals", label: "Approvals", icon: CheckSquare },
  { key: "tickets", label: "Tickets", icon: Ticket },
  { key: "requests", label: "Requests", icon: Inbox },
  {
    key: "electrician",
    label: "Electrician",
    icon: Wrench,
    children: [
      { key: "electrician-list", label: "Electrician List", icon: Users },
      { key: "add-electrician", label: "Add Electrician", icon: UserPlus },
      { key: "skills", label: "Skills / Certification", icon: Award },
      { key: "attendance", label: "Attendance", icon: CalendarCheck },
      { key: "leave", label: "Leave", icon: CalendarDays },
      { key: "performance", label: "Performance", icon: TrendingUp },
    ],
  },
  { key: "stock", label: "Stock Management", icon: Boxes },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

const QUICK_LINKS = [
  { key: "apply-leave", label: "Apply Leave", icon: FilePlus2 },
  { key: "leave-calendar", label: "Leave Calendar", icon: CalendarDays },
  { key: "leave-balance", label: "Leave Balance", icon: Wallet },
  { key: "leave-report", label: "Leave Report", icon: FileBarChart2 },
];

function NavRow({ item, active, depth = 0, openGroups, toggleGroup, onNavigate }) {
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;
  const isOpen = openGroups.includes(item.key);
  const isActive = active === item.key;
  const childActive = hasChildren && item.children.some((c) => c.key === active);

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => toggleGroup(item.key)}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-md text-sm transition-colors
            ${childActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
        >
          <span className="flex items-center gap-3">
            <Icon size={17} strokeWidth={1.8} />
            {item.label}
          </span>
          <ChevronRight
            size={14}
            className={`transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="mt-0.5 ml-4 pl-3 border-l border-white/10 flex flex-col gap-0.5">
            {item.children.map((child) => (
              <NavRow
                key={child.key}
                item={child}
                active={active}
                depth={depth + 1}
                openGroups={openGroups}
                toggleGroup={toggleGroup}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const ChildIcon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(item.key)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] transition-colors
        ${
          isActive
            ? "bg-blue-600 text-white shadow-sm shadow-blue-900/30"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
    >
      <ChildIcon size={16} strokeWidth={1.8} />
      {item.label}
    </button>
  );
}

export default function Layout({ active, breadcrumb = [], children, onNavigate }) {
  const [openGroups, setOpenGroups] = useState(["electrician"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleGroup = (key) =>
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        } shrink-0 bg-[#0b1739] flex flex-col transition-all duration-200`}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            R
          </div>
          <div className="leading-tight">
            <p className="text-white text-sm font-semibold">R&M System</p>
            <p className="text-[10.5px] text-slate-400">Panimalar Engg. College</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavRow
              key={item.key}
              item={item}
              active={active}
              openGroups={openGroups}
              toggleGroup={toggleGroup}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <div className="px-3 pb-4 pt-3 border-t border-white/10">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            Quick Links
          </p>
          <div className="flex flex-col gap-0.5">
            {QUICK_LINKS.map((q) => {
              const QIcon = q.icon;
              return (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => onNavigate?.(q.key)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <QIcon size={15} strokeWidth={1.8} />
                  {q.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="Toggle sidebar"
            >
              <Menu size={19} />
            </button>
            <h1 className="text-[15px] font-semibold text-slate-700">
              Repair &amp; Maintenance Management System
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100" aria-label="Mail">
              <Mail size={18} />
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-medium flex items-center justify-center">
                3
              </span>
            </button>

            <div className="w-px h-8 bg-slate-200" />

            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-md hover:bg-slate-100"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                <User size={17} />
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-[13px] font-semibold text-slate-700">Mr. Selvaraj</p>
                <p className="text-[11px] text-slate-400">Electrician Head</p>
              </div>
              <ChevronDown size={15} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* BREADCRUMB */}
        {breadcrumb.length > 0 && (
          <div className="px-6 pt-4 text-[12.5px] text-slate-500 flex items-center gap-1.5">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
                <span
                  className={
                    i === breadcrumb.length - 1
                      ? "text-blue-600 font-medium"
                      : "text-slate-400"
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-6 py-4">{children}</main>
      </div>
    </div>
  );
}
