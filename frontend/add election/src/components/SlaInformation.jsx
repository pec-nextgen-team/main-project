import React from 'react'
import { Clock } from 'lucide-react'

export default function SlaInformation() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock size={16} className="text-blue-600" />
        <h3 className="text-[13.5px] font-bold text-navy-900">SLA Information</h3>
      </div>
      <p className="text-[12.5px] text-slate-600 leading-relaxed mb-3">
        SLA (3 Days) applies only to approved tickets.
      </p>
      <button
        type="button"
        className="text-[12.5px] font-semibold text-blue-600 hover:underline"
      >
        View SLA Policy
      </button>
    </div>
  )
}
