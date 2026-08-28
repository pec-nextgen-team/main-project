import { useEffect, useMemo, useState } from "react";
import { Hourglass, ClipboardCheck, XCircle, CheckCircle2, Lightbulb } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SummaryCard from "../components/SummaryCard";
import FilterBar from "../components/FilterBar";
import ApprovalTable from "../components/ApprovalTable";
import ApprovalModal from "../components/ApprovalModal";
import WorkflowSummary from "../components/WorkflowSummary";
import InfoCard from "../components/InfoCard";
import Toast from "../components/Toast";

import {
  categories,
  subCategories,
  priorities,
  locations,
} from "../data/filterOptions";
import { fetchApprovals, approveComplaint, rejectComplaint } from "../services/approvalService";

const EMPTY_FILTERS = {
  search: "",
  category: "All Categories",
  subCategory: "All Sub Categories",
  priority: "All Priorities",
  fromDate: "",
  toDate: "",
  location: "All Locations",
};

/**
 * Approvals
 * Pending Approvals page for the HOD.
 *
 * Complaint records are loaded live from GET /api/approvals. Approve/reject
 * actions call the real backend and only update local state / show a
 * success toast after a 200 OK response; failures show the backend's error
 * message instead.
 */
export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [modal, setModal] = useState(null); // { complaint, mode: "view" | "reject" }
  const [toast, setToast] = useState(null);
  const [actioningId, setActioningId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await fetchApprovals();
        if (!cancelled) setApprovals(data);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message);
          showToast(error.message, "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const pending = useMemo(() => approvals.filter((a) => a.status === "Pending"), [approvals]);

  const filteredRows = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    // fromDate/toDate come from free-text "dd-mm-yyyy" inputs; row.reportedOn
    // may be "dd-mm-yyyy" or an ISO "yyyy-mm-dd" depending on the backend.
    // Parse both shapes into comparable Date objects instead of comparing
    // the raw strings (which sorts wrong across month/day boundaries).
    const parseDate = (value) => {
      if (!value) return null;
      const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
      if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
      const dmy = /^(\d{1,2})-(\d{1,2})-(\d{4})/.exec(value);
      if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    };
    const fromDate = parseDate(filters.fromDate);
    const toDate = parseDate(filters.toDate);

    return pending.filter((row) => {
      if (
        search &&
        !(
          row.ticketId.toLowerCase().includes(search) ||
          row.title.toLowerCase().includes(search) ||
          row.location.toLowerCase().includes(search)
        )
      )
        return false;
      if (filters.category !== "All Categories" && row.category !== filters.category) return false;
      if (
        filters.subCategory !== "All Sub Categories" &&
        row.subCategory !== filters.subCategory
      )
        return false;
      if (filters.priority !== "All Priorities" && row.priority !== filters.priority) return false;
      if (filters.location !== "All Locations" && row.location !== filters.location) return false;
      const rowDate = fromDate || toDate ? parseDate(row.reportedOn) : null;
      if (fromDate && (!rowDate || rowDate < fromDate)) return false;
      if (toDate && (!rowDate || rowDate > toDate)) return false;
      return true;
    });
  }, [pending, filters]);

  const stats = useMemo(() => {
    const approvedCount = approvals.filter((a) => a.status === "Approved").length;
    const rejectedCount = approvals.filter((a) => a.status === "Rejected").length;
    return {
      pending: pending.length,
      approved: approvedCount,
      rejected: rejectedCount,
      total: approvedCount + rejectedCount,
    };
  }, [approvals, pending]);

  // Any filter change (including from FilterBar's own controls) must reset
  // pagination back to page 1 so the user never lands on an out-of-range page.
  const handleFiltersChange = (next) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // There is no dedicated export endpoint for this page (unlike
  // /api/leaves/export in Leave Management), so this does not invent one.
  // Instead it builds a real CSV from the rows already loaded from
  // GET /api/approvals - the same data the table is showing, filtered the
  // same way - and triggers a real file download. If there are no matching
  // rows, it says so instead of claiming a fake export happened.
  const handleExport = () => {
    if (filteredRows.length === 0) {
      showToast("Nothing to export for the current filters.", "error");
      return;
    }
    const columns = [
      ["Ticket ID", (r) => r.ticketId],
      ["Category", (r) => r.category],
      ["Sub Category", (r) => r.subCategory ?? ""],
      ["Title", (r) => r.title],
      ["Location", (r) => r.location],
      ["Priority", (r) => r.priority],
      ["Reported By", (r) => r.reportedBy],
      ["Reported By Role", (r) => r.reportedByRole ?? ""],
      ["Reported On", (r) => r.reportedOn],
      ["Reported Time", (r) => r.reportedTime ?? ""],
      ["Status", (r) => r.status],
    ];
    const escapeCsv = (value) => {
      const s = String(value ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      columns.map(([label]) => escapeCsv(label)).join(","),
      ...filteredRows.map((row) => columns.map(([, get]) => escapeCsv(get(row))).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pending-approvals-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(`Exported ${filteredRows.length} record(s).`);
  };

  const handleView = (row) => setModal({ complaint: row, mode: "view" });
  const handleRejectClick = (row) => setModal({ complaint: row, mode: "reject" });

  const handleApprove = async (row) => {
    setActioningId(row.id);
    try {
      await approveComplaint(row.id);
      // Mutate local state and show the success toast only after the
      // backend confirms the ticket was opened.
      setApprovals((prev) =>
        prev.map((a) => (a.id === row.id ? { ...a, status: "Approved" } : a))
      );
      showToast(`${row.ticketId} approved and ticket created.`);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleConfirmReject = async (row, remarks) => {
    setActioningId(row.id);
    try {
      await rejectComplaint(row.id, remarks);
      setApprovals((prev) =>
        prev.map((a) => (a.id === row.id ? { ...a, status: "Rejected", rejectionRemarks: remarks } : a))
      );
      setModal(null);
      showToast(`${row.ticketId} rejected.`, "error");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar
        activeSubmenu="Pending Approvals"
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <Header onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 space-y-6">
          {/* Page heading + breadcrumb */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Approvals</h1>
            <p className="text-sm text-slate-500 mt-1">
              Home <span className="mx-1 text-slate-300">/</span> Approvals{" "}
              <span className="mx-1 text-slate-300">/</span>{" "}
              <span className="text-slate-700 font-medium">Pending Approvals</span>
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon={Hourglass}
              number={stats.pending}
              title="Pending Approvals"
              subtitle="Require your action"
              color="orange"
            />
            <SummaryCard
              icon={ClipboardCheck}
              number={stats.approved}
              title="Approved"
              subtitle="This Month"
              color="blue"
            />
            <SummaryCard
              icon={XCircle}
              number={stats.rejected}
              title="Rejected"
              subtitle="This Month"
              color="red"
            />
            <SummaryCard
              icon={CheckCircle2}
              number={stats.total}
              title="Total Processed"
              subtitle="This Month"
              color="green"
            />
          </div>

          {/* Main content grid: table + right rail */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="space-y-6 min-w-0">
              <FilterBar
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleReset}
                onExport={handleExport}
                categories={categories}
                subCategories={subCategories}
                priorities={priorities}
                locations={locations}
              />

              <ApprovalTable
                rows={pagedRows}
                totalRows={filteredRows.length}
                currentPage={safePage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleRejectClick}
                loading={loading}
                loadError={loadError}
                actioningId={actioningId}
              />

              {/* Bottom note */}
              <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-yellow-600" />
                <p>
                  <span className="font-medium">Note:</span> Complaints will be forwarded to
                  Electrician Head only after your approval.
                </p>
              </div>
            </div>

            {/* Right sidebar panels */}
            <div className="space-y-6">
              <InfoCard variant="guidelines" />
              <WorkflowSummary />
              <InfoCard variant="help" />
            </div>
          </div>
        </main>
      </div>

      <ApprovalModal
        complaint={modal?.complaint}
        mode={modal?.mode}
        onClose={() => setModal(null)}
        onConfirmReject={handleConfirmReject}
        submitting={actioningId === modal?.complaint?.id}
      />

      <Toast toast={toast} />
    </div>
  );
}
