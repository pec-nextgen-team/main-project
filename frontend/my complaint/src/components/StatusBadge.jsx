const STATUS_STYLES = {
  'Complaint Registered': 'bg-blue-100 text-blue-700',
  Inspection: 'bg-amber-100 text-amber-700',
  'Repair Assigned': 'bg-purple-100 text-purple-700',
  'Action Taken': 'bg-sky-100 text-sky-700',
  Verification: 'bg-teal-100 text-teal-700',
  Closed: 'bg-emerald-100 text-emerald-700',
};

export default function StatusBadge({ status }) {
  const classes = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
}
