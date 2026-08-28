import React from 'react'
import { Circle } from 'lucide-react'

const STEPS = [
  'Electrician Added',
  'Skills & Department Assigned',
  'Available for Assignment',
  'Can be Assigned to Tickets',
]

export default function ElectricianWorkflowCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4">
      <h3 className="text-[13.5px] font-bold text-navy-900 mb-3">Workflow</h3>
      <ol className="relative pl-4">
        {STEPS.map((step, idx) => (
          <li key={step} className="relative pb-4 last:pb-0">
            {idx !== STEPS.length - 1 && (
              <span className="absolute left-[3px] top-3 bottom-0 w-px bg-slate-200" />
            )}
            <span className="absolute left-0 top-1">
              <Circle size={7} className="text-brand-blue fill-brand-blue" />
            </span>
            <p className="text-[12px] text-navy-800 leading-snug pl-3">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
