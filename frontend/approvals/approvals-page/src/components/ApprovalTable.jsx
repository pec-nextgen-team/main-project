import { Zap, Droplet, Wrench, Paperclip, Eye, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORY_META = {
  Electrical: { icon: Zap, bg: "bg-blue-50", text: "text-yellow-600" },
  Plumbing: { icon: Droplet, bg: "bg-cyan-50", text: "text-cyan-600" },
  General: { icon: Wrench, bg: "bg-slate-100", text: "text-slate-600" },
};

const PRIORITY_META = {
  High: "bg-red-50 text-red-600 border border-red-100",
  Medium: "bg-orange-50 text-orange-600 border border-orange-100",
  Low: "bg-green-50 text-green-600 border border-green-100",
};

/**
 * ApprovalTable
 * Complaints Awaiting Your Approval — desktop table (kept as a real table,
 * not collapsed into cards, per spec) with row actions.
 */
export default function ApprovalTable({
  rows,
  onView,
  onApprove,
  onReject,
  loading,
  loadError,
  actioningId,
  totalRows = rows.length,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) {
  const rangeStart = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = totalRows === 0 ? 0 : Math.min(currentPage * pageSize, totalRows);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">Complaints Awaiting Your Approval</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left font-medium">S.No</th>
              <th className="px-4 py-3 text-left font-medium">Ticket ID</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Problem Title / Location</th>
              <th className="px-4 py-3 text-left font-medium">Priority</th>
              <th className="px-4 py-3 text-left font-medium">Reported By</th>
              <th className="px-4 py-3 text-left font-medium">Reported On</th>
              <th className="px-4 py-3 text-left font-medium">Attachments</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                  Loading approvals…
                </td>
              </tr>
            )}
            {!loading && loadError && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-red-500">
                  {loadError}
                </td>
              </tr>
            )}
            {!loading && !loadError && rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                  No complaints match the selected filters.
                </td>
              </tr>
            )}
            {!loading && !loadError && rows.map((row, idx) => {
              const meta = CATEGORY_META[row.category] ?? CATEGORY_META.General;
              const CategoryIcon = meta.icon;
              return (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3.5 font-medium text-[#0757D9] whitespace-nowrap">{row.ticketId}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${meta.bg} ${meta.text}`}
                    >
                      <CategoryIcon size={13} />
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 min-w-[200px]">
                    <p className="text-slate-800 font-medium">{row.title}</p>
                    <p className="text-xs text-slate-500">{row.location}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_META[row.priority]}`}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="text-slate-800">{row.reportedBy}</p>
                    <p className="text-xs text-slate-500">{row.reportedByRole}</p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="text-slate-800">{row.reportedOn}</p>
                    <p className="text-xs text-slate-500">{row.reportedTime}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Paperclip size={13} /> {row.attachments}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onView(row)}
                        title="View"
                        className="flex items-center gap-1 border border-[#0757D9] text-[#0757D9] bg-white hover:bg-blue-50 rounded-md px-2 py-1.5 text-xs font-medium transition-colors"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => onApprove(row)}
                        title="Approve"
                        disabled={actioningId === row.id}
                        className="flex items-center gap-1 border border-green-600 text-green-600 bg-white hover:bg-green-50 rounded-md px-2 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={13} /> {actioningId === row.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => onReject(row)}
                        title="Reject"
                        disabled={actioningId === row.id}
                        className="flex items-center gap-1 border border-red-500 text-red-500 bg-white hover:bg-red-50 rounded-md px-2 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={13} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination — wired to real page state from the parent, so it
          actually slices the fetched rows instead of always showing "1". */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Showing {rangeStart} to {rangeEnd} of {totalRows} records
        </p>
        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-600 bg-white"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed hover:enabled:bg-slate-50"
            >
              <ChevronLeft size={15} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#0757D9] text-white text-xs font-medium">
              {currentPage}
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed hover:enabled:bg-slate-50"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
