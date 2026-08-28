import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import SLAIndicator from './SLAIndicator.jsx';
import { formatDateTime } from '../utils/sla.js';

export default function ComplaintsTable({ complaints, startIndex, referenceDate, onView }) {
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <p className="text-sm font-semibold text-slate-600">No complaints match your filters</p>
        <p className="text-xs text-slate-400">Try adjusting the search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">S.No</th>
            <th className="px-4 py-3">Ticket ID</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Problem Title / Location</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Assigned To</th>
            <th className="px-4 py-3">Raised On</th>
            <th className="px-4 py-3">SLA (3 Days)</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {complaints.map((c, i) => (
            <tr key={c.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-500">{startIndex + i + 1}</td>
              <td className="px-4 py-3 font-semibold text-brand-700">{c.ticketId}</td>
              <td className="px-4 py-3 text-slate-600">{c.category}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{c.problemTitle}</p>
                <p className="text-xs text-slate-400">
                  {c.location}
                  {c.room ? ` - ${c.room}` : ''}
                </p>
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={c.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">
                {c.assignedTo ? (
                  <>
                    <p className="font-medium text-slate-700">{c.assignedTo.name}</p>
                    <p className="text-xs text-slate-400">{c.assignedTo.role}</p>
                  </>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDateTime(c.createdAt)}</td>
              <td className="px-4 py-3">
                <SLAIndicator complaint={c} referenceDate={referenceDate} />
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onView(c)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600"
                  aria-label={`View ${c.ticketId}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
