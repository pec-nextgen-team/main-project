import React from 'react';
import { 
  FileEdit, 
  UserCheck, 
  TicketCheck, 
  Wrench, 
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { COMPLAINT_STATUS } from '../../services/complaintService';

const STAGES = [
  {
    key: 'RAISE',
    label: '1. Raise Complaint',
    description: 'Registered by Staff/Student',
    icon: FileEdit,
  },
  {
    key: 'APPROVAL',
    label: '2. HOD Approval',
    description: 'Department Verification',
    icon: UserCheck,
  },
  {
    key: 'ASSIGNMENT',
    label: '3. Electrician Assignment',
    description: 'Admin Allocates Task',
    icon: TicketCheck,
  },
  {
    key: 'IN_PROGRESS',
    label: '4. Work Execution',
    description: 'Technician on site',
    icon: Wrench,
  },
  {
    key: 'COMPLETED',
    label: '5. Work Completed',
    description: 'Resolved & Signed Off',
    icon: CheckCircle2,
  },
];

export function WorkflowTracker({ currentStatus, className = '', id }) {
  const getStageIndex = (status) => {
    switch (status) {
      case COMPLAINT_STATUS.PENDING:
        return 1; // At HOD approval
      case COMPLAINT_STATUS.APPROVED:
        return 2; // At Assignment
      case COMPLAINT_STATUS.ASSIGNED:
        return 3; // Assigned, ready for work
      case COMPLAINT_STATUS.IN_PROGRESS:
        return 3; // Work execution
      case COMPLAINT_STATUS.COMPLETED:
      case COMPLAINT_STATUS.RESOLVED:
        return 4; // Complete
      case COMPLAINT_STATUS.REJECTED:
        return -1; // Rejected at HOD level
      default:
        return 0;
    }
  };

  const activeIndex = getStageIndex(currentStatus);
  const isRejected = currentStatus === COMPLAINT_STATUS.REJECTED;

  return (
    <div id={id} className={`bg-white rounded-lg border border-slate-200 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Lifecycle Workflow Pipeline
          </h4>
          <p className="text-sm font-medium text-slate-900 mt-0.5">
            5-Stage Institutional Maintenance Lifecycle
          </p>
        </div>
        {isRejected && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Complaint Rejected by HOD
          </span>
        )}
      </div>

      {/* Progress Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = !isRejected && activeIndex > idx;
          const isCurrent = !isRejected && (activeIndex === idx || (idx === 3 && currentStatus === COMPLAINT_STATUS.ASSIGNED));

          let badgeBg = 'bg-slate-100 text-slate-400 border-slate-200';
          let textColor = 'text-slate-500';
          let borderColor = 'border-slate-200 bg-slate-50/40';

          if (isPassed) {
            badgeBg = 'bg-emerald-700 text-white border-emerald-800';
            textColor = 'text-emerald-950 font-semibold';
            borderColor = 'border-emerald-200 bg-emerald-50/30';
          } else if (isCurrent) {
            badgeBg = 'bg-blue-700 text-white border-blue-800 ring-2 ring-blue-200';
            textColor = 'text-blue-950 font-bold';
            borderColor = 'border-blue-300 bg-blue-50/40 shadow-xs';
          } else if (isRejected && idx === 1) {
            badgeBg = 'bg-rose-700 text-white border-rose-800';
            textColor = 'text-rose-900 font-bold';
            borderColor = 'border-rose-300 bg-rose-50/40';
          }

          return (
            <div
              key={stage.key}
              className={`flex flex-col p-3 rounded-lg border transition-all ${borderColor}`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${badgeBg}`}>
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isRejected && idx === 1 ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className={`text-xs ${textColor} leading-tight`}>{stage.label}</span>
              </div>
              <span className="text-[11px] text-slate-500 leading-normal pl-9">
                {stage.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowTracker;
