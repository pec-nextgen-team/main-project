import { Search, Calendar, RotateCcw, Download } from "lucide-react";

/**
 * FilterBar
 * Search + filter panel above the approvals table.
 * Fully controlled by parent state so it stays in sync with the table.
 */
export default function FilterBar({ filters, onChange, onReset, onExport, categories, subCategories, priorities, locations }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={set("search")}
              placeholder="Search by Ticket ID, Title, Location..."
              className="w-full border border-slate-300 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={set("category")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Sub Category</label>
          <select
            value={filters.subCategory}
            onChange={set("subCategory")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            {subCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={set("priority")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            {priorities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">From Date</label>
          <div className="relative">
            <input
              type="text"
              value={filters.fromDate}
              onChange={set("fromDate")}
              placeholder="dd-mm-yyyy"
              className="w-full border border-slate-300 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
            />
            <Calendar size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">To Date</label>
          <div className="relative">
            <input
              type="text"
              value={filters.toDate}
              onChange={set("toDate")}
              placeholder="dd-mm-yyyy"
              className="w-full border border-slate-300 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
            />
            <Calendar size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Location / Building</label>
          <select
            value={filters.location}
            onChange={set("location")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            {locations.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-[#0757D9] text-[#0757D9] rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-green-600 text-green-600 rounded-lg px-3 py-2 text-sm font-medium hover:bg-green-50 transition-colors"
          >
            <Download size={15} /> Export
          </button>
        </div>
      </div>
    </div>
  );
}
