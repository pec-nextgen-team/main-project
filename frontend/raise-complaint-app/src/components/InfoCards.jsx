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

export function SLACard() {
  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-bold text-slate-800">SLA Information</h3>
      </div>
      <p className="text-sm text-slate-600">All complaints must be resolved within</p>
      <p className="my-1 text-3xl font-extrabold text-brand-700">3 Days</p>
      <p className="text-sm text-slate-600">from the date of approval.</p>
    </div>
  );
}

export function NeedHelpCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="mb-2 text-sm font-bold text-slate-800">Need Help?</h3>
      <p className="mb-3 text-sm text-slate-500">For any assistance, contact</p>
      <div className="space-y-2 text-sm">
        <a href="tel:04426491113" className="flex items-center gap-2 text-slate-700 hover:text-brand-600">
          <Phone className="h-4 w-4 text-brand-500" />
          044 - 2649 1113
        </a>
        <a
          href="mailto:support@panimalar.ac.in"
          className="flex items-center gap-2 text-slate-700 hover:text-brand-600 break-all"
        >
          <Mail className="h-4 w-4 text-brand-500" />
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

export function WorkflowSummaryCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Workflow Summary</h3>
      <ol>
        {WORKFLOW_STAGES.map((stage, index) => {
          const isLast = index === WORKFLOW_STAGES.length - 1;
          return (
            <li key={stage} className="relative flex items-start gap-3 pb-6 last:pb-0">
              {!isLast && (
                <span className="absolute left-[13px] top-7 h-full w-px bg-slate-200" aria-hidden="true" />
              )}
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-1 text-sm font-medium text-slate-700">{stage}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
