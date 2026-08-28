import { CheckCircle2, Clock, Phone, Mail } from 'lucide-react';

export function GuidelinesCard() {
  const items = [
    'Select the correct category and sub category.',
    'Provide clear and accurate description.',
    'Attach relevant photos or documents if any.',
    'You will be notified after the ticket is created.',
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="mb-3 text-sm font-bold text-slate-800">Complaint Guidelines</h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SLACard({ showPolicyLink = false, onViewPolicy, approvalLabel = 'approval' }) {
  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-bold text-slate-800">SLA Information</h3>
      </div>
      <p className="text-sm text-slate-600">All complaints must be resolved within</p>
      <p className="my-1 text-3xl font-extrabold text-brand-700">3 Days</p>
      <p className="text-sm text-slate-600">from the date of {approvalLabel}.</p>
      {showPolicyLink && (
        <button
          type="button"
          onClick={onViewPolicy}
          className="mt-3 text-sm font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          View SLA Policy
        </button>
      )}
    </div>
  );
}

export function NeedHelpCard({ variant = 'white' }) {
  const isGreen = variant === 'green';
  return (
    <div
      className={`rounded-xl border p-5 ${
        isGreen ? 'border-emerald-100 bg-emerald-50' : 'border-slate-200 bg-white shadow-card'
      }`}
    >
      <h3 className="mb-2 text-sm font-bold text-slate-800">Need Help?</h3>
      <p className="mb-3 text-sm text-slate-500">For any assistance, contact</p>
      <div className="space-y-2 text-sm">
        <a
          href="tel:04426491113"
          className={`flex items-center gap-2 text-slate-700 ${isGreen ? 'hover:text-emerald-700' : 'hover:text-brand-600'}`}
        >
          <Phone className={`h-4 w-4 ${isGreen ? 'text-emerald-600' : 'text-brand-500'}`} />
          044 - 2649 1113
        </a>
        <a
          href="mailto:support@panimalar.ac.in"
          className={`flex items-center gap-2 text-slate-700 break-all ${isGreen ? 'hover:text-emerald-700' : 'hover:text-brand-600'}`}
        >
          <Mail className={`h-4 w-4 ${isGreen ? 'text-emerald-600' : 'text-brand-500'}`} />
          support@panimalar.ac.in
        </a>
      </div>
    </div>
  );
}

const WORKFLOW_STAGES = [
  'Complaint Registered',
  'Inspection',
  'Repair Assigned',
  'Action Taken',
  'Verification',
  'Closed',
];

export { WORKFLOW_STAGES };

export function WorkflowSummaryCard({ activeIndex = -1, title = 'Workflow Summary' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      {title && <h3 className="mb-4 text-sm font-bold text-slate-800">{title}</h3>}
      <ol>
        {WORKFLOW_STAGES.map((stage, index) => {
          const isLast = index === WORKFLOW_STAGES.length - 1;
          const isDone = activeIndex >= 0 && index < activeIndex;
          const isCurrent = index === activeIndex;
          return (
            <li key={stage} className="relative flex items-start gap-3 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-[13px] top-7 h-full w-px ${
                    isDone ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold
                  ${
                    isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
              >
                {index + 1}
              </span>
              <span
                className={`pt-1 text-sm font-medium ${
                  isCurrent ? 'text-brand-700' : isDone ? 'text-emerald-700' : 'text-slate-700'
                }`}
              >
                {stage}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
