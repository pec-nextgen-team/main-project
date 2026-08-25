import { useMemo, useState, useEffect } from "react";
import {
  Ticket, FolderOpen, Wrench, CheckCircle2, AlertTriangle,
  Search, RotateCcw, FileDown, Eye, MoreVertical, X,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Clock,
  UserPlus, Layers,
} from "lucide-react";

/**
 * Tickets Page — Accessory Repair Complaint Tracking System
 * Panimalar Engineering College
 *
 * Stack: React + Vite + Tailwind CSS (no TypeScript, no Bootstrap)
 *
 * This component expects a backend exposing:
 *   GET /api/tickets?search=&status=&category=&priority=&fromDate=&toDate=&location=&assignedTo=&page=&limit=
 *   GET /api/tickets/summary
 *   GET /api/tickets/export
 * See fetchTickets()/fetchSummary() below — swap MOCK data for real calls
 * once the Express/Prisma backend is wired up (do not hard-code counts
 * once the backend is live).
 */

const WORKFLOW = [
  "Complaint Registered",
  "Inspection",
  "Repair Assigned",
  "Action Taken",
  "Verification",
  "Closed",
];

const STATUS_STYLES = {
  "Complaint Registered": "bg-blue-100 text-blue-700",
  Inspection: "bg-amber-100 text-amber-700",
  "Repair Assigned": "bg-indigo-100 text-indigo-700",
  "Action Taken": "bg-sky-100 text-sky-700",
  Verification: "bg-teal-100 text-teal-700",
  Closed: "bg-emerald-100 text-emerald-700",
  Overdue: "bg-red-100 text-red-700",
};

const PRIORITY_STYLES = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const SLA_COLOR = {
  green: "text-emerald-600",
  blue: "text-blue-600",
  orange: "text-amber-600",
  red: "text-red-600",
};

// Placeholder data — remove once GET /api/tickets is live.
const MOCK_TICKETS = [
  { id: "ACC-2026-0150", category: "Computer Accessories", problem: "Keyboard Not Working", location: "IT Lab - IT-01", priority: "High", status: "Action Taken", assigned: "Mr. Karthik", raisedOn: "16-05-2026 10:30 AM", sla: "1 Day Left", slaColor: "orange" },
  { id: "ACC-2026-0147", category: "Peripheral Devices", problem: "Printer Not Working", location: "Block A - 2nd Floor", priority: "Medium", status: "Inspection", assigned: "-", raisedOn: "14-05-2026 09:10 AM", sla: "3 Days Left", slaColor: "green" },
  { id: "ACC-2026-0146", category: "Computer Accessories", problem: "Monitor Display Issue", location: "Library", priority: "Medium", status: "Repair Assigned", assigned: "Mr. Rajesh", raisedOn: "13-05-2026 03:45 PM", sla: "2 Days Left", slaColor: "blue" },
  { id: "ACC-2026-0145", category: "Electrical Accessories", problem: "UPS Not Working", location: "Hostel - Block B", priority: "Low", status: "Repair Assigned", assigned: "Mr. Kumar", raisedOn: "12-05-2026 11:20 AM", sla: "2 Days Left", slaColor: "blue" },
  { id: "ACC-2026-0142", category: "Computer Accessories", problem: "Mouse Not Working", location: "CSE Seminar Hall", priority: "Medium", status: "Verification", assigned: "Mr. Rajesh", raisedOn: "10-05-2026 01:15 PM", sla: "Resolved", slaColor: "green" },
  { id: "ACC-2026-0140", category: "Other Accessories", problem: "Projector Remote Not Working", location: "Admin Block", priority: "Low", status: "Inspection", assigned: "-", raisedOn: "09-05-2026 04:00 PM", sla: "3 Days Left", slaColor: "green" },
  { id: "ACC-2026-0139", category: "Electrical Accessories", problem: "Adapter Failure", location: "EEE Lab", priority: "High", status: "Action Taken", assigned: "Mr. Karthik", raisedOn: "08-05-2026 10:05 AM", sla: "1 Day Left", slaColor: "orange" },
  { id: "ACC-2026-0138", category: "Peripheral Devices", problem: "Printer Paper Feed Issue", location: "Boys' Hostel", priority: "Low", status: "Overdue", assigned: "Mr. Kumar", raisedOn: "05-05-2026 08:30 AM", sla: "Overdue by 1 Day", slaColor: "red" },
  { id: "ACC-2026-0135", category: "Computer Accessories", problem: "Projector Not Working", location: "Auditorium", priority: "Medium", status: "Closed", assigned: "Mr. Rajesh", raisedOn: "01-05-2026 09:50 AM", sla: "Resolved on 03-05-2026", slaColor: "green" },
  { id: "ACC-2026-0132", category: "Electrical Accessories", problem: "Power Adapter Issue", location: "OHT - Terrace", priority: "Low", status: "Action Taken", assigned: "Mr. Kumar", raisedOn: "28-04-2026 02:40 PM", sla: "2 Days Left", slaColor: "blue" },
];

const MOCK_SUMMARY = [
  { label: "Total Tickets", value: 36, sub: "All time", icon: Ticket, color: "text-blue-600 bg-blue-50" },
  { label: "Open", value: 8, sub: "Yet to be inspected / assigned", icon: FolderOpen, color: "text-amber-600 bg-amber-50" },
  { label: "In Progress", value: 14, sub: "Under repair", icon: Wrench, color: "text-indigo-600 bg-indigo-50" },
  { label: "Resolved", value: 10, sub: "Awaiting verification", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { label: "Overdue", value: 4, sub: "Exceeded 3 days", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
];

const SIDEBAR_LINKS = [
  "Dashboard", "Raise Complaint", "My Complaints", "Approvals", "Tickets",
  "Requests", "Technician", "Stock Management", "Reports", "Notifications", "Settings",
];

function Badge({ text, className }) {
  return <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${className}`}>{text}</span>;
}

function SummaryCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className={`h-9 w-9 rounded-lg ${item.color} flex items-center justify-center mb-2`}>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-bold text-slate-800">{item.value}</div>
      <div className="text-sm font-medium text-slate-600">{item.label}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
    </div>
  );
}

function TicketDetailsModal({ ticket, onClose }) {
  if (!ticket) return null;
  const currentIdx = WORKFLOW.indexOf(ticket.status === "Overdue" ? "Action Taken" : ticket.status);

  return (
    <div className="fixed inset-0 bg-slate-900/55 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-bold text-lg text-slate-800">Ticket Details — {ticket.id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5 text-sm">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Complaint Information</h4>
            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div><span className="text-slate-400">Category:</span> {ticket.category}</div>
              <div><span className="text-slate-400">Priority:</span> <Badge text={ticket.priority} className={PRIORITY_STYLES[ticket.priority]} /></div>
              <div className="col-span-2"><span className="text-slate-400">Problem / Location:</span> {ticket.problem} / {ticket.location}</div>
              <div><span className="text-slate-400">Raised On:</span> {ticket.raisedOn}</div>
              <div><span className="text-slate-400">SLA:</span> <span className={`font-semibold ${SLA_COLOR[ticket.slaColor]}`}>{ticket.sla}</span></div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Assignment</h4>
            <div className="text-slate-700"><span className="text-slate-400">Assigned Technician:</span> {ticket.assigned}</div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Ticket Timeline</h4>
            <ol className="relative border-l-2 border-slate-200 ml-2 space-y-4">
              {WORKFLOW.map((stage, i) => {
                const done = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <li key={stage} className="ml-4 relative">
                    <span className={`absolute -left-[23px] top-0.5 h-4 w-4 rounded-full border-2 border-white ${done ? "bg-blue-600" : "bg-slate-300"}`} />
                    <span className={`text-sm ${isCurrent ? "font-bold text-blue-700" : "text-slate-600"}`}>{stage}</span>
                    {isCurrent && <div className="text-[11px] text-slate-400">Current stage</div>}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage({ user = { name: "Mr. Selvaraj", role: "Technician / Service Head" } }) {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [filters, setFilters] = useState({
    search: "", status: "All Status", category: "All Categories",
    priority: "All Priorities", fromDate: "", toDate: "",
    location: "All Locations", assignedTo: "All Technicians",
  });
  const [activeTicket, setActiveTicket] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Swap for a real fetch once the backend is live:
  // useEffect(() => {
  //   fetch(`/api/tickets?${new URLSearchParams({ ...filters, page, limit: pageSize })}`)
  //     .then((r) => r.json()).then((d) => setTickets(d.data));
  //   fetch("/api/tickets/summary").then((r) => r.json()).then(setSummary);
  // }, [filters, page]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const q = filters.search.toLowerCase();
      if (q && !(t.id.toLowerCase().includes(q) || t.problem.toLowerCase().includes(q) || t.location.toLowerCase().includes(q))) return false;
      if (filters.status !== "All Status" && t.status !== filters.status) return false;
      if (filters.category !== "All Categories" && t.category !== filters.category) return false;
      if (filters.priority !== "All Priorities" && t.priority !== filters.priority) return false;
      if (filters.location !== "All Locations" && !t.location.includes(filters.location)) return false;
      if (filters.assignedTo !== "All Technicians") {
        if (filters.assignedTo === "Unassigned" && t.assigned !== "-") return false;
        if (filters.assignedTo !== "Unassigned" && t.assigned !== filters.assignedTo) return false;
      }
      return true;
    });
  }, [tickets, filters]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetFilters() {
    setFilters({
      search: "", status: "All Status", category: "All Categories",
      priority: "All Priorities", fromDate: "", toDate: "",
      location: "All Locations", assignedTo: "All Technicians",
    });
    setPage(1);
  }

  function exportCSV() {
    const header = ["Ticket ID", "Category", "Problem", "Location", "Priority", "Status", "Assigned To", "Raised On", "SLA"];
    const rows = filtered.map((t) => [t.id, t.category, t.problem, t.location, t.priority, t.status, t.assigned, t.raisedOn, t.sla]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tickets_export.csv";
    a.click();
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0b1b3a] text-slate-200 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">PEC</div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-white tracking-wide">PANIMALAR</div>
            <div className="text-[10px] text-slate-400 tracking-wide">ENGINEERING COLLEGE</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => (
            <a key={link} href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${link === "Tickets" ? "bg-blue-700 text-white" : "hover:bg-slate-800"}`}>
              {link}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-200 mb-1">Need Help?</div>
          <div>044 - 2649 1113</div>
          <div>support@panimalar.ac.in</div>
          <div className="pt-3 text-[10px] text-slate-500 leading-snug">© 2026 Panimalar Engineering College.<br />All rights reserved.</div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-5 shrink-0">
          <span className="font-semibold text-slate-700">Repair &amp; Maintenance Management System</span>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
              {user.name?.[4] || "U"}
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">{user.name}</div>
              <div className="text-[11px] text-slate-500">{user.role}</div>
            </div>
          </div>
        </header>

        <main className="p-5 space-y-5 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tickets</h1>
            <div className="text-xs text-slate-500 mt-1"><span className="text-blue-600">Home</span> &gt; <span className="text-slate-700 font-medium">Tickets</span></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {summary.map((s) => <SummaryCard key={s.label} item={s} />)}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            <div className="xl:col-span-3 space-y-5">
              {/* FILTERS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold text-slate-500">Search</label>
                    <div className="relative mt-1">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        placeholder="Search by Ticket ID, Problem, Location..."
                        className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {[
                    ["status", "Status", ["All Status", ...WORKFLOW, "Overdue"]],
                    ["category", "Category", ["All Categories", "Computer Accessories", "Electrical Accessories", "Peripheral Devices", "Other Accessories"]],
                    ["priority", "Priority", ["All Priorities", "High", "Medium", "Low"]],
                  ].map(([key, label, options]) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-slate-500">{label}</label>
                      <select
                        value={filters[key]}
                        onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                        className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                      >
                        {options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}

                  <div>
                    <label className="text-xs font-semibold text-slate-500">From Date</label>
                    <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">To Date</label>
                    <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Location / Building</label>
                    <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Locations", "Main Building", "Block A", "Block B", "Administrative Block", "Library", "Laboratory Block"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Assigned To</label>
                    <select value={filters.assignedTo} onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Technicians", "Unassigned", "Mr. Karthik", "Mr. Rajesh", "Mr. Kumar"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button onClick={resetFilters} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
                    <RotateCcw size={14} /> Reset
                  </button>
                  <button onClick={exportCSV} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5">
                    <FileDown size={14} /> Export
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800">Tickets List</h2>
                  <span className="text-xs text-slate-500">{filtered.length} matching tickets</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3">S.No</th>
                        <th className="px-4 py-3">Ticket ID</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Problem / Location</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Assigned To</th>
                        <th className="px-4 py-3">Raised On</th>
                        <th className="px-4 py-3">SLA (3 Days)</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paged.length === 0 ? (
                        <tr><td colSpan={10} className="text-center text-slate-400 py-10">No tickets match the current filters.</td></tr>
                      ) : paged.map((t, i) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{(page - 1) * pageSize + i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-blue-700">{t.id}</td>
                          <td className="px-4 py-3 text-slate-600">{t.category}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">{t.problem}</div>
                            <div className="text-xs text-slate-400">{t.location}</div>
                          </td>
                          <td className="px-4 py-3"><Badge text={t.priority} className={PRIORITY_STYLES[t.priority]} /></td>
                          <td className="px-4 py-3"><Badge text={t.status} className={STATUS_STYLES[t.status]} /></td>
                          <td className="px-4 py-3 text-slate-600">{t.assigned}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{t.raisedOn}</td>
                          <td className="px-4 py-3 text-xs font-medium"><span className={SLA_COLOR[t.slaColor]}>{t.sla}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setActiveTicket(t)} className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center"><Eye size={15} /></button>
                              <button className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center"><MoreVertical size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-sm text-slate-600">
                  <div>Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} records</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPage(1)} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center"><ChevronsLeft size={14} /></button>
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center"><ChevronLeft size={14} /></button>
                    <span className="h-8 w-8 rounded-lg bg-blue-600 text-white font-medium flex items-center justify-center">{page}</span>
                    <button onClick={() => setPage((p) => (p * pageSize < filtered.length ? p + 1 : p))} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center"><ChevronRight size={14} /></button>
                    <button onClick={() => setPage(Math.max(1, Math.ceil(filtered.length / pageSize)))} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center"><ChevronsRight size={14} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><Clock size={16} className="text-blue-600" /> SLA Information</h3>
                <p className="text-xs text-slate-600 leading-relaxed">All approved/active tickets must be resolved within</p>
                <div className="text-3xl font-bold text-blue-700 my-2">3 Days</div>
                <p className="text-xs text-slate-600 leading-relaxed">from the applicable approval/processing date.</p>
                <button className="mt-3 text-xs font-semibold text-blue-700 hover:underline">View SLA Policy →</button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">Status Legend</h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />Open / Awaiting Inspection</li>
                  <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />In Progress / Under Repair</li>
                  <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Verification / Resolved</li>
                  <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Overdue</li>
                  <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" />Closed / Completed</li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Workflow Summary</h3>
                <ol className="relative border-l-2 border-slate-200 ml-2 space-y-4">
                  {WORKFLOW.map((stage, i) => (
                    <li key={stage} className="ml-4 relative">
                      <span className="absolute -left-[23px] top-0.5 h-4 w-4 rounded-full bg-blue-600 border-2 border-white" />
                      <span className="text-sm text-slate-700 font-medium">{i + 1}. {stage}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><UserPlus size={15} className="text-blue-600" /> Assign Repair Personnel</button>
                  <button className="w-full text-left text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2"><Layers size={15} className="text-blue-600" /> Bulk Update Status</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TicketDetailsModal ticket={activeTicket} onClose={() => setActiveTicket(null)} />
    </div>
  );
}
