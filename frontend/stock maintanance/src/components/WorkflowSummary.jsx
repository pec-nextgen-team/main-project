import React from 'react'
import { workflowSteps } from '../data/mockData.js'
import { Circle } from 'lucide-react'

export default function WorkflowSummary() {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <h3 className="text-[13.5px] font-bold text-navy-900 mb-3">Workflow Summary</h3>
      <ol className="relative pl-4">
        {workflowSteps.map((step, idx) => (
          <li key={step} className="relative pb-4 last:pb-0">
            {idx !== workflowSteps.length - 1 && (
              <span className="absolute left-[3px] top-3 bottom-0 w-px bg-purple-300" />
            )}
            <span className="absolute left-0 top-1">
              <Circle size={7} className="text-purple-500 fill-purple-500" />
            </span>
            <p className="text-[12px] text-navy-800 leading-snug pl-3">{step}</p>
          </li>
        ))}
      </ol>
      <p className="text-[11px] text-purple-500 mt-1 italic">
        Shown for reference — this complaint did not proceed past HOD Approval.
      </p>
    </div>
  )
}
