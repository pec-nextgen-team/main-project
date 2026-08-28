const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-emerald-100 text-emerald-700',
};

export default function PriorityBadge({ priority }) {
  const classes = PRIORITY_STYLES[priority] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {priority}
    </span>
  );
}
