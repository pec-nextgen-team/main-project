import { FileText, Clock3, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const CARD_CONFIG = [
  { key: 'total', label: 'Total Complaints', subtitle: 'All time', icon: FileText, tone: 'bg-brand-100 text-brand-700' },
  { key: 'open', label: 'Open', subtitle: 'Awaiting action', icon: Clock3, tone: 'bg-blue-100 text-blue-700' },
  { key: 'inProgress', label: 'In Progress', subtitle: 'Under maintenance', icon: Loader2, tone: 'bg-amber-100 text-amber-700' },
  { key: 'resolved', label: 'Resolved', subtitle: 'Work completed', icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-700' },
  { key: 'overdue', label: 'Overdue', subtitle: 'Exceeded 3 days', icon: AlertTriangle, tone: 'bg-red-100 text-red-700' },
];

export default function SummaryCards({ summary, loading }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CARD_CONFIG.map(({ key, label, subtitle, icon: Icon, tone }) => (
        <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">
            {loading ? '—' : summary?.[key] ?? 0}
          </p>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      ))}
    </div>
  );
}
