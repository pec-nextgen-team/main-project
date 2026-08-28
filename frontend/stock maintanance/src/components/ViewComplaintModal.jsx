import React from 'react'
import { X, Paperclip } from 'lucide-react'
import PriorityBadge from './PriorityBadge.jsx'
import RejectionReasonBadge from './RejectionReasonBadge.jsx'

export default function ViewComplaintModal({ complaint, onClose }) {
  if (!complaint) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-xl">
          <h3 className="text-[15px] font-bold text-navy-900">Complaint Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Ticket ID" value={complaint.ticketId} />
            <Detail label="Category" value={complaint.category} />
            <Detail label="Sub Category" value={complaint.subCategory} />
            <Detail label="Priority" value={<PriorityBadge priority={complaint.priority} />} />
            <Detail label="Problem Title" value={complaint.problemTitle} />
            <Detail label="Location" value={complaint.location} />
            <Detail label="Reported By" value={complaint.reportedBy} />
            <Detail label="Reported On" value={complaint.reportedOn} />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Complaint Description
            </p>
            <p className="text-[13px] text-navy-800 leading-relaxed">{complaint.description}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Detail label="Rejected On" value={`${complaint.rejectedOnDate}, ${complaint.rejectedOnTime}`} />
              <Detail
                label="Rejected By"
                value={`${complaint.rejectedBy} (${complaint.rejectedByDesignation})`}
              />
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Reason for Rejection
              </p>
              <RejectionReasonBadge reason={complaint.rejectionReason} />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
              Attachments
            </p>
            {complaint.attachments && complaint.attachments.length > 0 ? (
              <ul className="space-y-1">
                {complaint.attachments.map((a) => (
                  <li key={a} className="flex items-center gap-1.5 text-[12.5px] text-brand-blue">
                    <Paperclip size={12} />
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] text-slate-400">No attachments available.</p>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase mb-0.5">{label}</p>
      <div className="text-[13px] text-navy-800 font-medium">{value}</div>
    </div>
  )
}
