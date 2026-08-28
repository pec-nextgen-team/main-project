import React from 'react'
import { Briefcase, FileSignature, Clock4, Building2 } from 'lucide-react'

const TYPES = [
  { label: 'Permanent', icon: Briefcase },
  { label: 'Contract', icon: FileSignature },
  { label: 'Part Time', icon: Clock4 },
  { label: 'Outsourced', icon: Building2 },
]

export default function EmploymentTypesCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4">
      <h3 className="text-[13.5px] font-bold text-navy-900 mb-3">Employment Types</h3>
      <ul className="space-y-2">
        {TYPES.map(({ label, icon: Icon }) => (
          <li key={label} className="flex items-center gap-2.5 text-[12.5px] text-navy-700">
            <span className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0">
              <Icon size={14} className="text-brand-blue" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
