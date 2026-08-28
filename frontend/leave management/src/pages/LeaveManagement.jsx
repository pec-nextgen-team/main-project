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
import Toast from "../components/Toast";
import Pagination from "../components/Pagination";
import leaveApi from "../api/leaveApi";

/* ---------------------------------------------------------------------- */

const DEPARTMENTS = ["All Departments", "Electrical", "Plumbing", "General"];
const STATUSES = ["All Status", "Approved", "Pending", "Rejected"];
const LEAVE_TYPES = ["All Leave Types", "Casual Leave", "Earned Leave", "Sick Leave", "Other"];

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

/** Pulls a readable message out of an Axios error, falling back to a
 *  generic message if the backend didn't send one (network failure, etc). */
function apiErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
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
  const [leaves, setLeaves] = useState([]);
  const [electricians, setElectricians] = useState([]);
  const [stats, setStats] = useState({
    totalElectricians: 0,
    onLeaveToday: 0,
    leaveRequests: 0,
    pendingApprovals: 0,
    leaveTypeSummary: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    department: "All Departments",
    status: "All Status",
    leaveType: "All Leave Types",
    electricianId: "All Electricians",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Pagination is driven entirely by the backend (GET /api/leaves already
  // returns { data, total, page, limit }), so `leaves` below only ever
  // holds the current page - there is no separate client-side filter pass.
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState(null); // { type: 'apply'|'view'|'edit', record? }
  const [actionBusyId, setActionBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  /* Load the current page of leave requests + summary stats from the live
     backend. No mock fallback: if the API is unreachable we surface a real
     error instead of pretending data loaded successfully. */
  async function loadAll(activeFilters = appliedFilters, activePage = page, activeLimit = limit) {
    setLoading(true);
    setLoadError("");
    try {
      const listParams = { ...activeFilters, page: activePage, limit: activeLimit };
      const [leavesRes, summaryRes] = await Promise.all([
        leaveApi.list(listParams),
        leaveApi.summary(activeFilters),
      ]);
      const rows = Array.isArray(leavesRes) ? leavesRes : leavesRes?.data || [];
      setLeaves(rows);
      setTotal(Array.isArray(leavesRes) ? rows.length : leavesRes?.total ?? rows.length);
      setStats({
        totalElectricians: summaryRes?.totalElectricians ?? 0,
        onLeaveToday: summaryRes?.onLeaveToday ?? 0,
        leaveRequests: summaryRes?.leaveRequests ?? 0,
        pendingApprovals: summaryRes?.pendingApprovals ?? 0,
        leaveTypeSummary: summaryRes?.leaveTypeSummary ?? [],
      });
    } catch (err) {
      setLoadError(apiErrorMessage(err, "Could not reach the server. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  // Electrician roster is independent of the leave-request filters/paging,
  // so it's fetched once on mount rather than being re-fetched on every
  // search, reset, or page change.
  useEffect(() => {
    let cancelled = false;
    leaveApi
      .listElectricians()
      .then((res) => {
        if (!cancelled) setElectricians(Array.isArray(res) ? res : res?.data || []);
      })
      .catch(() => {
        /* Non-fatal: the electrician dropdown will just stay empty; the
           leave-request list itself still loads and surfaces its own error. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Single source of truth for re-fetching: any change to the applied
  // filters, page, or page size triggers exactly one request. handleSearch
  // and handleReset only update state - they never call loadAll directly -
  // so a filter change that also resets the page doesn't fire twice.
  useEffect(() => {
    loadAll(appliedFilters, page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, page, limit]);

  const donutData = useMemo(() => {
    // Sourced from the backend's own groupBy summary (real counts across
    // every matching record), not from the current page of `leaves` - so
    // the chart stays accurate regardless of pagination.
    const counts = { "Casual Leave": 0, "Earned Leave": 0, "Sick Leave": 0, Others: 0 };
    (stats.leaveTypeSummary || []).forEach((t) => {
      if (counts[t.type] !== undefined) counts[t.type] += t.count;
      else counts.Others += t.count;
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
  }, [stats.leaveTypeSummary]);

  const recentPending = useMemo(
    () => leaves.filter((l) => l.status === "Pending").slice(0, 3),
    [leaves]
  );

  // Changing a filter always brings the user back to page 1 - staying on
  // page 5 of the old result set would either show stale rows or an empty
  // page if the new filter has fewer results.
  function handleSearch() {
    setAppliedFilters(filters);
    setPage(1);
  }

  function handleReset() {
    const cleared = {
      fromDate: "",
      toDate: "",
      department: "All Departments",
      status: "All Status",
      leaveType: "All Leave Types",
      electricianId: "All Electricians",
      search: "",
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setPage(1);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
  }

  function handleLimitChange(nextLimit) {
    setLimit(nextLimit);
    setPage(1);
  }

  async function handleExport() {
    try {
      const blob = await leaveApi.export(appliedFilters);
      downloadBlob(blob, "leave-requests.csv");
    } catch (err) {
      setToast({
        type: "error",
        title: "Export failed",
        message: apiErrorMessage(err, "Could not export leave requests."),
      });
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* Approve / reject / cancel only ever mutate local state (and show a
     success toast) AFTER the backend confirms the change. Any failure
     shows the backend's own error message and leaves state untouched. */
  async function handleApprove(record) {
    setActionBusyId(record.id);
    try {
      const updated = await leaveApi.approve(record.id);
      setLeaves((prev) => prev.map((l) => (l.id === record.id ? { ...l, ...updated, status: "Approved" } : l)));
      setToast({ type: "success", title: "Leave approved", message: `${record.name}'s request has been approved.` });
    } catch (err) {
      setToast({ type: "error", title: "Could not approve leave", message: apiErrorMessage(err, "Please try again.") });
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleReject(record) {
    setActionBusyId(record.id);
    try {
      const updated = await leaveApi.reject(record.id);
      setLeaves((prev) => prev.map((l) => (l.id === record.id ? { ...l, ...updated, status: "Rejected" } : l)));
      setToast({ type: "success", title: "Leave rejected", message: `${record.name}'s request has been rejected.` });
    } catch (err) {
      setToast({ type: "error", title: "Could not reject leave", message: apiErrorMessage(err, "Please try again.") });
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleCancel(record) {
    if (!window.confirm(`Cancel the ${record.leaveType.toLowerCase()} request for ${record.name}?`)) return;
    setActionBusyId(record.id);
    try {
      await leaveApi.cancel(record.id);
      setLeaves((prev) => prev.filter((l) => l.id !== record.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setToast({ type: "success", title: "Leave request cancelled", message: `${record.name}'s request has been cancelled.` });
    } catch (err) {
      setToast({ type: "error", title: "Could not cancel leave", message: apiErrorMessage(err, "Please try again.") });
    } finally {
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

      {loadError && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <span>{loadError}</span>
          <button
            onClick={() => loadAll(appliedFilters, page, limit)}
            className="shrink-0 rounded-md border border-red-300 bg-white px-3 py-1 text-[12px] font-medium text-red-700 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <SummaryCard icon={Users} value={stats.totalElectricians} label="Total Electricians" tint="bg-blue-50 text-blue-600" />
        <SummaryCard icon={CalendarOff} value={stats.onLeaveToday} label="On Leave Today" tint="bg-orange-50 text-orange-600" />
        <SummaryCard icon={ClipboardList} value={stats.leaveRequests} label="Leave Requests" tint="bg-purple-50 text-purple-600" />
        <SummaryCard icon={Hourglass} value={stats.pendingApprovals} label="Pending Approvals" tint="bg-red-50 text-red-600" />
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
              value={filters.electricianId}
              onChange={(e) => setFilters((f) => ({ ...f, electricianId: e.target.value }))}
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
              placeholder="Search by name or ID, then press Search..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
              {!loading && leaves.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400">
                    No leave requests match the selected filters.
                  </td>
                </tr>
              )}
              {leaves.map((l, idx) => (
                <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-3 py-2.5 text-slate-500">{(page - 1) * limit + idx + 1}</td>
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

        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
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
          onError={(message) =>
            setToast({ type: "error", title: "Could not save leave request", message })
          }
          onSuccessToast={(title, message) => setToast({ type: "success", title, message })}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Layout>
  );
}

/* ---------------------------------------------------------------------- */
/* Apply / View / Edit modal                                              */
/* ---------------------------------------------------------------------- */

function LeaveModal({ modal, electricians, leaves, onClose, onSaved, onSuccessToast }) {
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

    const payload = {
      employeeId: form.employeeId,
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
    };

    setSaving(true);
    try {
      // Only mutate state and report success once the backend confirms
      // the write with a real record — never on a failed/unreachable call.
      const saved =
        type === "apply"
          ? await leaveApi.create(payload)
          : await leaveApi.update(record.id, payload);

      onSuccessToast(
        type === "apply" ? "Leave request submitted" : "Leave request updated",
        `${saved?.name || selectedElectrician?.name || form.employeeId}'s ${form.leaveType.toLowerCase()} request was saved.`
      );
      onSaved(saved);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save the leave request. Please try again."));
    } finally {
      setSaving(false);
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
