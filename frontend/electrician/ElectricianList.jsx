import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  CalendarOff,
  Building2,
  Search,
  RotateCcw,
  Download,
  Eye,
  Pencil,
  MoreVertical,
  Phone,
  Plus,
  Upload,
  ListChecks,
  FileDown,
  ClipboardCheck,
  UserPlus2,
  Wrench,
  Ticket,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Layout from "../components/Layout";
import electricianApi from "../api/electricianApi";

/* ---------------------------------------------------------------------- */
/* Static reference data + mock fallback                                  */
/* ---------------------------------------------------------------------- */

const DEPARTMENTS = ["All Departments", "Electrical Maintenance", "Plumbing Maintenance", "General Maintenance"];
const SPECIALIZATIONS = ["All Specializations", "Electrical", "Plumbing", "General"];
const STATUSES = ["All Status", "Active", "On Leave", "Inactive"];
const EMPLOYMENT_TYPES = ["All Types", "Full-time", "Contract"];
const LOCATIONS = ["All Locations", "Block A", "Block B", "Block C", "Hostel Block", "Admin Block"];

const MOCK_ELECTRICIANS = [
  { id: "ELEC001", name: "Mr. Karthik", department: "Electrical Maintenance", skills: "Electrical, Wiring, Lighting", phone: "99411 22334", status: "Active", availability: "Available", employmentType: "Full-time", location: "Block A", joinedOn: "2023-06-12" },
  { id: "ELEC002", name: "Mr. Rajesh", department: "Electrical Maintenance", skills: "Panels, MCC, Wiring", phone: "99411 22335", status: "Active", availability: "On Duty", employmentType: "Full-time", location: "Block B", joinedOn: "2022-03-04" },
  { id: "ELEC003", name: "Mr. Kumar", department: "Plumbing Maintenance", skills: "Plumbing, Pipe Fitting", phone: "99411 22336", status: "Active", availability: "Available", employmentType: "Full-time", location: "Hostel Block", joinedOn: "2021-11-20" },
  { id: "ELEC004", name: "Mr. Mohan", department: "Plumbing Maintenance", skills: "Plumbing, Pumps, Tanks", phone: "99411 22337", status: "Active", availability: "On Duty", employmentType: "Full-time", location: "Block C", joinedOn: "2020-08-15" },
  { id: "ELEC005", name: "Mr. Selvi", department: "General Maintenance", skills: "Carpentry, Painting", phone: "99411 22338", status: "Active", availability: "Available", employmentType: "Contract", location: "Admin Block", joinedOn: "2024-01-09" },
  { id: "ELEC006", name: "Mr. Prakash", department: "Electrical Maintenance", skills: "AC, Fans, Appliances", phone: "99411 22339", status: "On Leave", availability: "Not Available", employmentType: "Full-time", location: "Block A", joinedOn: "2019-07-01" },
  { id: "ELEC007", name: "Mr. Arul", department: "General Maintenance", skills: "Civil, Masonry", phone: "99411 22340", status: "Active", availability: "Available", employmentType: "Contract", location: "Hostel Block", joinedOn: "2023-02-27" },
  { id: "ELEC008", name: "Mr. Vignesh", department: "Electrical Maintenance", skills: "Controls, Automation", phone: "99411 22341", status: "Active", availability: "Available", employmentType: "Full-time", location: "Block B", joinedOn: "2022-09-18" },
  { id: "ELEC009", name: "Mr. Dinesh", department: "Plumbing Maintenance", skills: "Pipe Fitting, Sanitary", phone: "99411 22342", status: "Inactive", availability: "Not Available", employmentType: "Full-time", location: "Block C", joinedOn: "2018-04-10" },
  { id: "ELEC010", name: "Mr. Suresh", department: "Electrical Maintenance", skills: "Generator, DG, ATS", phone: "99411 22343", status: "Active", availability: "On Duty", employmentType: "Full-time", location: "Admin Block", joinedOn: "2021-05-22" },
  { id: "ELEC011", name: "Mr. Ramesh", department: "Electrical Maintenance", skills: "Wiring, Lighting", phone: "99411 22344", status: "Active", availability: "Available", employmentType: "Full-time", location: "Block A", joinedOn: "2023-10-03" },
  { id: "ELEC012", name: "Mr. Anand", department: "Plumbing Maintenance", skills: "Plumbing, Valves", phone: "99411 22345", status: "Active", availability: "On Duty", employmentType: "Contract", location: "Hostel Block", joinedOn: "2022-12-14" },
  { id: "ELEC013", name: "Mr. Balaji", department: "General Maintenance", skills: "Carpentry, Furniture", phone: "99411 22346", status: "Active", availability: "Available", employmentType: "Full-time", location: "Block B", joinedOn: "2024-03-19" },
  { id: "ELEC014", name: "Mr. Ganesh", department: "Electrical Maintenance", skills: "Panels, MCC", phone: "99411 22347", status: "Active", availability: "Available", employmentType: "Full-time", location: "Block C", joinedOn: "2020-01-30" },
  { id: "ELEC015", name: "Mr. Hari", department: "Plumbing Maintenance", skills: "Pumps, Tanks", phone: "99411 22348", status: "On Leave", availability: "Not Available", employmentType: "Full-time", location: "Admin Block", joinedOn: "2021-08-07" },
  { id: "ELEC016", name: "Mr. Ilango", department: "Electrical Maintenance", skills: "Motors, Automation", phone: "99411 22349", status: "Active", availability: "Available", employmentType: "Contract", location: "Block A", joinedOn: "2023-05-25" },
  { id: "ELEC017", name: "Mr. Jagan", department: "Electrical Maintenance", skills: "AC, Fans", phone: "99411 22350", status: "Active", availability: "Available", employmentType: "Full-time", location: "Block B", joinedOn: "2022-06-11" },
  { id: "ELEC018", name: "Mr. Kannan", department: "Electrical Maintenance", skills: "Controls, Automation", phone: "99411 22351", status: "Active", availability: "On Duty", employmentType: "Full-time", location: "Hostel Block", joinedOn: "2019-12-02" },
];

const STATUS_STYLE = {
  Active: "bg-green-50 text-green-700 border border-green-200",
  "On Leave": "bg-orange-50 text-orange-700 border border-orange-200",
  Inactive: "bg-red-50 text-red-700 border border-red-200",
};

const AVAILABILITY_STYLE = {
  Available: "bg-blue-50 text-blue-700 border border-blue-200",
  "On Duty": "bg-purple-50 text-purple-700 border border-purple-200",
  "Not Available": "bg-slate-100 text-slate-500 border border-slate-200",
};

const CATEGORY_COLORS = { Electrical: "#2563eb", Plumbing: "#16a34a", General: "#f97316" };

function categoryOf(dept) {
  if (dept.startsWith("Electrical")) return "Electrical";
  if (dept.startsWith("Plumbing")) return "Plumbing";
  return "General";
}

function initials(name) {
  const parts = name.replace("Mr.", "").trim().split(" ");
  return parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

const PAGE_SIZE = 10;

/* ---------------------------------------------------------------------- */

function SummaryCard({ icon: Icon, value, label, sub, tint }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-3.5">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-slate-800 leading-tight">{value}</p>
        <p className="text-[12px] font-medium text-slate-600 truncate">{label}</p>
        <p className="text-[11px] text-slate-400 truncate">{sub}</p>
      </div>
    </div>
  );
}

function Badge({ text, styleMap }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-medium ${styleMap[text]}`}>
      {text}
    </span>
  );
}

function FieldLabel({ children }) {
  return <label className="text-[12.5px] font-medium text-slate-500 mb-1 block">{children}</label>;
}

const inputCls =
  "w-full h-9 px-2.5 rounded-md border border-slate-300 bg-white text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500";

/* ---------------------------------------------------------------------- */

export default function ElectricianList() {
  const [electricians, setElectricians] = useState(MOCK_ELECTRICIANS);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    department: "All Departments",
    specialization: "All Specializations",
    status: "All Status",
    fromDate: "",
    toDate: "",
    employmentType: "All Types",
    location: "All Locations",
  });
  const [applied, setApplied] = useState(filters);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null); // { type: 'add'|'view'|'edit', record? }
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await electricianApi.list({});
        if (!cancelled && Array.isArray(data) && data.length) setElectricians(data);
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

  const summary = useMemo(() => {
    const total = electricians.length;
    const active = electricians.filter((e) => e.status === "Active").length;
    const onLeave = electricians.filter((e) => e.status === "On Leave").length;
    const inactive = electricians.filter((e) => e.status === "Inactive").length;
    const departments = new Set(electricians.map((e) => e.department)).size || 6;
    return { total, active, onLeave, inactive, departments: Math.max(departments, 6) };
  }, [electricians]);

  const filtered = useMemo(() => {
    return electricians.filter((e) => {
      if (applied.department !== "All Departments" && e.department !== applied.department) return false;
      if (applied.specialization !== "All Specializations" && categoryOf(e.department) !== applied.specialization) return false;
      if (applied.status !== "All Status" && e.status !== applied.status) return false;
      if (applied.employmentType !== "All Types" && e.employmentType !== applied.employmentType) return false;
      if (applied.location !== "All Locations" && e.location !== applied.location) return false;
      if (applied.fromDate && e.joinedOn < applied.fromDate) return false;
      if (applied.toDate && e.joinedOn > applied.toDate) return false;
      if (applied.search.trim()) {
        const t = applied.search.trim().toLowerCase();
        if (
          !e.name.toLowerCase().includes(t) &&
          !e.id.toLowerCase().includes(t) &&
          !e.phone.replace(/\s/g, "").includes(t.replace(/\s/g, ""))
        )
          return false;
      }
      return true;
    });
  }, [electricians, applied]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const donutData = useMemo(() => {
    const counts = { Electrical: 0, Plumbing: 0, General: 0 };
    electricians.forEach((e) => (counts[categoryOf(e.department)] += 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [electricians]);

  function handleSearch() {
    setApplied(filters);
    setPage(1);
  }

  function handleReset() {
    const cleared = {
      search: "",
      department: "All Departments",
      specialization: "All Specializations",
      status: "All Status",
      fromDate: "",
      toDate: "",
      employmentType: "All Types",
      location: "All Locations",
    };
    setFilters(cleared);
    setApplied(cleared);
    setPage(1);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExport() {
    try {
      const blob = await electricianApi.export(applied);
      downloadBlob(blob, "electricians.csv");
      return;
    } catch {
      // fall back to a client-side CSV of the filtered list
    }
    const header = ["S.No", "Employee ID", "Name", "Department", "Skills", "Phone", "Status", "Availability"];
    const rows = filtered.map((e, i) => [i + 1, e.id, e.name, e.department, e.skills, e.phone, e.status, e.availability]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv" }), "electricians.csv");
  }

  async function handleBulkUpdateStatus() {
    const status = window.prompt('Set status for all currently filtered electricians (Active / On Leave / Inactive):', "Active");
    if (!status || !STATUSES.includes(status)) return;
    try {
      await electricianApi.bulkUpdateStatus(filtered.map((e) => e.id), status);
    } catch {
      // proceed locally
    } finally {
      const ids = new Set(filtered.map((e) => e.id));
      setElectricians((prev) => prev.map((e) => (ids.has(e.id) ? { ...e, status } : e)));
    }
  }

  function upsert(record) {
    setElectricians((prev) => {
      const exists = prev.some((e) => e.id === record.id);
      return exists ? prev.map((e) => (e.id === record.id ? record : e)) : [record, ...prev];
    });
  }

  async function handleMenuAction(action, record) {
    setOpenMenuId(null);
    if (action === "deactivate") {
      try {
        await electricianApi.updateStatus(record.id, "Inactive");
      } catch {
        //
      } finally {
        setElectricians((prev) => prev.map((e) => (e.id === record.id ? { ...e, status: "Inactive" } : e)));
      }
    } else if (action === "activate") {
      try {
        await electricianApi.updateStatus(record.id, "Active");
      } catch {
        //
      } finally {
        setElectricians((prev) => prev.map((e) => (e.id === record.id ? { ...e, status: "Active" } : e)));
      }
    } else if (action === "delete") {
      if (!window.confirm(`Remove ${record.name} from the electrician list?`)) return;
      try {
        await electricianApi.remove(record.id);
      } catch {
        //
      } finally {
        setElectricians((prev) => prev.filter((e) => e.id !== record.id));
      }
    }
  }

  return (
    <Layout active="electrician-list" breadcrumb={["Home", "Electrician", "Electrician List"]}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-700">Electrician</h2>
        {loading && (
          <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
            <Loader2 size={13} className="animate-spin" /> Syncing...
          </span>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        <SummaryCard icon={Users} value={summary.total} label="Total Electricians" sub="All Active" tint="bg-blue-50 text-blue-600" />
        <SummaryCard icon={UserCheck} value={summary.active} label="Active" sub="Currently working" tint="bg-green-50 text-green-600" />
        <SummaryCard icon={CalendarOff} value={summary.onLeave} label="On Leave" sub="Not available" tint="bg-orange-50 text-orange-600" />
        <SummaryCard icon={UserX} value={summary.inactive} label="Inactive" sub="Not active" tint="bg-red-50 text-red-600" />
        <SummaryCard icon={Building2} value={summary.departments} label="Departments" sub="Assigned" tint="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        {/* LEFT: filters + table */}
        <div className="min-w-0">
          {/* FILTER CARD */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div className="lg:col-span-2">
                <FieldLabel>Search</FieldLabel>
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Name, ID, Phone..."
                    className={inputCls + " pl-8"}
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Department</FieldLabel>
                <select className={inputCls} value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Specialization</FieldLabel>
                <select className={inputCls} value={filters.specialization} onChange={(e) => setFilters((f) => ({ ...f, specialization: e.target.value }))}>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div>
                <FieldLabel>Status</FieldLabel>
                <select className={inputCls} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>From Date</FieldLabel>
                <input type="date" className={inputCls} value={filters.fromDate} onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))} />
              </div>
              <div>
                <FieldLabel>To Date</FieldLabel>
                <input type="date" className={inputCls} value={filters.toDate} onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))} />
              </div>
              <div>
                <FieldLabel>Employment Type</FieldLabel>
                <select className={inputCls} value={filters.employmentType} onChange={(e) => setFilters((f) => ({ ...f, employmentType: e.target.value }))}>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div className="w-full sm:w-56">
                <FieldLabel>Location / Building</FieldLabel>
                <select className={inputCls} value={filters.location} onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}>
                  {LOCATIONS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleSearch} className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium flex items-center gap-1.5">
                <Search size={15} /> Search
              </button>
              <button onClick={handleReset} className="h-9 px-4 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[13px] font-medium flex items-center gap-1.5">
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={handleExport} className="h-9 px-4 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[13px] font-medium flex items-center gap-1.5 ml-auto">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
              <h3 className="text-[15px] font-semibold text-blue-700">Electrician List</h3>
              <button
                onClick={() => setModal({ type: "add" })}
                className="h-8 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-medium flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Electrician
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-left">
                    {["S.No", "Employee ID", "Name", "Department", "Specialization / Skills", "Phone", "Status", "Availability", "Action"].map((h) => (
                      <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-slate-400">
                        No electricians match the selected filters.
                      </td>
                    </tr>
                  )}
                  {pageRows.map((e, idx) => (
                    <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                      <td className="px-3 py-2.5 text-slate-500">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{e.id}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-semibold shrink-0">
                            {initials(e.name)}
                          </div>
                          <span className="text-slate-800 font-medium">{e.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{e.department}</td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{e.skills}</td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Phone size={12} className="text-slate-400" />
                          {e.phone}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge text={e.status} styleMap={STATUS_STYLE} />
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge text={e.availability} styleMap={AVAILABILITY_STYLE} />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="relative flex items-center gap-1.5">
                          <button
                            onClick={() => setModal({ type: "view", record: e })}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setModal({ type: "edit", record: e })}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === e.id ? null : e.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="More"
                          >
                            <MoreVertical size={15} />
                          </button>
                          {openMenuId === e.id && (
                            <div className="absolute right-0 top-8 z-10 w-40 bg-white border border-slate-200 rounded-md shadow-lg py-1">
                              {e.status !== "Inactive" ? (
                                <button
                                  onClick={() => handleMenuAction("deactivate", e)}
                                  className="w-full text-left px-3 py-1.5 text-[12.5px] text-slate-600 hover:bg-slate-50"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleMenuAction("activate", e)}
                                  className="w-full text-left px-3 py-1.5 text-[12.5px] text-slate-600 hover:bg-slate-50"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => handleMenuAction("delete", e)}
                                className="w-full text-left px-3 py-1.5 text-[12.5px] text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-slate-500">
                Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-slate-500">10 per page</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-300 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronsLeft size={14} />
                  </button>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-300 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-[12.5px] font-medium ${
                        p === page ? "bg-blue-600 text-white" : "border border-slate-300 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-300 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-300 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-5">
          {/* Skills Overview */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-[14px] font-semibold text-blue-700 mb-3">Skills Overview</h3>
            <div className="relative w-full h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={2} stroke="none">
                    {donutData.map((d) => (
                      <Cell key={d.name} fill={CATEGORY_COLORS[d.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-semibold text-slate-800">{summary.total}</span>
                <span className="text-[10.5px] text-slate-400">Electricians</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[d.name] }} />
                    {d.name}
                  </span>
                  <span className="text-slate-500">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-[14px] font-semibold text-blue-700 mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setModal({ type: "add" })}
                className="w-full h-9 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-medium flex items-center gap-2"
              >
                <Plus size={14} /> Add Electrician
              </button>
              <button
                onClick={() => setModal({ type: "import" })}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[12.5px] font-medium flex items-center gap-2"
              >
                <Upload size={14} /> Import Electricians
              </button>
              <button
                onClick={handleBulkUpdateStatus}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[12.5px] font-medium flex items-center gap-2"
              >
                <ListChecks size={14} /> Bulk Update Status
              </button>
              <button
                onClick={handleExport}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[12.5px] font-medium flex items-center gap-2"
              >
                <FileDown size={14} /> Download List
              </button>
            </div>
          </div>

          {/* Workflow */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-[14px] font-semibold text-blue-700 mb-3">Workflow</h3>
            <div className="flex flex-col">
              {[
                { icon: UserPlus2, label: "Electrician Added", tint: "bg-blue-50 text-blue-600" },
                { icon: Wrench, label: "Skills & Department Assigned", tint: "bg-purple-50 text-purple-600" },
                { icon: ClipboardCheck, label: "Available for Assignment", tint: "bg-green-50 text-green-600" },
                { icon: Ticket, label: "Can be Assigned to Tickets", tint: "bg-orange-50 text-orange-600" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.tint}`}>
                      <step.icon size={15} />
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                  </div>
                  <p className="text-[12.5px] text-slate-600 pt-1.5 pb-4">{step.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-[14px] font-semibold text-blue-700 mb-1">Need Help?</h3>
            <p className="text-[12px] text-slate-500 mb-3">For any assistance, contact</p>
            <div className="flex flex-col gap-2 text-[12.5px] text-slate-600">
              <span className="flex items-center gap-2">
                <Phone size={13} className="text-slate-400" /> 044 - 2649 1113
              </span>
              <span className="flex items-center gap-2 break-all">
                <Building2 size={13} className="text-slate-400" /> support@panimalar.ac.in
              </span>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <ElectricianModal
          modal={modal}
          onClose={() => setModal(null)}
          onSaved={(record) => {
            upsert(record);
            setModal(null);
          }}
        />
      )}
    </Layout>
  );
}

/* ---------------------------------------------------------------------- */
/* Add / View / Edit / Import modal                                       */
/* ---------------------------------------------------------------------- */

function ElectricianModal({ modal, onClose, onSaved }) {
  const { type, record } = modal;
  const readOnly = type === "view";

  const [form, setForm] = useState(() => ({
    id: record?.id || "",
    name: record?.name || "",
    department: record?.department || DEPARTMENTS[1],
    skills: record?.skills || "",
    phone: record?.phone || "",
    status: record?.status || "Active",
    availability: record?.availability || "Available",
    employmentType: record?.employmentType || "Full-time",
    location: record?.location || LOCATIONS[1],
  }));
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (type === "import") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
            <h3 className="text-[15px] font-semibold text-blue-700">Import Electricians</h3>
            <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">
              <X size={17} />
            </button>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            <FieldLabel>CSV file</FieldLabel>
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-[13px]" />
            {error && <p className="text-[12.5px] text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="h-9 px-4 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[13px] font-medium">
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={async () => {
                  if (!file) {
                    setError("Choose a CSV file to import.");
                    return;
                  }
                  setSaving(true);
                  try {
                    const fd = new FormData();
                    fd.append("file", file);
                    await electricianApi.import(fd);
                  } catch {
                    // no backend in preview
                  } finally {
                    setSaving(false);
                    onClose();
                  }
                }}
                className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium disabled:opacity-60"
              >
                {saving ? "Importing..." : "Import"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.id || !form.name || !form.phone) {
      setError("Employee ID, name, and phone are required.");
      return;
    }
    setSaving(true);
    try {
      if (type === "add") await electricianApi.create(form);
      else if (type === "edit") await electricianApi.update(record.id, form);
    } catch {
      // no backend in preview
    } finally {
      setSaving(false);
      onSaved(form);
    }
  }

  const title = type === "add" ? "Add Electrician" : type === "edit" ? "Edit Electrician" : "Electrician Details";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="text-[15px] font-semibold text-blue-700">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Employee ID</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{record?.id}</p>
              ) : (
                <input
                  className={inputCls}
                  value={form.id}
                  disabled={type === "edit"}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="ELEC0XX"
                  required
                />
              )}
            </div>
            <div>
              <FieldLabel>Name</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{record?.name}</p>
              ) : (
                <input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Department</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{record?.department}</p>
              ) : (
                <select className={inputCls} value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>
                  {DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{record?.phone}</p>
              ) : (
                <input className={inputCls} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="99411 22334" required />
              )}
            </div>
          </div>

          <div>
            <FieldLabel>Specialization / Skills</FieldLabel>
            {readOnly ? (
              <p className="text-[13.5px] text-slate-700">{record?.skills}</p>
            ) : (
              <input className={inputCls} value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} placeholder="Wiring, Lighting" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Status</FieldLabel>
              {readOnly ? (
                <Badge text={record?.status} styleMap={STATUS_STYLE} />
              ) : (
                <select className={inputCls} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.filter((s) => s !== "All Status").map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <FieldLabel>Availability</FieldLabel>
              {readOnly ? (
                <Badge text={record?.availability} styleMap={AVAILABILITY_STYLE} />
              ) : (
                <select className={inputCls} value={form.availability} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}>
                  {["Available", "On Duty", "Not Available"].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Employment Type</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{record?.employmentType}</p>
              ) : (
                <select className={inputCls} value={form.employmentType} onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}>
                  {EMPLOYMENT_TYPES.filter((t) => t !== "All Types").map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <FieldLabel>Location / Building</FieldLabel>
              {readOnly ? (
                <p className="text-[13.5px] text-slate-700">{record?.location}</p>
              ) : (
                <select className={inputCls} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}>
                  {LOCATIONS.filter((l) => l !== "All Locations").map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {error && <p className="text-[12.5px] text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-[13px] font-medium">
              {readOnly ? "Close" : "Cancel"}
            </button>
            {!readOnly && (
              <button type="submit" disabled={saving} className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium disabled:opacity-60">
                {saving ? "Saving..." : type === "add" ? "Add Electrician" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
