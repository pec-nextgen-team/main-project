import React from 'react'
import { Wrench } from 'lucide-react'

export default function SpecializationHelpCard() {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Wrench size={16} className="text-purple-600" />
        <h3 className="text-[13.5px] font-bold text-navy-900">Specialization Help</h3>
      </div>
      <p className="text-[12.5px] text-slate-600 leading-relaxed">
        Select all that apply. This helps in assigning the right electrician to the right
        tickets.
      </p>
    </div>
  )
}
