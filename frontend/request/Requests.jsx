import { useEffect, useMemo, useState } from "react";
import {
  Inbox, Hourglass, Wrench, CheckCircle2, XCircle,
  Search, RotateCcw, FileDown, Eye, X, Plus, Menu,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Clock,
  Box, User, UserPlus, Layers, PackagePlus, ShieldCheck, HelpCircle,
} from "lucide-react";
import { fetchRequests, fetchRequestSummary, createRequest } from "./src/services/requestService";
import panimalarLogo from "./src/assets/panimalar-logo.jpeg";
import panimalar26Years from "./src/assets/panimalar-26years.jpeg";

/**
 * Requests Page — Repair & Maintenance Management System
 * Panimalar Engineering College
 *
 * Stack: React + Vite + Tailwind CSS (no TypeScript, no Bootstrap)
 *
 * Expects a backend exposing:
 *   GET   /api/requests?search=&type=&status=&priority=&fromDate=&toDate=&requestedBy=&location=&page=&limit=
 *   GET   /api/requests/:id
 *   POST  /api/requests
 *   PATCH /api/requests/:id/status
 *   POST  /api/requests/:id/approve
 *   POST  /api/requests/:id/reject
 *   POST  /api/requests/:id/assign
 *   GET   /api/requests/summary
 *   GET   /api/requests/export
 * Data is loaded live via src/services/requestService.js (Node.js/Express +
 * Prisma/PostgreSQL backend) — no mock data or hard-coded counts.
 */

const WORKFLOW = ["Request Raised", "Under Review / Approval", "Approved", "In Progress", "Completed"];
const REJECT_WORKFLOW = ["Request Raised", "Under Review", "Rejected"];
const STAGE_INDEX = { Pending: 0, "Under Review": 1, Approved: 2, "In Progress": 3, Completed: 4, Rejected: 2 };

const TYPE_STYLES = {
  "Material Request": "bg-blue-100 text-blue-700",
  "Equipment Request": "bg-emerald-100 text-emerald-700",
  "Service Request": "bg-purple-100 text-purple-700",
  "Maintenance Request": "bg-orange-100 text-orange-700",
};
const PRIORITY_STYLES = { High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-emerald-100 text-emerald-700" };
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-purple-100 text-purple-700",
  Approved: "bg-blue-100 text-blue-700",
  "In Progress": "bg-sky-100 text-sky-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

// Icon/color metadata for summary cards. Values are populated live from
// GET /api/requests/summary — this only maps each label to its presentation.
const SUMMARY_META = {
  "Total Requests": { sub: "All time", icon: Inbox, color: "text-blue-600 bg-blue-50" },
  Pending: { sub: "Awaiting action", icon: Hourglass, color: "text-amber-600 bg-amber-50" },
  "In Progress": { sub: "Under process", icon: Wrench, color: "text-sky-600 bg-sky-50" },
  Completed: { sub: "Successfully done", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  Rejected: { sub: "Not approved", icon: XCircle, color: "text-red-600 bg-red-50" },
};

const SIDEBAR_LINKS = [
  "Dashboard", "Raise Complaint", "My Complaints", "Approvals", "Tickets",
  "Requests", "Technician", "Stock Management", "Reports", "Notifications", "Settings",
];

const QUICK_LINKS = [
  { label: "Assign Repair Personnel", icon: UserPlus },
  { label: "Bulk Update Status", icon: Layers },
  { label: "Spare Parts Issue", icon: PackagePlus },
  { label: "SLA Policy", icon: ShieldCheck },
  { label: "Help & Support", icon: HelpCircle },
];

const EMPTY_FORM = {
  type: "Material Request", title: "", desc: "", priority: "Low",
  dept: "", location: "Main Building", requiredBy: "", by: "", remarks: "",
};

function Badge({ text, className }) {
  return <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${className}`}>{text}</span>;
}

function SummaryCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className={`h-9 w-9 rounded-lg ${item.color} flex items-center justify-center mb-2`}><Icon size={18} /></div>
      <div className="text-2xl font-bold text-slate-800">{item.value}</div>
      <div className="text-sm font-medium text-slate-600">{item.label}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
    </div>
  );
}

function RequestDetailsModal({ request, onClose }) {
  if (!request) return null;
  const flow = request.status === "Rejected" ? REJECT_WORKFLOW : WORKFLOW;
  const currentIdx = STAGE_INDEX[request.status] ?? 0;

  return (
    <div className="fixed inset-0 bg-slate-900/55 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-bold text-lg text-slate-800">Request Details — {request.id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5 text-sm">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Request Information</h4>
            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div><span className="text-slate-400">Type:</span> <Badge text={request.type} className={TYPE_STYLES[request.type]} /></div>
              <div><span className="text-slate-400">Priority:</span> <Badge text={request.priority} className={PRIORITY_STYLES[request.priority]} /></div>
              <div className="col-span-2"><span className="text-slate-400">Title:</span> <span className="font-medium">{request.title}</span></div>
              <div className="col-span-2"><span className="text-slate-400">Description:</span> {request.desc}</div>
              <div><span className="text-slate-400">Requested By:</span> {request.by}</div>
              <div><span className="text-slate-400">Department:</span> {request.dept}</div>
              <div><span className="text-slate-400">Location:</span> {request.location}</div>
              <div><span className="text-slate-400">Status:</span> <Badge text={request.status} className={STATUS_STYLES[request.status]} /></div>
              <div><span className="text-slate-400">Requested On:</span> {request.on}</div>
              <div><span className="text-slate-400">Expected Completion:</span> {request.expected}</div>
              <div><span className="text-slate-400">Assigned Personnel:</span> {request.assigned}</div>
              <div className="text-slate-400 italic">No attachments uploaded</div>
              <div className="col-span-2"><span className="text-slate-400">Remarks:</span> <span className="italic text-slate-500">{request.remarks}</span></div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Request Timeline</h4>
            <ol className="relative border-l-2 border-slate-200 ml-2 space-y-4">
              {flow.map((stage, i) => {
                const done = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const dotColor = done ? (request.status === "Rejected" && isCurrent ? "bg-red-500" : "bg-blue-600") : "bg-slate-300";
                return (
                  <li key={stage} className="ml-4 relative">
                    <span className={`absolute -left-[23px] top-0.5 h-4 w-4 rounded-full border-2 border-white ${dotColor}`} />
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

function NewRequestModal({ open, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  if (!open) return null;

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSubmit() {
    if (!form.title.trim() || submitting) return;
    await onSubmit(form);
    setForm(EMPTY_FORM);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/55 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-bold text-lg text-slate-800">New Request</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Request Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {["Material Request", "Equipment Request", "Service Request", "Maintenance Request"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Priority</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {["High", "Medium", "Low"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Request Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Request for replacement mouse" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Description</label>
            <textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} rows={3} placeholder="Describe the request..." className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Department</label>
              <input value={form.dept} onChange={(e) => set("dept", e.target.value)} placeholder="e.g. Computer Science" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Location / Building</label>
              <select value={form.location} onChange={(e) => set("location", e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {["Main Building", "Block A", "Block B", "Administrative Block", "Laboratory", "Library", "Hostel"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Required By Date</label>
              <input type="date" value={form.requiredBy} onChange={(e) => set("requiredBy", e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Requested By</label>
              <input value={form.by} onChange={(e) => set("by", e.target.value)} placeholder="Your name" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Attachments</label>
            <input type="file" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Additional Remarks</label>
            <textarea value={form.remarks} onChange={(e) => set("remarks", e.target.value)} rows={2} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestsPage({ user = { name: "Mr. Karthik", role: "Technician" } }) {
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    search: "", type: "All Types", status: "All Status", priority: "All Priorities",
    fromDate: "", toDate: "", requestedBy: "All Users", location: "All Locations",
  });
  const [activeRequest, setActiveRequest] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function showToast(message, type = "success") {
    setToastType(type);
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 3000);
  }

  // Load requests + summary from the live backend whenever filters or page change.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const [{ data }, summaryData] = await Promise.all([
          fetchRequests({ ...filters, page, limit: pageSize }),
          fetchRequestSummary(),
        ]);
        if (cancelled) return;
        setRequests(data);
        setSummary(
          summaryData.map((s) => ({ ...s, ...(SUMMARY_META[s.label] || {}) }))
        );
      } catch (error) {
        if (cancelled) return;
        setLoadError(error.message);
        showToast(error.message, "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filters, page]);

  // Backend already applies filters/pagination; this local pass covers the
  // moment between a filter change and the next successful fetch.
  const filtered = useMemo(() => requests, [requests]);
  const paged = filtered;

  function updateFilters(next) {
    // Any change to search or filter criteria (From/To Date, Requested By, etc.)
    // must reset back to page 1 so results are never a stale, empty page.
    setFilters(next);
    setPage(1);
  }

  function resetFilters() {
    updateFilters({
      search: "", type: "All Types", status: "All Status", priority: "All Priorities",
      fromDate: "", toDate: "", requestedBy: "All Users", location: "All Locations",
    });
  }

  function viewMyRequests() {
    updateFilters({ ...filters, search: user.name.replace("Mr. ", "") });
  }

  function exportCSV() {
    const header = ["Request ID", "Request Type", "Title", "Requested By", "Department", "Priority", "Status", "Requested Date", "Location"];
    const rows = filtered.map((r) => [r.id, r.type, r.title, r.by, r.dept, r.priority, r.status, r.on, r.location]);
    const csv = [header, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "requests_export.csv";
    a.click();
  }

  async function handleNewRequest(form) {
    setSubmitting(true);
    try {
      const created = await createRequest({
        type: form.type, title: form.title, desc: form.desc,
        by: form.by || user.name, dept: form.dept, location: form.location,
        priority: form.priority, requiredBy: form.requiredBy, remarks: form.remarks,
      });
      // Only mutate local state and show success after the backend confirms.
      setRequests((r) => [created, ...r]);
      setShowNewModal(false);
      showToast(`Request ${created?.id ?? ""} submitted successfully`.trim());
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  function closeSidebar() { setSidebarOpen(false); }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* Mobile overlay — click to close */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`w-64 shrink-0 bg-[#0b1b3a] text-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <img src={panimalarLogo} alt="Panimalar Engineering College" className="h-10 w-10 rounded-full object-cover shrink-0" />
            <div className="leading-tight min-w-0">
              <div className="text-[13px] font-bold text-white tracking-wide">PANIMALAR</div>
              <div className="text-[10px] text-slate-400 tracking-wide truncate">ENGINEERING COLLEGE</div>
            </div>
          </div>
          <button onClick={closeSidebar} className="text-slate-400 hover:text-white lg:hidden shrink-0" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1 text-sm">
          {SIDEBAR_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${link === "Requests" ? "bg-blue-700 text-white" : "hover:bg-slate-800"}`}
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 mt-2 mx-3 mb-3 bg-white/5 rounded-xl border border-white/10">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wide mb-2 px-1">Quick Links</div>
          <div className="space-y-1 text-xs">
            {QUICK_LINKS.map(({ label, icon: Icon }) => (
              <a key={label} href="#" onClick={closeSidebar} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10">
                <Icon size={14} className="text-blue-400" />{label}
              </a>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-white/10 text-[10px] text-slate-500 leading-snug">
          © 2026 Panimalar Engineering College.<br />All rights reserved.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-5 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-800 lg:hidden shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <img src={panimalarLogo} alt="Panimalar Engineering College" className="h-9 w-9 rounded-full object-cover shrink-0 hidden sm:block" />
            <span className="font-semibold text-slate-700 truncate">Repair &amp; Maintenance Management System</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <img src={panimalar26Years} alt="Celebrating 26 years of excellence in education — Panimalar" className="h-10 w-auto rounded hidden md:block" />
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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Requests</h1>
              <div className="text-xs text-slate-500 mt-1"><span className="text-blue-600">Home</span> &gt; <span className="text-slate-700 font-medium">Requests</span></div>
            </div>
            <button onClick={() => setShowNewModal(true)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5">
              <Plus size={16} /> New Request
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {summary.map((s) => <SummaryCard key={s.label} item={s} />)}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            <div className="xl:col-span-3 space-y-5">
              {/* FILTERS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Search</label>
                    <div className="relative mt-1">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={filters.search}
                        onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                        placeholder="Search by Request ID, Title, Department..."
                        className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500">Request Type</label>
                    <select value={filters.type} onChange={(e) => updateFilters({ ...filters, type: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Types", "Material Request", "Equipment Request", "Service Request", "Maintenance Request"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Status</label>
                    <select value={filters.status} onChange={(e) => updateFilters({ ...filters, status: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Status", "Pending", "Under Review", "Approved", "In Progress", "Completed", "Rejected"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Priority</label>
                    <select value={filters.priority} onChange={(e) => updateFilters({ ...filters, priority: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Priorities", "High", "Medium", "Low"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500">From Date</label>
                    <input type="date" value={filters.fromDate} onChange={(e) => updateFilters({ ...filters, fromDate: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">To Date</label>
                    <input type="date" value={filters.toDate} onChange={(e) => updateFilters({ ...filters, toDate: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Requested By</label>
                    <select value={filters.requestedBy} onChange={(e) => updateFilters({ ...filters, requestedBy: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Users", "Faculty/Staff", "Technician", "HOD", "Service Provider"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Location / Building</label>
                    <select value={filters.location} onChange={(e) => updateFilters({ ...filters, location: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Locations", "Main Building", "Block A", "Block B", "Administrative Block", "Laboratory", "Library", "Hostel"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>

                  <div className="flex items-end gap-3 md:col-span-2">
                    <button onClick={resetFilters} className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5">
                      <RotateCcw size={14} /> Reset
                    </button>
                    <button onClick={exportCSV} className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-1.5">
                      <FileDown size={14} /> Export
                    </button>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800">Requests List</h2>
                  <span className="text-xs text-slate-500">{filtered.length} matching requests</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3">S.No</th>
                        <th className="px-4 py-3">Request ID</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Request Title / Description</th>
                        <th className="px-4 py-3">Requested By</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Requested On</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr><td colSpan={10} className="text-center text-slate-400 py-10">Loading requests…</td></tr>
                      ) : loadError ? (
                        <tr><td colSpan={10} className="text-center text-red-500 py-10">{loadError}</td></tr>
                      ) : paged.length === 0 ? (
                        <tr><td colSpan={10} className="text-center text-slate-400 py-10">No requests match the current filters.</td></tr>
                      ) : paged.map((r, i) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{(page - 1) * pageSize + i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-blue-700">{r.id}</td>
                          <td className="px-4 py-3"><Badge text={r.type} className={TYPE_STYLES[r.type]} /></td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">{r.title}</div>
                            <div className="text-xs text-slate-400 truncate max-w-xs">{r.desc}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{r.by}</td>
                          <td className="px-4 py-3 text-slate-600">{r.dept}</td>
                          <td className="px-4 py-3"><Badge text={r.priority} className={PRIORITY_STYLES[r.priority]} /></td>
                          <td className="px-4 py-3"><Badge text={r.status} className={STATUS_STYLES[r.status]} /></td>
                          <td className="px-4 py-3 text-xs text-slate-500">{r.on}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => setActiveRequest(r)} className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center"><Eye size={15} /></button>
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
                <p className="text-xs text-slate-600 leading-relaxed mb-2">Requests will be processed based on priority.</p>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" />High</span><span className="font-semibold">1 Day</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />Medium</span><span className="font-semibold">3 Days</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Low</span><span className="font-semibold">5 Days</span></li>
                </ul>
                <button className="mt-3 text-xs font-semibold text-blue-700 hover:underline">View SLA Policy →</button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">Request Types</h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><Box size={14} className="text-blue-600" />Material Request</li>
                  <li className="flex items-center gap-2"><Wrench size={14} className="text-emerald-600" />Equipment Request</li>
                  <li className="flex items-center gap-2"><User size={14} className="text-purple-600" />Service Request</li>
                  <li className="flex items-center gap-2"><Wrench size={14} className="text-amber-600" />Maintenance Request</li>
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
                  <button onClick={() => setShowNewModal(true)} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={15} /> New Request
                  </button>
                  <button onClick={viewMyRequests} className="w-full text-left text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2">
                    <User size={15} className="text-blue-600" /> View My Requests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <RequestDetailsModal request={activeRequest} onClose={() => setActiveRequest(null)} />
      <NewRequestModal open={showNewModal} onClose={() => setShowNewModal(false)} onSubmit={handleNewRequest} submitting={submitting} />

      {toast && (
        <div className={`fixed bottom-6 right-6 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50 flex items-center gap-2 ${toastType === "error" ? "bg-red-600" : "bg-emerald-600"}`}>
          {toastType === "error" ? <XCircle size={16} /> : <CheckCircle2 size={16} />} {toast}
        </div>
      )}
    </div>
  );
}
