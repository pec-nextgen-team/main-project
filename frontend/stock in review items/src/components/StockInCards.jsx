import { Building2, Phone, Mail, MapPin, CheckCircle2, Info } from 'lucide-react';

export function SupplierInfoCard({ supplier }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Building2 className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-bold text-slate-800">Supplier Information</h3>
      </div>
      <dl className="space-y-2.5 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Supplier Name</dt>
          <dd className="font-semibold text-slate-700">{supplier.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Contact Person</dt>
          <dd className="text-slate-700">{supplier.contact}</dd>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <a href={`tel:${supplier.phone.replace(/\s/g, '')}`} className="hover:text-brand-600">
            {supplier.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <a href={`mailto:${supplier.email}`} className="break-all hover:text-brand-600">
            {supplier.email}
          </a>
        </div>
        <div className="flex items-start gap-2 text-slate-700">
          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <span>{supplier.address}</span>
        </div>
      </dl>
    </div>
  );
}

const STEP_STYLES = {
  done: {
    circle: 'bg-emerald-500 text-white',
    line: 'bg-emerald-400',
    label: 'text-emerald-700',
  },
  current: {
    circle: 'bg-brand-600 text-white ring-4 ring-brand-100',
    line: 'bg-slate-200',
    label: 'text-brand-700',
  },
  upcoming: {
    circle: 'bg-slate-200 text-slate-500',
    line: 'bg-slate-200',
    label: 'text-slate-500',
  },
};

export function StockInProcessCard({ steps }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Stock In Process</h3>
      <ol>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const style = STEP_STYLES[step.state] || STEP_STYLES.upcoming;
          return (
            <li key={step.label} className="relative flex items-start gap-3 pb-6 last:pb-0">
              {!isLast && (
                <span className={`absolute left-[13px] top-7 h-full w-px ${style.line}`} aria-hidden="true" />
              )}
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.circle}`}>
                {step.state === 'done' ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </span>
              <div className="pt-1">
                <p className={`text-sm font-medium ${style.label}`}>{step.label}</p>
                {step.date && <p className="text-xs text-slate-400">{step.date}</p>}
                {step.state === 'current' && <p className="text-xs font-medium text-brand-500">Current Step</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function NotesCard() {
  const items = [
    'Ensure items are checked physically before stock in.',
    'Verify quantity, quality and expiry date.',
    'Upload invoice copy for reference.',
    'All fields marked with * are mandatory.',
  ];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Info className="h-4 w-4 text-amber-600" />
        <h3 className="text-sm font-bold text-slate-800">Notes</h3>
      </div>
      <ul className="list-disc space-y-1.5 pl-4 text-sm text-amber-900">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
