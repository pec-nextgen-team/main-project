import { X, Paperclip, MapPin, User, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import SLAIndicator from './SLAIndicator.jsx';
import { WorkflowSummaryCard } from './InfoCards.jsx';
import { formatDateTime } from '../utils/sla.js';

const STAGE_INDEX = {
  'Complaint Registered': 0,
  Inspection: 1,
  'Repair Assigned': 2,
  'Action Taken': 3,
  Verification: 4,
  Closed: 5,
};

export default function ComplaintDetailsModal({ complaint, referenceDate, onClose }) {
  if (!complaint) return null;

  const activeIndex = STAGE_INDEX[complaint.status] ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-slate-400">Complaint Details</p>
            <h2 className="text-lg font-bold text-slate-800">{complaint.ticketId}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto thin-scrollbar px-6 py-5 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            <span className="text-sm text-slate-400">
              {complaint.category} &middot; {complaint.subCategory}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800">{complaint.problemTitle}</h3>
            <p className="mt-1 text-sm text-slate-600">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Location">
              {complaint.location}
              {complaint.room ? ` - ${complaint.room}` : ''} ({complaint.floor})
            </InfoRow>
            <InfoRow icon={Wrench} label="Asset / Equipment">
              {complaint.asset || 'Not specified'}
            </InfoRow>
            <InfoRow icon={User} label="Reported By">
              {complaint.reportedBy} &middot; {complaint.department}
            </InfoRow>
            <InfoRow icon={User} label="Assigned Technician">
              {complaint.assignedTo ? `${complaint.assignedTo.name} (${complaint.assignedTo.role})` : 'Not yet assigned'}
            </InfoRow>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">SLA Status</p>
            <SLAIndicator complaint={complaint} referenceDate={referenceDate} />
          </div>

          {/* Timeline */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Workflow Timeline</p>
            <WorkflowSummaryCard activeIndex={activeIndex} title="" />
          </div>

          {/* Attachments */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Attachments</p>
            {complaint.attachments?.length ? (
              <ul className="space-y-1.5">
                {complaint.attachments.map((file) => (
                  <li key={file.name} className="flex items-center gap-2 text-sm text-slate-600">
                    <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                    {file.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No attachments were added to this complaint.</p>
            )}
          </div>

          {/* Processing details (read-only, technician-entered) */}
          {(complaint.inspection || complaint.repair || complaint.actionTaken) && (
            <div className="space-y-3 rounded-lg border border-slate-200 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Wrench className="h-3.5 w-3.5" />
                Processing Details
              </p>
              {complaint.inspection && (
                <DetailBlock title="Inspection" date={complaint.inspection.date}>
                  Inspected by {complaint.inspection.inspectedBy}. {complaint.inspection.notes}
                </DetailBlock>
              )}
              {complaint.repair && (
                <DetailBlock title="Repair Assigned" date={complaint.repair.assignedDate}>
                  Assigned to {complaint.repair.technician}. {complaint.repair.notes}
                </DetailBlock>
              )}
              {complaint.actionTaken && (
                <DetailBlock title="Action Taken" date={complaint.actionTaken.date}>
                  {complaint.actionTaken.notes}
                </DetailBlock>
              )}
            </div>
          )}

          {/* Verification */}
          {complaint.verification && (
            <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verification
              </p>
              <p className="text-sm text-teal-800">
                Verified by {complaint.verification.verifiedBy} on {formatDateTime(complaint.verification.date)}.{' '}
                {complaint.verification.remarks}
              </p>
            </div>
          )}

          {/* Closure */}
          {complaint.closure && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Closure
              </p>
              <p className="text-sm text-emerald-800">
                Closed by {complaint.closure.closedBy} on {formatDateTime(complaint.closure.date)}.{' '}
                {complaint.closure.remarks}
              </p>
            </div>
          )}

          <p className="text-xs text-slate-400">
            Raised on {formatDateTime(complaint.createdAt)} &middot; Last updated {formatDateTime(complaint.updatedAt)}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm text-slate-700">{children}</p>
      </div>
    </div>
  );
}

function DetailBlock({ title, date, children }) {
  return (
    <div className="text-sm">
      <p className="font-semibold text-slate-700">
        {title} <span className="font-normal text-slate-400">&middot; {formatDateTime(date)}</span>
      </p>
      <p className="text-slate-600">{children}</p>
    </div>
  );
}
