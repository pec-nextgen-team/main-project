import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  ClipboardCheck,
  Ticket,
  Inbox,
  Wrench,
  Building2,
  ShieldCheck,
  BarChart3,
  Bell,
  Settings,
  GraduationCap,
} from "lucide-react";

/**
 * Sidebar
 * Fixed dark-navy left nav. "My Complaints" is highlighted since
 * Complaint Details is reached from that section.
 */
export default function Sidebar() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Raise Complaint", icon: FilePlus2 },
    { label: "My Complaints", icon: ListChecks, active: true },
    { label: "Approvals", icon: ClipboardCheck },
    { label: "Tickets", icon: Ticket },
    { label: "Requests", icon: Inbox },
    { label: "Technician", icon: Wrench },
    { label: "Service Provider", icon: Building2 },
    { label: "IQAC / NAAC", icon: ShieldCheck },
    { label: "Reports", icon: BarChart3 },
    { label: "Notifications", icon: Bell },
    { label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[210px] shrink-0 bg-[#062B5C] text-white h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-[12px] font-bold tracking-wide">PANIMALAR</p>
          <p className="text-[10px] text-white/60 tracking-wide">ENGINEERING COLLEGE</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 text-[13px]">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
              active
                ? "bg-[#0757D9] text-white font-medium shadow-sm"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={16} />
            <span className="text-left">{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 text-[10px] text-white/40 leading-snug text-center">
        © 2026 Panimalar Engineering College.
        <br />
        All rights reserved.
      </div>
    </aside>
  );
}
