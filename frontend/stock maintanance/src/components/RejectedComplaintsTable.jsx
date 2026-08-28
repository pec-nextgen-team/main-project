import React from 'react'
import { Eye } from 'lucide-react'
import PriorityBadge from './PriorityBadge.jsx'
import CategoryBadge from './CategoryBadge.jsx'
import RejectionReasonBadge from './RejectionReasonBadge.jsx'

const COLUMNS = [
  'S.No',
  'Ticket ID',
  'Category',
  'Problem Title / Location',
  'Priority',
  'Rejected On',
  'Rejected By',
  'Reason for Rejection',
  'Action',
]

export default function RejectedComplaintsTable({ complaints, onView, loading, loadError }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
        <h3 className="text-[15px] font-bold text-red-600">Rejected Complaints</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-slate-400 text-[13px]">
                  Loading rejected complaints…
                </td>
              </tr>
            )}
            {!loading && loadError && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-red-500 text-[13px]">
                  {loadError}
                </td>
              </tr>
            )}
            {!loading && !loadError && complaints.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-slate-400 text-[13px]">
                  No rejected complaints match the current filters.
                </td>
              </tr>
            )}
            {!loading && !loadError && complaints.map((c) => (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5 text-[13px] text-slate-600">{c.sNo}</td>
                <td className="px-4 py-3.5 text-[13px] font-semibold text-navy-900 whitespace-nowrap">
                  {c.ticketId}
                </td>
                <td className="px-4 py-3.5">
                  <CategoryBadge category={c.category} />
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-[13px] text-navy-800 font-medium">{c.problemTitle}</p>
                  <p className="text-[11.5px] text-slate-400">{c.location}</p>
                </td>
                <td className="px-4 py-3.5">
                  <PriorityBadge priority={c.priority} />
                </td>
                <td className="px-4 py-3.5 text-[12.5px] text-slate-600 whitespace-nowrap">
                  <p>{c.rejectedOnDate}</p>
                  <p className="text-slate-400">{c.rejectedOnTime}</p>
                </td>
                <td className="px-4 py-3.5 text-[12.5px] text-slate-600 whitespace-nowrap">
                  <p className="text-navy-800 font-medium">{c.rejectedBy}</p>
                  <p className="text-slate-400">({c.rejectedByDesignation})</p>
                </td>
                <td className="px-4 py-3.5">
                  <RejectionReasonBadge reason={c.rejectionReason} />
                </td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onView(c)}
                    className="inline-flex items-center gap-1.5 border border-brand-blue text-brand-blue text-[12px] font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <Eye size={13} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
