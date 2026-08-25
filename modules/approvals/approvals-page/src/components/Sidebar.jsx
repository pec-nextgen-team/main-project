import { useState } from "react";
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  ClipboardCheck,
  Ticket,
  Inbox,
  Zap,
  Boxes,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  Megaphone,
  ListOrdered,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

/**
 * Sidebar
 * Shared left navigation for the Repair & Maintenance Management System.
 * Reused across pages — Approvals is highlighted/expanded by default here.
 */
export default function Sidebar({ activeSubmenu = "Pending Approvals" }) {
  const [approvalsOpen, setApprovalsOpen] = useState(true);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Raise Complaint", icon: FilePlus2 },
    { label: "My Complaints", icon: ListChecks },
  ];

  const approvalSubItems = ["Pending Approvals", "Approved", "Rejected"];

  const restItems = [
    { label: "Tickets", icon: Ticket },
    { label: "Requests", icon: Inbox },
    { label: "Electrician", icon: Zap },
    { label: "Stock Management", icon: Boxes },
    { label: "Reports", icon: BarChart3 },
    { label: "Notifications", icon: Bell },
    { label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#062B5C] text-white h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Panimalar Engg. College</p>
          <p className="text-[11px] text-white/60">Repair & Maintenance</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-sm">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}

        {/* Approvals (active, blue highlight) */}
        <div>
          <button
            onClick={() => setApprovalsOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0757D9] text-white font-medium shadow-sm"
          >
            <ClipboardCheck size={18} />
            <span className="flex-1 text-left">Approvals</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${approvalsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {approvalsOpen && (
            <div className="mt-1 ml-6 border-l border-white/10 pl-4 space-y-0.5">
              {approvalSubItems.map((item) => (
                <button
                  key={item}
                  className={`w-full text-left px-2 py-2 rounded-md text-[13px] transition-colors ${
                    item === activeSubmenu
                      ? "text-white font-medium bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {restItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Links */}
      <div className="mx-3 mb-3 rounded-xl bg-white/5 border border-white/10 p-3">
        <p className="text-xs font-semibold text-white/80 mb-2">Quick Links</p>
        <div className="space-y-1 text-[13px]">
          <button className="w-full flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <Megaphone size={14} /> Add Announcement
          </button>
          <button className="w-full flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ListOrdered size={14} /> View All Tickets
          </button>
          <button className="w-full flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ShieldCheck size={14} /> SLA Policy
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 text-[11px] text-white/40 leading-snug">
        © 2026 Panimalar Engineering College.
        <br />
        All rights reserved.
      </div>
    </aside>
  );
}
