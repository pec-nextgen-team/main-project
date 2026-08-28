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
  X,
} from "lucide-react";
import panimalarLogo from "../assets/panimalar-logo.jpeg";
import years26Badge from "../assets/panimalar-26years.jpeg";

/**
 * Sidebar
 * Shared left navigation for the Repair & Maintenance Management System.
 * Reused across pages — Approvals is highlighted/expanded by default here.
 *
 * mobileOpen/onClose let the parent (Header's menu button) control the
 * sidebar as a slide-in overlay on small screens, while the existing
 * desktop layout (always visible, `lg:flex`) is untouched.
 */
export default function Sidebar({ activeSubmenu = "Pending Approvals", mobileOpen = false, onClose = () => {} }) {
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
    <>
      {/* Mobile backdrop — click to close */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 flex flex-col w-64 shrink-0 bg-[#062B5C] text-white h-screen
        transform transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
      {/* Logo */}
      <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-white/10">
        <img
          src={panimalarLogo}
          alt="Panimalar Engineering College"
          className="h-10 w-10 object-contain rounded-md bg-white/90 p-0.5 shrink-0"
        />
        <div className="leading-tight flex-1 min-w-0 px-1">
          <p className="text-[13px] font-semibold truncate">Panimalar Engg. College</p>
          <p className="text-[10px] text-white/60 truncate">Repair & Maintenance</p>
        </div>
        <img
          src={years26Badge}
          alt="Celebrating 26 years of excellence in education"
          className="h-9 w-9 object-contain rounded-md shrink-0"
        />
        <button
          onClick={onClose}
          className="ml-1 p-1.5 rounded-md text-white/70 hover:bg-white/10 hover:text-white lg:hidden shrink-0"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-sm">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={onClose}
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
                  onClick={onClose}
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
            onClick={onClose}
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
    </>
  );
}
