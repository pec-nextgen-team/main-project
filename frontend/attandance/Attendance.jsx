import { useEffect, useMemo, useState } from "react";
import {
  Users, UserCheck, UserX, Clock, CalendarCheck,
  Search as SearchIcon, RotateCcw, FileDown, Eye, Pencil, X,
  ChevronLeft, ChevronRight, ChevronsRight, Info, CalendarDays,
  FileText, BarChart3, Loader2, AlertTriangle,
} from "lucide-react";
import { attendanceApi } from "./attendanceService";

/**
 * Attendance Page — Electrician section
 * Panimalar Engineering College — Repair & Maintenance Management System
 *
 * Stack: React + Vite + Tailwind CSS (no TypeScript, no Bootstrap)
 *
 * Suggested file split (per project convention):
 *   src/pages/Attendance.jsx        <- this file
 *   src/components/SummaryCard.jsx
 *   src/components/AttendanceFilters.jsx
 *   src/components/AttendanceTable.jsx
 *   src/components/AttendanceModal.jsx (View / Edit / Mark)
 *   src/components/AttendanceSummary.jsx (donut)
 *   src/components/ShiftSummary.jsx
 *   src/components/QuickActions.jsx
 *   src/components/AttendanceLegend.jsx
 * Kept in one file here for easy review — split out once dropped into
 * the project if Sidebar/Header/etc. already exist there (reuse those
 * instead of the local versions below).
 *
 * Backend (once connected):
 *   GET /api/attendance?date=&department=&location=&shift=&status=
 *   POST /api/attendance/mark
 *   PATCH /api/attendance/:id
 *   GET /api/attendance/summary
 */

const STATUS_STYLES = {
  Present: "bg-emerald-100 text-emerald-700",
  Absent: "bg-red-100 text-red-700",
  "On Leave": "bg-orange-100 text-orange-700",
};
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700", "bg-pink-100 text-pink-700",
];

// The backend (GET /api/attendance/summary) returns just label/value/sub
// per card; icon + color are a frontend presentation concern, so they're
// looked up here by label rather than sent over the wire.
const SUMMARY_META = {
  "Total Electricians": { icon: Users, color: "text-blue-600 bg-blue-50" },
  "Present Today": { icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
  "Absent Today": { icon: UserX, color: "text-red-600 bg-red-50" },
  "On Leave": { icon: Clock, color: "text-orange-600 bg-orange-50" },
  "Avg. Attendance": { icon: CalendarCheck, color: "text-purple-600 bg-purple-50" },
};

const SIDEBAR_LINKS = ["Dashboard", "Raise Complaint", "My Complaints", "Approvals", "Tickets", "Requests"];
const ELECTRICIAN_SUBLINKS = ["Electrician List", "Add Electrician", "Skills / Certification", "Attendance", "Leave", "Performance"];
const SIDEBAR_TAIL = ["Stock Management", "Reports", "Notifications", "Settings"];

function to24(t) {
  if (!t || t === "-") return "";
  const [time, period] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function to12(t) {
  if (!t) return "-";
  let [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}
function calcHours(inT, outT) {
  if (!inT || !outT) return "-";
  const [ih, im] = inT.split(":").map(Number);
  const [oh, om] = outT.split(":").map(Number);
  const mins = (oh * 60 + om) - (ih * 60 + im);
  if (mins < 0) return "-";
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
}

function Badge({ text, className }) {
  return <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${className}`}>{text}</span>;
}

function SummaryCard({ item }) {
  const meta = SUMMARY_META[item.label] || { icon: Users, color: "text-slate-600 bg-slate-50" };
  const Icon = meta.icon;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className={`h-9 w-9 rounded-lg ${meta.color} flex items-center justify-center mb-2`}><Icon size={18} /></div>
      <div className="text-2xl font-bold text-slate-800">{item.value}</div>
      <div className="text-sm font-medium text-slate-600">{item.label}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
    </div>
  );
}

function AttendanceDonut() {
  // Present 15/18, Absent 2/18, On Leave 1/18 — circumference 2*pi*55 ≈ 345.6
  return (
    <div className="flex items-center justify-center relative">
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="75" cy="75" r="55" fill="none" stroke="#e2e8f0" strokeWidth="18" />
        <circle cx="75" cy="75" r="55" fill="none" stroke="#22c55e" strokeWidth="18" strokeLinecap="round" strokeDasharray="287.9 345.6" />
        <circle cx="75" cy="75" r="55" fill="none" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" strokeDasharray="38.4 345.6" strokeDashoffset="-287.9" />
        <circle cx="75" cy="75" r="55" fill="none" stroke="#f97316" strokeWidth="18" strokeLinecap="round" strokeDasharray="19.2 345.6" strokeDashoffset="-326.3" />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-slate-800">18</div>
        <div className="text-[11px] text-slate-400">Total</div>
      </div>
    </div>
  );
}

function ViewModal({ record, onClose }) {
  if (!record) return null;
  const rows = [
    ["Employee ID", record.empId],
    ["Name", record.name],
    ["Department", record.dept],
    ["Shift", `${record.shift} (${record.shiftTime})`],
    ["Date", "16-05-2026"],
    ["Check In", record.checkIn],
    ["Check Out", record.checkOut],
    ["Total Hours", record.hours],
  ];
  return (
    <div className="fixed inset-0 bg-slate-900/55 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Attendance Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-2.5 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between"><span className="text-slate-400">{label}</span><span className="font-medium">{value}</span></div>
          ))}
          <div className="flex justify-between items-center"><span className="text-slate-400">Status</span><Badge text={record.status} className={STATUS_STYLES[record.status]} /></div>
          <div className="flex justify-between"><span className="text-slate-400">Remarks</span><span className="font-medium">{record.remarks}</span></div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ record, onClose, onSave }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("Present");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // BUG FIX (#14 — edit form wasn't populating existing values): this
  // modal stays mounted the whole time (it just renders null when there's
  // no record), so useState's initial value only ever ran once, on the
  // very first render, when `record` was still null. Selecting a *new*
  // row to edit updated the `record` prop but never touched this state,
  // so the form kept showing whatever was left over from the previous
  // edit (or blank fields, the first time). Re-sync whenever the record
  // being edited actually changes.
  useEffect(() => {
    if (record) {
      setCheckIn(to24(record.checkIn));
      setCheckOut(to24(record.checkOut));
      setStatus(record.status);
      setRemarks(record.remarks === "-" ? "" : record.remarks || "");
      setError("");
    }
  }, [record]);

  if (!record) return null;

  // Wait for the real PATCH to succeed before closing/toasting — never
  // show success (or update the table) off an optimistic assumption.
  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await onSave(record.empId, {
        checkIn: to12(checkIn), checkOut: to12(checkOut),
        hours: calcHours(checkIn, checkOut), status, remarks: remarks || "-",
      });
      onClose();
    } catch (e) {
      setError(e?.response?.status === 404
        ? "Frontend cannot safely resolve this: the backend attendance update endpoint isn't available yet."
        : e?.message || "Couldn't save this update. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/55 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Edit Attendance — {record.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Check In</label>
              <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Check Out</label>
              <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {["Present", "Absent", "On Leave"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Remarks</label>
            <input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          {error && (
            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" /><span>{error}</span>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkModal({ open, employees, onClose, onSave }) {
  const [empId, setEmpId] = useState("");
  const [status, setStatus] = useState("Present");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [remarks, setRemarks] = useState("");

  if (!open) return null;
  const selectedEmp = empId || employees[0]?.empId;

  async function handleSave() {
    const patch = { status };
    if (status === "Present") {
      patch.checkIn = to12(checkIn) || "-";
      patch.checkOut = to12(checkOut) || "-";
      patch.hours = calcHours(checkIn, checkOut);
      patch.remarks = remarks || "-";
    } else if (status === "Absent") {
      patch.checkIn = "-"; patch.checkOut = "-"; patch.hours = "-";
      patch.remarks = remarks || "No Show";
    } else {
      patch.checkIn = "-"; patch.checkOut = "-"; patch.hours = "-";
      patch.remarks = leaveType;
    }
    setSaving(true);
    setError("");
    try {
      // "mark" (new record for today) vs "update" (existing employee
      // already has a row) both go through onSave; the parent decides
      // which real endpoint to call based on whether the employee already
      // has a record for the selected date.
      await onSave(selectedEmp, patch, { isMark: true });
      setEmpId(""); setStatus("Present"); setCheckIn(""); setCheckOut(""); setRemarks("");
      onClose();
    } catch (e) {
      setError(e?.response?.status === 404
        ? "Frontend cannot safely resolve this: the backend attendance mark endpoint isn't available yet."
        : e?.message || "Couldn't save this attendance record. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/55 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Mark Attendance</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-slate-500">Employee</label>
            <select value={selectedEmp} onChange={(e) => setEmpId(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {employees.map((e) => <option key={e.empId} value={e.empId}>{e.empId} — {e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Status</label>
            <div className="mt-1 flex gap-2">
              {["Present", "Absent", "On Leave"].map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium ${status === s ? "bg-blue-600 text-white border-blue-600" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {status === "Present" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Check In</label>
                <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Check Out</label>
                <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          )}
          {status === "On Leave" && (
            <div>
              <label className="text-xs font-semibold text-slate-500">Leave Type</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {["Casual Leave", "Sick Leave", "Earned Leave"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500">Remarks</label>
            <input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          {error && (
            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" /><span>{error}</span>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage({ user = { name: "Mr. Selvaraj", role: "Electrician Head" } }) {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState({ date: "2026-05-16", dept: "All Departments", location: "All Locations", shift: "All Shifts", status: "All Status" });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [showMark, setShowMark] = useState(false);
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Real data load, gated on `appliedFilters.date` only (the one filter
  // the backend contract documents as a query param). Department/shift/
  // status stay client-side below, same as before — kept minimal rather
  // than rebuilding the whole filter/pagination flow this round.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    Promise.all([
      attendanceApi.list({ date: appliedFilters.date }),
      attendanceApi.summary({ date: appliedFilters.date }),
    ])
      .then(([listRes, summaryRes]) => {
        if (cancelled) return;
        setRecords(listRes?.data ?? listRes ?? []);
        setSummary(summaryRes?.data ?? summaryRes ?? []);
      })
      .catch((e) => {
        if (cancelled) return;
        setRecords([]);
        setSummary([]);
        setLoadError(
          e?.response?.status === 404
            ? "Frontend cannot safely resolve this because the required backend functionality (the /api/attendance API) is missing or not yet deployed."
            : e?.message || "Couldn't load attendance data."
        );
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [appliedFilters.date]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (appliedFilters.dept !== "All Departments" && r.dept !== appliedFilters.dept) return false;
      if (appliedFilters.shift !== "All Shifts" && r.shift !== appliedFilters.shift) return false;
      if (appliedFilters.status !== "All Status" && r.status !== appliedFilters.status) return false;
      return true;
    });
  }, [records, appliedFilters]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function applyFilters() { setAppliedFilters(filters); setPage(1); }
  function resetFilters() {
    const reset = { date: "2026-05-16", dept: "All Departments", location: "All Locations", shift: "All Shifts", status: "All Status" };
    setFilters(reset); setAppliedFilters(reset); setPage(1);
  }

  function exportCSV() {
    const header = ["Employee ID", "Name", "Department", "Shift", "Check In", "Check Out", "Total Hours", "Status", "Remarks"];
    const rows = records.map((r) => [r.empId, r.name, r.dept, r.shift, r.checkIn, r.checkOut, r.hours, r.status, r.remarks]);
    const csv = [header, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attendance_export.csv";
    a.click();
  }

  // Called by EditModal/MarkModal. Waits for the real API response before
  // touching table state or showing a success toast — on failure it
  // rethrows so the modal shows the error inline and nothing here changes.
  async function saveAttendance(empId, patch, opts = {}) {
    const result = opts.isMark
      ? await attendanceApi.mark({ empId, date: appliedFilters.date, ...patch })
      : await attendanceApi.update(empId, patch);

    const saved = result?.data ?? result ?? patch;
    setRecords((rs) => {
      const exists = rs.some((r) => r.empId === empId);
      return exists
        ? rs.map((r) => (r.empId === empId ? { ...r, ...saved } : r))
        : [...rs, { empId, ...saved }];
    });
    const rec = records.find((r) => r.empId === empId);
    setToast(`Attendance updated for ${rec?.name || saved?.name || empId}`);
    setTimeout(() => setToast(""), 3000);
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
        <nav className="px-3 py-4 space-y-1 text-sm">
          {SIDEBAR_LINKS.map((link) => (
            <a key={link} href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800">{link}</a>
          ))}
          <div className="pt-1">
            <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200">
              <span>Electrician</span>
            </div>
            <div className="ml-3 border-l border-white/10 pl-3 space-y-1">
              {ELECTRICIAN_SUBLINKS.map((link) => (
                <a key={link} href="#" className={`block px-3 py-1.5 rounded-lg text-xs ${link === "Attendance" ? "bg-blue-700 text-white" : "hover:bg-slate-800"}`}>{link}</a>
              ))}
            </div>
          </div>
          {SIDEBAR_TAIL.map((link) => (
            <a key={link} href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 mt-1">{link}</a>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-white/10 text-[10px] text-slate-500 leading-snug">
          © 2026 Panimalar Engineering College.<br />All rights reserved.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-5 shrink-0">
          <span className="font-semibold text-slate-700">Repair &amp; Maintenance Management System</span>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">{user.name?.[4] || "U"}</div>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">{user.name}</div>
              <div className="text-[11px] text-slate-500">{user.role}</div>
            </div>
          </div>
        </header>

        <main className="p-5 space-y-5 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
            <div className="text-xs text-slate-500 mt-1"><span className="text-blue-600">Home</span> &gt; <span className="text-slate-500">Electrician</span> &gt; <span className="text-slate-700 font-medium">Attendance</span></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {loading && summary.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-24 animate-pulse" />
                ))
              : summary.map((s) => <SummaryCard key={s.label} item={s} />)}
          </div>

          {loadError && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" /><span>{loadError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            <div className="xl:col-span-3 space-y-5">
              {/* FILTERS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Date</label>
                    <div className="relative mt-1">
                      <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Department</label>
                    <select value={filters.dept} onChange={(e) => setFilters({ ...filters, dept: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Departments", "Electrical Maintenance", "Plumbing Maintenance", "General Maintenance"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Location / Building</label>
                    <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Locations", "Main Building", "Block A", "Block B", "Administrative Block"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Shift</label>
                    <select value={filters.shift} onChange={(e) => setFilters({ ...filters, shift: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Shifts", "General", "First Shift", "Second Shift"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Status</label>
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      {["All Status", "Present", "Absent", "On Leave"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={applyFilters} className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-1.5">
                      <SearchIcon size={14} /> Search
                    </button>
                    <button onClick={resetFilters} className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5">
                      <RotateCcw size={14} /> Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    Attendance List <Info size={13} className="text-slate-300" />
                  </h2>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowMark(true)} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-1.5">
                      <UserCheck size={13} /> Mark Attendance
                    </button>
                    <button onClick={exportCSV} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5">
                      <FileDown size={13} /> Export
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3">S.No</th>
                        <th className="px-4 py-3">Employee ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Shift</th>
                        <th className="px-4 py-3">Check In</th>
                        <th className="px-4 py-3">Check Out</th>
                        <th className="px-4 py-3">Total Hours</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Remarks</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr><td colSpan={11} className="text-center text-slate-400 py-10 flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading attendance...</td></tr>
                      ) : paged.length === 0 ? (
                        <tr><td colSpan={11} className="text-center text-slate-400 py-10">No attendance records match the current filters.</td></tr>
                      ) : paged.map((r, i) => (
                        <tr key={r.empId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{(page - 1) * pageSize + i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-blue-700">{r.empId}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`h-7 w-7 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold`}>
                                {r.name.replace("Mr. ", "")[0]}
                              </div>
                              <span className="font-medium text-slate-800">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{r.dept}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{r.shift}<div className="text-slate-400">{r.shiftTime}</div></td>
                          <td className="px-4 py-3 text-xs text-slate-600">{r.checkIn}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{r.checkOut}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{r.hours}</td>
                          <td className="px-4 py-3"><Badge text={r.status} className={STATUS_STYLES[r.status]} /></td>
                          <td className="px-4 py-3 text-xs text-slate-500">{r.remarks}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setViewRecord(r)} className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center"><Eye size={14} /></button>
                              <button onClick={() => setEditRecord(r)} className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center"><Pencil size={14} /></button>
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
                    <span className="text-xs text-slate-400 mr-1">10 per page</span>
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center"><ChevronLeft size={14} /></button>
                    <span className="h-8 w-8 rounded-lg bg-blue-600 text-white font-medium flex items-center justify-center">{page}</span>
                    <button onClick={() => setPage((p) => (p * pageSize < filtered.length ? p + 1 : p))} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center"><ChevronRight size={14} /></button>
                    <button onClick={() => setPage(Math.max(1, Math.ceil(filtered.length / pageSize)))} className="h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center"><ChevronsRight size={14} /></button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-start gap-3 text-xs text-blue-800">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>Note: Attendance is calculated based on check in and check out time. Grace time is 15 minutes after shift start time.</span>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Today's Attendance Summary</h3>
                <AttendanceDonut />
                <ul className="mt-4 space-y-2 text-xs">
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Present</span><span className="font-semibold text-slate-700">15 (83.33%)</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Absent</span><span className="font-semibold text-slate-700">2 (11.11%)</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" />On Leave</span><span className="font-semibold text-slate-700">1 (5.56%)</span></li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">Shift Wise Summary</h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center justify-between"><span>General Shift <span className="text-slate-400">(09:00 AM - 06:00 PM)</span></span><span className="font-semibold text-slate-800 bg-slate-100 rounded-full px-2.5 py-0.5">16</span></li>
                  <li className="flex items-center justify-between"><span>First Shift <span className="text-slate-400">(07:00 AM - 03:00 PM)</span></span><span className="font-semibold text-slate-800 bg-slate-100 rounded-full px-2.5 py-0.5">1</span></li>
                  <li className="flex items-center justify-between"><span>Second Shift <span className="text-slate-400">(02:00 PM - 10:00 PM)</span></span><span className="font-semibold text-slate-800 bg-slate-100 rounded-full px-2.5 py-0.5">1</span></li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setShowMark(true)} className="text-left text-xs px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <UserCheck size={16} className="mb-1 text-blue-600" /><br />Mark Today Attendance
                  </button>
                  <button className="text-left text-xs px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <CalendarDays size={16} className="mb-1 text-blue-600" /><br />Attendance Calendar
                  </button>
                  <button className="text-left text-xs px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <FileText size={16} className="mb-1 text-blue-600" /><br />Leave Requests
                  </button>
                  <button className="text-left text-xs px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <BarChart3 size={16} className="mb-1 text-blue-600" /><br />Attendance Report
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">Attendance Legend</h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 mt-1" /><span><b className="text-slate-700">Present</b> — On time or within grace time</span></li>
                  <li className="flex items-start gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-500 mt-1" /><span><b className="text-slate-700">Late</b> — Check in after grace time</span></li>
                  <li className="flex items-start gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500 mt-1" /><span><b className="text-slate-700">Absent</b> — No check in for the day</span></li>
                  <li className="flex items-start gap-2"><span className="h-2.5 w-2.5 rounded-full bg-purple-500 mt-1" /><span><b className="text-slate-700">On Leave</b> — Approved leave</span></li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ViewModal record={viewRecord} onClose={() => setViewRecord(null)} />
      <EditModal
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onSave={(empId, patch) => saveAttendance(empId, patch)}
      />
      <MarkModal
        open={showMark}
        employees={records}
        onClose={() => setShowMark(false)}
        onSave={(empId, patch, opts) => saveAttendance(empId, patch, opts)}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
