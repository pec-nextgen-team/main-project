import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { computeSlaInfo } from '../utils/sla.js';

const TONE_STYLES = {
  ok: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
  warning: { bar: 'bg-amber-500', text: 'text-amber-700' },
  overdue: { bar: 'bg-red-500', text: 'text-red-700' },
  resolved: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
};

export default function SLAIndicator({ complaint, referenceDate }) {
  const sla = computeSlaInfo(complaint, referenceDate);
  const tone = TONE_STYLES[sla.tone] || TONE_STYLES.ok;

  return (
    <div className="min-w-[130px]">
      <div className={`mb-1 flex items-center gap-1 text-xs font-semibold ${tone.text}`}>
        {sla.tone === 'overdue' && <AlertTriangle className="h-3.5 w-3.5" />}
        {sla.tone === 'resolved' && <CheckCircle2 className="h-3.5 w-3.5" />}
        <span>{sla.label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${sla.percent}%` }} />
      </div>
    </div>
  );
}
