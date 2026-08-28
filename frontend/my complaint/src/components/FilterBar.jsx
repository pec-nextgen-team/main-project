import { Search, RotateCcw, Download } from 'lucide-react';

const STATUS_OPTIONS = [
  'All Status',
  'Complaint Registered',
  'Inspection',
  'Repair Assigned',
  'Action Taken',
  'Verification',
  'Closed',
];

const CATEGORY_OPTIONS = [
  'All Category',
  'Computer Accessories',
  'Electrical Accessories',
  'Peripheral Devices',
  'Other Accessories',
];

export default function FilterBar({ filters, onChange, onReset, onExport }) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by Ticket ID, Problem Title, Location..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-slate-500">From Date</span>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onChange({ fromDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-slate-500">To Date</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onChange({ toDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </label>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}
