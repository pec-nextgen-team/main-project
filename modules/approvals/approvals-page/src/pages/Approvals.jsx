import { useMemo, useState } from "react";
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
  initialApprovals,
  categories,
  subCategories,
  priorities,
  locations,
} from "../data/mockApprovals";

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
 * All data below is local mock state (see src/data/mockApprovals.js).
 * To wire this up to the real backend:
 *   - replace `initialApprovals` with a fetch to GET /api/approvals
 *   - replace the approve/reject handlers with PATCH /api/approvals/:id
 * The component structure and props are already shaped for that swap.
 */
export default function Approvals() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [modal, setModal] = useState(null); // { complaint, mode: "view" | "reject" }
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3000);
  };

  const pending = useMemo(() => approvals.filter((a) => a.status === "Pending"), [approvals]);

  const filteredRows = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
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
      if (filters.priority !== "All Priorities" && row.priority !== filters.priority) return false;
      if (filters.location !== "All Locations" && row.location !== filters.location) return false;
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

  const handleReset = () => setFilters(EMPTY_FILTERS);

  const handleExport = () => {
    showToast(`Exported ${filteredRows.length} record(s).`);
  };

  const handleView = (row) => setModal({ complaint: row, mode: "view" });
  const handleRejectClick = (row) => setModal({ complaint: row, mode: "reject" });

  const handleApprove = (row) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === row.id ? { ...a, status: "Approved" } : a))
    );
    showToast(`${row.ticketId} approved and ticket created.`);
  };

  const handleConfirmReject = (row, remarks) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === row.id ? { ...a, status: "Rejected", rejectionRemarks: remarks } : a))
    );
    setModal(null);
    showToast(`${row.ticketId} rejected.`, "error");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar activeSubmenu="Pending Approvals" />

      <div className="flex-1 min-w-0">
        <Header />

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
                onChange={setFilters}
                onReset={handleReset}
                onExport={handleExport}
                categories={categories}
                subCategories={subCategories}
                priorities={priorities}
                locations={locations}
              />

              <ApprovalTable
                rows={filteredRows}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleRejectClick}
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
      />

      <Toast toast={toast} />
    </div>
  );
}
