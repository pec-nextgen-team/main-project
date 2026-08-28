import { useMemo, useState } from 'react';
import {
  Monitor,
  Zap,
  Keyboard,
  Package,
  Lock,
  Info,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import CategoryCard from '../components/CategoryCard.jsx';
import FileUpload from '../components/FileUpload.jsx';
import { GuidelinesCard, SLACard, NeedHelpCard, WorkflowSummaryCard } from '../components/InfoCards.jsx';
import useAuth from '../hooks/useAuth.js';
import { createComplaint } from '../api/complaintApi.js';

const CATEGORIES = [
  {
    id: 'computer-accessories',
    title: 'Computer Accessories',
    description: 'Computer-related accessories',
    icon: Monitor,
  },
  {
    id: 'electrical-accessories',
    title: 'Electrical Accessories',
    description: 'Electrical/electronic accessories',
    icon: Zap,
  },
  {
    id: 'peripheral-devices',
    title: 'Peripheral Devices',
    description: 'Keyboard, mouse, printer and similar devices',
    icon: Keyboard,
  },
  {
    id: 'other-accessories',
    title: 'Other Accessories',
    description: 'Other repairable accessories',
    icon: Package,
  },
];

const SUB_CATEGORIES = ['Keyboard', 'Mouse', 'Monitor', 'Printer', 'UPS', 'Adapter', 'Projector', 'Network Device', 'Other'];
const LOCATIONS = ['Main Building', 'Block A', 'Block B', 'Administrative Block', 'Library', 'Laboratory Block'];
const FLOORS = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];
const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Administration',
  'Other',
];
const PRIORITIES = [
  { value: 'Low', dot: 'bg-emerald-500' },
  { value: 'Medium', dot: 'bg-amber-500' },
  { value: 'High - Urgent', dot: 'bg-red-500' },
];

const DESCRIPTION_MAX_LENGTH = 500;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

function toLocalDateTimeInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function buildInitialForm(user) {
  return {
    category: '',
    subCategory: '',
    problemTitle: '',
    location: '',
    floor: '',
    roomNo: '',
    asset: '',
    description: '',
    priority: '',
    reportedOn: toLocalDateTimeInputValue(new Date()),
    reportedBy: user.name,
    mobile: user.mobile || '',
    email: user.email,
    department: user.department || '',
    attachments: [],
  };
}

export default function RaiseComplaint() {
  const { user } = useAuth();
  const [form, setForm] = useState(() => buildInitialForm(user));
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('');
  const [ticket, setTicket] = useState(null);

  const requiredFields = useMemo(
    () => [
      'category',
      'subCategory',
      'problemTitle',
      'location',
      'floor',
      'roomNo',
      'description',
      'priority',
      'reportedBy',
      'mobile',
      'department',
    ],
    []
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate() {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      const value = form[field];
      if (!value || String(value).trim() === '') {
        nextErrors[field] = 'This field is required.';
      }
    });

    if (form.mobile && !MOBILE_REGEX.test(form.mobile.trim())) {
      nextErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }

    if (form.description && form.description.length > DESCRIPTION_MAX_LENGTH) {
      nextErrors.description = `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleReset() {
    setForm(buildInitialForm(user));
    setErrors({});
    setSubmitState('idle');
    setSubmitError('');
    setTicket(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      const firstErrorField = document.querySelector('[data-error="true"]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitState('submitting');
    setSubmitError('');

    try {
      const created = await createComplaint({
        ...form,
        reportedOn: new Date(form.reportedOn).toISOString(),
      });
      setTicket(created);
      setSubmitState('success');
    } catch (err) {
      setSubmitState('error');
      setSubmitError(err.message || 'Something went wrong while submitting your complaint.');
    }
  }

  if (submitState === 'success' && ticket) {
    return <SuccessPanel ticket={ticket} onNewComplaint={handleReset} />;
  }

  return (
    <div>
      {/* Page heading + breadcrumb */}
      <div className="mb-6">
        <nav className="mb-1 text-xs text-slate-500">
          <span>Home</span>
          <span className="mx-1.5">/</span>
          <span className="font-medium text-slate-700">Raise Complaint</span>
        </nav>
        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Raise New Complaint</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main form card */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
            <h3 className="mb-5 text-base font-bold text-slate-800">Complaint Information</h3>

            {/* Category */}
            <Field label="Category" required error={errors.category}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CATEGORIES.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    icon={cat.icon}
                    title={cat.title}
                    description={cat.description}
                    selected={form.category === cat.id}
                    onSelect={() => updateField('category', cat.id)}
                  />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Sub Category" required error={errors.subCategory}>
                <Select
                  value={form.subCategory}
                  onChange={(v) => updateField('subCategory', v)}
                  options={SUB_CATEGORIES}
                  placeholder="Select sub category"
                  error={errors.subCategory}
                />
              </Field>

              <Field label="Problem Title" required error={errors.problemTitle}>
                <TextInput
                  value={form.problemTitle}
                  onChange={(v) => updateField('problemTitle', v)}
                  placeholder="e.g. Keyboard Not Working"
                  error={errors.problemTitle}
                />
              </Field>

              <Field label="Location / Building" required error={errors.location}>
                <Select
                  value={form.location}
                  onChange={(v) => updateField('location', v)}
                  options={LOCATIONS}
                  placeholder="Select building"
                  error={errors.location}
                />
              </Field>

              <Field label="Floor / Area" required error={errors.floor}>
                <Select
                  value={form.floor}
                  onChange={(v) => updateField('floor', v)}
                  options={FLOORS}
                  placeholder="Select floor"
                  error={errors.floor}
                />
              </Field>

              <Field label="Room / Area No." required error={errors.roomNo}>
                <TextInput
                  value={form.roomNo}
                  onChange={(v) => updateField('roomNo', v)}
                  placeholder="e.g. Lab - IT-01"
                  error={errors.roomNo}
                />
              </Field>

              <Field label="Asset / Equipment">
                <TextInput
                  value={form.asset}
                  onChange={(v) => updateField('asset', v)}
                  placeholder="e.g. Keyboard - Asset ID KB-102"
                />
              </Field>
            </div>

            <Field label="Problem Description" required error={errors.description}>
              <textarea
                value={form.description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the problem clearly..."
                rows={4}
                data-error={Boolean(errors.description)}
                className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2
                  ${errors.description ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'}`}
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {form.description.length}/{DESCRIPTION_MAX_LENGTH}
              </p>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Priority" required error={errors.priority}>
                <div className="relative">
                  <Select
                    value={form.priority}
                    onChange={(v) => updateField('priority', v)}
                    options={PRIORITIES.map((p) => p.value)}
                    placeholder="Select priority"
                    error={errors.priority}
                  />
                  {form.priority && (
                    <span
                      className={`pointer-events-none absolute right-9 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
                        PRIORITIES.find((p) => p.value === form.priority)?.dot
                      }`}
                    />
                  )}
                </div>
              </Field>

              <Field label="Reported On" required>
                <input
                  type="datetime-local"
                  value={form.reportedOn}
                  onChange={(e) => updateField('reportedOn', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </Field>

              <Field label="Reported By" required error={errors.reportedBy}>
                <div className="relative">
                  <input
                    value={form.reportedBy}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-9 text-sm text-slate-600"
                  />
                  <Lock className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
              </Field>

              <Field label="Mobile Number" required error={errors.mobile}>
                <TextInput
                  value={form.mobile}
                  onChange={(v) => updateField('mobile', v.replace(/[^\d]/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  error={errors.mobile}
                  inputMode="numeric"
                />
              </Field>

              <Field label="Email ID">
                <input
                  value={form.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600"
                />
              </Field>

              <Field label="Department" required error={errors.department}>
                <Select
                  value={form.department}
                  onChange={(v) => updateField('department', v)}
                  options={DEPARTMENTS}
                  placeholder="Select department"
                  error={errors.department}
                />
              </Field>
            </div>

            <Field label="Attachments">
              <FileUpload files={form.attachments} onChange={(files) => updateField('attachments', files)} />
            </Field>

            {submitState === 'error' && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Bottom notice */}
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                <span className="font-semibold">Note:</span> Once submitted, your complaint will be
                forwarded for inspection and further processing. You will be notified about the
                complaint status through the Dashboard and available notification channels.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={submitState === 'submitting'}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitState === 'submitting' ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </div>

          {/* Right info column */}
          <div className="space-y-6">
            <GuidelinesCard />
            <SLACard />
            <NeedHelpCard />
            <WorkflowSummaryCard />
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, error, ...rest }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-error={Boolean(error)}
      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2
        ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'}`}
      {...rest}
    />
  );
}

function Select({ value, onChange, options, placeholder, error }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-error={Boolean(error)}
      className={`w-full appearance-none rounded-lg border bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3.5 py-2.5 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2
        ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function SuccessPanel({ ticket, onNewComplaint }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <h2 className="text-lg font-bold text-slate-800">Complaint Registered Successfully</h2>
      <p className="mt-1 text-sm text-slate-500">
        Ticket ID <span className="font-semibold text-slate-700">{ticket.complaintId || ticket.id}</span>{' '}
        has been created with status <span className="font-semibold text-brand-600">Complaint Registered</span>.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={onNewComplaint}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Raise Another Complaint
        </button>
        <a
          href="#"
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Go to My Complaints
        </a>
      </div>
    </div>
  );
}
