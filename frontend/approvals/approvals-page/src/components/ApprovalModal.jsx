import { useState } from "react";
import { X, Paperclip, MapPin, User, Calendar, Tag } from "lucide-react";

const PRIORITY_META = {
  High: "bg-red-50 text-red-600 border border-red-100",
  Medium: "bg-orange-50 text-orange-600 border border-orange-100",
  Low: "bg-green-50 text-green-600 border border-green-100",
};

/**
 * ApprovalModal
 * Handles two modes:
 *  - "view": read-only complaint detail
 *  - "reject": same detail plus a required remarks field, used for the
 *    reject confirmation flow
 */
export default function ApprovalModal({ complaint, mode, onClose, onConfirmReject, submitting }) {
  const [remarks, setRemarks] = useState("");

  if (!complaint) return null;

  const isReject = mode === "reject";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">
            {isReject ? "Reject Complaint" : "Complaint Details"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-[#0757D9]">{complaint.ticketId}</p>
              <p className="text-slate-800 font-semibold mt-0.5">{complaint.title}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_META[complaint.priority]}`}>
              {complaint.priority}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Tag size={14} className="text-slate-400" /> {complaint.category}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={14} className="text-slate-400" /> {complaint.location}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <User size={14} className="text-slate-400" /> {complaint.reportedBy} ({complaint.reportedByRole})
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={14} className="text-slate-400" /> {complaint.reportedOn}, {complaint.reportedTime}
            </div>
            <div className="flex items-center gap-2 text-slate-600 col-span-2">
              <Paperclip size={14} className="text-slate-400" /> {complaint.attachments} attachment(s)
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-100">
              {complaint.description}
            </p>
          </div>

          {isReject && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Rejection Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Explain why this complaint is being rejected..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          {isReject && (
            <button
              onClick={() => remarks.trim() && !submitting && onConfirmReject(complaint, remarks)}
              disabled={!remarks.trim() || submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed"
            >
              {submitting ? "Rejecting..." : "Confirm Rejection"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
