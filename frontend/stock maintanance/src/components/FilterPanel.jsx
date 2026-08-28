import React from 'react'
import { Search, Calendar, RotateCcw, Download } from 'lucide-react'
import {
  categoryOptions,
  subCategoryOptions,
  priorityOptions,
  locationOptions,
} from '../data/mockData.js'

export default function FilterPanel({ filters, onChange, onReset, onExport }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  const subOptions = subCategoryOptions[filters.category] || subCategoryOptions['All Categories']

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4 sm:p-5 mb-5">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Search">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={set('search')}
              placeholder="Search by Ticket ID, Problem, Location..."
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
          </div>
        </Field>

        <Field label="Category">
          <select
            value={filters.category}
            onChange={(e) =>
              onChange({ ...filters, category: e.target.value, subCategory: 'All Sub Categories' })
            }
            className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sub Category">
          <select
            value={filters.subCategory}
            onChange={set('subCategory')}
            className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            {subOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority">
          <select
            value={filters.priority}
            onChange={set('priority')}
            className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Field label="From Date">
          <div className="relative">
            <input
              type="date"
              value={filters.fromDate}
              onChange={set('fromDate')}
              className="w-full pl-3 pr-9 py-2 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="To Date">
          <div className="relative">
            <input
              type="date"
              value={filters.toDate}
              onChange={set('toDate')}
              className="w-full pl-3 pr-9 py-2 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="Location / Building">
          <select
            value={filters.location}
            onChange={set('location')}
            className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            {locationOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-end gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 border border-brand-blue text-brand-blue text-[13px] font-medium rounded-md py-2 hover:bg-blue-50 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="button"
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-1.5 border border-green-600 text-green-600 text-[13px] font-medium rounded-md py-2 hover:bg-green-50 transition-colors"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
