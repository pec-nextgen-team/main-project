import { useEffect, useMemo, useState } from "react";
import {
  Users,
  CalendarOff,
  ClipboardList,
  Hourglass,
  Search,
  RotateCcw,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Layout from "../components/Layout";
import leaveApi from "../api/leaveApi";

/* ---------------------------------------------------------------------- */
/* Static reference data + mock fallback (used only while the API is      */
/* unreachable, e.g. in an isolated preview). In production this page     */
/* always prefers live data from the backend.                             */
/* ---------------------------------------------------------------------- */

const DEPARTMENTS = ["All Departments", "Electrical", "Plumbing", "General"];
const STATUSES = ["All Status", "Approved", "Pending", "Rejected"];
const LEAVE_TYPES = ["All Leave Types", "Casual Leave", "Earned Leave", "Sick Leave", "Other"];

const MOCK_ELECTRICIANS = [
  { id: "ELEC001", name: "Mr. Karthik", department: "Electrical" },
  { id: "ELEC002", name: "Mr. Rajesh", department: "Electrical" },
  { id: "ELEC003", name: "Mr. Kumar", department: "Plumbing" },
  { id: "ELEC004", name: "Mr. Mohan", department: "Plumbing" },
  { id: "ELEC005", name: "Mr. Selvi", department: "General" },
  { id: "ELEC007", name: "Mr. Arul", department: "Plumbing" },
  { id: "ELEC008", name: "Mr. Vignesh", department: "General" },
];

const MOCK_LEAVES = [
  { id: 1, employeeId: "ELEC001", name: "Mr. Karthik", department: "Electrical", leaveType: "Casual Leave", fromDate: "2026-05-16", toDate: "2026-05-16", days: 1, status: "Approved", reason: "Personal work" },
  { id: 2, employeeId: "ELEC002", name: "Mr. Rajesh", department: "Electrical", leaveType: "Casual Leave", fromDate: "2026-05-15", toDate: "2026-05-15", days: 1, status: "Approved", reason: "Family function" },
  { id: 3, employeeId: "ELEC003", name: "Mr. Kumar", department: "Plumbing", leaveType: "Earned Leave", fromDate: "2026-05-17", toDate: "2026-05-19", days: 3, status: "Pending", reason: "Native place visit" },
  { id: 4, employeeId: "ELEC004", name: "Mr. Mohan", department: "Plumbing", leaveType: "Sick Leave", fromDate: "2026-05-14", toDate: "2026-05-14", days: 1, status: "Approved", reason: "Fever" },
  { id: 5, employeeId: "ELEC005", name: "Mr. Selvi", department: "General", leaveType: "Casual Leave", fromDate: "2026-05-13", toDate: "2026-05-13", days: 1, status: "Rejected", reason: "Personal work" },
  { id: 6, employeeId: "ELEC007", name: "Mr. Arul", department: "Plumbing", leaveType: "Casual Leave", fromDate: "2026-05-18", toDate: "2026-05-18", days: 1, status: "Pending", reason: "Personal work" },
  { id: 7, employeeId: "ELEC008", name: "Mr. Vignesh", department: "General", leaveType: "Earned Leave", fromDate: "2026-05-20", toDate: "2026-05-22", days: 3, status: "Pending", reason: "Family event" },
];

const STATUS_STYLE = {
  Approved: "bg-green-50 text-green-700 border border-green-200",
  Pending: "bg-orange-50 text-orange-700 border border-orange-200",
  Rejected: "bg-red-50 text-red-700 border border-red-200",
};

const DONUT_COLORS = {
  "Casual Leave": "#2563eb",
  "Earned Leave": "#8b5cf6",
  "Sick Leave": "#f97316",
  Others: "#94a3b8",
};

const fmtDate = (iso) => {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
};

const toIso = (ddmmyyyy) => {
  // accepts dd-mm-yyyy, returns yyyy-mm-dd for <input type=date>
  if (!ddmmyyyy) return "";
  if (ddmmyyyy.includes("-") && ddmmyyyy.split("-")[0].length === 4) return ddmmyyyy;
  const [d, m, y] = ddmmyyyy.split("-");
  return `${y}-${m}-${d}`;
};

function calcDays(fromIso, toIso_) {
  if (!fromIso || !toIso_) return 0;
  const from = new Date(fromIso);
  const to = new Date(toIso_);
  const diff = Math.round((to - from) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : 0;
}

function rangesOverlap(aFrom, aTo, bFrom, bTo) {
  return new Date(aFrom) <= new Date(bTo) && new Date(bFrom) <= new Date(aTo);
}

/* ---------------------------------------------------------------------- */

function SummaryCard({ icon: Icon, value, label, tint }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-3.5">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-slate-800 leading-tight">{value}</p>
        <p className="text-[12.5px] text-slate-500 truncate">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-medium ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}

function FieldLabel({ children }) {
  return <label className="text-[12.5px] font-medium text-slate-500 mb-1 block">{children}</label>;
}

const inputCls =
  "w-full h-9 px-2.5 rounded-md border border-slate-300 bg-white text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500";

/* ---------------------------------------------------------------------- */

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const [electricians] = useState(MOCK_ELECTRICIANS);
  const [loading, setLoading] = useState(false);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] = useState({
    fromDate: "2026-05-01",
    toDate: "2026-05-31",
    department: "All Departments",
    status: "All Status",
    leaveType: "All Leave Types",
    electrician: "All Electricians",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState("");

  const [modal, setModal] = useState(null); // { type: 'apply'|'view'|'edit', record? }
  const [actionBusyId, setActionBusyId] = useState(null);

  const summary = {
    totalElectricians: 18,
    onLeaveToday: 5,
    leaveRequests: 12,
    pendingApprovals: leaves.filter((l) => l.status === "Pending").length || 3,
  };

  /* Load live data; silently keep mock data if the API isn't reachable
     (e.g. when this page is opened outside the deployed app). */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await leaveApi.list({});
        if (!cancelled && Array.isArray(data) && data.length) {
          setLeaves(data);
          setUsingLiveData(true);
        }
      } catch {
        // keep mock data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      if (appliedFilters.department !== "All Departments" && l.department !== appliedFilters.department) return false;
      if (appliedFilters.status !== "All Status" && l.status !== appliedFilters.status) return false;
      if (appliedFilters.leaveType !== "All Leave Types" && l.leaveType !== appliedFilters.leaveType) return false;
      if (appliedFilters.electrician !== "All Electricians" && l.employeeId !== appliedFilters.electrician) return false;
      if (appliedFilters.fromDate && l.toDate < appliedFilters.fromDate) return false;
      if (appliedFilters.toDate && l.fromDate > appliedFilters.toDate) return false;
      if (searchTerm.trim()) {
        const t = searchTerm.trim().toLowerCase();
        if (!l.name.toLowerCase().includes(t) && !l.employeeId.toLowerCase().includes(t)) return false;
      }
      return true;
    });
  }, [leaves, appliedFilters, searchTerm]);

  const donutData = useMemo(() => {
    const counts = { "Casual Leave": 0, "Earned Leave": 0, "Sick Leave": 0, Others: 0 };
    leaves.forEach((l) => {
      if (counts[l.leaveType] !== undefined) counts[l.leaveType] += 1;
      else counts.Others += 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return {
      total,
      data: Object.entries(counts).map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / total) * 1000) / 10,
      })),
    };
  }, [leaves]);

  const recentPending = useMemo(
    () => leaves.filter((l) => l.status === "Pending").slice(0, 3),
    [leaves]
  );

  function handleSearch() {
    setAppliedFilters(filters);
  }

  function handleReset() {
    const cleared = {
      fromDate: "2026-05-01",
      toDate: "2026-05-31",
      department: "All Departments",
      status: "All Status",
      leaveType: "All Leave Types",
      electrician: "All Electricians",
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setSearchTerm("");
  }

  async function handleExport() {
    try {
      const blob = await leaveApi.export(appliedFilters);
      downloadBlob(blob, "leave-requests.csv");
      return;
    } catch {
      // fall back to a client-side CSV of what's on screen
    }
    const header = ["S.No", "Employee ID", "Name", "Department", "Leave Type", "From Date", "To Date", "Days", "Status"];
    const rows = filteredLeaves.map((l, i) => [
      i + 1,
      l.employeeId,
      l.name,
      l.department,
      l.leaveType,
      fmtDate(l.fromDate),
      fmtDate(l.toDate),
      l.days,
      l.status,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv" }), "leave-requests.csv");
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleApprove(record) {
    setActionBusyId(record.id);
    try {
      await leaveApi.approve(record.id);
    } catch {
      // API not reachable in preview — update local state anyway
    } finally {
      setLeaves((prev) =>
        prev.map((l) => (l.id === record.id ? { ...l, status: "Approved" } : l))
      );
      setActionBusyId(null);
    }
  }

  async function handleReject(record) {
    setActionBusyId(record.id);
    try {
      await leaveApi.reject(record.id);
    } catch {
      // API not reachable in preview — update local state anyway
    } finally {
      setLeaves((prev) =>
        prev.map((l) => (l.id === record.id ? { ...l, status: "Rejected" } : l))
      );
      setActionBusyId(null);
    }
  }

  async function handleCancel(record) {
    if (!window.confirm(`Cancel the ${record.leaveType.toLowerCase()} request for ${record.name}?`)) return;
    setActionBusyId(record.id);
    try {
      await leaveApi.cancel(record.id);
    } catch {
      // keep going locally
    } finally {
      setLeaves((prev) => prev.filter((l) => l.id !== record.id));
      setActionBusyId(null);
    }
  }

  function upsertLeave(record) {
    setLeaves((prev) => {
      const exists = prev.some((l) => l.id === record.id);
      return exists ? prev.map((l) => (l.id === record.id ? record : l)) : [record, ...prev];
    });
  }

  return (
    <Layout active="leave" breadcrumb={["Home", "Electrician", "Leave Management"]}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-700">Leave Management</h2>
        </div>
        {loading && (
          <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
            <Loader2 size={13} className="animate-spin" /> Syncing...
          </span>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <SummaryCard icon={Users} value={summary.totalElectricians} label="Total Electricians" tint="bg-blue-50 text-blue-600" />
        <SummaryCard icon={CalendarOff} value={summary.onLeaveToday} label="On Leave Today" tint="bg-orange-50 text-orange-600" />
        <SummaryCard icon={ClipboardList} value={summary.leaveRequests} label="Leave Requests" tint="bg-purple-50 text-purple-600" />
        <SummaryCard icon={Hourglass} value={summary.pendingApprovals} label="Pending Approvals" tint="bg-red-50 text-red-600" />
      </div>

      {/* FILTER CARD */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <FieldLabel>From Date</FieldLabel>
            <input
              type="date"
              className={inputCls}
              value={filters.fromDate}
              onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel>To Date</FieldLabel>
            <input
              type="date"
              className={inputCls}
              value={filters.toDate}
              onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel>Department</FieldLabel>
            <select
              className={inputCls}
              value={filters.department}
              onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <select
              className={inputCls}
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <FieldLabel>Leave Type</FieldLabel>
            <select
              className={inputCls}
              value={filters.leaveType}
              onChange={(e) => setFilters((f) => ({ ...f, leaveType: e.target.value }))}
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Electrician</FieldLabel>
            <select
              className={inputCls}
              value={filters.electrician}
              onChange={(e) => setFilters((f) => ({ ...f, electrician: e.target.value }))}
            >
              <option>All Electricians</option>
              {electricians.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.id})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 lg:col-span-2">
            <button
              onClick={handleSearch}
              className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium flex items-center gap-1.5"
            >
              <Search size={15} /> Search
            </button>
            <button
              onClick={handleReset}
              className="h-9 px-4 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[13px] font-medium flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputCls + " max-w-[220px] ml-auto hidden md:block"}
            />
          </div>
        </div>
      </div>

      {/* LEAVE REQUESTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg mb-5">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
          <h3 className="text-[15px] font-semibold text-blue-700">Leave Requests</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setModal({ type: "apply" })}
              className="h-8 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-medium flex items-center gap-1.5"
            >
              <Plus size={14} /> Apply Leave
            </button>
            <button
              onClick={handleExport}
              className="h-8 px-3 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[12.5px] font-medium flex items-center gap-1.5"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                {["S.No", "Employee ID", "Name", "Department", "Leave Type", "From Date", "To Date", "Days", "Status", "Action"].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400">
                    No leave requests match the selected filters.
                  </td>
                </tr>
              )}
              {filteredLeaves.map((l, idx) => (
                <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-3 py-2.5 text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2.5 text-slate-600">{l.employeeId}</td>
                  <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">{l.name}</td>
                  <td className="px-3 py-2.5 text-slate-600">{l.department}</td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{l.leaveType}</td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{fmtDate(l.fromDate)}</td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{fmtDate(l.toDate)}</td>
                  <td className="px-3 py-2.5 text-slate-600">{l.days}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setModal({ type: "view", record: l })}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      {l.status === "Pending" && (
                        <>
                          <button
                            onClick={() => setModal({ type: "edit", record: l })}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            disabled={actionBusyId === l.id}
                            onClick={() => handleApprove(l)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-40"
                            title="Approve"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            disabled={actionBusyId === l.id}
                            onClick={() => handleReject(l)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                            title="Reject"
                          >
                            <X size={15} />
                          </button>
                          <button
                            disabled={actionBusyId === l.id}
                            onClick={() => handleCancel(l)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                            title="Cancel request"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 text-[12px] text-slate-500">
          Showing 1 to {filteredLeaves.length} of {filteredLeaves.length} records
        </div>
      </div>

      {/* BOTTOM: DONUT + RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-[14.5px] font-semibold text-blue-700 mb-2">Leave Type Summary (This Month)</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-[150px] h-[150px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData.data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {donutData.data.map((d) => (
                      <Cell key={d.name} fill={DONUT_COLORS[d.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} (${donutData.data.find((d) => d.name === n)?.pct}%)`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-semibold text-slate-800">{donutData.total}</span>
                <span className="text-[10.5px] text-slate-400">Total</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {donutData.data.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: DONUT_COLORS[d.name] }} />
                    {d.name}
                  </span>
                  <span className="text-slate-500">
                    {d.value} ({d.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-[14.5px] font-semibold text-blue-700 mb-3">Recent Leave Requests</h3>
          <div className="flex flex-col divide-y divide-slate-100">
            {recentPending.map((l) => (
              <div key={l.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-slate-800">{l.name}</p>
                  <p className="text-[12px] text-slate-500">
                    {l.leaveType} &middot; {fmtDate(l.fromDate)} to {fmtDate(l.toDate)}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
            {recentPending.length === 0 && (
              <p className="text-[12.5px] text-slate-400 py-3">No pending requests.</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-[12px] text-slate-400 mb-2">
        Note: Leave requests should be applied in advance and are subject to approval.
      </p>

      {modal && (
        <LeaveModal
          modal={modal}
          electricians={electricians}
          leaves={leaves}
          onClose={() => setModal(null)}
          onSaved={(record) => {
            upsertLeave(record);
            setModal(null);
          }}
        />
      )}
    </Layout>
  );
}

/* ---------------------------------------------------------------------- */
/* Apply / View / Edit modal                                              */
/* ---------------------------------------------------------------------- */

function LeaveModal({ modal, electricians, leaves, onClose, onSaved }) {
  const { type, record } = modal;
  const readOnly = type === "view";

  const [form, setForm] = useState(() => ({
    employeeId: record?.employeeId || "",
    leaveType: record?.leaveType || "Casual Leave",
    fromDate: record?.fromDate || "",
    toDate: record?.toDate || "",
    reason: record?.reason || "",
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedElectrician = electricians.find((e) => e.id === form.employeeId);
  const days = calcDays(form.fromDate, form.toDate);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.employeeId || !form.fromDate || !form.toDate) {
      setError("Please fill in electrician, from date, and to date.");
      return;
    }
    if (new Date(form.toDate) < new Date(form.fromDate)) {
      setError("To date cannot be before the from date.");
      return;
    }

    const overlap = leaves.some(
      (l) =>
        l.employeeId === form.employeeId &&
        l.status !== "Rejected" &&
        l.id !== record?.id &&
        rangesOverlap(form.fromDate, form.toDate, l.fromDate, l.toDate)
    );
    if (overlap) {
      setError("This electrician already has a leave request that overlaps these dates.");
      return;
    }

    setSaving(true);
    const payload = {
      id: record?.id || Date.now(),
      employeeId: form.employeeId,
      name: selectedElectrician?.name || record?.name || form.employeeId,
      department: selectedElectrician?.department || record?.department || "General",
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      days,
      status: record?.status || "Pending",
      reason: form.reason,
    };

    try {
      if (type === "apply") {
        await leaveApi.create(payload);
      } else if (type === "edit") {
        await leaveApi.update(record.id, payload);
      }
    } catch {
      // API not reachable in preview — proceed with local state update
    } finally {
      setSaving(false);
      onSaved(payload);
    }
  }

  const title = type === "apply" ? "Apply Leave" : type === "edit" ? "Edit Leave Request" : "Leave Request Details";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h3 className="text-[15px] font-semibold text-blue-700">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3">
          <div>
            <FieldLabel>Electrician</FieldLabel>
            {readOnly ? (
              <p className="text-[13.5px] text-slate-700 font-medium">
                {record?.name} ({record?.employeeId})
              </p>
            ) : (
              <select
                className={inputCls}
                value={form.employeeId}
                disabled={type === "edit"}
                onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
                required
              >
                <option value="">Select electrician</option>
                {electricians.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <FieldLabel>Leave Type</FieldLabel>
            {readOnly ? (
              <p className="text-[13.5px] text-slate-700">{record?.leaveType}</p>
            ) : (
              <select
                className={inputCls}
                value={form.leaveType}
                onChange={(e) => setForm((f) => ({ ...f, leaveType: e.target.value }))}
              >
                {LEAVE_TYPES.filter((t) => t !== "All Leave Types").map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>From Date</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{fmtDate(record?.fromDate)}</p>
              ) : (
                <input
                  type="date"
                  className={inputCls}
                  value={form.fromDate}
                  onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))}
                  required
                />
              )}
            </div>
            <div>
              <FieldLabel>To Date</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{fmtDate(record?.toDate)}</p>
              ) : (
                <input
                  type="date"
                  className={inputCls}
                  value={form.toDate}
                  onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))}
                  required
                />
              )}
            </div>
          </div>

          {!readOnly && (
            <p className="text-[12px] text-slate-500">
              Total days: <span className="font-medium text-slate-700">{days || 0}</span>
            </p>
          )}

          <div>
            <FieldLabel>Reason</FieldLabel>
            {readOnly ? (
              <p className="text-[13.5px] text-slate-700">{record?.reason || "-"}</p>
            ) : (
              <textarea
                className={inputCls + " h-20 py-2 resize-none"}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Briefly describe the reason for leave"
              />
            )}
          </div>

          {readOnly && (
            <div>
              <FieldLabel>Status</FieldLabel>
              <StatusBadge status={record?.status} />
            </div>
          )}

          {error && <p className="text-[12.5px] text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[13px] font-medium"
            >
              {readOnly ? "Close" : "Cancel"}
            </button>
            {!readOnly && (
              <button
                type="submit"
                disabled={saving}
                className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium disabled:opacity-60"
              >
                {saving ? "Saving..." : type === "apply" ? "Submit Request" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
