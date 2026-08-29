import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Wrench, 
  CheckCheck,
  AlertCircle 
} from 'lucide-react';
import { COMPLAINT_STATUS } from '../../services/complaintService';

export function Badge({ status, priority, size = 'md' }) {
  if (priority) {
    const priorityConfig = {
      Low: {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      },
      Medium: {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      },
      High: {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      },
      Emergency: {
        bg: 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
        dot: 'bg-rose-600 animate-pulse',
      },
    };

    const config = priorityConfig[priority] || priorityConfig.Medium;
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${config.bg} ${sizeClasses}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
        {priority} Priority
      </span>
    );
  }

  const statusConfigs = {
    [COMPLAINT_STATUS.PENDING]: {
      label: 'Pending HOD Approval',
      icon: Clock,
      style: 'bg-amber-50 text-amber-800 border-amber-300',
    },
    [COMPLAINT_STATUS.APPROVED]: {
      label: 'Approved (Pending Assignment)',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    [COMPLAINT_STATUS.REJECTED]: {
      label: 'Rejected',
      icon: XCircle,
      style: 'bg-rose-50 text-rose-800 border-rose-300',
    },
    [COMPLAINT_STATUS.ASSIGNED]: {
      label: 'Electrician Assigned',
      icon: UserCheck,
      style: 'bg-blue-50 text-blue-800 border-blue-300',
    },
    [COMPLAINT_STATUS.IN_PROGRESS]: {
      label: 'In Progress',
      icon: Wrench,
      style: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    },
    [COMPLAINT_STATUS.COMPLETED]: {
      label: 'Work Completed',
      icon: CheckCheck,
      style: 'bg-teal-50 text-teal-800 border-teal-300',
    },
    [COMPLAINT_STATUS.RESOLVED]: {
      label: 'Resolved',
      icon: CheckCheck,
      style: 'bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold',
    },
  };

  const current = statusConfigs[status] || {
    label: status || 'Unknown',
    icon: AlertCircle,
    style: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const IconComponent = current.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${current.style} ${sizeClasses}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">{current.label}</span>
    </span>
  );
}

export default Badge;
