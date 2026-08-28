import { useMemo, useState, useEffect } from "react";
import {
  Ticket, FolderOpen, Wrench, CheckCircle2, AlertTriangle,
  Search, RotateCcw, FileDown, Eye, MoreVertical, X, Menu,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Clock,
  UserPlus, Layers,
} from "lucide-react";
import panimalarLogo from "./assets/panimalar-logo.png";
import panimalar26Years from "./assets/panimalar-26years.png";
import { fetchTickets, fetchTicketsSummary, exportTickets } from "./services/ticketsService";
import useAuth from "./hooks/useAuth";

/**
 * Tickets Page — Accessory Repair Complaint Tracking System
 * Panimalar Engineering College
 *
 * Stack: React + Vite + Tailwind CSS (no TypeScript, no Bootstrap)
 *
 * This component calls a backend exposing:
 *   GET /api/tickets?search=&status=&category=&priority=&fromDate=&toDate=&location=&assignedTo=&page=&limit=
 *   GET /api/tickets/summary
 *   GET /api/tickets/export
 * via services/ticketsService.js — see fetchTickets(), fetchTicketsSummary()
 * and exportTickets(). No mock/placeholder data is used; if these endpoints
 * are not yet live on the Express/Prisma backend, the page will surface the
 * request error inline rather than falling back to fake data.
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

// Maps a summary label coming back from GET /api/tickets/summary to the
// icon/color used to render it. The counts themselves always come from the API.
const SUMMARY_PRESENTATION = {
  "Total Tickets": { icon: Ticket, color: "text-blue-600 bg-blue-50" },
  Open: { icon: FolderOpen, color: "text-amber-600 bg-amber-50" },
  "In Progress": { icon: Wrench, color: "text-indigo-600 bg-indigo-50" },
  Resolved: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  Overdue: { icon: AlertTriangle, color: "text-red-600 bg-red-50" },
};

const SIDEBAR_LINKS = [
  "Dashboard", "Raise Complaint", "My Complaints", "Approvals", "Tickets",
  "Requests", "Technician", "Stock Management", "Reports", "Notifications", "Settings",
];

function Badge({ text, className }) {
  return <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${className}`}>{text}</span>;
}

function SummaryCard({ item }) {
  const presentation = SUMMARY_PRESENTATION[item.label] || { icon: Ticket, color: "text-slate-600 bg-slate-50" };
  const Icon = item.icon || presentation.icon;
  const color = item.color || presentation.color;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className={`h-9 w-9 rounded-lg ${color} flex items-center justify-center mb-2`}>
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

export default function TicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: "", status: "All Status", category: "All Categories",
    priority: "All Priorities", fromDate: "", toDate: "",
    location: "All Locations", assignedTo: "All Technicians",
  });
  const [activeTicket, setActiveTicket] = useState(null);
  const [page, setPage] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pageSize = 10;

  // Live data: GET /api/tickets (filtered + paginated server-side) and
  // GET /api/tickets/summary for the dashboard counts.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchTickets(filters, page, pageSize), fetchTicketsSummary()])
      .then(([ticketsResult, summaryResult]) => {
        if (cancelled) return;
        setTickets(ticketsResult.tickets);
        setTotal(ticketsResult.total);
        setSummary(summaryResult);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load tickets.");
        setTickets([]);
        setSummary([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  // Filters changed -> results shrink/change shape, so land back on page 1
  // instead of stranding the user on a page that may no longer exist.
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.category, filters.priority, filters.fromDate, filters.toDate, filters.location, filters.assignedTo]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = tickets;

  function resetFilters() {
    setFilters({
      search: "", status: "All Status", category: "All Categories",
      priority: "All Priorities", fromDate: "", toDate: "",
      location: "All Locations", assignedTo: "All Technicians",
    });
    setPage(1);
  }

  async function exportCSV() {
    setExporting(true);
    try {
      const blob = await exportTickets(filters);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "tickets_export.csv";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(err.message || "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  function goTo(link) {
    // Navigation between pages is owned by the app's router (react-router
    // routes live outside this standalone component). We only manage the
    // mobile drawer's open/close state here so it doesn't reload the page.
    setMobileNavOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* MOBILE OVERLAY */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`w-64 shrink-0 bg-[#0b1b3a] text-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">PEC</div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-white tracking-wide">PANIMALAR</div>
            <div className="text-[10px] text-slate-400 tracking-wide">ENGINEERING COLLEGE</div>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="ml-auto text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => goTo(link)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${link === "Tickets" ? "bg-blue-700 text-white" : "hover:bg-slate-800"}`}
            >
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
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-5 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="text-slate-500 hover:text-slate-800 lg:hidden shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <img src={panimalarLogo} alt="Panimalar Engineering College" className="h-10 w-10 object-contain shrink-0" />
            <span className="font-semibold text-slate-700 truncate hidden sm:inline">Repair &amp; Maintenance Management System</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <img src={panimalar26Years} alt="Celebrating 26 years of excellence in education" className="h-10 w-auto object-contain rounded hidden sm:block" />
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
              {user.name?.[4] || "U"}
            </div>
            <div className="leading-tight hidden md:block">
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
                  <button onClick={exportCSV} disabled={exporting} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1.5">
                    <FileDown size={14} /> {exporting ? "Exporting…" : "Export"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800">Tickets List</h2>
                  <span className="text-xs text-slate-500">{total} matching tickets</span>
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
                      {loading ? (
                        <tr><td colSpan={10} className="text-center text-slate-400 py-10">Loading tickets…</td></tr>
                      ) : paged.length === 0 ? (
                        <tr><td colSpan={10} className="text-center text-slate-400 py-10">No tickets match the current filters.</td></tr>
                      ) : paged.map((t, i) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{(safePage - 1) * pageSize + i + 1}</td>
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
                  <div>Showing {total === 0 ? 0 : (safePage - 1) * pageSize + 1} to {Math.min(safePage * pageSize, total)} of {total} records</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPage(1)} disabled={safePage === 1} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><ChevronsLeft size={14} /></button>
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><ChevronLeft size={14} /></button>
                    <span className="h-8 w-8 rounded-lg bg-blue-600 text-white font-medium flex items-center justify-center">{safePage}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><ChevronRight size={14} /></button>
                    <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><ChevronsRight size={14} /></button>
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
